import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sAge'
})
export class AgePipe implements PipeTransform {

  transform(birthday: Date, checkYearOnly = false): any {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    if (checkYearOnly) return age;
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }

}
