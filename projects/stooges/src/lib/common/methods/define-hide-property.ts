export function defineHideProperty(obj: any, propertyKey: PropertyKey, value: any) {
    Object.defineProperty(obj, propertyKey, {
        value: value,
        enumerable: false,
        configurable: true,
        writable: true
    });
}