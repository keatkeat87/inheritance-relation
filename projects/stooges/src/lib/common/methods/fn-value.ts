import { isFunction } from "./is-function";

export function fnValue<T>(value: T | (() => T)): T {
    return (isFunction(value)) ? value() : value;
}