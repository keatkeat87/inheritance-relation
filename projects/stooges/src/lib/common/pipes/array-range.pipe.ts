import { Pipe, PipeTransform } from '@angular/core';
import { range } from '../methods/range';

@Pipe({
  name: 'sArrayRange'
})
export class ArrayRangePipe implements PipeTransform {

  transform(value: number): number[] {
    return range(0, value);
  }

}
