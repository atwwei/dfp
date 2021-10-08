# @wwei/dfp

@wwei/dfp is an [angular](https://angular.io) (>=12) module for displaying google dfp ads using [Google Publisher Tag (Doubleclick GPT)](https://developers.google.com/publisher-tag/reference).

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version **12.0.4**.

[![CircleCI](https://img.shields.io/circleci/build/github/atwwei/dfp)](https://circleci.com/gh/atwwei/dfp)
[![Coverage Status](https://coveralls.io/repos/github/atwwei/dfp/badge.svg)](https://coveralls.io/github/atwwei/dfp)
[![version](https://badge.fury.io/js/@wwei%2Fdfp.svg)](https://www.npmjs.com/package/@wwei/dfp)
[![license](https://img.shields.io/npm/l/express.svg?style=flat-square)](https://github.com/atwwei/dfp/blob/master/LICENSE)

## Usage

Add `DfpModule` to the imports of your NgModule.

```
import { DfpModule } from '@wwei/dfp';

@NgModule({
  imports: [
    ...
    DfpModule,
  ],
  ...
})
export class AppModule {}
...
```

Use [googletag.PubAdsService](https://developers.google.com/publisher-tag/reference#googletag.pubadsservice) to customize page-level settings before the service is enabled.

```
import { DfpService } from '@wwei/dfp';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private dfp: DfpService) {
    // Use googletag to customize page-level settings
    this.dfp.cmd(() => {
      googletag.pubads().collapseEmptyDivs();
      googletag.pubads().enableSingleRequest();
      ...
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

## Links

|                       |                                             |
| :-------------------- | :------------------------------------------ |
| Online Examples       | https://atwwei.github.io/dfp                |
| For Angular6          | https://www.npmjs.com/package/ngx-dfp       |
| Google Publisher Tags | https://developers.google.com/publisher-tag |
|                       |                                             |
