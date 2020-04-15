import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module'
import { RegistroReportesComponent } from 'app/modulos/rai/components/registro-reportes/registro-reportes.component';
import { FormularioAccidenteComponent } from './components/registro-reportes/formulario-accidente/formulario-accidente.component';
import { FormularioIncidenteComponent } from './components/registro-reportes/formulario-incidente/formulario-incidente.component';

import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { ConsultaReportesComponent } from './components/consulta-reportes/consulta-reportes.component';
import { CargaArchivoComponent } from './components/carga-archivo/carga-archivo.component'

@NgModule({
  imports: [
    CommonModule,
    ComunModule
  ],
  declarations: [
    RegistroReportesComponent,
    FormularioAccidenteComponent,
    FormularioIncidenteComponent,
    ConsultaReportesComponent,
    CargaArchivoComponent
  ],
  providers: [ReporteService]
})
export class RaiModule { }
