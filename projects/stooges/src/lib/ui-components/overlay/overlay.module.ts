import { NgModule } from '@angular/core';
import { OverlayFrameComponent } from './overlay-frame/overlay-frame.component';
import { CommonModule } from '../../common/common.module';


@NgModule({
  imports: [
    CommonModule
  ],
  exports : [
    OverlayFrameComponent
  ],
  declarations: [OverlayFrameComponent]
})
export class OverlayModule { }
