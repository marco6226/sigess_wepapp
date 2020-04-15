import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module'
import { ParametrizacionPeligrosComponent } from './components/parametrizacion-peligros/parametrizacion-peligros.component';
import { FormularioIpecrComponent } from './components/formulario-ipecr/formulario-ipecr.component';
import { FormularioPeligroComponent } from './components/formulario-peligro/formulario-peligro.component';
import { ConsultaIpecrComponent } from './components/consulta-ipecr/consulta-ipecr.component';

@NgModule({
  imports: [
    CommonModule,
    ComunModule
  ],
  declarations: [ParametrizacionPeligrosComponent, FormularioIpecrComponent, FormularioPeligroComponent, ConsultaIpecrComponent],
})
export class IprModule { }
