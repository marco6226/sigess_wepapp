import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspeccionesComponent } from './inspecciones.component';
import { ListasInspeccionComponent } from './components/listas-inspeccion/listas-inspeccion.component';
import { ElaboracionListaComponent } from './components/elaboracion-lista/elaboracion-lista.component';
import { ProgramacionComponent } from './components/programacion/programacion.component';
import { ElaboracionInspeccionesComponent } from './components/elaboracion-inspecciones/elaboracion-inspecciones.component';

import { AuthGuardService } from './../core/auth-guard.service';

const routes: Routes = [
  {
    path: 'inspecciones',
    component: InspeccionesComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'listasInspeccion', component: ListasInspeccionComponent },
      { path: 'elaboracionLista', component: ElaboracionListaComponent },
      { path: 'programacion', component: ProgramacionComponent },
      { path: 'elaboracionInspecciones', component: ElaboracionInspeccionesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InspeccionesRoutingModule { }
