import { NgModule } from '@angular/core';
import { SliderComponent } from './slider.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        SliderComponent
    ],
    declarations: [
        SliderComponent
    ]
})
export class SliderModule { }
