export function isSixDigitToken(value: any): value is number {
    return typeof (value) === 'number' && value >= 100000 && value <= 999999;
}