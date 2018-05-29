 
import { InjectionToken } from "@angular/core";

// provide in root
export class GoogleMapConfig {
    constructor(data: GoogleMapConfig) {
        Object.assign(this, data);
    }
    apiKey: string
}

export const GOOGLE_MAP_CONFIG = new InjectionToken<GoogleMapConfig>('GOOGLE_MAP_CONFIG');

