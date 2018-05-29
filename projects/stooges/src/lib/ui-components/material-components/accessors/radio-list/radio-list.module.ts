import { NgModule } from '@angular/core';
import { MatRadioListComponent } from './radio-list.component';
import { MatBaseRadioListComponent } from './base-radio-list/base-radio-list.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule
  ],
  exports : [MatRadioListComponent, MatBaseRadioListComponent],
  declarations: [MatRadioListComponent, MatBaseRadioListComponent]
})
export class MatRadioListModule { }
