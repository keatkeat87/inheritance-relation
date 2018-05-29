export class ForeignKeyMetadata {
    linkTo: string

    constructor(data?: Partial<ForeignKeyMetadata>) {
        Object.assign(this, data);
    }
}

export function ForeignKey(linkTo: string) {
    return Reflect.metadata('ForeignKey', new ForeignKeyMetadata({ linkTo }));
}