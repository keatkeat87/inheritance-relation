import { RouterCommonService } from './router-common.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn : 'root'
})
export class RouterActivateWatcher {

  constructor(
    private router: Router,
    private common : RouterCommonService
  ) { }

  // 不要在 root router 调用, 因为 root router 不可能会 inactive
  // 而且 root router 还会马上监听到 NavigationEnd, 这样也会破坏逻辑 
  watch(activatedRoute: ActivatedRoute, onActive: () => void | Promise<void>, onInactive: () => void | Promise<void>) : Subscription {
    onActive(); // 开始就是 active 直接运行一次
    let active = true; 
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(_ => {
      let activatedRoutes = this.common.recursiveGetAllActivatedRoute(this.router.routerState.root);
      let found = activatedRoutes.find(a => a === activatedRoute) != null;
      if (!found && active) {
        active = false;
        onInactive();
      }
      else if (found && !active) {
        active = true;
        onActive();
      }
    });
  } 
}
