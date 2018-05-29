import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 's-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaypalFormComponent implements OnInit {

  constructor() { }

  @Input()
  useSandbox?: '';

  @Input()
  businessEmail: string; // 'hengkeat87@gmail.com'

  @Input()
  clientEmail: string;

  @Input()
  currencyCode: string;

  @Input()
  orderId: string;

  @Input()
  amount: number;

  @Input()
  returnUrl: string;

  @Input()
  cancelUrl: string;

  get formActionUrl() {
    return (this.useSandbox === undefined) ? 'https://www.paypal.com/cgi-bin/webscr' : 'https://www.sandbox.paypal.com/cgi-bin/webscr';
  }

  @ViewChild('paypalForm') el: ElementRef;

  ngOnInit() {
  }

  public submit() {
     (this.el.nativeElement as HTMLFormElement ).submit();
  }

}
