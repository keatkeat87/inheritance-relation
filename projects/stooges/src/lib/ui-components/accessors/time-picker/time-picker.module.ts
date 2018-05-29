import { NgModule } from '@angular/core';
import { TimePickerComponent } from './time-picker.component';
import { FormModule } from '../../../form/form.module';

@NgModule({
  imports: [
    FormModule
  ],
  exports: [TimePickerComponent],
  declarations: [TimePickerComponent]
})
export class TimePickerModule { }
