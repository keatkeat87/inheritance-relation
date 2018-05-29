import { RouterCacheService } from './services/router-cache.service';
import { Router } from '@angular/router';
import { Directive } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[sRouterHistoryBack]',
  host: {
    '(click)': 'click()'
  }
})
export class RouterHistoryBackDirective {

  constructor(
    private router: Router,
    private routerCacheService: RouterCacheService,
    private location: Location
  ) { }

  click() {
    if (this.routerCacheService.noCache) {
      this.router.navigate(['../'], { replaceUrl: true });
    }
    else {
      this.location.back();
    }
  } 
}
