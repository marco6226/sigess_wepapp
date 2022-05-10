import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecRoutingModule } from './sec-routing.module';
import { ComunModule } from 'app/modulos/comun/comun.module'
import { SecComponent } from './sec.component';
import { ConsultaDesviacionComponent } from './components/consulta-desviacion/consulta-desviacion.component';
import { GestionTareasComponent } from './components/gestion-tareas/gestion-tareas.component';
import { AsignacionTareasComponent } from './components/asignacion-tareas/asignacion-tareas.component';
import { MisTareasComponent } from './components/mis-tareas/mis-tareas.component';
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
import { ButtonModule, ColorPickerModule, MultiSelectModule, RadioButtonModule, TooltipModule } from 'primeng/primeng';
import { TareaComponent } from './components/tarea/tarea.component';
import { CoreModule } from '../core/core.module';
import { SeguimientosTareasComponent } from './components/seguimientos-tareas/seguimientos-tareas.component';
import { VerificacionTareaComponent } from './components/verificacion-tarea/verificacion-tarea.component';
import { CapitalizePipe } from './utils/pipes/capitalize.pipe';
import { MiembrosEquipoComponent } from './components/analisis-desviacion/miembros-equipo/miembros-equipo.component';
import { FlowChartComponent } from './components/analisis-desviacion/flow-chart/flow-chart.component';
import { DiagramModule, SymbolPaletteModule, DiagramAllModule, OverviewAllModule, SymbolPaletteAllModule } from '@syncfusion/ej2-angular-diagrams';
import { NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { BrowserModule } from '@angular/platform-browser';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SecRoutingModule,
        ComunModule,
        TreeTableModule,
        TooltipModule,
        DiagramModule,
        SymbolPaletteModule,
        ToolbarModule,
        UploaderModule,
        DiagramAllModule, 
        GridAllModule, 
        SymbolPaletteAllModule, 
        OverviewAllModule, 
        ButtonModule,       
        ColorPickerModule,  
        // // DateRangePickerModule, 
         CheckBoxModule, 
        // // AccumulationChartModule, 
         ToolbarModule, 
         DropDownButtonModule, 
         UploaderModule, 
        // // CircularGaugeModule, 
        // // DropDownListAllModule, 
         ListViewAllModule,       
        //  // DialogAllModule, 
         TextBoxModule, 
         RadioButtonModule,       
         MultiSelectModule, 
         NumericTextBoxModule, 
         BrowserModule
    ],
    declarations: [
        SecComponent,
        ConsultaDesviacionComponent,
        GestionTareasComponent,
        AsignacionTareasComponent,
        MisTareasComponent,
        AnalisisDesviacionComponent,
        ConsultaAnalisisDesviacionComponent,
        AnalisisCostosComponent,
        DocumentosAnalisisDesviacionComponent,
        ConsultaDesviacionInspeccionComponent,
        TareaComponent,
        SeguimientosTareasComponent,
        VerificacionTareaComponent,
        CapitalizePipe,
        MiembrosEquipoComponent,
        FlowChartComponent
    ],
    providers: [
        SistemaCausaRaizService,
        DesviacionService,
        AnalisisDesviacionService,
        TareaService,
        CapitalizePipe
    ]
})
export class SecModule { }
