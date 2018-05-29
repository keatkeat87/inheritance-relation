export class ForeignKeySelectMetadata {
    orderby: string // key
    display: string // key

    constructor(data?: Partial<ForeignKeySelectMetadata>) {
        Object.assign(this, data);
    }
}

export function ForeignKeySelect(metadata: ForeignKeySelectMetadata) {
    return Reflect.metadata('ForeignKeySelect', new ForeignKeySelectMetadata(metadata));
}