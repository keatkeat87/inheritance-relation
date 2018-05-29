import { FileMetadata } from "./FileDecorator";

export class ImageMetadata extends FileMetadata {
    constructor(data?: Partial<ImageMetadata>) {
        super();
        Object.assign(this, data);
    }
    onlyExtensions: string[] = ['.jpg', '.jpeg'];
    aspectRatio: string | null = null; // 没有就放 value null
    haveUseOriginal = false;
    scenes: {
        [name: string]: string
    } = {}; // 给个 default 方便 Object.keys, 因为当 array 用嘛
}

export function ImageDecorator(metadata: Partial<ImageMetadata>) {
    return Reflect.metadata('Image', new ImageMetadata(metadata));
}