import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SgComponent } from './sg.component';

const routes: Routes = [	
	{ path: 'sistemaGestion', component: SgComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SgRoutingModule { }
