import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { DfpService } from './dfp.service';
import { DfpAdDirective } from './dfp-ad.directive';
import { By } from '@angular/platform-browser';
import { GPT_SOURCE, GPT_SOURCE_LIMITED_ADS } from './consts';

describe('DfpAdDirective (Server Side)', () => {
  let service: DfpService;
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let platform: Object;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DfpService,
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: GPT_SOURCE,
          useValue: GPT_SOURCE_LIMITED_ADS,
        },
      ],
      declarations: [TestComponent, DfpAdDirective],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(DfpService);
    platform = TestBed.inject(PLATFORM_ID);

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Simple test', () => {
    expect(platform).toBeDefined();
    expect(isPlatformServer(platform)).toBeTrue();

    expect(TestBed.inject(GPT_SOURCE)).toEqual(GPT_SOURCE_LIMITED_ADS);

    expect(service.cmd(() => {})).toBeFalse();
    expect(
      fixture.debugElement.query(By.css('.dfp-ad')).nativeElement.innerHTML,
    ).toBeFalsy();
  });
});

const dfpAd = {
  unitPath: '/6355419/Travel',
  size: [728, 90],
};
@Component({
  selector: 'dfp-ad-test-ssr',
  template: `<div *dfpAd="dfpAd" class="dfp-ad"></div>`,
})
export class TestComponent {
  dfpAd = dfpAd;
}
