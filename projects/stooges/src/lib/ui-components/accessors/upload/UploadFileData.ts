import { Subscription } from 'rxjs';

import { UploadImageFile } from './UploadImageFile';
import { SImage } from '../../../models/Image';
import { SFile as SFile } from '../../../models/File';


export class UploadFileData {
    constructor(
        fileData: Partial<UploadFileData>
    ) {
        Object.assign(this, fileData);
    }
    get loading(): boolean {
        return this.file.src == '';
    }

    ajaxSubscribe: Subscription;

    originalFile: File;
    percent = 0; //start from 0
    file: SFile | SImage;

    imageFile: UploadImageFile | null; // image 才会有, 没有就给 null
}
