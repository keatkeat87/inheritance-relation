import { RobotsRule } from "../types";

export class RouteData {
    constructor(data: Partial<RouteData>) {
        Object.assign(this, data);
    }

    title?: string
    metaDescription?: string
    robotsRule?: RobotsRule
    authGuardRole?: string
    authLoginPath?: string
    authNoRolePath?: string
    preloadingRouteName?: string
    [propName : string] : any
}