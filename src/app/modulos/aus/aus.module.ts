import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { CommonModule } from '@angular/common';
import { ReporteAusentismoComponent } from './components/reporte-ausentismo/reporte-ausentismo.component';
import { ConsultaAusentismoComponent } from './components/consulta-ausentismo/consulta-ausentismo.component';

@NgModule({
  imports: [
    CommonModule,
    ComunModule
  ],
  exports:[
    ComunModule
  ],
  declarations: [ReporteAusentismoComponent, ConsultaAusentismoComponent]
})
export class AusModule { }
