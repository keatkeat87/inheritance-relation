import { NgModule } from '@angular/core';

import { LazyFirstRoutingModule } from './lazy-first-routing.module';
import { LazyFirstComponent } from './lazy-first.component';

@NgModule({
  imports: [
    LazyFirstRoutingModule
  ],
  declarations: [LazyFirstComponent]
})
export class LazyFirstModule { }
