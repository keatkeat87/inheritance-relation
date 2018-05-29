import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';
import { CompareWith } from '../../../../types';


@Component({
  selector: 's-mat-radio-list',
  templateUrl: './radio-list.component.html',
  styleUrls: ['./radio-list.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatRadioListComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatRadioListComponent)
    }
  ]
})
export class MatRadioListComponent extends AbstractAccessorComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }

  @Input()
  compareWith: CompareWith
}


