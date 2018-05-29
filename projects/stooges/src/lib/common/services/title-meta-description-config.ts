import { InjectionToken } from "@angular/core";

// provide in root
export class TitleMetaDescriptionConfig {
    constructor(data: TitleMetaDescriptionConfig) {
        Object.assign(this, data);
    }
    titleSuffix: string
}

export const TITLE_META_DESCRIPTION_CONFIG = new InjectionToken<TitleMetaDescriptionConfig>('TITLE_META_DESCRIPTION_CONFIG');