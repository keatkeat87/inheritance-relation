import { CommonModule } from '../../../common/common.module';
import { NgModule } from '@angular/core';

import { UploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UploadComponent],
  exports : [UploadComponent]
})
export class UploadModule { }
