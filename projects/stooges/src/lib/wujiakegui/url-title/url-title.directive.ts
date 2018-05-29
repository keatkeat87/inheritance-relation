import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { toUrlTitle } from '../../common/methods/to-url-title';


// sample  <input formControlName="urlTitle" sUrlTitle="name_en" type="text">
@Directive({
  selector: '[sUrlTitle]'
})
export class UrlTitleDirective implements OnInit, OnDestroy {

  constructor(
    private closestControl: ControlContainer,
    // @Optional() private formControlDirective: FormControlDirective,
    // @Optional() private formControlName: FormControlName,
  ) { }

  @Input('sUrlTitle')
  // null 表示不处理,当作没有放这个指令,设计这个 null 是为了方便做 dynamic 调用
  urlTitle: string | FormControl | null;

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  @Input()
  control: FormControl;

  @Input()
  controlName: string;

  private sub = new Subscription();;

  ngOnInit() {
    if (this.urlTitle) {
      const watchControl = (typeof (this.urlTitle) === 'string') ? this.closestControl.control!.get(this.urlTitle) as FormControl : this.urlTitle;

      this.sub.add(
        watchControl.valueChanges.subscribe(v => {
          const formControl = this.formControl || this.control;
          const formControlName = this.formControlName || this.controlName;
          const control = formControl || this.closestControl.control!.get(formControlName) as FormControl;
          control.setValue(toUrlTitle(v));
        })
      )
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
