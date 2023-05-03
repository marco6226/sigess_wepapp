import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
// import { FlowChartComponent } from './components/carga-archivo/flow-chart/flow-chart.component';
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

import { DiagramModule,DiagramContextMenuService,DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';
import { SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { BrowserModule } from '@angular/platform-browser';
import { RegistroReporteTemporalComponent } from './components/registro-reporte-temporal/registro-reporte-temporal.component';
import { ConsultarReporteTemporalComponent } from './components/consultar-reporte-temporal/consultar-reporte-temporal.component';
import { FormularioAccidenteTemporalComponent } from './components/registro-reporte-temporal/formulario-accidente-temporal/formulario-accidente-temporal.component';
import { FormularioIncidenteTemporalComponent } from './components/registro-reporte-temporal/formulario-incidente-temporal/formulario-incidente-temporal.component';
import { IncapacidadesComplementariaComponent } from 'app/modulos/sec/components/analisis-desviacion/factor-causal/incapacidades-complementaria/incapacidades-complementaria.component';
import { IncapacidadesComplementariaTemporalComponent } from './components/registro-reporte-temporal/formulario-accidente-temporal/incapacidades-complementaria-temporal/incapacidades-complementaria-temporal.component';
import { ListadoCausasTemporalComponent } from './components/registro-reporte-temporal/formulario-accidente-temporal/listado-causas-temporal/listado-causas-temporal.component';
import { RegistroReporteCtrComponent } from './components/registro-reporte-ctr/registro-reporte-ctr.component';
import { FormularioAccidenteCtrComponent } from './components/registro-reporte-ctr/formulario-accidente/formulario-accidente-ctr.component';
import { IncapacidadesCtrComponent } from './components/registro-reporte-ctr/formulario-accidente/incapacidades-ctr/incapacidades-ctr.component';
import { ConsultaReportesAliadoComponent } from './components/consulta-reportes-aliado/consulta-reportes-aliado.component';
import { DesviacionAliadosService } from '../sec/services/desviacion-aliados.service';
// import { FileUploaderComponent } from '../core/components/file-uploader/file-uploader.component';
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
    RegistroReporteTemporalComponent,
    ConsultarReporteTemporalComponent,
    FormularioAccidenteTemporalComponent,
    FormularioIncidenteTemporalComponent,
    IncapacidadesComplementariaTemporalComponent,
    ListadoCausasTemporalComponent,
    RegistroReporteCtrComponent,
    FormularioAccidenteCtrComponent,
    IncapacidadesCtrComponent,
    ConsultaReportesAliadoComponent
    // FlowChartComponent
  ],
  providers: [ReporteService, DesviacionAliadosService,DiagramContextMenuService]
})
export class RaiModule { }
