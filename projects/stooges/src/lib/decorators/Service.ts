import { Constructor } from '../types';

export class ServiceMetadata {
    getConstructor: () => Constructor;

    constructor(data: Partial<ServiceMetadata>) {
        Object.assign(this, data);
    }
}
export function Service(getConstructorMethod: any) {
    return Reflect.metadata('Service', new ServiceMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}