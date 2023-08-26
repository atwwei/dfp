/*
 * Public API Surface of dfp
 */

globalThis.googletag = globalThis.googletag || { cmd: [] };

export * from './lib/consts';
export * from './lib/events';
export * from './lib/types';
export { DfpService } from './lib/dfp.service';
export { DfpModule } from './lib/dfp.module';
export { DfpAdDirective } from './lib/dfp-ad.directive';
