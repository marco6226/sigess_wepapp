import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FlowChartComponent } from './components/carga-archivo/flow-chart/flow-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module'
import { RegistroReportesComponent } from 'app/modulos/rai/components/registro-reportes/registro-reportes.component';
import { FormularioAccidenteComponent } from './components/registro-reportes/formulario-accidente/formulario-accidente.component';
import { FormularioIncidenteComponent } from './components/registro-reportes/formulario-incidente/formulario-incidente.component';

import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { ConsultaReportesComponent } from './components/consulta-reportes/consulta-reportes.component';
import { CargaArchivoComponent } from './components/carga-archivo/carga-archivo.component'

import { NumericTextBoxModule, ColorPickerModule, UploaderModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';

import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';

import { ButtonModule, CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';

import { AccumulationAnnotationService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, ChartAllModule } from '@syncfusion/ej2-angular-charts';

import { DiagramModule,DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';
import { SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    CommonModule,
    ComunModule,

    // DragDropModule,
    // NgxGraphModule,
    // NgFlowchartModule,
    DiagramModule,
    SymbolPaletteModule,
    ToolbarModule,
    UploaderModule,
    DiagramAllModule, 
    // ChartAllModule, 
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
    RegistroReportesComponent,
    FormularioAccidenteComponent,
    FormularioIncidenteComponent,
    ConsultaReportesComponent,
    CargaArchivoComponent,
    FlowChartComponent
  ],
  providers: [ReporteService]
})
export class RaiModule { }
