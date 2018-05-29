import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyPreloadStrategyService } from './my-preload-strategy.service';

@NgModule({
    imports: [RouterModule.forRoot([
        { path: 'lazy-first', loadChildren: './lazy-first/lazy-first.module#LazyFirstModule' },
        { path: 'lazy-second', loadChildren: './lazy-second/lazy-second.module#LazySecondModule' },
    ], {
            // enableTracing: true, // <-- debugging purposes only
            preloadingStrategy: MyPreloadStrategyService
        })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
