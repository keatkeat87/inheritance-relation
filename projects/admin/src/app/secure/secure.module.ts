import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { CommonModule, FormModule, MatInputModule, MatPasswordEyeModule } from '../../../../stooges/src/public_api';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';

@NgModule({
  imports: [
    SecureRoutingModule,
    CommonModule,
    FormModule,

    MatInputModule,
    MatPasswordEyeModule,

    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [],
  declarations: [
    SecureComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ]
})
export class SecureModule { }
