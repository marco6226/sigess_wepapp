import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionesComponent } from './observaciones.component';

const routes: Routes = [
    { path: 'observaciones', component: ObservacionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ObservacionesRoutingModule { }
