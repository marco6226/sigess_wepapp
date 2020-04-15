import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { SgRoutingModule } from './sg-routing.module';
import { SgComponent } from './sg.component';
import { SistemaGestionComponent } from './components/sistema-gestion/sistema-gestion.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { ConsultaEvaluacionComponent } from './components/consulta-evaluacion/consulta-evaluacion.component';

import { SistemaGestionService } from 'app/modulos/sg/services/sistema-gestion.service';
import { EvaluacionService } from 'app/modulos/sg/services/evaluacion.service';
import { RespuestaService } from 'app/modulos/sg/services/respuesta.service';
import { ReporteSGEService } from 'app/modulos/sg/services/reporte-sge.service';
import { VisorPdfComponent } from 'app/modulos/comun/components/visor-pdf/visor-pdf.component'

import { SgeFormComponent } from './components/sge-form/sge-form.component';
import { SgeNodoComponent } from './components/sge-form/sge-nodo/sge-nodo.component';
import { SgeCompositorComponent } from './components/sge-form/sge-compositor/sge-compositor.component';
import { DesviacionesEvaluacionComponent } from './components/desviaciones-evaluacion/desviaciones-evaluacion.component';

import { DocumentoSelectorComponent } from 'app/modulos/ado/components/documento-selector/documento-selector.component'

@NgModule({
  imports: [
    ComunModule,
    SgRoutingModule
  ],
  declarations: [
    SgComponent,
    SistemaGestionComponent,
    EvaluacionComponent,
    ConsultaEvaluacionComponent,
    SgeFormComponent,
    SgeNodoComponent,
    SgeCompositorComponent,
    VisorPdfComponent,
    DesviacionesEvaluacionComponent,
    DocumentoSelectorComponent
  ],
  providers: [SistemaGestionService, EvaluacionService, RespuestaService, ReporteSGEService]
})
export class SgModule { }
