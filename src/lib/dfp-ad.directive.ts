/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import {
  Directive,
  DoCheck,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { DELAY_TIME } from './consts';
import { DfpService } from './dfp.service';
import { DfpAdDisplay, DfpAdRefresh } from './actions';
import { DfpAd } from './types';

@Directive({
  selector: '[dfpAd]',
})
export class DfpAdDirective implements DoCheck, OnChanges, OnDestroy {
  private $destroy = new Subject();
  private $update = new Subject();
  private element?: HTMLElement;
  private slot?: googletag.Slot;

  @Input() set dfpAd(dfpAd: string | DfpAd) {
    if (typeof dfpAd === 'string') {
      this.unitPath = dfpAd;
    } else {
      Object.assign(this, dfpAd);
    }
  }
  unitPath!: string;
  @Input('dfpAdId') id?: string;
  @Input('dfpAdSize') size?: googletag.GeneralSize;
  @Input('dfpAdSizeMapping') sizeMapping?: googletag.SizeMappingArray;
  @Input('dfpAdCategoryExclusion') categoryExclusion?: string | string[];
  @Input('dfpAdClickUrl') clickUrl?: string;
  @Input('dfpAdCollapseEmptyDiv') collapseEmptyDiv?:
    | boolean
    | [boolean, boolean];
  @Input('dfpAdForceSafeFrame') forceSafeFrame?: boolean;
  @Input('dfpAdSafeFrameConfig') safeFrameConfig?: googletag.SafeFrameConfig;
  @Input('dfpAdTargeting') targeting?: Record<string, string | string[]>;
  @Input('dfpAdAdsense') adsense?: Record<string, string>;
  @Input('dfpAdContent') content?: string;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<unknown>,
    private dfp: DfpService,
    @Optional() router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.$update
        .pipe(
          switchMap(() => timer(DELAY_TIME)),
          takeUntil(this.$destroy),
        )
        .subscribe(() => {
          this.dfp.cmd(() => this.display());
        });

      router &&
        router.events
          .pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntil(this.$destroy),
          )
          .subscribe((e) => {
            this.$update.next();
          });
    }
  }

  display(): void {
    if (this.element?.innerText?.match(/\S+/)) {
      return;
    }

    if (this.slot && this.id === this.element?.id) {
      this.settings(this.slot);
      this.dfp.queue(new DfpAdRefresh(this.slot));
    } else {
      this.destroy();
      if ((this.slot = this.define())) {
        googletag.enableServices();
        if (this.size && this.content) {
          googletag.content().setContent(this.slot, this.content);
        } else {
          this.dfp.queue(new DfpAdDisplay(this.slot));
        }
      } else {
        this.clear();
      }
    }
  }

  ngDoCheck(): void {
    if (this.element?.id && this.id !== this.element.id) {
      this.id = this.element.id;
      this.destroy();
      this.create();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['dfpAd'] || changes['id'] || changes['size'];
    if (change && !change.isFirstChange()) {
      this.clear();
    }
    this.create();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.clear();
  }

  private create(): void {
    if (this.unitPath) {
      if (!this.element) {
        const view = this.viewContainer.createEmbeddedView(this.templateRef);
        this.element = view.rootNodes[0];
      }
      this.$update.next();
    } else {
      this.clear();
    }
  }

  private clear(): void {
    this.viewContainer.clear();
    this.element = undefined;
    this.destroy();
  }

  private define(): googletag.Slot | undefined {
    let slot: googletag.Slot | null;
    const id = this.element?.id || this.id || '';
    if (this.size) {
      slot = googletag.defineSlot(this.unitPath, this.size, id);
    } else {
      slot = googletag.defineOutOfPageSlot(this.unitPath, id);
    }
    if (slot && this.element) {
      this.id = this.element.id = id || slot.getSlotElementId();
      return this.settings(slot);
    }
    return;
  }

  private destroy(): void {
    if (this.slot) {
      googletag.destroySlots([this.slot]);
      this.slot = undefined;
    }
  }

  private settings(slot: googletag.Slot): googletag.Slot {
    if (this.size && this.content) {
      slot.addService(googletag.content());
    } else {
      if (this.sizeMapping) {
        slot.defineSizeMapping(this.sizeMapping);
      }

      slot.clearCategoryExclusions();
      if (this.categoryExclusion) {
        if (this.categoryExclusion instanceof Array) {
          this.categoryExclusion.forEach((cat) =>
            slot.setCategoryExclusion(cat),
          );
        } else {
          slot.setCategoryExclusion(this.categoryExclusion);
        }
      }

      if (typeof this.forceSafeFrame === 'boolean') {
        slot.setForceSafeFrame(this.forceSafeFrame);
      }

      if (this.safeFrameConfig) {
        slot.setSafeFrameConfig(this.safeFrameConfig);
      }

      slot.clearTargeting();
      if (this.targeting) {
        slot.updateTargetingFromMap(this.targeting);
      }

      if (this.collapseEmptyDiv instanceof Array) {
        slot.setCollapseEmptyDiv(
          this.collapseEmptyDiv[0],
          this.collapseEmptyDiv[1],
        );
      } else if (typeof this.collapseEmptyDiv === 'boolean') {
        slot.setCollapseEmptyDiv(this.collapseEmptyDiv);
      }

      if (this.clickUrl) {
        slot.setClickUrl(this.clickUrl);
      }

      if (this.adsense) {
        for (const key in this.adsense) {
          slot.set(key, this.adsense[key]);
        }
      }

      slot.addService(googletag.pubads());
    }
    return slot;
  }
}
