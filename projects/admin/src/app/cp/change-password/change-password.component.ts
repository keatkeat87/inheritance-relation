import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { 
  IdentityService, AbstractFormComponent, FormService, Required, slideUpDownOverflowAnimation
 } from '../../../../../stooges/src/public_api';

export class ChangePasswordForm {

  constructor(data?: Partial<ChangePasswordForm>) {
    Object.assign(this, data);
  }

  @Required()
  currentPassword = '';

  @Required()
  newPassword = '';
}

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideUpDownOverflowAnimation]
})
export class ChangePasswordComponent extends AbstractFormComponent implements OnInit {

  protected resetOnSuccessful = true;

  constructor(
    cdr: ChangeDetectorRef,
    private edmFormService: FormService,
    private identityService: IdentityService,
  ) {
    super(cdr);
  }


  ngOnInit() {
    const eGroup = this.edmFormService.buildFormEDM(new ChangePasswordForm());
    this.form = this.edmFormService.buildNgForm(eGroup);
    this.defaultValue = this.form.value;
  }

  wrongPassword = false;
  showPassword = false;

  protected async internalSubmitAsync(): Promise<boolean> {

    try {
      const formValue = this.form.value as ChangePasswordForm;
      await this.identityService.changePasswordAsync(formValue).catch(e => {
        if (e == 'wrongPassword') { this.wrongPassword = true; }
        throw new Error('');
      });
      return true;
    }
    catch (e) { return false; }
  }

}




