import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService, FormService, Email, Required, slideUpDownOverflowAnimation, AbstractFormComponent } from '../../../../../stooges/src/public_api';


export class LoginForm {

  constructor(data?: Partial<LoginForm>) {
    Object.assign(this, data);
  }

  @Email()
  @Required()
  username = '';

  @Required()
  password = '';

}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideUpDownOverflowAnimation]
})
export class LoginComponent extends AbstractFormComponent implements OnInit {

  protected resetOnSuccessful = true;

  constructor(
    cdr: ChangeDetectorRef,
    private edmFormService: FormService,
    private router: Router,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(cdr);
  }

  ngOnInit() {
    const eGroup = this.edmFormService.buildFormEDM(new LoginForm());
    this.form = this.edmFormService.buildNgForm(eGroup);
  }

  get redirectUrl() {
    const curr = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    return curr ? curr : this.router.url;
  }

  private onSuccessful() {
    const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    if (redirectUrl) this.router.navigateByUrl(redirectUrl);
  }

  notFound = false;
  wrongPassword = false;
  locked = false;
  blocked = false;

  protected async internalSubmitAsync(): Promise<boolean> {
    try {
      const formValue = this.form.value as LoginForm;
      await this.identityService.loginAsync({ type: 'password', username: formValue.username, password: formValue.password }).catch(e => {
        if (e == 'notFound') { this.notFound = true; }
        if (e == 'wrongPassword') { this.wrongPassword = true; }
        if (e == 'locked') { this.locked = true; }
        if (e == 'blocked') { this.blocked = true; }
        throw new Error('');
      });
      this.onSuccessful();
      return true;
    }
    catch (e) { return false; }
  }
}







