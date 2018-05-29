import { NgModule } from '@angular/core';

import { MatTimePickerComponent } from './time-picker.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';
import { TimePickerModule } from '../../../accessors/time-picker/time-picker.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        TimePickerModule
    ],
    exports: [MatTimePickerComponent],
    declarations: [MatTimePickerComponent],
    providers: []
})
export class MatTimePickerModule { }
