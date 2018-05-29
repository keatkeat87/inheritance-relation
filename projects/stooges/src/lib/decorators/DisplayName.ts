export class DisplayNameMetadata {
    name: string
    constructor(data?: Partial<DisplayNameMetadata>) {
        Object.assign(this, data);
    }
}

export function DisplayName(name: string) {
    return Reflect.metadata('DisplayName', new DisplayNameMetadata({ name }));
}
export function TableDisplayName(name: string) {
    return Reflect.metadata('TableDisplayName', new DisplayNameMetadata({ name }));
}
export function FormDisplayName(name: string) {
    return Reflect.metadata('FormDisplayName', new DisplayNameMetadata({ name }));
}