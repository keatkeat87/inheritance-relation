import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatCheckboxComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatCheckboxComponent)
    }
  ]
})
export class MatCheckboxComponent extends AbstractAccessorComponent implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }
}
