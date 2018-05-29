import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, RouteData } from '../../../stooges/src/public_api';


@NgModule({
    imports: [RouterModule.forRoot([
        { path: '', pathMatch: 'full', redirectTo: 'events' },
        {
            path: 'secure',
            loadChildren : './secure/secure.module#SecureModule'
        }, 
        {
            path: '',
            loadChildren: './cp/cp.module#CPModule',
            // future : 之后改成 canLoad, wait for ng issue fixed
            canActivate: [AuthGuard],
            data: new RouteData({
                authGuardRole: 'Admin',
                authLoginPath: '/secure/login'
            }),
        },    
        { path: '**', pathMatch: 'full', loadChildren: './not-found/not-found.module#NotFoundModule' }
    ])],
    exports: [RouterModule],
})
export class AppRoutingModule { }
