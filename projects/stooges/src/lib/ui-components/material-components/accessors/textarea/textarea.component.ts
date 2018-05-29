import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatTextareaComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatTextareaComponent)
    }
  ]
})
export class MatTextareaComponent extends AbstractAccessorComponent implements OnInit {


  ngOnInit() {
    super.ngOnInit();
  }

}
