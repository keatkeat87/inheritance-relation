import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService, FormService, Email, Required, slideUpDownOverflowAnimation, AbstractFormComponent } from '../../../../../stooges/src/public_api';


export class ForgotPasswordForm {

  constructor(data?: Partial<ForgotPasswordForm>) {
    Object.assign(this, data);
  }

  @Email()
  @Required()
  username = '';
}


@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideUpDownOverflowAnimation]
})
export class ForgotPasswordComponent extends AbstractFormComponent implements OnInit {

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

  notFound = false;

  ngOnInit() {
    const eGroup = this.edmFormService.buildFormEDM(new ForgotPasswordForm());
    this.form = this.edmFormService.buildNgForm(eGroup);
  }

  protected async internalSubmitAsync(): Promise<boolean> {
    try {
      const formValue = this.form.value as ForgotPasswordForm;
      await this.identityService.forgotPasswordAsync(formValue).catch(e => {
        if (e == 'notFound') { this.notFound = true; }
        throw new Error('');
      });

      this.router.navigate(
        ['../reset-password'],
        {
          queryParams: {
            email: formValue.username
          },
          queryParamsHandling: 'merge',
          relativeTo : this.activatedRoute
        }
      );
      return true;
    }
    catch (e) { return false; }
  }
}

