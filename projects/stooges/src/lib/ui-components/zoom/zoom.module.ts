import { NgModule } from '@angular/core';
import { ZoomComponent } from './zoom.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [
     CommonModule
  ],
  exports : [
    ZoomComponent
  ],
  declarations: [ZoomComponent]
})
export class ZoomModule { }
