import { LocalidadesComponent } from './components/localidades/localidades.component';
import { AsignacionColiderComponent } from './components/asignacion-colider/asignacion-colider.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { CargueDocumentosComponent } from './components/cargue-documentos/cargue-documentos.component';
import { ActividadesContratadasComponent } from './components/actividades-contratadas/actividades-contratadas.component';
import { EquipoSstListComponent } from './components/equipo-sst-list/equipo-sst-list.component';
import { EquipoSstComponent } from './components/equipo-sst/equipo-sst.component';
import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { AdminContratistasComponent } from 'app/modulos/ctr/components/admin-contratistas/admin-contratistas.component'
import { SeguimientoContratistasComponent } from 'app/modulos/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component'
import { EmpresaDashComponent } from 'app/modulos/comun/components/empresa-dash/empresa-dash.component';
import { AliadosListComponent } from './components/aliados-list/aliados-list.component';
import { AliadosComponent } from './components/aliados/aliados.component';
import { AliadosActualizarComponent } from './components/aliados-actualizar/aliados-actualizar.component';
import { InformacionGeneralComponent } from './components/informacion-general/informacion-general.component'
import { ControlRiesgoComponent } from './components/control-riesgo/control-riesgo.component';
import { SubcontratistasComponent } from './components/subcontratistas/subcontratistas.component';
import { FormSubcontratistaComponent } from './components/subcontratistas/form-subcontratista/form-subcontratista.component';
// import { Tree, TreeNode } from 'primeng/primeng';
// import { TreeSelectModule } from 'primeng/tree';
// TreeSelectModule is 


@NgModule({
  imports: [
    ComunModule,
    // Tree,
  ],
  declarations: [
    AdminContratistasComponent, 
    SeguimientoContratistasComponent, 
    EmpresaDashComponent, 
    AliadosListComponent, 
    AliadosComponent, 
    AliadosActualizarComponent,
    EquipoSstComponent,
    EquipoSstListComponent,
    ActividadesContratadasComponent,
    CargueDocumentosComponent,
    CalificacionComponent,
    AsignacionColiderComponent,
    LocalidadesComponent,
    InformacionGeneralComponent,
    ControlRiesgoComponent,
    SubcontratistasComponent,
    FormSubcontratistaComponent
  ],
  providers: []
})
export class CtrModule { }
