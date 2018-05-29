export function toOdataSpecialCharacter(value: string) : string {
    value = value.replace(/'/g, "''");
    value = value.replace(/%/g, "%25");
    value = value.replace(/\+/g, "%2B");
    value = value.replace(/\//g, "%2F");
    value = value.replace(/\?/g, "%3F");
    value = value.replace(/#/g, "%23");
    value = value.replace(/&/g, "%26");
    return value;
}