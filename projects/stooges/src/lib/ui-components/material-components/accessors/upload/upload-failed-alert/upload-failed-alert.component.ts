import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { SImageData } from '../../../../../common/services/image.service';
import { FileMetadata } from '../../../../../decorators/FileDecorator';

@Component({
  selector: 's-mat-upload-failed-alert',
  templateUrl: './upload-failed-alert.component.html',
  styleUrls: ['./upload-failed-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatUploadFailedAlertComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  fileMetadata: FileMetadata;

  imageData: SImageData;

  ngOnInit() {
    this.fileMetadata = this.data.fileMetadata;
    this.imageData = this.data.imageData;
  }

}
