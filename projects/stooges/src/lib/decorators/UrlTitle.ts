export class UrlTitleMetadata {
    linkTo: string
    constructor(data?: Partial<UrlTitleMetadata>) {
        Object.assign(this, data);
    }
}
export function UrlTitle(linkTo: string) {
    return Reflect.metadata('UrlTitle', new UrlTitleMetadata({ linkTo }));
}