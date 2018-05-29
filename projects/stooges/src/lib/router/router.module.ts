import { RouterModule as NgRouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterOutletComponent } from './s-router-outlet/s-router-outlet.component';
import { RouterHistoryBackDirective } from './router-history-back.directive';
import { RouteReuseStrategy as NgRouteReuseStrategy } from '@angular/router';
import { RouteReuseStrategy } from './services/RouteReuseStrategy';

/*
  用法 : 
  
  <s-router-outlet [isRoot]="true" ></s-router-outlet> 放在 app.component
  <div sRouterHistoryBack >back</div> // not <a> 哦

  记得用 RouterActivateWatcher 处理缓存等等
   
*/

@NgModule({
  imports: [
    NgRouterModule
  ],
  exports: [
    RouterOutletComponent,
    RouterHistoryBackDirective
  ],
  declarations: [
    RouterOutletComponent,
    RouterHistoryBackDirective
  ]
})
export class RouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RouterModule,
      providers: [
        {
          provide: NgRouteReuseStrategy,
          useClass: RouteReuseStrategy
        }
      ]
    }
  }
}
