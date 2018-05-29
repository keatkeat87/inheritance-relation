import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { HammerInstance } from '@angular/platform-browser/src/dom/events/hammer_gestures';


let propagating = require('propagating-hammerjs');
// 不使用 require 就用下面这个 require 的话 tsconfig types 要添加 'node', 不用 require "noImplicitAny": true 过不去.
// import * as propagatingNamespace from 'propagating-hammerjs';
// const propagating = propagatingNamespace;

export interface PropagatingHammerInput extends HammerInput {
    stopPropagation(): void;
}


/*
default 和 hammer 一样，要用到就自己写设置
<div (tap)="tap()"

  data-hammer-pinch
  data-hammer-rotate
  data-hammer-pan="all"
  data-hammer-swipe="all"

  style="width:500px;height:500px;overflow: scroll">
  <div style="height:1000px;">
    dada
  </div>
</div>

*/


@Injectable()
export class StoogesHammerGestureConfig extends HammerGestureConfig {
    overrides = <any>{};

    buildHammer(element: HTMLElement) : HammerInstance {
        const needRotate = element.dataset['hammerRotate'] != undefined;
        const needPinch = element.dataset['hammerPinch'] != undefined;
        const panDirection = element.dataset['hammerPan'];
        const swipeDirection = element.dataset['hammerSwipe'];
        const mc = propagating(new Hammer(element)) as HammerManager;
        // const mc = new Hammer(element);
        if (needPinch) mc.get('pinch').set({ enable: true });
        if (needRotate) mc.get('rotate').set({ enable: true });
        if (panDirection) mc.get('pan').set({ direction: Hammer['DIRECTION_' + panDirection.toUpperCase()] });
        if (swipeDirection) mc.get('swipe').set({ direction: Hammer['DIRECTION_' + swipeDirection.toUpperCase()] });

        for (const eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }

        return mc;
    }
}
