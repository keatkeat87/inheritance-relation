import { Directive } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

/*
  当有嵌套 [formGroup] 的时候, s-errors 无法找到准确的 submitable form, 因为嵌套的 [formGroup] 是不会被 parent form 的 submit 影响的, 而子 formGroupDirection 也没办法找到 parent
  所以需要一个 指令来帮助 s-errors 找出准确的 [formGroup]
  note : 如果只有一个 [formGroup] 子层都是用 formGroupName 的话，并不算是嵌套哦, 所以不需要这个指令也可以 work
  sample
  <form [formGroup]="form" submitableForm >
*/
@Directive({
  selector: '[sSubmitableForm]'
})
export class SubmitableFormDirective {

  constructor(
    public formGroupDirective: FormGroupDirective,
  ) {
  }
}
