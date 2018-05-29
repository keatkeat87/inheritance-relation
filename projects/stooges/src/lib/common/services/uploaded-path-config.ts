import { InjectionToken } from "@angular/core";

// provide in root
export class UploadedPathConfig {
    constructor(data: UploadedPathConfig) {
        Object.assign(this, data);
    }
    uploadedFilesPath: string
}

export const UPLOADED_PATH_CONFIG = new InjectionToken<UploadedPathConfig>('UPLOADED_PATH_CONFIG');