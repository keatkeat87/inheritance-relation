import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LazySecondComponent } from './lazy-second.component';

const routes: Routes = [
  { path : '', component : LazySecondComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazySecondRoutingModule { }
