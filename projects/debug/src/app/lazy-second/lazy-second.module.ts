import { NgModule } from '@angular/core';

import { LazySecondRoutingModule } from './lazy-second-routing.module';
import { LazySecondComponent } from './lazy-second.component';

@NgModule({
  imports: [
    LazySecondRoutingModule
  ],
  declarations: [LazySecondComponent]
})
export class LazySecondModule { }
