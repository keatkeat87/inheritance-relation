 
import { InjectionToken } from "@angular/core";

// provide in root
export class GoogleReCaptchaConfig {
    constructor(data: GoogleReCaptchaConfig) {
        Object.assign(this, data);
    }
    siteKey: string;
}

export const GOOGLE_RECAPTCHA_CONFIG = new InjectionToken<GoogleReCaptchaConfig>('GOOGLE_RECAPTCHA_CONFIG');

