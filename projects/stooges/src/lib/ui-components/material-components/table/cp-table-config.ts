 
 import { InjectionToken } from "@angular/core";

// provide in root
export class MatCPTableConfig {
    constructor(data: MatCPTableConfig) {
        Object.assign(this, data);
    }
    // 这里和 LanguageModule 是完全不一样的概念哦
    // LanguageModule 是说 App 的 language
    // 这里的是 table 处理的 language 
    // value is en,cn,ms not en-US 哦
    defaultLanguage: string 
    supportedLanguages: string[]
}

export const MAT_CP_TABLE_CONFIG = new InjectionToken<MatCPTableConfig>('MAT_CP_TABLE_CONFIG');




