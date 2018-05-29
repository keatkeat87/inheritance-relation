import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService, FormService, SixDigitToken, Required, slideUpDownOverflowAnimation, AbstractFormComponent } from '../../../../../stooges/src/public_api';

export class ResetPasswordForm {

  constructor(data?: Partial<ResetPasswordForm>) {
    Object.assign(this, data);
  }

  @Required()
  @SixDigitToken()
  token: number = null!;

  @Required()
  password = '';
}


@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideUpDownOverflowAnimation]
})
export class ResetPasswordComponent extends AbstractFormComponent implements OnInit {

  protected resetOnSuccessful = true;

  constructor(
    cdr: ChangeDetectorRef,
    private edmFormService: FormService,
    private router: Router,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute
  ) {
    super(cdr);
  }

  private username: string;
  showExpired = false;
  showResendSerityCode = false;
  showNotMatch = false;
  showPassword = false;
  showResendTokenLoading = false;

  ngOnInit() {
    this.username = this.activatedRoute.snapshot.queryParamMap.get('email')!;
    if (!this.username) {
      alert('username missing'); // 不可能发生
      this.router.navigate(['/']);
    }
    else {
      const eGroup = this.edmFormService.buildFormEDM(new ResetPasswordForm());
      this.form = this.edmFormService.buildNgForm(eGroup);
    }
  }

  async resendToken() {
    this.showResendTokenLoading = true;
    await this.identityService.forgotPasswordAsync({ username: this.username });
    this.showResendTokenLoading = false;
    this.showResendSerityCode = true;
    this.cdr.markForCheck();
  }

  protected async internalSubmitAsync(): Promise<boolean> {

    try {
      const formValue = this.form.value as ResetPasswordForm;
      await this.identityService.resetPasswordAsync({
        username: this.username,
        token: formValue.token,
        password: formValue.password
      }).catch(e => {
        if (e == 'expired') { this.showExpired = true; }
        if (e == 'notMatch') { this.showNotMatch = true; }
        throw new Error('');
      });

      const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl') || '';
      this.router.navigateByUrl(redirectUrl);
      return true;
    }
    catch (e) { return false; }
  }
}


