import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LazyFirstComponent } from './lazy-first.component';

const routes: Routes = [
  { 
    path : '', 
    component : LazyFirstComponent,
    children : [
      { 
        path : 'child', 
        loadChildren : './child/child.module#ChildModule',
        data : {
          routeName : 'lazy-first-child',
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyFirstRoutingModule { }
