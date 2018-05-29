import { UploadedPathService } from '../../../common/services/uploaded-path.service';
import { HttpClient, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as EXIF from 'exif-js/exif';
import { Observable ,  Subject ,  Subscription } from 'rxjs';

import { SFile as SFile } from '../../../models/File';
import { SImage as SImage } from '../../../models/Image';
import { CropData, Dimension } from '../../../types';
import { ImageService } from '../../../common/services/image.service';
import { AlertService } from '../../../common/services/alert.service';
import { UploadFileData } from './UploadFileData';
import { UploadImageFile } from './UploadImageFile';
import { FileMetadata, ImageMetadata } from '../../../decorators';
import { toArray } from '../../../common/methods/to-array';
import { getExtension } from '../../../common/methods/get-extension';
import { toNgHttpParams } from '../../../common/methods/to-ng-http-params';


/*
    sample :
    <s-upload #upload [config]="uploadConfig" formControlName="images" (validationFailed)="uploadError()" ></s-upload>
    <div class="uploadFileContainer">
        <div *ngFor="let fileData of upload.fileDatas" (drop)="upload.moveFileData(fileData,upload.dragingFileData)" (dragstart)="upload.dragingFileData = fileData"
            sDragover draggable="true" class="uploadFile" >
            <img *ngIf="fileData.file.src != ''" [sImage]="[fileData.file, 'upload']">
            <i [sShow]="fileData.loading" class="fa fa-spin fa-spinner loading"></i>
            <i (click)="upload.removeFileData(fileData)" [sShow]="!fileData.loading" class="fa fa-times close"></i>
        </div>
    </div>
    note :
    -由外面处理 error display, 监听 (validationFailed)
*/
export type UploadComponentModel = SFile | SImage | (SFile | SImage)[];
export type UploadComponentPublishMethod = (value: UploadComponentModel) => void;


export type UploadErrorCode = 'extension' | 'maxSize' | 'minWidth,minHeight' | '';

@Component({
    selector: 's-upload',
    exportAs: 'upload',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UploadComponent),
        multi: true
    }],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit, OnDestroy, ControlValueAccessor {
    constructor(
        private cdr: ChangeDetectorRef,
        private alertErrorService: AlertService,
        private imageService: ImageService,
        private http: HttpClient,
        private uploadFilePathConverter: UploadedPathService
    ) { }

    @Input()
    public metadata: FileMetadata | ImageMetadata = new ImageMetadata(); //won't change

    @Output()
    validationFailed = new EventEmitter<UploadErrorCode>();

    @Output()
    cropfile = new EventEmitter<UploadFileData[]>();

    dragingFileData: UploadFileData; //给 drag & drop 用的

    fileDatas: UploadFileData[] = [];
    // cropingFileDatas: FileData[] = [];
    error: boolean; // on change 会 clear
    private subscriptions: Subscription[] = [];

    public focus() {
        this.inputFileEl.nativeElement.focus();
    }

    @ViewChild('inputFileEl', { read : ElementRef })
    inputFileEl: ElementRef;

    public get pending(): boolean {
        return this.fileDatas.some(f => f.loading);
    }

    @Output('uploadDone')
    public uploadDoneEmitter = new EventEmitter<void>();

    ngOnInit() { }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.fileDatas.forEach(f => f.ajaxSubscribe && f.ajaxSubscribe.unsubscribe());
    }

    removeFileData(fileData: UploadFileData, needConfirm = false) {
        if (!needConfirm || confirm('Confirm remove ?')) {
            const ipos = this.fileDatas.indexOf(fileData);
            this.fileDatas.splice(ipos, 1);
            this.updateModel();
        }
    }

    moveFileData(dropFileData: UploadFileData, dragingFileData: UploadFileData) {
        if (dropFileData == dragingFileData) {
            //skip
        }
        else {
            // [a,b,c,d,e];  result [a,c,d,b,e]
            // 1,3
            // right
            // [a,c,d,e]
            // 2
            // splice(2,0,b)
            // [a,c,b,d,e]
            const iposDrag = this.fileDatas.indexOf(dragingFileData);
            let iposDrop = this.fileDatas.indexOf(dropFileData);
            const moveTo = (iposDrag < iposDrop) ? 'right' : 'left'; // move to right 就是摆前面
            this.fileDatas.splice(iposDrag, 1);
            iposDrop = this.fileDatas.indexOf(dropFileData);
            if (moveTo == 'right') iposDrop += 1; // splice default is 自己摆前面，把东西往后推, 所以 to left 要移位置
            this.fileDatas.splice(iposDrop, 0, dragingFileData);
            this.updateModel();
        }
    }

    private generateImageFileByExifAsync(file: File): Promise<UploadImageFile> {
        return new Promise((resolve) => {
            const exif = EXIF as any;
            const img = new Image();
            const objectUrl = window.URL.createObjectURL(file);
            img.onload = () => {
                exif.getData(img, () => {
                    const orientation = EXIF.getTag(img, 'Orientation');
                    const imageFile = new UploadImageFile();
                    imageFile.image = img;
                    imageFile.height = img.height;
                    imageFile.width = img.width;
                    imageFile.hasExif = orientation != null;
                    imageFile.orientation = orientation || null;

                    if (orientation == 8) { // -90
                        imageFile.height = img.width;
                        imageFile.width = img.height;
                    }
                    else if (orientation == 6) { // 90
                        imageFile.height = img.width;
                        imageFile.width = img.height;
                    }
                    // window.URL.revokeObjectURL(objectUrl);
                    resolve(imageFile);
                });
            };
            img.src = objectUrl;
        });
    }

    async upload(inputFiles: FileList) {

        //let files = s.toArray<File>(inputFiles);
        // let exif = EXIF as any;
        // let img = new Image();
        // img.onload = () => {
        //     exif.getData(img, () => {
        //         let o = EXIF.getTag(img, 'Orientation');
        //         console.log(o);
        //     });
        // }
        // img.src = window.URL.createObjectURL(files[0]);
        //let f = await this.generateImageFileByExifAsync(files[0]);

        const { metadata } = this;
        this.touch();
        const files = toArray<File>(inputFiles);
        let imageFiles: UploadImageFile[] = [];
        if (metadata instanceof ImageMetadata) {
            imageFiles = await Promise.all(files.map(async (file) => {
                return await this.generateImageFileByExifAsync(file);
            }));
        }

        // validation size, extension, minWidth,height
        let errorCode: UploadErrorCode = '';
        if (!errorCode && metadata.maxSize) {
            const overSize = files.some(f => (f.size / 1000) > metadata.maxSize!);
            if (overSize) errorCode = 'maxSize';
        }
        if (!errorCode && (metadata.onlyExtensions || metadata.exceptExtensions)) {
            const extensions = metadata.onlyExtensions || metadata.exceptExtensions;
            const ok = files.every(f => {
                const extension = getExtension(f.name)!.toLowerCase();
                const found = extensions!.indexOf(extension) != -1;
                const notFound = !found;
                if (metadata.onlyExtensions) return found; // only = every found then ok
                if (metadata.exceptExtensions) return notFound; //except = every notFound then ok
                return '' as never; 
            });
            if (!ok) errorCode = 'extension';
        }
        if (!errorCode && metadata instanceof ImageMetadata) {
            let ok = true;
            for (const imageFile of imageFiles) {
                let pass = true;
                const imageData = this.imageService.getData(metadata);
                if (imageData.maxWidthAfterRetinaAndAspectRatio) {
                    pass = imageFile.width >= imageData.maxWidthAfterRetinaAndAspectRatio;
                }
                if (pass && imageData.maxHeightAfterRetinaAndAspectRatio) {
                    pass = imageFile.height >= imageData.maxHeightAfterRetinaAndAspectRatio;
                }
                if (!pass) ok = false; break;
            }
            if (!ok) errorCode = 'minWidth,minHeight';
        }

        if (errorCode) {
            console.log('upload file error', errorCode);
            this.error = true;
            this.validationFailed.emit(errorCode);
        }
        else {
            this.error = false;
            const newFileDatas: UploadFileData[] = [];
            const cropingFileDatas: UploadFileData[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let fileDataFile: SImage | SFile = null!;
                const data = {
                    name: file.name,
                    size: file.size / 1000,
                    src: ''
                };
                if (metadata instanceof ImageMetadata) {
                    const imageFile = imageFiles[i];
                    const dimension: Dimension = {
                        width: imageFile.width,
                        height: imageFile.height
                    };
                    const clone = { ...data, ...dimension, ...{ $metadata: metadata } };
                    fileDataFile = new SImage(clone);
                }
                else {
                    fileDataFile = new SFile(data);
                }

                const fileData = new UploadFileData({
                    file: fileDataFile,
                    originalFile: file,
                    imageFile: (metadata instanceof ImageMetadata) ? imageFiles[i] : null
                });

                if (metadata instanceof ImageMetadata && metadata.aspectRatio) {
                    const imageFile = imageFiles[i];
                    const imageDimension: Dimension = {
                        width: imageFile.width,
                        height: imageFile.height
                    };
                    const aspectRatioDimension = this.imageService.aspectRatioToDimension(metadata.aspectRatio);
                    const expectedImageHeight = imageDimension.width / (aspectRatioDimension.width / aspectRatioDimension.height);
                    // allow ceil and floor
                    const ok = Math.ceil(expectedImageHeight) == imageDimension.height || Math.floor(expectedImageHeight) == imageDimension.height;
                    if (ok) {
                        this.uploadToServer(fileData); // 比例刚刚好, 直接上
                        newFileDatas.push(fileData);
                    }
                    else {
                        cropingFileDatas.push(fileData);
                    }
                }
                else {
                    this.uploadToServer(fileData);
                    newFileDatas.push(fileData);
                }
            }
            if (cropingFileDatas.length > 0) {
                this.cropfile.emit(cropingFileDatas);
            }

            if (metadata.multiple) {
                this.fileDatas.push(...newFileDatas);
            }
            else {
                this.fileDatas = [...newFileDatas];
            }
        }
        this.cdr.markForCheck();
    }

    public uploadToServer(fileData: UploadFileData, crop?: CropData) {
        if (crop) {
            // const index = this.cropingFileDatas.indexOf(fileData);
            // this.cropingFileDatas.splice(index, 1);
            this.fileDatas.push(fileData);
        }
        const sub = this.sendFile(fileData, crop).subscribe(v => {
            if (typeof (v) === 'string') {
                fileData.percent = 100;
                const src = v as string;
                (fileData.file as SFile).src = this.uploadFilePathConverter.nameToPath(src);
                this.updateModel();
                sub.unsubscribe();
                this.uploadDoneEmitter.emit();
            }
            else {
                fileData.percent = Math.ceil(v);
            }
            this.cdr.markForCheck();
        }, () => {
            const ipos = this.fileDatas.indexOf(fileData);
            this.fileDatas.splice(ipos, 1);
            this.cdr.markForCheck(); 
            this.alertErrorService.alertAsync(`${ fileData.originalFile.name } upload failed, please retry.`);
            this.uploadDoneEmitter.error('uploadFailed');
        });
    }

    private sendFile(fileData: UploadFileData, crop?: CropData): Observable<string | number> {

        const formData = new FormData();
        formData.append('uploadFile', fileData.originalFile, fileData.originalFile.name);

        const subject = new Subject<string | number>();
        const { metadata } = this;
        let httpParams;
        if (metadata instanceof ImageMetadata) {
            const imageFile = fileData.file as SImage;
            if (crop) {
                imageFile.width = crop.width;
                imageFile.height = crop.height;
            }
            const imageData = this.imageService.getData(metadata, imageFile.width, imageFile.height);
            const data = {
                widths: imageData.pressWidths,
                heights: imageData.pressHeights,
                crop: crop || null,
                haveUseOriginal: metadata.haveUseOriginal
            };
            httpParams = toNgHttpParams({ compressImageJson: JSON.stringify(data) });
        }
        this.http.post(metadata.serverUrl, formData, {
            responseType : 'json',
            params: httpParams,
            observe: 'events',
            reportProgress: true
        }).subscribe(event => {
            if (event.type == HttpEventType.UploadProgress) {
                const e = event as HttpProgressEvent;
                subject.next(e.loaded / e.total! * 100);
            }
            if (event instanceof HttpResponse) {
                if (event.status == 200) {
                    const src = event.body!['value']; // 处理 OData responseText
                    subject.next(src);
                }
                else {
                    subject.error(event);
                }
            }
        });
        return subject.asObservable();
    }

    disabled = false;

    setDisabledState(isDisabled: boolean)
    {
        this.disabled = isDisabled;
    }


    writeValue(value: UploadComponentModel): void {
        const config = this.metadata;
        const fileDatas : UploadFileData[] = [];
        //SFile 的话没有就是 null
        //string 的话是 ''
        if (value) {
            const values = (config.multiple) ? value as (SFile | SImage)[] : [value as SFile | SImage];
            for (const v of values) {
                const fileData = new UploadFileData({
                    file: v
                });
                fileDatas.push(fileData);
            }
        }
        this.fileDatas = fileDatas;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: UploadComponentPublishMethod): void {
        this.publish = fn;
    }

    registerOnTouched(fn: any): void {
        this.touch = fn;
    }

    private publish: UploadComponentPublishMethod;
    private touch: any;


    private updateModel() {
        const { metadata } = this;
        const values = this.fileDatas.filter(f => !f.loading).map(f => f.file);
        const result = (metadata.multiple) ? values : values[0];
        this.publish(result);
    }
}
