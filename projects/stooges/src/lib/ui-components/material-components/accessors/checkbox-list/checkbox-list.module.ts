import { NgModule } from '@angular/core';
import { MatCheckboxListComponent } from './checkbox-list.component';
import { MatBaseCheckboxListComponent } from './base-checkbox-list/base-checkbox-list.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule
  ],
  exports : [
    MatCheckboxListComponent,
    MatBaseCheckboxListComponent
  ],
  declarations: [MatCheckboxListComponent, MatBaseCheckboxListComponent]
})
export class MatCheckboxListModule { }
