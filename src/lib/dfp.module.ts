import { NgModule } from '@angular/core';

import { DfpAdDirective } from './dfp-ad.directive';

const DFP_DIRECTIVES = [DfpAdDirective];

@NgModule({
  declarations: DFP_DIRECTIVES,
  exports: DFP_DIRECTIVES,
})
export class DfpModule {}
