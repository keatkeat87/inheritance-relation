import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import { CompareType } from '../../types';
import { isValidDate } from '../../common/methods/is-valid-date';
import { isEmail } from '../../common/methods/is-email';
import { isSixDigitToken } from '../../common/methods/is-six-digit-token';
import { isMomentObject } from '../../common/methods/is-moment-object';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  private isEmptyInputValue(value: any) {
    return value == null || ((typeof value === 'string') && value.length === 0) || Array.isArray(value) && value.length === 0;
  }

  matchWithString(targetString: string, caseSensitive = true): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value as string;
      const ok = this.isEmptyInputValue(value) || ((caseSensitive) ? value === targetString : value.lowerCaseEqual(targetString));
      return (ok) ? null : {
        matchWithString: 'not match'
      };
    };
  }
  
  required(): ValidatorFn {
    return (control: AbstractControl) => {
      return this.isEmptyInputValue(control.value) ? {
        required: 'required'
      } : null;
    };
  }

  email(): ValidatorFn {
    return (control: AbstractControl) => {
      const ok = this.isEmptyInputValue(control.value) || isEmail(control.value);
      return (ok) ? null : {
        email: 'invalid email format'
      };
    };
  }

  date(): ValidatorFn {
    return (control: AbstractControl) => {
      const value : any = control.value;
      // note : 因为 datepicker 是使用 moment object 的, 所以在验证上只要是 Date | Moment Object 都可以.
      const ok = value == null || isValidDate(value) || (isMomentObject(value) && value.isValid());
      return (ok) ? null : {
        date: 'invalid date format'
      };
    };
  }

  // 目前 translate 不稳定，先不去理他先，当作没有 translate 做先.
  compare(fromKey: string, toKey: string, toDisplay: string, type: CompareType): ValidatorFn {
    return (formGroup: FormGroup) => {
      let fromControl = formGroup.get(fromKey) as FormControl;
      let toControl = formGroup.get(toKey) as FormControl;
      if (this.isEmptyInputValue(fromControl.value) || this.isEmptyInputValue(toControl.value)) return null;
      if (type == 'eq' && fromControl.value === toControl.value) return null;
      if (type == 'ge' && fromControl.value >= toControl.value) return null;
      if (type == 'gt' && fromControl.value > toControl.value) return null;
      if (type == 'le' && fromControl.value <= toControl.value) return null;
      if (type == 'lt' && fromControl.value < toControl.value) return null;
      let messages = {
        gt: `must greater than ${toDisplay}`,
        ge: `must greater or equal to ${toDisplay}`,
        lt: `must less than ${toDisplay}`,
        le: `must less or equal to ${toDisplay}`,
        eq: `must same with ${toDisplay}`
      }
      fromControl.setErrors({
        ...fromControl.errors,
        [type]: messages[type]
      });
      return null;
    };
  }


  private minMaxRange(type: 'min', limitA: number, equal?: boolean): ValidatorFn
  private minMaxRange(type: 'max', limitA: number, equal?: boolean): ValidatorFn
  private minMaxRange(type: 'range', limitA: number, equal?: boolean, limitB?: number): ValidatorFn
  private minMaxRange(type: 'min' | 'max' | 'range', limitA: number, equal = true, limitB?: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (this.isEmptyInputValue(value)) return null;

      let isArray = Array.isArray(value);
      let isString = typeof (value) == 'string';
      let isNumber = typeof (value) == 'number';
      let v: number = 0;

      if (isArray || isString) {
        v = (value as string | any[]).length
      }
      else if (isNumber) {
        v = value as number
      }
      else {
        console.error('never');
      }
      let ok = true;

      if (type == 'max') {
        ok = (equal) ? v <= limitA : v < limitA;
      }
      else if (type == 'min') {
        ok = (equal) ? v >= limitA : v > limitA;
      }
      else {
        // range 
        ok = (equal) ? (v >= limitA && v <= limitB!) : (v > limitA && v < limitB!);
      }

      if (ok) {
        return null;
      }
      else {
        let messages = {
          minString: `can't less than ${limitA} characters, current is ${v} characters`,
          maxString: `can't more than ${limitA} characters, current is ${v} characters`,
          minArray: `can't less than ${limitA}, current is ${v}`,
          maxArray: `can't more than ${limitA}, current is ${v}`,
          minNumber: `can't less than ${limitA}`,
          maxNumber: `can't greater than ${limitA}`,
          noNegative: `can't be negative`,
          rangeString: `must between ${limitA} - ${limitB} characters, current is ${v} characters`,
          rangeArray: `must between ${limitA} - ${limitB}, current is ${v}`,
          rangeNumber: `must between ${limitA} - ${limitB}`
        }

        let error = {};
        // limitA = min or max    
        if (type == 'min' && isNumber && limitA == 0) {
          error['noNegative'] = messages['noNegative'];
        }
        else if (isArray) {
          error[type + 'Array'] = messages[type + 'Array'];
        }
        else if (isString) {
          error[type + 'String'] = messages[type + 'String'];
        }
        else if (isNumber) {
          error[type + 'Number'] = messages[type + 'Number'];
        }
        else {
          console.error('never');
        }
        return error;
      }
    };
  }

  min(min: number, equal = true): ValidatorFn {
    return this.minMaxRange('min', min, equal);
  }

  max(max: number, equal = true): ValidatorFn {
    return this.minMaxRange('max', max, equal);
  }

  range(min: number, max: number, equal = true): ValidatorFn {
    return this.minMaxRange('range', min, equal, max);
  }

  sixDigitToken(): ValidatorFn {
    return (control: AbstractControl) => {
      const ok = this.isEmptyInputValue(control.value) || isSixDigitToken(control.value); // /^\d{6}$/.test(control.value);
      return ok ? null : {
        sixDigitToken: 'must be 6 digits'
      };
    };
  }

  passwordStrength(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (this.isEmptyInputValue(control.value)) return null;
      let messages: string[] = [];
      if (!/[A-Z]/.test(value)) {
        messages.push('must contain uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        messages.push('must contain lowercase letter');
      }
      if (!/\d/.test(value)) {
        messages.push('must contain number');
      }
      if (!/\W|_/.test(value)) {
        messages.push('must contain symbols');
      }
      if (value.length < 8) {
        messages.push('minimum 8 characters');
      }
      return (messages.length) ? null : {
        passwordStrength: messages.join('\r\n')
      } 
    };
  } 
}
