import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher as RealMatErrorStateMatcher } from '@angular/material';

// 全局注入
export class MatErrorStateMatcher implements RealMatErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        // 不清楚为什么 control and form 有可能是 null, 暂时把它当作一定有值
        return control!.invalid && (isSubmitted || (control!.dirty && control!.touched));
    }
}
