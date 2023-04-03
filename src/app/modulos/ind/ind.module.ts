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
import { NgxChartsModule } from 'ngx-charts-8';
import { ngxChartsBarModule, ngxChartsLineModule, ngxChartsComboModule, ngxChartsPieModule, ngxChartsStackedModule } from '@tusharghoshbd/ngx-charts';
import { IndCasosMedicosComponent } from './components/ind-casos-medicos/ind-casos-medicos.component';
import { IndCaracterizacionComponent } from './components/ind-caracterizacion/ind-caracterizacion.component';
import { IndCasosMedicosGestionComponent } from './components/ind-casos-medicos-gestion/ind-casos-medicos-gestion.component';
// import { ComboChartComponent } from './components/combo-chart/combo-chart.component';
// import { ComboSeriesVerticalComponent } from './components/combo-chart/combo-series-vertical.component';


@NgModule({
  imports: [
    CommonModule,
    ComunModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxChartsModule,
    ngxChartsBarModule,
    ngxChartsLineModule,
    ngxChartsComboModule,
    ngxChartsPieModule,
    ngxChartsStackedModule
  ],
  declarations: [
    IndicadoresEmpComponent, 
    ElaboracionTableroComponent, 
    EditorHtmlComponent,
    SafeBypassPipe,
    ConsultaTableroComponent,
    HorahombrestrabajadaComponent,
    AccidentalidadComponent,
    IndCasosMedicosComponent,
    IndCaracterizacionComponent,
    IndCasosMedicosGestionComponent,
    // ComboChartComponent,
    // ComboSeriesVerticalComponent
  ],
  bootstrap: [HorahombrestrabajadaComponent],
  providers: [
    ReporteAtService
]
})
export class IndModule { }
