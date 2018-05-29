let autoId = 0;
export class UniqueMetadata {
    name = 'stooges' + (autoId++)
    order = 0
    constructor(data?: Partial<UniqueMetadata>) {
        Object.assign(this, data);
    }
}

export function Unique(metadata?: UniqueMetadata | UniqueMetadata[]) {
    let metadatas = (Array.isArray(metadata)) ? metadata.map(d => new UniqueMetadata(d)) : [new UniqueMetadata(metadata)];
    return Reflect.metadata('Unique', metadatas);
}