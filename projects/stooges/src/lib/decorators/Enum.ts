export type EnumOption = { value: string, display?: string };

export class EnumMetadata {
    multiple = false;
    items: EnumOption[]

    constructor(data?: Partial<EnumMetadata>) {
        Object.assign(this, data);
    }
}
export function Enum(metadata?: Partial<EnumMetadata>) {
    return Reflect.metadata('Enum', new EnumMetadata(metadata));
}