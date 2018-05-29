import { RouterCommonService } from './router-common.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy as NgRouteReuseStrategy } from "@angular/router";
import { RouterLifeCycleService } from './router-life-cycle.service';
import { RouterCacheService } from './router-cache.service';

@Injectable()
export class RouteReuseStrategy implements NgRouteReuseStrategy {

    constructor(
        private lifeCycle : RouterLifeCycleService,
        private common : RouterCommonService,
        private cache : RouterCacheService
    ) { }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (this.shouldAttach(route)) {
            let navigationId = this.common.getRightId(this.lifeCycle.after);
            let cache = this.cache.findCache(navigationId);
            return cache.store.get(route.routeConfig!) || null;
        }
        return null;
    }

    shouldAttach(_route: ActivatedRouteSnapshot): boolean {
        return this.lifeCycle.ready && this.lifeCycle.isPopstate;
    }

    shouldDetach(_route: ActivatedRouteSnapshot): boolean {
        // 不管 popstate or not 都要 allow store, 不然 ng 就 destroy component 了！
        return this.lifeCycle.ready;
    }
     
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        if (detachedTree) {            
            let cache = this.cache.findCache(this.lifeCycle.before.id);
            cache.store.set(route.routeConfig!, detachedTree);
        } 
    } 
}