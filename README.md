# @wwei/dfp

@wwei/dfp is an [angular](https://angular.io) module for displaying google dfp ads using [Google Publisher Tag (Doubleclick GPT)](https://developers.google.com/publisher-tag/reference).

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version **12.0.4**.

[![Build Status](https://img.shields.io/circleci/build/github/atwwei/dfp/main)](https://circleci.com/gh/atwwei/dfp/tree/main)
[![Coverage Status](https://img.shields.io/coveralls/github/atwwei/dfp)](https://coveralls.io/github/atwwei/dfp?branch=main)
[![NPM Version](https://img.shields.io/npm/v/@wwei/dfp)](https://www.npmjs.com/package/@wwei/dfp)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![GitHub License](https://img.shields.io/github/license/atwwei/dfp)](https://github.com/atwwei/dfp/blob/master/LICENSE)

## Install

```
npm install @wwei/dfp@latest
```

| Angular Version | Install                       |
| :-------------- | :---------------------------- |
| 6、7            | npm install @wwei/dfp@v7-lts  |
| 8               | npm install @wwei/dfp@v8-lts  |
| 9               | npm install @wwei/dfp@v9-lts  |
| 10              | npm install @wwei/dfp@v10-lts |
| 11              | npm install @wwei/dfp@v11-lts |
| 12              | npm install @wwei/dfp@v12-lts |
| 13              | npm install @wwei/dfp@v13-lts |
| 14              | npm install @wwei/dfp@v14-lts |

## Usage

Add `DfpModule` to the imports of your NgModule.

```
import { NgModule } from '@angular/core';
import { DfpModule, GPT_LOADER, GPT_SOURCE } from '@wwei/dfp';
import { of } from 'rxjs';

@NgModule({
  imports: [
    // ...
    DfpModule,
  ],
  providers: [
    // Use observable object to control the load time of GPT
    {
      provide: GPT_LOADER,
      useValue: of(GPT_SOURCE.LIMITED_ADS),
    },
  ],
  // ...
})
export class AppModule {
  // ...
}
```

Use `DfpService`.

```
import { Component } from '@angular/core';
import { DfpService, RewardedSlotGrantedEvent } from '@wwei/dfp';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private dfp: DfpService) {
    // Customize page-level settings before the service is enabled.
    this.dfp.cmd(() => {
      googletag.pubads().collapseEmptyDivs();
      googletag.pubads().enableSingleRequest();
      // ...
    });
  }
  /**
   * Displays the rewarded ad. This method should not be called
   * until the user has consented to view the ad.
   */
  displayRewardedAd() {
    this.dfp
      .rewarded({
        unitPath: '/22639388115/rewarded_web_example',
      })
      .subscribe((event) => {
        if (event instanceof RewardedSlotGrantedEvent) {
          // The rewarded is granted
        }
        // googletag.destroySlots([event.slot]);
      });
  }
}
```

Use `DfpAdDirective` in angular templates to define and display advertisements.

```
<div
  *dfpAd="{
    unitPath: '/6355419/Travel/Europe',
    id: 'ad-div-id',
    size: [
      [300, 250],
      [728, 90],
      [750, 200]
    ],
    sizeMapping: [
      [
        [750, 0],
        [
          [750, 200],
          [728, 90]
        ]
      ],
      [
        [300, 0],
        [300, 250]
      ],
      [[0, 0], []]
    ],
    categoryExclusion: 'AirlineAd',
    clickUrl: 'http://www.example.com?original_click_url=',
    collapseEmptyDiv: [true, true],
    forceSafeFrame: true,
    safeFrameConfig: { sandbox: true },
    targeting: { test: 'refresh' },
    adsense: { adsense_test_mode: 'on' }
  }"
></div>
```

_The following settings can override the above settings with the same name._

```
<div
  *dfpAd="
    '/6355419/Travel/Europe';
    id: 'ad-div-id';
    size: [
      [300, 250],
      [728, 90],
      [750, 200]
    ];
    sizeMapping: [
      [
        [750, 0],
        [
          [750, 200],
          [728, 90]
        ]
      ],
      [
        [300, 0],
        [300, 250]
      ],
      [[0, 0], []]
    ];
    categoryExclusion: 'AirlineAd';
    clickUrl: 'http://www.example.com?original_click_url=';
    collapseEmptyDiv: [true, true];
    forceSafeFrame: true;
    safeFrameConfig: { sandbox: true };
    targeting: { test: 'refresh' };
    adsense: { adsense_test_mode: 'on' };
  "
></div>
```

EventEmitter for `SlotRenderEndedEvent`、`SlotVisibilityChangedEvent`

```
<div
  [dfpAd]="{
    unitPath: '/6355419/Travel/Europe',
    id: 'ad-div-id',
    size: [
      [300, 250],
      [728, 90],
      [750, 200]
    ],
    ...
  }"
  (renderEnded)="onRenderEnded($event)"
  (visibilityChanged)="onVisibilityChanged($event)"
></div>
```

## Links

| Name            | URL                                                 |
| :-------------- | :-------------------------------------------------- |
| Online Examples | https://atwwei.github.io/dfp                        |
| Google Samples  | https://developers.google.com/publisher-tag/samples |

## License

MIT © [Wei Wang](https://github.com/atwwei)
