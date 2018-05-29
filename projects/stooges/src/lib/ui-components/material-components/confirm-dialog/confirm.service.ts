import { MatConfirmDialogComponent, MatConfirmDialogData } from './confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

export type MatConfirmDialogResult = 'ok' | undefined;

// note :
// 这个 service 不是 root 
// 因为它依赖 EntryComponent MatConfirmDialogComponent
// 如果它是 root 依赖注入器就是 root 的，MatConfirmDialogComponent 就必须在 root module entry 才可以, 我不要.
@Injectable()
export class MatConfirmDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  confirmAsync(title: string, keyword?: string, inputType?: 'password' | 'number'): Promise<MatConfirmDialogResult> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open<MatConfirmDialogComponent, MatConfirmDialogData>(MatConfirmDialogComponent, {
        width: '300px',
        data: new MatConfirmDialogData({
          title,
          keyword,
          inputType
        })
      });
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}
