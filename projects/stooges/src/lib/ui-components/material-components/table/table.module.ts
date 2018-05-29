import { NgModule } from '@angular/core';
import { MatTableComponent } from './table.component';
import { MatTableModule as RealMatTableModule, MatSortModule, MatIconModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    RealMatTableModule,
    MatSortModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    CommonModule
  ],
  exports: [MatTableComponent],
  declarations: [MatTableComponent]
})
export class MatTableModule { }
