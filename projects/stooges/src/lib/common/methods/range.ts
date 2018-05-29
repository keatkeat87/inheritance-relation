export function range(start: number, count: number): number[] {
    return Array.from(new Array(count), (_, i) => i + start);
}