import { Constructor } from '../types';

export class ResourceMetadata {
    getConstructor: () => Constructor;
    constructor(data: Partial<ResourceMetadata>) {
        Object.assign(this, data);
    }
}
export function Resource(getConstructorMethod: any) {
    return Reflect.metadata('Resource', new ResourceMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}