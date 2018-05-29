import { NgModule } from '@angular/core';

import { ChildRoutingModule } from './child-routing.module';
import { ChildComponent } from './child.component';

@NgModule({
  imports: [
    ChildRoutingModule
  ],
  declarations: [ChildComponent]
})
export class ChildModule { }
