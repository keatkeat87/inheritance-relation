import { GoogleLoginConfig, GOOGLE_LOGIN_CONFIG } from './google-login-config';
import { Inject, Injectable } from '@angular/core';
import { createAndAppendScriptAsync } from '../../common/methods/create-and-append-script';

declare let gapi: any;

@Injectable({
  providedIn : 'root'
})
export class GoogleLoginService {

  constructor(
    @Inject(GOOGLE_LOGIN_CONFIG) private config: GoogleLoginConfig,
  ) { }

  private loadScriptPromise: Promise<void>;

  private googleAuth: any;

  /**
   * @description Error<string> 'cancel' | 'notAllowEmail'
   */
  async loginAsync() : Promise<string> {
    await this.loadScriptAsync();
    return this.googleAuth.signIn({
      scope: 'profile email'
    }).then((googleUser: any) => {
      const accessToken = googleUser.getAuthResponse().id_token;
      return accessToken;
    }, (e: any) => {
      if (e == 'popup_closed_by_user') return Promise.reject('cancel');
      if (e == 'access_denied') return Promise.reject('notAllowEmail');
      return Promise.reject(e);
    });
  }

  private async loadScriptAsync() : Promise<void> {
    if (this.loadScriptPromise) return this.loadScriptPromise;
    this.loadScriptPromise = new Promise<void>((resolve) => {
      window['googleLoginInit'] = () => {
        // 以后如果要处理 load error : https://developers.google.com/api-client-library/javascript/reference/referencedocs
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: this.config.clientId,
          }).then((googleAuth: any) => {
            this.googleAuth = googleAuth;
            resolve();
          });
        });
      };
      createAndAppendScriptAsync('https://apis.google.com/js/api:client.js?onload=googleLoginInit'); 
    });
    return this.loadScriptPromise;
  }
}
