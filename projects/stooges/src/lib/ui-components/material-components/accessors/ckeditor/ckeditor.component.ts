import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractAccessorComponent } from '../../../../form/components/abstract-accessor';
import { InvalidFocus } from '../../../../form/types';


@Component({
  selector: 's-mat-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  providers: [
    {
      provide: AbstractAccessorComponent,
      useExisting: forwardRef(() => MatCkeditorComponent)
    },
    {
      provide: InvalidFocus,
      useExisting: forwardRef(() => MatCkeditorComponent)
    }
  ]
})
export class MatCkeditorComponent extends AbstractAccessorComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }
}
