export function dateEqual(a: Date | null, b: Date | null): boolean {
    if (a == null || b == null) return false;
    return (a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate());
}