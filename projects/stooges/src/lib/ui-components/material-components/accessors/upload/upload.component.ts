import { Component, forwardRef, OnInit, Optional, ViewChild, ViewContainerRef, TemplateRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { MatUploadFailedAlertComponent } from './upload-failed-alert/upload-failed-alert.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { InvalidFocus } from '../../../../form/types';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { ImageService, SImageData } from '../../../../common/services/image.service';
import { DeviceService } from '../../../../common/services/device.service';
import { ImageMetadata } from '../../../../decorators/ImageDecorator';
import { FileMetadata } from '../../../../decorators/FileDecorator';
import { METADATA_KEY } from '../../../../decorators/metadata-key';
import { fadeInAnimation } from '../../../../animations/fade-in.animation';
import { CropData } from '../../../../types';
import { UploadComponent } from '../../../accessors/upload/upload.component';
import { EGroupDirective } from '../../../../entity/directives/e-group.directive';
import { EGroupNameDirective } from '../../../../entity/directives/e-group-name.directive';
import { OverlayFrameComponent } from '../../../overlay/overlay-frame/overlay-frame.component';
import { MatCropingFileData } from './types';
import { UploadFileData } from './../../../../ui-components/accessors/upload/UploadFileData';
import { ZoomData } from '../../../zoom/types';
 
@Component({
  selector: 's-mat-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatUploadComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatUploadComponent)
    }
  ],
  animations: [fadeInAnimation]
})
export class MatUploadComponent extends AbstractAccessorComponent implements OnInit {

  checkPending() : boolean {
    return this.baseUploadComponent.pending;
  }

  getPendingEmitter() : EventEmitter<void> {
    return this.baseUploadComponent.uploadDoneEmitter;
  }

  @ViewChild('upload', { read: UploadComponent })
  private upload: UploadComponent;

  focus() {
    this.upload.focus();
  }

  constructor(
    cdr: ChangeDetectorRef,
    private imageService: ImageService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
    private deviceService: DeviceService,
    @Optional() closestControl: ControlContainer,
    @Optional() eGroupDirective?: EGroupDirective,
    @Optional() eGroupNameDirective?: EGroupNameDirective
  ) {
    super(cdr, closestControl, eGroupDirective, eGroupNameDirective);
  }


  isImageUpload: boolean;
  imageData: SImageData;
  fileMetadata: FileMetadata | ImageMetadata;
  imageMetadata: ImageMetadata; // 方便 html 调用

  @ViewChild(UploadComponent, { read: UploadComponent })
  baseUploadComponent: UploadComponent;

  validationFailed() {
    this.dialog.open(MatUploadFailedAlertComponent, {
      width: '500px',
      data: {
        fileMetadata: this.fileMetadata,
        imageData: this.imageData
      }
    });
  }

  @ViewChild('popup', { read: TemplateRef })
  private popupTemplate: TemplateRef<any>;


  @ViewChild('overlayFrame', { read: OverlayFrameComponent })
  overlayFrame: OverlayFrameComponent;

  disposeOverlayRef() {
    this.overlayRef!.dispose();
    this.overlayRef = null;
  }

  private overlayRef: OverlayRef | null;

  cropingFileDatas: MatCropingFileData[];
  cropfile(fileDatas: UploadFileData[]) {
    this.cropingFileDatas = fileDatas.map<MatCropingFileData>(fileData => {

      const deviceWidth = this.deviceService.deviceWidth - 40;
      const deviceHeight = this.deviceService.deviceHeight - 100;

      let expectedFrameWidth = this.imageData.maxWidthAfterCeilAndAspectRatio / this.deviceService.devicePixelRatio;
      let expectedFrameHeight = this.imageData.maxHeightAfterCeilAndAspectRatio / this.deviceService.devicePixelRatio;

      const final = (expectedFrameWidth > deviceWidth || expectedFrameHeight > deviceHeight) ?
        this.imageService.imageToFrame(expectedFrameWidth, expectedFrameHeight, deviceWidth, deviceHeight, 'contain') :
        { width: expectedFrameWidth, height: expectedFrameHeight };

      const scale = final.width / expectedFrameWidth; // 因为 viewport width 小于 我们期望的 frameWidth 所以压缩, crop 的时候要算回来的    
      return {
        fileData,
        frameWidth: final.width,
        frameHeight: final.height,
        scale,
        transformFrameWidth: fileData.imageFile!.width / this.deviceService.devicePixelRatio * scale,
        transformFrameHeight: fileData.imageFile!.height / this.deviceService.devicePixelRatio * scale,
      };
    });

    if (this.overlayRef) this.disposeOverlayRef(); // 确保只有一个 overlay
    this.overlayRef = this.overlay.create(new OverlayConfig({
      positionStrategy: this.overlay.position()
        .global()
        .width(this.cropingFileDatas[0].frameWidth + 'px')
        .height(this.cropingFileDatas[0].frameHeight + 'px')
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
    }));

    const portal = new TemplatePortal(this.popupTemplate, this.vcr);
    this.overlayRef.attach(portal);
  }

  crop(cropingFileData: MatCropingFileData, zoomData: ZoomData) {
    const crop: CropData = {
      x: Math.ceil(Math.abs(zoomData.x / zoomData.scale) * this.deviceService.devicePixelRatio / cropingFileData.scale),
      y: Math.ceil(Math.abs(zoomData.y / zoomData.scale) * this.deviceService.devicePixelRatio / cropingFileData.scale),
      width: Math.ceil(cropingFileData.frameWidth / zoomData.scale * this.deviceService.devicePixelRatio / cropingFileData.scale),
      height: Math.ceil(cropingFileData.frameHeight / zoomData.scale * this.deviceService.devicePixelRatio / cropingFileData.scale)
    };
    this.baseUploadComponent.uploadToServer(cropingFileData.fileData, crop);
    this.cropingFileDatas.splice(0, 1);
    if (this.cropingFileDatas.length == 0) {
      this.overlayRef!.detachBackdrop();
      this.overlayFrame.animationLeave();
    }
    else {
      const next = this.cropingFileDatas[0];
      this.overlayRef!.updateSize({
        width: next.frameWidth,
        height: next.frameHeight
      });
    }
  }


  ngOnInit() {
    super.ngOnInit();
    this.fileMetadata = this.eControl.getMetadata(METADATA_KEY.File) || this.eControl.getMetadata(METADATA_KEY.Image);
    if (this.fileMetadata instanceof ImageMetadata) {
      this.imageMetadata = this.fileMetadata;
      this.isImageUpload = true;
      this.imageData = this.imageService.getData(this.fileMetadata);
    }
  }
}
