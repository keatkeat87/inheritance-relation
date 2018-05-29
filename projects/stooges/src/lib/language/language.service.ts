import { LanguageConfig, LANGUAGE_CONFIG } from './language-config';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

export interface LanguageMatcher<T> { [languageCode: string]: T; }

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(LANGUAGE_CONFIG) private config: LanguageConfig
  ) { }

  get sameAsDefault(): boolean {
    return this.config.defaultLanguage === this.locale;
  }

  get defaultLanguage() {
    return this.config.defaultLanguage;
  }

  get currentLanguage() {
    return this.locale;
  }

  match<T = string>(matcher: LanguageMatcher<T>): T {
    const defaultLanguage = this.config.defaultLanguage;
    const currLanguage = this.locale;
    return (currLanguage in matcher) ? matcher[currLanguage] : matcher[defaultLanguage];
  }

  pretty(language: string) {
    const convertor = {
      'en-US': 'en',
      'zh': 'cn',
      'ms': 'ms'
    };
    return convertor[language];
  }

}
