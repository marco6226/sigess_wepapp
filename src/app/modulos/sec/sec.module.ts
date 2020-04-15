import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecRoutingModule } from './sec-routing.module';
import { ComunModule } from 'app/modulos/comun/comun.module'
import { SecComponent } from './sec.component';
import { ConsultaDesviacionComponent } from './components/consulta-desviacion/consulta-desviacion.component';
import { GestionTareasComponent } from './components/gestion-tareas/gestion-tareas.component';
import { AsignacionTareasComponent } from './components/asignacion-tareas/asignacion-tareas.component';
import { AnalisisDesviacionComponent } from './components/analisis-desviacion/analisis-desviacion.component';

import { SistemaCausaRaizService } from 'app/modulos/sec/services/sistema-causa-raiz.service';
import { DesviacionService } from 'app/modulos/sec/services/desviacion.service';
import { AnalisisDesviacionService } from 'app/modulos/sec/services/analisis-desviacion.service'
import { TareaService } from 'app/modulos/sec/services/tarea.service'

import { ConsultaAnalisisDesviacionComponent } from './components/consulta-analisis-desviacion/consulta-analisis-desviacion.component';


import { TreeTableModule } from 'primeng/treetable';
import { AnalisisCostosComponent } from './components/analisis-costos/analisis-costos.component';
import { DocumentosAnalisisDesviacionComponent } from './components/documentos-analisis-desviacion/documentos-analisis-desviacion.component';
import { ConsultaDesviacionInspeccionComponent } from './components/consulta-desviacion-inspeccion/consulta-desviacion-inspeccion.component';

@NgModule({
  imports: [
    CommonModule,
    SecRoutingModule,
    ComunModule,
    TreeTableModule
  ],
  declarations: [
    SecComponent,
    ConsultaDesviacionComponent,
    GestionTareasComponent,
    AsignacionTareasComponent,
    AnalisisDesviacionComponent,
    ConsultaAnalisisDesviacionComponent,
    AnalisisCostosComponent,
    DocumentosAnalisisDesviacionComponent,
    ConsultaDesviacionInspeccionComponent
  ],
  providers: [SistemaCausaRaizService, DesviacionService, AnalisisDesviacionService, TareaService]
})
export class SecModule { }
