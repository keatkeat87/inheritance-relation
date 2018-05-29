import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Device } from '../../types';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { merge, Observable } from 'rxjs';
import { filter, mapTo, publishReplay, refCount } from 'rxjs/operators';
import { DEVICE_CONFIG, DeviceConfig } from './device-config';

/*
   note : 
   留意哦, 不在 browser 跑会坏掉的. 因为这个依赖 dom
*/
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private document: Document
  constructor(
    // 必须是 any, 然后才放进去, 不然 compile 会 error 
    // https://github.com/angular/angular/issues/20351
    // 目前这个是 material 的解决方案.
    @Inject(DOCUMENT) _document: any,
    @Inject(DEVICE_CONFIG) private config: DeviceConfig,
    private breakpointObserver: BreakpointObserver
  ) {

    this.document = _document;

    let breakpointObservers = this.config.breakpoints.map(breakpoint => {
      return this.breakpointObserver.observe([breakpoint.mediaQuery]).pipe(
        filter(breakpointState => breakpointState.matches),
        mapTo<BreakpointState, Device>(breakpoint.device)
      )
    });
    this.device$ = merge(...breakpointObservers).pipe(publishReplay(1), refCount());
  }

  device$: Observable<Device>

  get device(): Device {
    return this.config.breakpoints.find(b => this.breakpointObserver.isMatched(b.mediaQuery))!.device; 
  }

  get devicePixelRatio(): number {
    return window.devicePixelRatio;
  }

  get deviceWidth(): number {
    return this.document.documentElement.clientWidth;
  }
  get deviceHeight(): number {
    return this.document.documentElement.clientHeight;
  }


}
