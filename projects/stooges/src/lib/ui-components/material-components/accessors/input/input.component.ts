import { AfterViewInit, Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatInputComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatInputComponent)
    }
  ]
})
export class MatInputComponent extends AbstractAccessorComponent implements OnInit, AfterViewInit {

  @Input('type')
  inputType = 'text';

  @Input()
  autocomplete: string = null!;
 
  @Input()
  readonly: '' | boolean;

  @Input()
  autofocus: '' | undefined;

  get isReadonly() {
    return this.readonly === true || this.readonly === '';
  }

  public get value() {
    return this.formControl.value;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    if (this.autofocus === '') this.focus();
  }
}
