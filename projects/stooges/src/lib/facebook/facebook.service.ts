import { FacebookConfig, FACEBOOK_CONFIG } from './facebook-config';
import { Inject, Injectable } from '@angular/core';
import { createAndAppendScriptAsync } from '../common/methods/create-and-append-script';

declare let FB: any;

@Injectable({
  providedIn : 'root'
})
export class FacebookService {

  constructor(
    @Inject(FACEBOOK_CONFIG) private config: FacebookConfig
  ) { }
 
  private loadScriptPromise: Promise<void>; 
  
  async loadScriptAsync() : Promise<void> {
    if (this.loadScriptPromise) return this.loadScriptPromise;
    this.loadScriptPromise = new Promise<void>((resolve) => {
      window['fbAsyncInit'] = () => {
        FB.init({
          appId: this.config.appId,
          cookie: true,
          xfbml: true,
          version: this.config.version
        });
        resolve();
      };
      createAndAppendScriptAsync('//connect.facebook.net/en_US/sdk.js', 'facebook-jssdk'); //如果用了 FB.init 这里请求的 script 就不要放 #appId=123 之类的, 不然会有 Bug
    });
    return this.loadScriptPromise;
  }

  /**
   * @description Error<string> 'cancel' | 'notAllowEmail' | 'noEmail'
   */
  async loginAsync(): Promise<string> {
    await this.loadScriptAsync();
    return new Promise<string>((resolve, reject) => {
      FB.login((responseLogin: any) => {
        //response = {
        //    authResponse: {
        //        accessToken: '',
        //        expiresIn: 4875,
        //        grantedScopes: 'email,public_profile',
        //        userID : 'zz'
        //    },
        //    status: 'connected'
        //}
        if (responseLogin.authResponse) {
          if ((responseLogin.authResponse.grantedScopes as string).indexOf('email') == -1) reject('notAllowEmail');
          FB.api('/me', { fields: 'id, name, email' }, (responseMe: any) => {
            // response = {
            //   id: 'zz',
            //   name: '',
            //   email: '' // if no then don't have this property
            // }
            if (!responseMe.email) reject('noEmail');
            resolve(responseLogin.authResponse.accessToken);
          });
        }
        else {
          reject('cancel');
        }
      }, {
          scope: 'email',
          return_scopes: true,
          auth_type: 'rerequest' //每一次都要求过
        });
    });

  }


}
