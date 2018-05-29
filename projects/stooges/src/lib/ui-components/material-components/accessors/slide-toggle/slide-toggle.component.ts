import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatSlideToggleComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatSlideToggleComponent)
    }
  ]
})
export class MatSlideToggleComponent extends AbstractAccessorComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }

}
