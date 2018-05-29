import { Injectable } from '@angular/core';
import { LanguageService } from '../../language/language.service';
import { createAndAppendScriptAsync } from '../..';


@Injectable({
  providedIn: 'root'
})
export class GoogleRecaptchaService {

  constructor(
    private languageService: LanguageService
  ) { }

  private loadScriptPromise: Promise<void>;

  async loadScriptAsync(): Promise<void> {
    if (this.loadScriptPromise) return this.loadScriptPromise;
    this.loadScriptPromise = new Promise<void>((resolve) => {
      window['googleRecaptchaInit'] = () => {
        resolve();
      };
      // https://developers.google.com/recaptcha/docs/language
      const language = this.languageService.match({
        'en-US': 'en',
        'zh': 'zh-CN'
      });
      createAndAppendScriptAsync(`https://www.google.com/recaptcha/api.js?onload=googleRecaptchaInit&render=explicit&hl=${language}`);
    });
    return this.loadScriptPromise;
  }

}
