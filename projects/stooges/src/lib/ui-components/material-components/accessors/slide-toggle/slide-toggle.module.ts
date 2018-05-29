import { NgModule } from '@angular/core';
import { MatSlideToggleModule as RealMatSlideToggleModule } from '@angular/material';

import { MatSlideToggleComponent } from './slide-toggle.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        RealMatSlideToggleModule
    ],
    exports: [MatSlideToggleComponent],
    declarations: [MatSlideToggleComponent],
    providers: []
})
export class MatSlideToggleModule { }
