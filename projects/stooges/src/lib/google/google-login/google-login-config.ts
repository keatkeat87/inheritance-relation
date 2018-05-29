
import { InjectionToken } from "@angular/core";

// provide in root
export class GoogleLoginConfig {
    constructor(data: GoogleLoginConfig) {
        Object.assign(this, data);
    }
    clientId: string
}

export const GOOGLE_LOGIN_CONFIG = new InjectionToken<GoogleLoginConfig>('GOOGLE_LOGIN_CONFIG');