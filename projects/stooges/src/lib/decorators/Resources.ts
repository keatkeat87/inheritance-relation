import { Constructor } from '../types';

export class ResourcesMetadata {
    getConstructor: () => Constructor;

    constructor(data: Partial<ResourcesMetadata>) {
        Object.assign(this, data);
    }
}
export function Resources(getConstructorMethod: any) {
    return Reflect.metadata('Resources', new ResourcesMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}