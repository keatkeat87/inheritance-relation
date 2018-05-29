import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';
import { CompareWith } from '../../../../types';


export type MatSimpleSelectComponentItem = any;
export type MatSimpleSelectComponentGetValueOrDisplayFn = (item: MatSimpleSelectComponentItem) => any;

let defaultGetValue: MatSimpleSelectComponentGetValueOrDisplayFn = (item: MatSimpleSelectComponentItem) => {
  return item;
};
let defaultGetDisplay: MatSimpleSelectComponentGetValueOrDisplayFn = defaultGetValue;
let defaultCompareWith: CompareWith = (o1, o2) => {
  return o1 === o2;
}

@Component({
  selector: 's-mat-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatSimpleSelectComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatSimpleSelectComponent)
    }
  ]
})
export class MatSimpleSelectComponent extends AbstractAccessorComponent implements OnInit {

  @Input()
  items: MatSimpleSelectComponentItem[];

  internalGetValue = defaultGetValue;

  @Input()
  set getValue(getValueFn: MatSimpleSelectComponentGetValueOrDisplayFn) {
    this.internalGetValue = getValueFn || defaultGetValue;
  }

  internalGetDisplay = defaultGetDisplay;

  @Input()
  set getDisplay(getDisplayFn: MatSimpleSelectComponentGetValueOrDisplayFn) {
    this.internalGetDisplay = getDisplayFn || defaultGetDisplay;
  }

  internalCompareWith = defaultCompareWith;

  @Input()
  set compareWith(compareWithFn: CompareWith) {
    this.internalCompareWith = compareWithFn || defaultCompareWith;
  }

  @Input()
  hidePleaseSelect = false;

  @Input()
  loading = false;

  @Input()
  multiple = false; // not change able

  async ngOnInit() {
    // multiple 肯定没有 please select 选
    if(this.multiple) this.hidePleaseSelect = true; 
    super.ngOnInit();
  }

}

