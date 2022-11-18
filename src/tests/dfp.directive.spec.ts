import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { of, timer } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import {
  DfpAd,
  DfpAdDirective,
  DfpService,
  GPT_LOADER,
  GPT_SOURCE,
  ImpressionViewableEvent,
  RewardedSlotClosedEvent,
  RewardedSlotGrantedEvent,
  SlotRenderEndedEvent,
} from '../public-api';

describe('DfpAdDirective', () => {
  let service: DfpService;
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let step = 1;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: TestComponent },
          { path: 'test', component: TestComponent },
        ]),
      ],
      providers: [
        DfpService,
        {
          provide: GPT_LOADER,
          useValue: of(GPT_SOURCE.LIMITED_ADS),
        },
      ],
      declarations: [TestComponent, DfpAdDirective],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(DfpService);
    if (step > 3) {
      done();
      return;
    }
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.step = step;

    fixture.detectChanges();

    if (step == 1) {
      service.cmd(() => {
        googletag
          .defineSlot(dfpAd.unitPath, [1, 1], 'dfp-ad-1')
          ?.addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
      });
    }

    service.events
      .pipe(
        filter((event) => {
          if (step == 1) {
            return event instanceof ImpressionViewableEvent;
          } else {
            return event instanceof SlotRenderEndedEvent;
          }
        }),
        switchMap(() => timer(200)),
        take(1),
      )
      .subscribe(() => {
        done();
      });

    step += 1;
  });

  it('Ad slot should be rendered', () => {
    const dfpads = fixture.debugElement.queryAll(By.css('.dfp-ad'));
    dfpads.forEach((ad) => expect(ad.nativeElement.innerHTML).toBeTruthy());

    var gpt_unit_id = dfpads[0].nativeElement.id;
    expect(gpt_unit_id).toMatch(/^gpt_unit_/);

    const dfpad2 = fixture.debugElement.query(By.css('#' + component.id2));
    expect(dfpad2).toBeFalsy();

    expect(component.renderEnded instanceof SlotRenderEndedEvent).toBeTruthy();
  });

  it('Ad slot should be refreshed after changed', (done: DoneFn) => {
    component.targeting = undefined;

    const oldId1 = component.id1;
    expect(service.getSlot(oldId1)).toBeDefined();
    expect(service.getSlot(oldId1)?.getTargeting('test')).toEqual(['refresh']);

    const id = (component.id = 'dfp-ad-changed');
    const id1 = (component.id1 += '-changed');

    fixture.autoDetectChanges();

    service.events
      .pipe(
        filter((event) => event instanceof SlotRenderEndedEvent),
        switchMap(() => timer(200)),
        take(1),
      )
      .subscribe(() => {
        fixture.autoDetectChanges(false);

        const ids = service
          .getSlots([id, id1])
          .map((slot) => slot.getSlotElementId());

        expect(ids).toContain(id);

        expect(ids).not.toContain(oldId1);
        expect(ids).toContain(id1);

        expect(service.getSlot(id1)?.getTargeting('test')).toEqual([]);

        done();
      });
  });

  it('Ad slot should be refreshed after navigated', (done: DoneFn) => {
    const router = TestBed.inject(Router);

    googletag.pubads().clear();

    const dfpads = fixture.debugElement.queryAll(By.css('.dfp-ad'));
    dfpads.forEach((ad) => expect(ad.nativeElement.innerHTML).toBeFalsy());

    router.navigateByUrl('/test');

    service.events
      .pipe(
        filter((event) => event instanceof SlotRenderEndedEvent),
        switchMap(() => timer(200)),
        take(1),
      )
      .subscribe(() => {
        dfpads.forEach((ad) => expect(ad.nativeElement.innerHTML).toBeTruthy());
        done();
      });
  });

  it(
    'Display a rewarded ad',
    (done: DoneFn) => {
      const outOfPageSlot = service.define({
        unitPath: '/22639388115/rewarded_web_example',
      });
      expect(outOfPageSlot.getOutOfPage()).toBe(true);
      googletag.destroySlots([outOfPageSlot]);

      let isNull = true;
      service
        .rewarded({
          unitPath: '',
        })
        .subscribe({
          next: () => (isNull = false),
          complete: () => {
            expect(isNull).toBe(true);
            console.log('rewarded slot is null');
          },
        });

      service
        .rewarded({
          unitPath: '/22639388115/rewarded_web_example_empty',
        })
        .subscribe((event) => {
          expect(event instanceof SlotRenderEndedEvent).toBe(true);
          googletag.destroySlots([event.slot]);
        });

      service
        .rewarded({
          unitPath: '/22639388115/rewarded_web_example',
        })
        .subscribe({
          next: (event) => {
            if (event instanceof RewardedSlotGrantedEvent) {
              expect(event.payload).toBeTruthy();
            } else {
              expect(event instanceof RewardedSlotClosedEvent).toBe(true);
            }
            googletag.destroySlots([event.slot]);
          },
          complete: () => {
            console.log('rewarded complete');
            done();
          },
        });
    },
    15 * 1000,
  );

  it('All slots should be removed', () => {
    expect(service.getSlots().length).toBe(0);

    const dfpads = fixture.debugElement.queryAll(By.css('.dfp-ad'));
    dfpads.forEach((ad) => expect(ad.nativeElement.innerHTML).toBeFalsy());
  });

  it('Tags should be append', () => {
    const text = service.appendText('appendText');
    expect(text.textContent).toBe('appendText');

    const innerHTML = "console.log('appendScript')";
    const node = service.appendScript({
      innerHTML: innerHTML,
      id: 'appendScript',
    });
    expect(node.innerHTML).toBe(innerHTML);
    const node1 = service.appendScript({
      innerHTML: innerHTML + ';',
      id: 'appendScript',
    });
    expect(node1.innerHTML).toBe(innerHTML + ';');
  });
});

const dfpAd: DfpAd = {
  unitPath: '/6355419/Travel',
  size: [728, 90],
  sizeMapping: [
    [
      [1024, 768],
      [970, 250],
    ],
    [[980, 690], 'fluid'],
    [
      [640, 480],
      [120, 60],
    ],
    [[0, 0], []],
  ],
  categoryExclusion: ['AirlineAd'],
  clickUrl: 'http://www.example.com?original_click_url=',
  collapseEmptyDiv: [true, true],
  forceSafeFrame: true,
  safeFrameConfig: { sandbox: true },
  targeting: { test: 'refresh' },
  adsense: { adsense_test_mode: 'on' },
};
@Component({
  selector: 'dfp-ad-test',
  template: `<div>
    <div *dfpAd="dfpAd; id: id" class="dfp-ad"></div>
    <div
      *dfpAd="
        dfpAd.unitPath;
        size: dfpAd.size;
        targeting: targeting;
        collapseEmptyDiv: true;
        categoryExclusion: 'AirlineAd'
      "
      [id]="id1"
      class="dfp-ad"
    ></div>
    <div *ngIf="step == 1">
      <div
        [dfpAd]="dfpAd"
        class="dfp-ad"
        (renderEnded)="onRenderEnded($event)"
      ></div>
      <div><div *dfpAd="''" [id]="id2"></div></div>
      <div style="display: none;">
        <div *dfpAd="dfpAd" id="parent-is-hidden"></div>
      </div>
    </div>
  </div>`,
  styles: ['.dfp-ad{height:92px;margin-top:1rem;border:1px solid #ccc}'],
})
export class TestComponent {
  step = 1;
  dfpAd = dfpAd;

  id?: string;
  id1 = 'dfp-ad-1';
  id2 = 'dfp-ad-2';

  targeting = dfpAd.targeting;

  renderEnded?: SlotRenderEndedEvent;

  onRenderEnded(event: SlotRenderEndedEvent) {
    this.renderEnded = event;
  }
}
