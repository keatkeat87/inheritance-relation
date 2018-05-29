export function camelCaseToRegularString(value: string) : string {
    return value.replace(/([A-Z])/g, ' $1').toLowerCase();
}