import { NgModule } from '@angular/core';

import { MatDatePickerComponent } from './date-picker.component';
import { MatDatepickerModule as RealMatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        RealMatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [MatDatePickerComponent],
    declarations: [MatDatePickerComponent],
    providers: [],
})
export class MatDatePickerModule { }
