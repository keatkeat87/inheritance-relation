export function isHourString(value: string): boolean {
    const reg = /^([1-9]|1[0-2]|0[1-9]){1}$/;
    return reg.test(value);
}