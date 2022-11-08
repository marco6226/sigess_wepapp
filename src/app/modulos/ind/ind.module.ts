import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { IndicadoresEmpComponent } from './components/indicadores-emp/indicadores-emp.component';
import { ElaboracionTableroComponent } from './components/elaboracion-tablero/elaboracion-tablero.component'
import { EditorHtmlComponent } from '../comun/components/editor-html/editor-html.component';
import { SafeBypassPipe } from '../comun/pipes/safe-bypass.pipe';
import { ConsultaTableroComponent } from './components/consulta-tablero/consulta-tablero.component';
import { HorahombrestrabajadaComponent } from './components/horahombrestrabajada/horahombrestrabajada.component';
import { CalendarModule } from 'primeng/calendar';
import { AccidentalidadComponent } from './components/accidentalidad/accidentalidad.component';
import {ReporteAtService } from "app/modulos/ind/services/reporte-at.service";

@NgModule({
  imports: [
    CommonModule,
    ComunModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  declarations: [
    IndicadoresEmpComponent, 
    ElaboracionTableroComponent, 
    EditorHtmlComponent,
    SafeBypassPipe,
    ConsultaTableroComponent,
    HorahombrestrabajadaComponent,
    AccidentalidadComponent
  ],
  bootstrap: [HorahombrestrabajadaComponent],
  providers: [
    ReporteAtService
]
})
export class IndModule { }
