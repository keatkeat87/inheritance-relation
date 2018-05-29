export function isMinuteString(value: string): boolean {
    const reg = /^([1-9]|[0-5][0-9]){1}$/;
    return reg.test(value);
}