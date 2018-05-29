import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { IdentityService } from './identity.service';
import { AlertService } from '../common/services/alert.service';

@Injectable({
  providedIn : 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private alertService: AlertService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    const role: string = route.data.authGuardRole;
    const loginPath: string = route.data.authLoginPath;
    const noRolePath: string = route.data.authNoRolePath;

    if (!this.identityService.hasLogged) {
      await this.identityService.tryLoginByLocalStorageAsync();
    }

    if (!this.identityService.hasLogged) {
      this.router.navigate([loginPath], { queryParams: { redirectUrl: state.url } });
      return false;
    }
    else {
      if (role) {
        if (this.identityService.hasRole(role)) {
          const userRole = this.identityService.user.Roles.singleOrDefault(r => r.Name == role)!;
          if (userRole.disabled) {
            await this.alertService.alertAsync('your account has been disabled to access this page.');
            this.router.navigate([loginPath], { queryParams: { redirectUrl: state.url } });
            return false;
          }
          return true;
        }
        else {
          if (noRolePath) {
            this.router.navigate([noRolePath], { queryParams: { redirectUrl: state.url } });
          }
          else {
            await this.alertService.alertAsync(`your account does't have permission to access this page.`);
            this.router.navigate([loginPath], { queryParams: { redirectUrl: state.url } });
          }
          return false;
        }
      }
      else {
        return true;
      }
    }
  }
}
