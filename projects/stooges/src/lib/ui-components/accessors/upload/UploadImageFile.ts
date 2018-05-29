export class UploadImageFile {
    constructor(data?: Partial<UploadImageFile>) {
        Object.assign(this, data);
    }
    image: HTMLImageElement;
    width: number; // 经过 exif 调整
    height: number; // 经过 exif 调整
    hasExif: boolean;
    orientation: number; // base on exif， 手机通常是 1,6,3,8
}




