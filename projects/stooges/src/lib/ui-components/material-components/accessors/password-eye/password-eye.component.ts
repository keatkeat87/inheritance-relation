import { MatInputComponent } from '../input/input.component';
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-password-eye',
  templateUrl: './password-eye.component.html',
  styleUrls: ['./password-eye.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatPasswordEyeComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatPasswordEyeComponent)
    }
  ]
})
export class MatPasswordEyeComponent extends AbstractAccessorComponent implements OnInit {

  @Input()
  showPassword: boolean;

  ngOnInit() {
    super.ngOnInit();
  }

  focus() {
    this.inputComponent.focus();
  }

  @ViewChild(MatInputComponent, { read: MatInputComponent })
  inputComponent: MatInputComponent;
}

