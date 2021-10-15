import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { timer } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { DfpAd } from './types';
import { ImpressionViewableEvent, SlotRenderEndedEvent } from './events';
import { DfpService } from './dfp.service';
import { DfpAdDirective } from './dfp-ad.directive';

describe('DfpAdDirective', () => {
  let service: DfpService;
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let init = true;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: TestComponent },
          { path: 'test', component: TestComponent },
        ]),
      ],
      providers: [DfpService],
      declarations: [TestComponent, DfpAdDirective],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.get(DfpService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    if (init) {
      service.cmd(() => {
        googletag
          .defineSlot(dfpAd.unitPath, [1, 1], 'dfp-ad-1')
          .addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
      });
    }

    service.events
      .pipe(
        filter((event) => {
          if (init) {
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

    init = false;
  });

  it('Ad slot should be rendered', () => {
    const dfpads = fixture.debugElement.queryAll(By.css('.dfp-ad'));
    dfpads.forEach((ad) => expect(ad.nativeElement.innerHTML).toBeTruthy());

    const dfpad2 = fixture.debugElement.query(By.css('#' + component.id2));
    expect(dfpad2).toBeFalsy();

    const dfpad3 = fixture.debugElement.query(
      By.css('#' + component.id3),
    ).nativeElement;
    expect(dfpad3.innerHTML).toBe('DFP AD CONTENT');

    const slot = service.getSlot(
      component.outOfPage ? component.outOfPage.id || '' : '',
    ) as googletag.Slot;
    expect(slot).toBeTruthy();
    expect(slot.getOutOfPage()).toBeTrue();

    component.outOfPage = undefined;
  });

  it('Ad slot should be refreshed after changed', (done: DoneFn) => {
    component.targeting = undefined;

    const oldId1 = component.id1;
    const slot = service.getSlot(oldId1) as googletag.Slot;
    expect(slot).toBeDefined();
    expect(slot.getTargeting('test')).toEqual(['refresh']);

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

        const slot = service.getSlot(id1) as googletag.Slot;
        expect(slot).toBeDefined();
        expect(slot.getTargeting('test')).toEqual([]);

        done();
      });
  });

  it('Ad slot should be refreshed after navigated', (done: DoneFn) => {
    const router = TestBed.get(Router);

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

  it('All slots should be removed', () => {
    fixture.destroy();

    expect(service.getSlots().length).toBe(0);
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
  template: ` <div *dfpAd="dfpAd; id: id" class="dfp-ad"></div>
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
    <div *dfpAd="''" [id]="id2"></div>
    <div *dfpAd="dfpAd; id: id3; content: 'DFP AD CONTENT'"></div>
    <div *dfpAd="outOfPage"></div>`,
  styles: ['div{height:92px;margin-top:1rem;border:1px solid #ccc}'],
})
export class TestComponent {
  dfpAd = dfpAd;

  outOfPage: DfpAd | undefined = {
    id: 'getOutOfPage',
    unitPath: '/6355419/Travel',
    targeting: { test: 'outofpage' },
  };

  id = '';
  id1 = 'dfp-ad-1';
  id2 = 'dfp-ad-2';
  id3 = 'dfp-ad-3';

  targeting = dfpAd.targeting;
}
