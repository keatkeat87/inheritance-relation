import { NgModule } from '@angular/core';
import { MatConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { FormModule } from '../../../form/form.module';
import { CommonModule } from '../../../common/common.module';
import { MatConfirmDialogService } from './confirm.service';

@NgModule({
  imports: [
    MatDialogModule,
    FormModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers : [MatConfirmDialogService],
  declarations: [MatConfirmDialogComponent],
  entryComponents: [MatConfirmDialogComponent]
})
export class MatConfirmDialogModule { }
