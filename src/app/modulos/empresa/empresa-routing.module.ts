import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaComponent } from './empresa.component';
/*
import { EmpresaAdminComponent } from './components/empresa-admin/empresa-admin.component';
import { SedeComponent } from './components/sede/sede.component';
import { AreaComponent } from './components/area/area.component';
import { CargoComponent } from './components/cargo/cargo.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';

import { AuthGuardService } from './../core/auth-guard.service';
*/
const routes: Routes = [
  /*
  {
    path: 'inicio/empresa',
    component: EmpresaComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'empresa', component: EmpresaAdminComponent },
      { path: 'sede', component: SedeComponent },
      { path: 'area', component: AreaComponent },
      { path: 'cargo', component: CargoComponent },
      { path: 'empleado', component: EmpleadoComponent }
    ]
  }
*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmpresaRoutingModule { }
