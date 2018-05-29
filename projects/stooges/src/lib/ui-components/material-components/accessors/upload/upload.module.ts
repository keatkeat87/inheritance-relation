import { NgModule } from '@angular/core';

import { MatUploadComponent } from './upload.component';
import { MatUploadFailedAlertComponent } from './upload-failed-alert/upload-failed-alert.component';
import { MatUploadRequirementComponent } from './upload-requirement/upload-requirement.component';
import { MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { OverlayModule as NgOverlayModule } from '@angular/cdk/overlay';
import { MatCanvasForCropComponent } from './canvas-for-crop/canvas-for-crop.component';
import { ZoomModule } from '../../../zoom/zoom.module';
import { OverlayModule } from '../../../overlay/overlay.module';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';
import { UploadModule } from '../../../accessors/upload/upload.module';

@NgModule({
    imports: [
        UploadModule,
        CommonModule,
        FormModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
        ZoomModule,
        OverlayModule,
        NgOverlayModule
    ],
    exports: [MatUploadComponent],
    declarations: [MatUploadComponent, MatUploadFailedAlertComponent, MatUploadRequirementComponent, MatCanvasForCropComponent],
    providers: [],
    entryComponents: [MatUploadFailedAlertComponent]
})
export class MatUploadModule { }
