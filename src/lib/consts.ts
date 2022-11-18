/* eslint-disable no-unused-vars */
import { InjectionToken } from '@angular/core';
import { of } from 'rxjs';

export const DELAY_TIME = 50;

export enum GPT_SOURCE {
  STANDARD = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
  LIMITED_ADS = 'https://pagead2.googlesyndication.com/tag/js/gpt.js',
}

export const GPT_LOADER = new InjectionToken('GPT_LOADER', {
  providedIn: 'root',
  factory: () => of(GPT_SOURCE.STANDARD),
});
