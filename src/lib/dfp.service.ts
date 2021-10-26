import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Observable, Subject, timer } from 'rxjs';
import { buffer, switchMap } from 'rxjs/operators';

import { GPT_SOURCE, DELAY_TIME } from './consts';
import {
  Event,
  ImpressionViewableEvent,
  SlotOnloadEvent,
  SlotRenderEndedEvent,
  SlotRequestedEvent,
  SlotResponseReceived,
  SlotVisibilityChangedEvent,
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
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private init(): void {
    // GPT
    if (!(window as any).googletag) {
      this.appendScript({ async: true, src: GPT_SOURCE });
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
      const pubads = googletag.pubads();
      pubads.addEventListener('impressionViewable', (event) => {
        this.$events.next(new ImpressionViewableEvent(event));
      });
      pubads.addEventListener('slotOnload', (event) => {
        this.$events.next(new SlotOnloadEvent(event));
      });
      pubads.addEventListener('slotRenderEnded', (event) => {
        this.$events.next(new SlotRenderEndedEvent(event));
      });
      pubads.addEventListener('slotRequested', (event) => {
        this.$events.next(new SlotRequestedEvent(event));
      });
      pubads.addEventListener('slotResponseReceived', (event) => {
        this.$events.next(new SlotResponseReceived(event));
      });
      pubads.addEventListener('slotVisibilityChanged', (event) => {
        this.$events.next(new SlotVisibilityChangedEvent(event));
      });
    });
  }

  define(ad: DfpAd, slot?: googletag.Slot): googletag.Slot {
    let id = ad.id || '';

    if (!slot) {
      const exists = this.getSlot(id);
      if (exists) {
        this.destroy(exists);
      }
      if (ad.size) {
        slot = googletag.defineSlot(ad.unitPath, ad.size, id) as googletag.Slot;
      } else {
        slot = googletag.defineOutOfPageSlot(ad.unitPath, id) as googletag.Slot;
      }
    }

    if (ad.size && ad.content) {
      slot.addService(googletag.content());
      googletag.enableServices();
      googletag.content().setContent(slot, ad.content);
    } else {
      if (ad.sizeMapping) {
        slot.defineSizeMapping(ad.sizeMapping);
      }

      slot.clearCategoryExclusions();
      if (ad.categoryExclusion) {
        if (ad.categoryExclusion instanceof Array) {
          const s = slot;
          ad.categoryExclusion.forEach((cat) => s.setCategoryExclusion(cat));
        } else {
          slot.setCategoryExclusion(ad.categoryExclusion);
        }
      }

      if (typeof ad.forceSafeFrame === 'boolean') {
        slot.setForceSafeFrame(ad.forceSafeFrame);
      }

      if (ad.safeFrameConfig) {
        slot.setSafeFrameConfig(ad.safeFrameConfig);
      }

      slot.clearTargeting();
      if (ad.targeting) {
        slot.updateTargetingFromMap(ad.targeting);
      }

      if (ad.collapseEmptyDiv instanceof Array) {
        slot.setCollapseEmptyDiv(
          ad.collapseEmptyDiv[0],
          ad.collapseEmptyDiv[1],
        );
      } else if (typeof ad.collapseEmptyDiv === 'boolean') {
        slot.setCollapseEmptyDiv(ad.collapseEmptyDiv);
      }

      if (ad.clickUrl) {
        slot.setClickUrl(ad.clickUrl);
      }

      if (ad.adsense) {
        for (const key in ad.adsense) {
          slot.set(key, ad.adsense[key]);
        }
      }

      slot.addService(googletag.pubads());
      googletag.enableServices();
    }

    return slot;
  }

  display(slot: googletag.Slot): void {
    this.$singleRequest.next(new DisplaySlot(slot));
  }

  refresh(slot: googletag.Slot): void {
    this.$singleRequest.next(new RefreshSlot(slot));
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
