export function toUrlTitle(value: string): string {
    let result = value.toString().toLowerCase().trim();
    result = result.replace(/\&+/, '-and-');
    result = result.replace(/[\s]/gi, '-');
    return result;
}