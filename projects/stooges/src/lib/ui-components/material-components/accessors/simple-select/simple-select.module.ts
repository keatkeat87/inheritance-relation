import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import { MatSimpleSelectComponent } from './simple-select.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    exports: [MatSimpleSelectComponent],
    declarations: [MatSimpleSelectComponent],
    providers: []
})
export class MatSimpleSelectModule { }
