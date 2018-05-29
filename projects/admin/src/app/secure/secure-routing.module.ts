import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecureComponent } from './secure.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: SecureComponent,
            children: [
                { path: 'login', component: LoginComponent },
                { path: 'forgot-password', component: ForgotPasswordComponent },
                { path: 'reset-password', component: ResetPasswordComponent }
            ]
        }
    ])],
    exports: [RouterModule],
})
export class SecureRoutingModule { }
