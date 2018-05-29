import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, OnInit, ViewChild } from '@angular/core';
// import * as moment from 'moment';
import * as momentNs from 'moment';
const moment = momentNs;
import { AM_PM } from '../../../types';


export type TimePickerComponentModel = Date | null;
export type TimePickerComponentPublishMethod = (value: TimePickerComponentModel) => void;

@Component({
  selector: 's-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
  }],
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  ngOnInit() {

  }

  public focus() {
      this.firstInputEl.nativeElement.focus();
  }

  @ViewChild('firstInputEl', { read : ElementRef })
  firstInputEl: ElementRef;

  toggle() {
    this.amOrPm = (this.amOrPm == 'AM') ? 'PM' : 'AM';
    this.update();
  }

  update() {
    if (this.hour.touched && this.minute.touched) this.touch();
    const hour = this.hour.value;
    const minute = this.minute.value;
    if (hour == null && minute == null) {
      this.publish(null);
    }
    else {
      const m = moment(`1970-01-01 ${hour}:${minute}:00 ${this.amOrPm}`, 'YYYY-MM-DD h:m:ss A', true);
      if (!m.isValid()) {
        this.publish(new Date('Invalid Date'));
      }
      else {
        this.publish(m.toDate());
      }
    }
  }

  amOrPm: AM_PM = 'AM';
  hour = new FormControl();
  minute = new FormControl();

  writeValue(value: Date): void {
    if (value == null) {
      this.hour.setValue(null);
      this.minute.setValue(null);
      this.amOrPm = 'AM';
    }
    else {
      this.hour.setValue(moment(value).format('hh'));
      this.minute.setValue(moment(value).format('mm'));
      this.amOrPm = moment(value).format('A') as AM_PM;
    }
  }

  private publish: TimePickerComponentPublishMethod;
  registerOnChange(fn: TimePickerComponentPublishMethod): void {
    this.publish = fn;
  }
  private touch: any;
  registerOnTouched(fn: any): void {
    this.touch = fn;
  }


}
