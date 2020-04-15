import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaActasComponent } from './components/consulta-actas/consulta-actas.component';
import { ComunModule } from '../comun/comun.module';

@NgModule({
  declarations: [ConsultaActasComponent],
  imports: [
    ComunModule,
    CommonModule
  ]
})
export class CopModule { }
