import { Injectable, ComponentRef } from '@angular/core';
import { NavigationStart, Route, DetachedRouteHandle, Router, ResolveEnd, NavigationEnd, OutletContext } from '@angular/router';
import { filter, skip, map } from 'rxjs/operators';
import { RouterLifeCycleService } from './router-life-cycle.service';
import { RouterCommonService } from './router-common.service';
import { zip } from 'rxjs';

export type RouterCache = {
  navigation: NavigationStart,
  scrollTop: number,
  store: Map<Route, DetachedRouteHandle>
};

@Injectable({
  providedIn : 'root'
})
export class RouterCacheService {

  constructor(
    private lifeCycle: RouterLifeCycleService,
    private common: RouterCommonService
  ) { }

  setup(router: Router) {
    let maxCacheLength = 10;

    let o1 = router.events.pipe(
      filter(e => e instanceof ResolveEnd),
      skip(1),
      map(_ => {
        // add navigations
        // create,edit,remove cache (note: 这个可以 remove cache but can't destroy component, due to 不明白 ng)   
        let removedCaches: RouterCache[] = [];
        let { before } = this.lifeCycle;
        let caches = this.caches;

        if (this.common.isPopstate(before)) {
          let cacheIndex = this.findCacheIndex(before.restoredState!.navigationId);
          let cache = caches[cacheIndex];
          // update cache 
          cache.scrollTop = this.lifeCycle.scrollTop;
          cache.navigation = before;
          if (!this.lifeCycle.isPopstate) {
            removedCaches = caches.splice(cacheIndex + 1); // when forward, 移除列队后面的 cache
          }
        }
        else {
          // new cache
          caches.push({
            navigation: before,
            scrollTop: this.lifeCycle.scrollTop,
            store: new Map()
          });
        }
        if (caches.length > maxCacheLength) {
          let removeLength = caches.length - maxCacheLength;
          removedCaches = caches.splice(0, removeLength);
        }
        return removedCaches;
      })
    );

    let o2 = router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      skip(1)
    );

    // NavigationEnd 后, 通过 activateRoute 匹配寻找, 才能确保 component 可以 remove 
    // 这里没有明白为什么 ng 在 destroy 一个已经没有关系的 component 会产生 bug 
    let sampahs: { component: ComponentRef<any>, config: Route }[] = []; // 无法马上 destroy 的 component 留起来
    zip(o1, o2).subscribe(([removedCaches, _]) => {
      let activatedConfigs = this.common.recursiveGetAllActivatedRoute(router.routerState.root).map(r => r.routeConfig);
      if (sampahs.length > 0) {
        for (let i = sampahs.length - 1; i >= 0; i--) {
          let sampah = sampahs[i];
          let found = activatedConfigs.find(c => c === sampah.config) != null;
          if (!found) {
            sampah.component.destroy();
          }
        }
      }
      if (removedCaches.length) {
        for (let cache of removedCaches) {
          cache.store.forEach((detachedRouteHandle, config) => {
            let contexts: Map<string, OutletContext> = detachedRouteHandle['contexts'];
            contexts.forEach((context: OutletContext) => {
              if (context.outlet) {
                context.outlet.deactivate();
                context.children.onOutletDeactivated();
              }
            });
            let component = detachedRouteHandle['componentRef'] as ComponentRef<any>;
            if (contexts.size == 0) {
              component.destroy();
            }
            else {
              let found = activatedConfigs.find(c => c === config) != null;
              if (found) {
                sampahs.push({ component, config });
              }
              else {
                component.destroy();
              }
            }
          });
        }
      }
    });
  }

  private caches: RouterCache[] = [];

  private findCacheIndex(navigationId: number) {
    return this.caches.findIndex(c => c.navigation.id == navigationId);
  }

  findCache(navigationId: number) {
    return this.caches[this.findCacheIndex(navigationId)];
  }

  // 可以用来推断 firstload, no cache = firstload 
  get noCache(): boolean {
    return this.caches.length == 0;
  }

}
