import { typeOf } from './typeof';

export function isFunction(value: any): value is Function {
    return typeOf(value) === 'function';
}