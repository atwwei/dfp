import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { buffer, filter, switchMap, take } from 'rxjs/operators';

import { GPT_SOURCE, DELAY_TIME } from './consts';
import {
  Event,
  EVENT_TYPES,
  eventFactory,
  RewardedSlotReadyEvent,
  RewardedSlotGrantedEvent,
  RewardedSlotClosedEvent,
  SlotRenderEndedEvent,
} from './events';
import { Request, DisplaySlot, RefreshSlot } from './actions';
import { ScriptOptions, DfpAd } from './types';

@Injectable({
  providedIn: 'root',
})
export class DfpService {
  private $singleRequest = new Subject<Request>();
  private $events = new Subject<Event>();
  get events(): Observable<Event> {
    return this.$events.asObservable();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject(GPT_SOURCE) private gptSource: string,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private init(): void {
    // GPT
    if (!(window as any).googletag) {
      this.appendScript({ async: true, src: this.gptSource });
      (window as any).googletag = (window as any).googletag || { cmd: [] };
    }
    // Single Request Queue
    this.$singleRequest
      .pipe(
        buffer(
          this.$singleRequest.pipe(switchMap(() => timer(DELAY_TIME * 2))),
        ),
      )
      .subscribe((acts) => {
        const refreshSlots: googletag.Slot[] = [];
        acts.forEach((act) => {
          if (act instanceof DisplaySlot) {
            googletag.display(act.slot);
          } else {
            refreshSlots.push(act.slot);
          }
        });
        if (refreshSlots.length > 0) {
          googletag.pubads().refresh(refreshSlots);
        }
      });
    // Event Listeners
    googletag.cmd.push(() => {
      EVENT_TYPES.forEach((type) =>
        googletag.pubads().addEventListener(type, (event) => {
          this.$events.next(eventFactory(type, event));
        }),
      );
    });
  }

  define(ad: DfpAd, definedSlot?: googletag.Slot): googletag.Slot {
    let id = ad.id || '';

    let slot: googletag.Slot;
    if (definedSlot) {
      slot = definedSlot;
    } else {
      const exists = this.getSlot(id);
      if (exists) {
        this.destroy(exists);
      }
      if (ad.size) {
        slot = googletag.defineSlot(ad.unitPath, ad.size, id)!;
      } else {
        slot = googletag.defineOutOfPageSlot(ad.unitPath, id)!;
      }
    }

    slot
      .clearCategoryExclusions()
      .clearTargeting()
      .defineSizeMapping(ad.sizeMapping || [])
      .updateTargetingFromMap(ad.targeting || {})
      .setClickUrl(ad.clickUrl || '')
      .setForceSafeFrame(ad.forceSafeFrame || false)
      .setSafeFrameConfig(ad.safeFrameConfig || {});

    if (ad.categoryExclusion instanceof Array) {
      ad.categoryExclusion.forEach((cat) => slot.setCategoryExclusion(cat));
    } else if ('string' === typeof ad.categoryExclusion) {
      slot.setCategoryExclusion(ad.categoryExclusion);
    }

    if (ad.collapseEmptyDiv instanceof Array) {
      slot.setCollapseEmptyDiv(ad.collapseEmptyDiv[0], ad.collapseEmptyDiv[1]);
    } else if ('boolean' === typeof ad.collapseEmptyDiv) {
      slot.setCollapseEmptyDiv(ad.collapseEmptyDiv);
    }

    const attributes = ad.adsense || {};
    for (const key in attributes) {
      const attributeName = key as googletag.adsense.AttributeName;
      slot.set(attributeName, attributes[attributeName]!);
    }

    slot.addService(googletag.pubads());
    googletag.enableServices();

    return slot;
  }

  display(slot: googletag.Slot): void {
    this.$singleRequest.next(new DisplaySlot(slot));
  }

  refresh(slot: googletag.Slot): void {
    this.$singleRequest.next(new RefreshSlot(slot));
  }

  /**
   * Displays a rewarded ad. This method should not be called until the user has consented to view the ad.
   */
  rewarded(ad: DfpAd) {
    const rewarded = googletag.defineOutOfPageSlot(
      ad.unitPath,
      googletag.enums.OutOfPageFormat.REWARDED,
    );
    if (rewarded === null) {
      return EMPTY;
    }
    googletag.display(this.define(ad, rewarded));
    return this.events.pipe(
      filter((event) => {
        if (event.slot === rewarded) {
          if (event instanceof RewardedSlotReadyEvent) {
            event.makeRewardedVisible();
          }
          return (
            (event instanceof SlotRenderEndedEvent && event.isEmpty) ||
            event instanceof RewardedSlotGrantedEvent ||
            event instanceof RewardedSlotClosedEvent
          );
        }
        return false;
      }),
      take<
        | SlotRenderEndedEvent
        | RewardedSlotGrantedEvent
        | RewardedSlotClosedEvent
      >(1),
    );
  }

  destroy(slot: googletag.Slot): void {
    googletag.destroySlots([slot]);
  }

  getSlot(elementId: string): googletag.Slot | undefined {
    return this.getSlots().find(
      (slot) => elementId === slot.getSlotElementId(),
    );
  }

  getSlots(elementIds?: string[]): googletag.Slot[] {
    let slots: googletag.Slot[] = googletag.pubads().getSlots();
    return slots.filter(
      (slot) =>
        !elementIds || elementIds.indexOf(slot.getSlotElementId()) !== -1,
    );
  }

  /**
   * Use googletag.cmd.push() to execute the callback function.
   * @param callback
   */
  cmd(callback: () => void): boolean {
    if (isPlatformBrowser(this.platformId)) {
      googletag.cmd.push(callback);
      return true;
    }
    return false;
  }

  appendScript(
    options: ScriptOptions,
    parentNode?: Element,
  ): HTMLScriptElement {
    parentNode = parentNode || this.document.head;
    const oldScript = options.id
      ? parentNode.querySelector('#' + options.id)
      : null;
    const script = this.document.createElement('script');
    Object.assign(script, options, { type: 'text/javascript' });
    if (oldScript) {
      parentNode.replaceChild(script, oldScript);
    } else {
      this.appendText('\n', parentNode);
      parentNode.appendChild(script);
      this.appendText('\n', parentNode);
    }
    return script;
  }

  appendText(data: string, parentNode?: Element): Text {
    parentNode = parentNode || this.document.head;
    const text = this.document.createTextNode(data);
    parentNode.appendChild(text);
    return text;
  }
}
