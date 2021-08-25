import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Observable, Subject, timer } from 'rxjs';
import { buffer, filter, map, switchMap } from 'rxjs/operators';

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
import { Action, DfpAdDisplay, DfpAdRefresh } from './actions';
import { ScriptOptions } from './types';

@Injectable({
  providedIn: 'root',
})
export class DfpService {
  private $queue = new Subject<Action>();

  private $events = new Subject<Event>();
  get events(): Observable<Event> {
    return this.$events.asObservable();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Record<string, unknown>,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeGPT();
      this.startActionQueue();
      this.addEventListeners();
    }
  }

  private initializeGPT() {
    this.appendScript({ async: true, src: GPT_SOURCE });
    window.googletag = window.googletag || { cmd: [] };
  }

  private startActionQueue() {
    const displaySlots: googletag.Slot[] = [];

    this.$queue
      .pipe(
        filter((act) => {
          if (act instanceof DfpAdDisplay) {
            displaySlots.push(act.slot);
            return false;
          }
          return (
            act instanceof DfpAdRefresh && displaySlots.indexOf(act.slot) === -1
          );
        }),
        map((act) => act.slot),
        buffer(this.$queue.pipe(switchMap(() => timer(DELAY_TIME * 2)))),
      )
      .subscribe((refreshSlots) => {
        displaySlots.forEach((slot) => {
          googletag.display(slot);
        });
        displaySlots.splice(0);
        if (refreshSlots.length > 0) {
          googletag.pubads().refresh(refreshSlots);
        }
      });
  }

  private addEventListeners() {
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

  clear(elementIds?: string[]): void {
    this.cmd(() => {
      googletag.pubads().clear(this.getSlots(elementIds));
    });
  }

  cmd(callback: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      googletag.cmd.push(callback);
    }
  }

  destroySlots(elementIds?: string[]): void {
    this.cmd(() => {
      googletag.destroySlots(this.getSlots(elementIds));
    });
  }

  getSlots(elementIds?: string[]): googletag.Slot[] | undefined {
    let slots: googletag.Slot[] | undefined = undefined;
    if (isPlatformBrowser(this.platformId)) {
      if (googletag.apiReady && elementIds) {
        return googletag
          .pubads()
          .getSlots()
          .filter((slot) => {
            return elementIds.indexOf(slot.getSlotElementId()) !== -1;
          });
      }
    }
    return slots;
  }

  refresh(
    elementIds?: string[],
    opt_options?: { changeCorrelator: boolean },
  ): void {
    this.cmd(() => {
      googletag.pubads().refresh(this.getSlots(elementIds), opt_options);
    });
  }

  queue(event: Action) {
    this.$queue.next(event);
  }

  /**
   * Append Script tag to parentNode
   * @param options
   * @param parentNode The default setting is document.head
   * @returns
   */
  appendScript(
    options: ScriptOptions,
    parentNode?: Element,
  ): HTMLScriptElement {
    parentNode = parentNode || this.document.head;
    const oldScript = options.id
      ? parentNode.querySelector('#' + options.id)
      : null;
    const script = this.document.createElement('script');
    Object.assign(script, options, {
      type: 'text/javascript',
    });
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
