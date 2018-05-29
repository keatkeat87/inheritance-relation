import { InjectionToken } from "@angular/core";

// provide in root
export class APIServerConfig {
    constructor(data: APIServerConfig) {
        Object.assign(this, data);
    }
    path: string
}

export const API_SERVER_CONFIG = new InjectionToken<APIServerConfig>('API_SERVER_CONFIG');