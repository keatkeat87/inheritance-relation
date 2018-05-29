import { Directive, HostBinding, Input, OnInit, Optional, ElementRef } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { InvalidFocus } from '../types';

@Directive({
  selector: '[sInvalidFocus]',
  providers: [
    { provide: InvalidFocus, useExisting: InvalidFocusDirective }
  ]
})
export class InvalidFocusDirective implements OnInit, InvalidFocus {

  constructor(
    private el: ElementRef,
    @Optional() private closestControl?: ControlContainer,
  ) { }

  @Input()
  sInvalidFocus: string | AbstractControl

  private abstractControl: AbstractControl

  @Input()
  @HostBinding('tabindex')
  tabindex = -1;

  focus() {
    (this.el.nativeElement as HTMLElement).focus();
  }

  get invalid(): boolean {
    return this.abstractControl.invalid;
  }

  ngOnInit() {
    this.abstractControl = (typeof (this.sInvalidFocus) === 'string') ?
      this.closestControl!.control!.get(this.sInvalidFocus)! : this.sInvalidFocus;
  }

}
