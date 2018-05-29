import { InjectionToken } from "@angular/core";
import { Device } from "../../types";

// provide in root
export class DeviceConfig {
    constructor(data?: DeviceConfig) {
        Object.assign(this, data);
    }
    breakpoints: { device: Device, mediaQuery: string }[] = [
        { device: 'mobile', mediaQuery: '(max-width: 420px)' },
        { device: 'tablet', mediaQuery: '(min-width: 421px) and (max-width: 1024px)' },
        { device: 'pc', mediaQuery: '(min-width: 1025px)' }
    ]
}

export const DEVICE_CONFIG = new InjectionToken<DeviceConfig>('DEVICE_CONFIG', {
    providedIn: 'root',
    factory: () => new DeviceConfig()
});