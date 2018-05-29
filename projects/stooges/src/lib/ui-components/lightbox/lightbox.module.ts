import { NgModule } from '@angular/core';
import { LightboxComponent } from './lightbox.component';
import { OverlayModule as NgOverlayModule } from '@angular/cdk/overlay';
import { LightboxDeepStyleComponent } from './lightbox-deep-style/lightbox-deep-style.component';
import { CommonModule } from '../../common/common.module';
import { SliderModule } from '../slider/slider.module';
import { ZoomModule } from '../zoom/zoom.module';
import { OverlayModule } from '../overlay/overlay.module';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    OverlayModule,
    NgOverlayModule,
    ZoomModule
  ],
  exports: [
    LightboxComponent
  ],
  declarations: [
    LightboxComponent, 
    LightboxDeepStyleComponent
  ]
})
export class LightboxModule { }
