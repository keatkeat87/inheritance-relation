import { ControlContainer } from '@angular/forms';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
  Optional,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { DeviceService } from '../../../../common/services/device.service';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';
import { EGroupDirective } from '../../../../entity/directives/e-group.directive';
import { EGroupNameDirective } from '../../../../entity/directives/e-group-name.directive';

import 'moment'; 
import { MomentDateAdapter } from '@angular/material-moment-adapter';

const dateFormats = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 's-mat-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatDatePickerComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatDatePickerComponent)
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: dateFormats },
  ]
})
export class MatDatePickerComponent extends AbstractAccessorComponent implements OnInit, OnDestroy {

  constructor(
    cdr: ChangeDetectorRef,
    private deviceService: DeviceService,
    @Optional() closestControl?: ControlContainer,
    @Optional() eGroupDirective?: EGroupDirective,
    @Optional() eGroupNameDirective?: EGroupNameDirective
  ) {
    super(cdr, closestControl, eGroupDirective, eGroupNameDirective);
  }

  mobile = false;

  @Input()
  min: Date;

  @Input()
  max: Date;

  @Input()
  filter: (d: Date) => boolean;

  ngOnInit() {
    super.ngOnInit();
    this.sub.add(this.deviceService.device$.subscribe(device => {
      this.mobile = device == 'mobile';
      this.cdr.markForCheck();
    }));
  }
}

