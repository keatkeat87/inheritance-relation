import { Constructor } from '../types';

export class ComplexTypeMetadata {
    getConstructor: () => Constructor;
    constructor(data: Partial<ComplexTypeMetadata>) {
        Object.assign(this, data);
    }
}
export function ComplexType(getConstructorMethod: any) {
    return Reflect.metadata('ComplexType', new ComplexTypeMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}