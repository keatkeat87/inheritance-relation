
import { camelCaseToRegularString } from './camel-case-to-regular-string';

export function valueToDisplay(value: string, mode: 'none' | 'spaceFirstUpper' | 'firstUpper' = 'none') {
    let ipos = value.indexOf('_');
    if (ipos != -1) {
        let front = value.substring(0, ipos);
        let end = value.substring(ipos + 1);
        value = front + ` (${end})`;
    }
    if (mode == 'none') return camelCaseToRegularString(value);
    if (mode == 'spaceFirstUpper') return camelCaseToRegularString(value).split(' ').map(v => v.firstCharUpperCase()).join(' ');
    if (mode == 'firstUpper') return camelCaseToRegularString(value).firstCharUpperCase();
    return '' as never;
}