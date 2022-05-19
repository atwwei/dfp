import { InjectionToken } from '@angular/core';

export const DELAY_TIME = 50;

export const GPT_SOURCE_STANDARD =
  'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

export const GPT_SOURCE_LIMITED_ADS =
  'https://pagead2.googlesyndication.com/tag/js/gpt.js';

export const GPT_SOURCE = new InjectionToken('GPT_SOURCE', {
  providedIn: 'root',
  factory: () => GPT_SOURCE_STANDARD,
});
