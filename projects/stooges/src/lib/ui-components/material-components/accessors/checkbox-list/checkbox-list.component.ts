import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';
import { CompareWith } from '../../../../types';


@Component({
  selector: 's-mat-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatCheckboxListComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatCheckboxListComponent)
    }
  ]
})
export class MatCheckboxListComponent extends AbstractAccessorComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }

  @Input()
  compareWith: CompareWith
}

