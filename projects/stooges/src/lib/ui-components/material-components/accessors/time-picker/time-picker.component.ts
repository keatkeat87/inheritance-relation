import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';

@Component({
  selector: 's-mat-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatTimePickerComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatTimePickerComponent)
    }
  ]
})
export class MatTimePickerComponent extends AbstractAccessorComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }


}

