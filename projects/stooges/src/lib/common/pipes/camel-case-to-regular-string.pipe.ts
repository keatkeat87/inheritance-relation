import { Pipe, PipeTransform } from '@angular/core';
import { camelCaseToRegularString } from '../methods/camel-case-to-regular-string';

@Pipe({
  name: 'sCamelCaseToRegularString'
})
export class CamelCaseToRegularStringPipe implements PipeTransform {
  transform(value: string): string {
    return camelCaseToRegularString(value);
  }
}
