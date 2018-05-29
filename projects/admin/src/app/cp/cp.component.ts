import { Router } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { 
  MatDialog
} from '@angular/material';
import { Admin } from '../entities/Resource/Admin';
import { StoogesAppComponent, IdentityConfig, IDENTITY_CONFIG, IdentityService, DeviceService } from '../../../../stooges/src/public_api';

@Component({
  templateUrl: './cp.component.html',
  styleUrls: ['./cp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CPComponent implements OnInit {
  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private identityService: IdentityService,
    @Inject(IDENTITY_CONFIG) private identityConfig: IdentityConfig,
    private router: Router,
    private stoogesAppComponent: StoogesAppComponent,
    private cdr: ChangeDetectorRef
  ) { }

  opened = false;
  mode = 'push';
  get mobileAndTablet() {
    return this.deviceService.device != 'pc';
  }

  @ViewChild('sidenav', { read: MatSidenav })
  sideNavComponent: MatSidenav;

  admin: Admin;

  ngOnInit() {
    this.identityConfig.selectedRole = 'Admin';
    this.opened = (this.deviceService.device == 'pc') ? true : false;
    this.mode = (this.deviceService.device == 'pc') ? 'side' : 'push';//push, over,side;
    this.identityService.user$.subscribe(u => {
      if (u != null) {
        this.admin = this.identityService.getCharacter<Admin>(Admin);
        this.cdr.markForCheck();
      }
    });
  }

  public sideNavOpen() {
    this.sideNavComponent.open();
  }

  async logout() {
    await this.identityService.logoutAsync();
    location.reload(false);
  }

  matchUrlRefresh(href: string) {
    if (href.endsWith(this.router.url)) {
      this.stoogesAppComponent.refreshEmitter.emit();
    }
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '500px',
    });
  }

}
