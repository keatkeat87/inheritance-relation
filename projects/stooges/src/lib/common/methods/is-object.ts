import { typeOf } from './typeof';

export function isObject(value: any): value is Object {
    return typeOf(value) === 'object';
}