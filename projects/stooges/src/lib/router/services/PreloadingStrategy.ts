import { Injectable } from '@angular/core';
import { PreloadingStrategy as NgPreloadingStrategy , Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PreloadingStrategy extends NgPreloadingStrategy {

    private store: Map<string, () => Observable<any>> = new Map();

    load(routeName: string): void {
        let load = this.store.get(routeName)!;
        load().pipe(take(1)).subscribe(_ => {
            this.store.delete(routeName);
        });
    }

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data!['preLoadingRouteName']) {
            this.store.set(route.data!['preLoadingRouteName'], load);
        }
        return of(null);
    }
}
