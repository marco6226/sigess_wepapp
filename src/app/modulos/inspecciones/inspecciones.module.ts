import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { InspeccionesRoutingModule } from './inspecciones-routing.module';
import { InspeccionesComponent } from './inspecciones.component';
import { ListasInspeccionComponent } from './components/listas-inspeccion/listas-inspeccion.component';
import { ProgramacionComponent } from './components/programacion/programacion.component';
import { ElaboracionInspeccionesComponent } from './components/elaboracion-inspecciones/elaboracion-inspecciones.component';
import { ElaboracionListaComponent } from './components/elaboracion-lista/elaboracion-lista.component';
import { ListaInspeccionFormComponent } from './components/lista-inspeccion-form/lista-inspeccion-form.component';
import { ElementoInspeccionNodeComponent } from './components/lista-inspeccion-form/elemento-inspeccion-node/elemento-inspeccion-node.component';

import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'
import { ProgramacionService } from 'app/modulos/inspecciones/services/programacion.service'
import { InspeccionService } from 'app/modulos/inspecciones/services/inspeccion.service';
import { ConsultaInspeccionesComponent } from './components/consulta-inspecciones/consulta-inspecciones.component'
import { PanelFlotanteComponent } from 'app/modulos/comun/components/panel-flotante/panel-flotante.component';


@NgModule({
  imports: [
    ComunModule,
    InspeccionesRoutingModule
  ],
  declarations: [
    InspeccionesComponent,
    ListasInspeccionComponent,
    ProgramacionComponent,
    InspeccionesComponent,
    ElaboracionInspeccionesComponent,
    ElaboracionListaComponent,
    ListaInspeccionFormComponent,
    ElementoInspeccionNodeComponent,
    ConsultaInspeccionesComponent
  ],
  providers: [ListaInspeccionService, ProgramacionService, InspeccionService]
})
export class InspeccionesModule { }
