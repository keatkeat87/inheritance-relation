import { SFile } from './File';
import { defineHideProperty } from '../common';
import { ImageMetadata } from '../decorators/ImageDecorator';

export class SImage extends SFile {

    constructor(data?: Partial<SImage>) {
        super();
        defineHideProperty(this,'$metadata',null); 
        Object.assign(this, data);
    }

    width: number;
    height: number;
    $metadata: ImageMetadata; // not enumerable 在 entity parse 的时候会填进去这个值, 这个是专门为了 s-image 而设计的, 纯粹就是为了方便调用, 不然不应该出现在这里的.
}
