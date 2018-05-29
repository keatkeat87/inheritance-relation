import { Constructor } from '../types';

export class JsonMetadata {
    getConstructor: () => Constructor;
    get hasConstructor(): boolean {
        return this.getConstructor != null;
    }
    constructor(data: Partial<JsonMetadata>) {
        Object.assign(this, data);
    }
}
export function Json(getConstructorMethod?: any) {
    // note :
    // JObject JArray JAny JArrayAny 通用
    // must have default value, new Class() | [] | {}
    // 如何区分
    // JObject 就是 value = object && metadata has Constructor
    // JAny 就是 value = object && metadata don have Constructor
    // JArray 就是 value is array && metadata has Constructor
    // JArrayAny 就是 metadata don have Constructor
    return Reflect.metadata('Json', new JsonMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}