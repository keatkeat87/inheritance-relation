import { CommonModule, FormModule, UploadModule } from '../../../../../stooges/src/public_api';
import { NgModule } from '@angular/core';
import { CkImageBrowseComponent } from './ck-image-browse.component';
import { MatProgressBarModule, MatButtonModule } from '@angular/material';


@NgModule({
    imports: [
        UploadModule,
        FormModule,
        CommonModule,
        MatProgressBarModule,
        MatButtonModule
    ],
    exports: [CkImageBrowseComponent],
    declarations: [CkImageBrowseComponent],
    providers: [],
})
export class CkImageBrowseModule { }
