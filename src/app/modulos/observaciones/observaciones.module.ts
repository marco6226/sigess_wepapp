import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservacionesRoutingModule } from './observaciones-routing.module';
import { ObservacionesComponent } from './observaciones.component';

import { TarjetaService } from 'app/modulos/observaciones/services/tarjeta.service';
import { ObservacionService } from 'app/modulos/observaciones/services/observacion.service';
import { RegistroObservacionesComponent } from './components/registro-observaciones/registro-observaciones.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component'

import { ComunModule } from 'app/modulos/comun/comun.module';
import { FormularioTarjetaComponent } from './components/formulario-tarjeta/formulario-tarjeta.component';
import { GestionObservacionesComponent } from './components/gestion-observaciones/gestion-observaciones.component';
import { ConsultaObservacionesComponent } from './components/consulta-observaciones/consulta-observaciones.component';

@NgModule({
  imports: [
    ComunModule,
    CommonModule,
    ObservacionesRoutingModule
  ],
  declarations: [
    ObservacionesComponent,
    RegistroObservacionesComponent,
    TarjetaComponent,
    FormularioTarjetaComponent,
    GestionObservacionesComponent,
    ConsultaObservacionesComponent
  ],
  providers: [TarjetaService, ObservacionService]
})
export class ObservacionesModule { }
