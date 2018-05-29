import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyPreloadStrategyService extends PreloadingStrategy {

  cache: Map<string, () => Observable<any>> = new Map();

  load(routeName: string): void {
    let load = this.cache.get(routeName)!;
    load().pipe(take(1)).subscribe(_ => {
      this.cache.delete(routeName);
    });
  }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    console.log('route', route);
    if(route.data && route.data!['routeName']){
      this.cache.set(route.data!['routeName'], load);
    }
    return of(null);
  }
}
