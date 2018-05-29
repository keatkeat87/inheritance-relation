import { InjectionToken } from '@angular/core';
 
// provide in root
export class LanguageConfig {
    constructor(data?: Partial<LanguageConfig>) {
        Object.assign(this, data);
    }
    defaultLanguage = 'en-US';
    supportedLanguages: string[] = ['en-US'];
}

export const LANGUAGE_CONFIG = new InjectionToken<LanguageConfig>('LANGUAGE_CONFIG', {
    providedIn: 'root',
    factory: () => new LanguageConfig()
});


