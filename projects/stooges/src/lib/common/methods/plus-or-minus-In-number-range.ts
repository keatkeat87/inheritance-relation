export function plusOrMinusInNumberRange(num: number, addOrMinusNumber: number, min: number, max: number): number {
    const length = max - min + 1;
    addOrMinusNumber = addOrMinusNumber % length;
    num += addOrMinusNumber;
    if (num > max) {
        return num - length;
    }
    if (num < min) {
        return num + length;
    }
    return num;
}