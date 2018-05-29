import { NgModule } from '@angular/core';

import { EGroupDirective } from './directives/e-group.directive';
import { EGroupNameDirective } from './directives/e-group-name.directive';

@NgModule({
  imports: [],
  exports: [
    EGroupDirective,
    EGroupNameDirective
  ],
  declarations: [
    EGroupDirective,
    EGroupNameDirective
  ]
})
export class EntityModule { }
