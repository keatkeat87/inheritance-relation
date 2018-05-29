export function getExtension(value: string): string | undefined {
    const ipos = value.lastIndexOf('.');
    if (ipos == -1) return undefined;
    return value.substring(ipos);
}