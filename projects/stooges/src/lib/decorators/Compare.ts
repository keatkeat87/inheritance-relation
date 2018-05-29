import { CompareType } from "../types";

export class CompareMetadata {
    linkTo: string
    type : CompareType    
    constructor(data?: Partial<CompareMetadata>) {
        Object.assign(this, data);
    }
}

export function Compare(type : CompareType, linkTo : string) {
    return Reflect.metadata('Compare', new CompareMetadata({ type, linkTo }));
}