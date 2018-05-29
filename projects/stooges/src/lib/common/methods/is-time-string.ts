export function isTimeString(value: string): boolean {
    const reg = /^(1[0-2]|0[1-9]){1}(:[0-5][0-9]\ [aApP][mM]){1}$/;
    return reg.test(value);
}