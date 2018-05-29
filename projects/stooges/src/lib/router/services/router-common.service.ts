import { Injectable } from '@angular/core';
import { NavigationStart, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn : 'root'
})
export class RouterCommonService {

  constructor() { }

  isPopstate(navigation: NavigationStart) {
    return navigation.navigationTrigger == 'popstate';
  }

  disableBrowserScrollRestoration() {
    if (history && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  updateGlobalScrollTop(value: number) {
    document.documentElement.scrollTop = document.body.scrollTop = value;
  }

  getGlobalScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  getRightId(navigation: NavigationStart) {
    return this.isPopstate(navigation) ? navigation.restoredState!.navigationId : navigation.id;
  }

  recursiveGetAllActivatedRoute(activatedRoute: ActivatedRoute) {
    let activatedRoutes: ActivatedRoute[] = [];
    activatedRoutes.push(activatedRoute);
    if (activatedRoute.children) {
      for (let child of activatedRoute.children) {
        activatedRoutes = activatedRoutes.concat(this.recursiveGetAllActivatedRoute(child));
      }
    }
    return activatedRoutes;
  }

}
