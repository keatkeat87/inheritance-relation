import { NgModule } from '@angular/core';
import { MatDialogModule, MatExpansionModule, MatMenuModule, MatIconModule, MatSidenavModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CkImageBrowseModule } from './ck-image-browse/ck-image-browse.module';
import { CPRoutingModule } from './cp-routing.module';
import { CPComponent } from './cp.component';
import { RouterModule } from '@angular/router';
import { FormModule, MatInputModule, MatPasswordEyeModule, CommonModule } from '../../../../stooges/src/public_api';

@NgModule({
  imports: [
    CPRoutingModule,
    MatDialogModule,
    MatExpansionModule,
    CkImageBrowseModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    FormModule,
    MatInputModule,
    MatPasswordEyeModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    CommonModule
  ],
  declarations: [
    CPComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    ChangePasswordComponent
  ]
})
export class CPModule {

}
