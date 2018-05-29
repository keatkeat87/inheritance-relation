import { GoogleReCaptchaConfig, GOOGLE_RECAPTCHA_CONFIG } from './google-recaptcha-config';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GoogleRecaptchaService } from './google-recaptcha.service';

declare let grecaptcha: any;

export type GoogleRecaptchaComponentModel = string;
export type GoogleRecaptchaComponentPublishMethod = (value: GoogleRecaptchaComponentModel) => void;

// 记得 required 哦
// <s-google-recaptcha formControlName="googleRecaptchaToken" ></s-google-recaptcha>
@Component({
  selector: 's-google-recaptcha',
  templateUrl: './google-recaptcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GoogleRecaptchaComponent),
    multi: true
  }],
})
export class GoogleRecaptchaComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  constructor(
    private googleRecaptchaService: GoogleRecaptchaService,
    @Inject(GOOGLE_RECAPTCHA_CONFIG) private config: GoogleReCaptchaConfig
  ) { }


  ngOnInit() {

  }

  @ViewChild('target', { read: ElementRef }) el: ElementRef;

  public reset() {
    grecaptcha.reset(this.grecaptchaId);
  }

  private grecaptchaId: number;

  async ngAfterViewInit() {
    await this.googleRecaptchaService.loadScriptAsync();
    this.grecaptchaId = grecaptcha.render(this.el.nativeElement, {
      sitekey: this.config.siteKey,
      callback: (token: string) => {
        this.touch();
        this.publish(token);
      },
      theme: 'light',
      'expired-callback': () => {
        this.publish('');
      }
    });
  }

  writeValue(_value: GoogleRecaptchaComponentModel): void {
    // 不会发生的, 这个 component 只是负责写
  }

  private publish: GoogleRecaptchaComponentPublishMethod;
  registerOnChange(fn: GoogleRecaptchaComponentPublishMethod): void {
    this.publish = fn;
  }
  touch: any;
  registerOnTouched(fn: any): void {
    this.touch = fn;
  }
}
