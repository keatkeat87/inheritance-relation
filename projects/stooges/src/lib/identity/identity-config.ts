import { InjectionToken } from "@angular/core";

// provide in root
export class IdentityConfig {
    constructor(data?: Partial<IdentityConfig>) {
        Object.assign(this, data);
    }
    currentUserExpand: string = 'Roles,Claims,characters';
    selectedRole: string | null = null; // null 表示匿名
}

export const IDENTITY_CONFIG = new InjectionToken<IdentityConfig>('IDENTITY_CONFIG', {
    providedIn: 'root',
    factory: () => new IdentityConfig()
});