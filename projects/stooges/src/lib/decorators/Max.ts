export class MaxMetadata {
    max: number
    equal: boolean
    constructor(data: Partial<MaxMetadata>) {
        Object.assign(this, data);
    }
}

export function Max(max: number, equal = true) {
    return Reflect.metadata('Max', new MaxMetadata({ max, equal }));
}