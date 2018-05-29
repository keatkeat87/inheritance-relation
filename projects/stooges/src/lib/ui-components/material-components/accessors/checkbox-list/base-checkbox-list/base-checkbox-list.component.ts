import { CompareWith } from './../../../../../types';

import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnInit,
  ContentChildren,
  AfterContentInit,
  QueryList,
  ChangeDetectorRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material';
import { startWith } from 'rxjs/operators';


/*
   note: 
   disable and items change 逻辑和 ng select, material select 一样
   同步的时候不管 disable, 也不管 item 有没有   
*/

export type MatBaseCheckboxListComponentModel = any[];
export type MatBaseCheckboxListComponentPublishMethod = (value: MatBaseCheckboxListComponentModel) => void;


@Component({
  selector: 's-mat-base-checkbox-list',
  templateUrl: './base-checkbox-list.component.html',
  styleUrls: ['./base-checkbox-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatBaseCheckboxListComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatBaseCheckboxListComponent implements OnInit, ControlValueAccessor, AfterContentInit {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }
 
  private defaultCompareWith : CompareWith = (o1: any, o2: any) => o1 === o2;
  private _compareWith = this.defaultCompareWith;
  @Input()
  get compareWith() { return this._compareWith; }
  set compareWith(fn: CompareWith) {
    this._compareWith = fn || this.defaultCompareWith;
    if (this.checkboxQueryList) {
      this.modelToView();
    }
  }

  focus() {
    let checkboxes = this.checkboxQueryList.toArray().filter(c => !c.disabled);
    if (checkboxes.length) {
      checkboxes[0].focus();
    }
  }

  values: MatBaseCheckboxListComponentModel;

  @ContentChildren(MatCheckbox, { read: MatCheckbox })
  checkboxQueryList: QueryList<MatCheckbox>

  modelToView() {
    let checkboxes = this.checkboxQueryList.toArray();
    checkboxes.forEach(c => c.checked = false);
    for (let value of this.values) {
      let checkbox = checkboxes.find(c => this.compareWith(c.value, value));
      if (checkbox) {
        checkbox.checked = true;
      }
    }
  }

  viewToModel() {
    let checkboxes = this.checkboxQueryList.toArray();
    this.values = checkboxes.filter(c => c.checked).map(c => c.value);
    this.publish(this.values);
  }

  ngAfterContentInit() {
    let beforeCheckboxes: MatCheckbox[] = [];
    this.checkboxQueryList.changes.pipe(startWith(null)).subscribe(_ => {
      let afterCheckboxes = this.checkboxQueryList.toArray();
      let addedCheckboxes = afterCheckboxes.filter(afterCheckbox => beforeCheckboxes.find(beforeCheckbox => afterCheckbox == beforeCheckbox) == null);
      for (let addedCheckbox of addedCheckboxes) {
        addedCheckbox.change.subscribe(() => {
          this.touch();
          this.viewToModel();
        });
      }
      this.modelToView();
    });
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {

  }

  writeValue(values: MatBaseCheckboxListComponentModel): void {
    this.values = [...values];
    if (this.checkboxQueryList) {
      this.modelToView();
    }
  }

  registerOnChange(fn: MatBaseCheckboxListComponentPublishMethod): void {
    this.publish = fn;
  }

  registerOnTouched(fn: any): void {
    this.touch = fn;
  }

  private publish: MatBaseCheckboxListComponentPublishMethod;
  private touch: any;

}
