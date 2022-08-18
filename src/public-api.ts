/*
 * Public API Surface of dfp
 */

declare var globalThis: any;
declare var window: any;
declare var global: any;

(function (global: any) {
  global.googletag = global.googletag || { cmd: [] };
  return global.googletag;
})(
  (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global),
);

export * from './lib/consts';
export * from './lib/events';
export * from './lib/types';
export { DfpService } from './lib/dfp.service';
export { DfpModule } from './lib/dfp.module';
export { DfpAdDirective } from './lib/dfp-ad.directive';
