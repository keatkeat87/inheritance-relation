export function toArray<T>(value: any): Array<T> {
    return Array.prototype.slice.call(value);
}