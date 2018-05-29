

export class FileMetadata {
    constructor(data?: Partial<FileMetadata>) {
        Object.assign(this, data);
    }

    serverUrl = '/api/uploadFile';
    onlyExtensions: string[] | null;
    exceptExtensions: string[] | null; //['.jpg']
    maxSize: number | null = null //kb
    multiple = false;
}

export function FileDecorator(metadata?: Partial<FileMetadata>) {
    return Reflect.metadata('File', new FileMetadata(metadata));
}