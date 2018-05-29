import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HammerService {

  constructor() { }

  isPanEqualSwipe(e: HammerInput) : boolean {
    const swipeSpped = (e.pointerType == 'mouse') ? 1.5 : 0.7;
    const panSpeed = Math.abs(e.deltaX) / e.deltaTime;
    return panSpeed >= swipeSpped;
  }

  isPanLeft(e: HammerInput) : boolean {
     return e.deltaX < 0;
  }

  isPanRight(e: HammerInput) : boolean {
    return e.deltaX > 0;
  }

}
