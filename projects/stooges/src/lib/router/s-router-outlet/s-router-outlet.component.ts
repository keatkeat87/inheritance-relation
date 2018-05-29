import { RouterActivateWatcher } from '../services/router-activate-watcher.service';
import { RouterCommonService } from '../services/router-common.service';
import { RouterLifeCycleService } from '../services/router-life-cycle.service';
import { RouterCacheService } from '../services/router-cache.service';
import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Input, EventEmitter } from '@angular/core';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd, ResolveEnd } from '@angular/router';
import { filter, take, map } from 'rxjs/operators';
import { Subscription, zip } from 'rxjs';


@Component({
  selector: 's-router-outlet',
  templateUrl: './s-router-outlet.component.html',
  styleUrls: ['./s-router-outlet.component.scss'],
  animations: [
    trigger(
      'routerAnimation',
      [
        transition(
          '* => *',
          group([
            query(':enter', [
              style({
                position: '{{enterPosition}}',
                top: '{{enterTop}}',
                left: '{{enterLeft}}',
                zIndex: '{{enterZIndex}}',
                width: '100%',
                minHeight: '100vh'
              }),
              animate('{{enterTiming}}', style({
                left: '{{enterAnimateLeft}}'
              }))
            ], { optional: true }),
            query(':leave', [
              style({
                position: '{{leavePosition}}',
                top: '{{leaveTop}}',
                left: '{{leaveLeft}}',
                zIndex: '{{leaveZIndex}}',
                width: '100%',
                minHeight: '100vh',
              }),
              animate('{{leaveTiming}}', style({
                left: '{{leaveAnimateLeft}}',
                height: '{{leaveAnimateHeight}}'
              }))
            ], { optional: true })
          ])
        )
      ]
    )]
})
export class RouterOutletComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache: RouterCacheService,
    private lifeCycle: RouterLifeCycleService,
    private common: RouterCommonService,
    private activateWatcher: RouterActivateWatcher
  ) { }

  @Input()
  isRoot = false;

  routerAnimationParams: any = {
    enterPosition: 'static',
    enterTop: 'auto',
    enterLeft: 'auto',
    enterZIndex: 'auto',
    enterTiming: '0ms',
    enterAnimateLeft: 'auto',
    leavePosition: 'static',
    leaveTop: 'auto',
    leaveLeft: 'auto',
    leaveZIndex: 'auto',
    leaveTiming: '0ms',
    leaveAnimateLeft: 'auto',
    leaveAnimateHeight: 'auto'
  };

  private sub = new Subscription();

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @ViewChild('outlet', { read: ElementRef })
  outletEl: ElementRef

  @ViewChild('outlet', { read: RouterOutlet })
  outlet: RouterOutlet

  ngAfterViewInit() {
    let process = () => {

      let routerChangeSub: Subscription;
      let lastRouterOutletPath = this.outlet.activatedRoute.routeConfig!.path;

      let onActive = () => {
        let o1 = this.router.events.pipe(
          filter(e => e instanceof ResolveEnd),
          map(_ => {
            return Math.abs(document.body.getBoundingClientRect().top - (this.outletEl.nativeElement as HTMLElement).getBoundingClientRect().top);
          })
        );

        let o2 = this.router.events.pipe(
          filter(e => e instanceof NavigationEnd)
        );

        routerChangeSub = zip(o1, o2).subscribe(([routerOutletScrollTop, _]) => {

          // animation 
          let sawHeader = this.lifeCycle.scrollTop <= routerOutletScrollTop;
          let navigationId = this.common.getRightId(this.lifeCycle.after);
          let popstateScrollTop = this.lifeCycle.isPopstate ? this.cache.findCache(navigationId).scrollTop : null;

          let move : any = {
            position: 'fixed',
            zIndex: 10,
            animateHeight: 'auto'
          }
          let stay : any = {
            position: 'static',
            top: 'auto',
            left: 'auto',
            zIndex: 'inherit',
            animateLeft: 0,
            animateHeight: 'auto'
          }
          let moveIn : any = {
            ...move,
            top: null,
            left: '100%',
            timing: '500ms ease-in',
            animateLeft: 0,
          }

          if (this.lifeCycle.isPopstate) {
            moveIn.top = -(popstateScrollTop! - routerOutletScrollTop);
          }
          else {
            moveIn.top = (sawHeader) ? routerOutletScrollTop - this.lifeCycle.scrollTop : 0;
          }
          moveIn.top = moveIn.top + 'px';

          let moveOut = {
            ...move,
            top: -(this.lifeCycle.scrollTop - routerOutletScrollTop) + 'px',
            left: 0,
            timing: '500ms 100ms',
            animateLeft: '100%',
          }

          let stayHide = {
            ...stay,
            timing: '100ms 500ms',
            animateLeft: '10000px',
          }
          let stayShow = {
            ...stay,
            timing: '600ms',
            animateLeft: 'auto'
          }

          let enter : any = null;
          let leave : any = null;

          if (this.lifeCycle.isHref || this.lifeCycle.isForward) {
            enter = moveIn;
            leave = stayHide;
          }
          else if (this.lifeCycle.isBack) {
            enter = stayShow;
            leave = moveOut;
          }
          else {
            // never
          }

          let nextScrollTop : number;
          if (this.lifeCycle.isPopstate) {
            nextScrollTop = popstateScrollTop!;
          }
          else {
            nextScrollTop = (sawHeader) ? this.lifeCycle.scrollTop : routerOutletScrollTop;
          }

          let timeoutMs = (enter == moveIn) ? 500 : 100;

          Promise.resolve().then(() => {
            this.common.updateGlobalScrollTop(this.lifeCycle.scrollTop);
          });

          let mapObjectKey = (obj: Object, prefix: string) => {
            return Object.keys(obj).reduce((result, key) => {
              result[prefix + key.substring(0, 1).toUpperCase() + key.substring(1)] = obj[key]; //TODO
              return result;
            }, {});
          }

          this.routerAnimationParams = {
            ...mapObjectKey(enter, 'enter'),
            ...mapObjectKey(leave, 'leave')
          };

          if (lastRouterOutletPath != this.outlet.activatedRoute.routeConfig!.path) {
            lastRouterOutletPath = this.outlet.activatedRoute.routeConfig!.path;
            if (!this.activatedRoute.snapshot.fragment) {
              console.log('need scroll', this.activatedRoute.snapshot.fragment);
              setTimeout(() => {
                this.common.updateGlobalScrollTop(nextScrollTop);
              }, timeoutMs);
            }
          }

        });
        this.sub.add(routerChangeSub);
      };

      let onInActive = () => {
        routerChangeSub.unsubscribe();
        this.sub.remove(routerChangeSub);
      }

      this.sub.add(this.activateWatcher.watch(this.activatedRoute, onActive, onInActive));

    }

    if (this.isRoot) {
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        take(1)
      ).subscribe(_ => {
        process();
      });
    }
    else {
      process();
    }
  }

  ngOnInit() {
    if (this.isRoot) {
      this.common.disableBrowserScrollRestoration();
      this.lifeCycle.setup(this.router);
      this.cache.setup(this.router);
    }
  }

  public animationEmitter = new EventEmitter<'start' | 'done'>();

  animationStart() {
    console.log('animationStart');
  }

  animationDone() {
    console.log('animationDone');
  }
}

