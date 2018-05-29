import { typeOf } from "./typeof";

export function isDate(value: any): value is Date {
    return typeOf(value) === 'date';
}