import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { AdminContratistasComponent } from 'app/modulos/ctr/components/admin-contratistas/admin-contratistas.component'
import { SeguimientoContratistasComponent } from 'app/modulos/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component'
import { EmpresaDashComponent } from 'app/modulos/comun/components/empresa-dash/empresa-dash.component';
import { AliadosListComponent } from './components/aliados-list/aliados-list.component';
import { AliadosComponent } from './components/aliados/aliados.component'

@NgModule({
  imports: [
    ComunModule,
  ],
  declarations: [AdminContratistasComponent, SeguimientoContratistasComponent, EmpresaDashComponent, AliadosListComponent, AliadosComponent],
  providers: []
})
export class CtrModule { }
