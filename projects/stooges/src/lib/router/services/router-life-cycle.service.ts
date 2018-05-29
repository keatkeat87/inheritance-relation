import { Injectable } from '@angular/core';
import { NavigationStart, Router, ResolveEnd } from '@angular/router';
import { RouterCommonService } from './router-common.service';
import { filter, pairwise, take, skip } from 'rxjs/operators';

@Injectable({
  providedIn : 'root'
})
export class RouterLifeCycleService {

  constructor(
    private common: RouterCommonService
  ) { }

  get ready() {
    return !!this.before;
  }
  
  setup(router : Router) {

    router.events.pipe(
      filter(e => e instanceof NavigationStart),
      take(1)
    ).subscribe((navigationStart: NavigationStart) => {
      this.navigations.push(navigationStart);
    });

    router.events.pipe(
      filter(e => e instanceof NavigationStart),
      pairwise()
    ).subscribe(([before, after]: [NavigationStart, NavigationStart]) => {
      this.before = before;
      this.after = after;
    });

    router.events.pipe(
      filter(e => e instanceof ResolveEnd),
      skip(1),
    ).subscribe(_ =>{
      this.navigations.push(this.after);
      let goOrBack = this.recursiveGetRightId(this.before) < this.recursiveGetRightId(this.after) ? 'go' : 'back';
      let isPopstate = this.isPopstate = this.common.isPopstate(this.after);
      this.isBack = goOrBack == 'back';
      this.isHref = !isPopstate && goOrBack == 'go';
      this.isForward = isPopstate && goOrBack == 'go';
      this.scrollTop = this.common.getGlobalScrollTop(); 
    }); 
  }
 
  // 记入所有的 navigations, 包括第一个, 为了分辨出 forward, caches 不够用
  private navigations: NavigationStart[] = [];
  private recursiveGetRightId(navigation: NavigationStart) : number {
    if (this.common.isPopstate(navigation)) {
      let nextNavigation = this.navigations.find(n => n.id == navigation.restoredState!.navigationId)!;
      return this.recursiveGetRightId(nextNavigation);
    }
    else {
      return navigation.id;
    }
  }

  before: NavigationStart

  after: NavigationStart

  isPopstate: boolean

  isBack: boolean

  isHref: boolean

  isForward: boolean

  scrollTop: number

}
