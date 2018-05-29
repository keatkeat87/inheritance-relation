import { ValidatorFn } from "@angular/forms";

export interface Validator { name: string; validatorFn: ValidatorFn; }

// 当 interface 来用的, class 当 interface 是 ng 推荐的用法之一
export class InvalidFocus {
    invalid : boolean
    focus(){}  
}