import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { CieSelectorComponent } from 'app/modulos/comun/components/cie-selector/cie-selector.component';

import { SesionService } from 'app/modulos/core/services/sesion.service'
import { EnumeracionesService } from 'app/modulos/comun/services/enumeraciones.service'
import { ComunService } from 'app/modulos/comun/services/comun.service'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service'
import { CambioPasswdService } from 'app/modulos/comun/services/cambio-passwd.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { SistemaNivelRiesgoService } from 'app/modulos/core/services/sistema-nivel-riesgo.service';
import { TienePermisoDirective } from 'app/modulos/comun/directives/tiene-permiso.directive'
import { ConfiguracionGeneralDirective } from 'app/modulos/comun/directives/configuracion-general.directive'
import { FileSizePipe } from 'app/modulos/comun/pipes/file-size.pipe'


import { IndicadoresAusentismoComponent } from 'app/modulos/ind/components/indicadores-ausentismo/indicadores-ausentismo.component';
import { PanelGraficaComponent } from 'app/modulos/ind/components/panel-grafica/panel-grafica.component';
import { IndicadoresSgeComponent } from 'app/modulos/ind/components/indicadores-sge/indicadores-sge.component';
import { IndicadoresRaiComponent } from 'app/modulos/ind/components/indicadores-rai/indicadores-rai.component';
import { IndicadoresInpComponent } from 'app/modulos/ind/components/indicadores-inp/indicadores-inp.component';


import {
	SharedModule,
	PanelModule,
	InputTextareaModule,
	InputTextModule,
	PasswordModule,
	CheckboxModule,
	TabViewModule,
	TooltipModule,
	GrowlModule,
	RadioButtonModule,
	DropdownModule,
	DialogModule,
	MessagesModule,
	MessageModule,
	AccordionModule,
	ConfirmDialogModule,
	ToggleButtonModule,
	SelectButtonModule,
	TreeModule,
	FieldsetModule,
	CalendarModule,
	SpinnerModule,
	MenuModule,
	MultiSelectModule,
	OverlayPanelModule,
	OrganizationChartModule,
	AutoCompleteModule,
	ContextMenuModule,
	InputMaskModule,
	ChipsModule,
	FileUploadModule,
	BreadcrumbModule,
	ChartModule,
	GalleriaModule,
	LightboxModule,
	InputSwitchModule,

} from 'primeng/primeng';

import { GMapModule } from 'primeng/gmap';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { LayoutComponent } from './components/layout/layout.component'
import { LayoutMenuComponent } from './components/layout/layout-menu/layout-menu.component'
import { LayoutContentComponent } from './components/layout/layout-content/layout-content.component'


import { VisorPdfComponent } from 'app/modulos/comun/components/visor-pdf/visor-pdf.component'
//import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { AreaSelectorComponent } from 'app/modulos/empresa/components/area/area-selector/area-selector.component';
import { MultiAreaSelectorComponent } from 'app/modulos/empresa/components/area/multi-area-selector/multi-area-selector.component';
import { CiudadSelectorComponent } from 'app/modulos/comun/components/ciudad-selector/ciudad-selector.component';
import { CustomRadioButtonComponent } from './components/custom-radio-button/custom-radio-button.component';
import { MensajeUsuarioComponent } from './components/mensaje-usuario/mensaje-usuario.component';
import { EmpleadoSelectorComponent } from './components/empleado-selector/empleado-selector.component';
import { SelectorRangoFechasComponent } from './components/selector-rango-fechas/selector-rango-fechas.component'

import { DocumentoUploadComponent } from 'app/modulos/ado/components/documento-upload/documento-upload.component';
import { PanelFlotanteComponent } from 'app/modulos/comun/components/panel-flotante/panel-flotante.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { FormularioConstructorComponent } from './components/formulario-constructor/formulario-constructor.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { DataNotFoundComponent } from './components/data-not-found/data-not-found.component';
import { RangoFechaSelectorComponent } from './components/rango-fecha-selector/rango-fecha-selector.component';
import { CambioPasswdComponent } from './components/cambio-passwd/cambio-passwd.component';
import { LoginComponent } from '../core/components/login/login.component';
import { ContactoComponent } from '../core/components/contacto/contacto.component';
import { IdleTimeoutComponent } from './components/idle-timeout/idle-timeout.component';
import { DiagramAllModule, DiagramModule, OverviewAllModule, SymbolPaletteAllModule, SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';

import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {RatingModule} from 'primeng/rating';
// import {InputNumberModule} from 'primeng/primeng';


const modules = [
	ToastModule,
	ButtonModule,
	BreadcrumbModule,
	MenuModule,
	ConfirmDialogModule,
	PanelModule,
	ToolbarModule,
	RatingModule,
	FileUploadModule,
	// InputNumberModule
  ];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		RouterModule,

		PanelModule,
		PasswordModule,
		InputTextareaModule,
		InputTextModule,
		CheckboxModule,
		TabViewModule,
		ButtonModule,
		TooltipModule,
		GrowlModule,
		RadioButtonModule,
		DropdownModule,
		DialogModule,
		MessagesModule,
		MessageModule,
		AccordionModule,
		ConfirmDialogModule,
		ToggleButtonModule,
		SelectButtonModule,
		TreeTableModule,
		TreeModule,
		FieldsetModule,
		CalendarModule,
		SpinnerModule,
		MenuModule,
		MultiSelectModule,
		OverlayPanelModule,
		OrganizationChartModule,
		AutoCompleteModule,
		ContextMenuModule,
		InputMaskModule,
		ChipsModule,
		FileUploadModule,
		BreadcrumbModule,
		// TreeSelectModule,
		
		ChartModule,
		MultiSelectModule,
		DropdownModule,
		CalendarModule,
		GalleriaModule,
		LightboxModule,
		InputSwitchModule,
		TableModule,
		PaginatorModule,
		ScrollPanelModule,
		GMapModule,
        ProgressSpinnerModule,

        DiagramAllModule, 
		DiagramModule, 
		OverviewAllModule, 
		SymbolPaletteAllModule, 
		SymbolPaletteModule,

		modules
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		RouterModule,

		PanelModule,
		PasswordModule,
		InputTextareaModule,
		InputTextModule,
		CheckboxModule,
		TabViewModule,
		ButtonModule,
		TooltipModule,
		GrowlModule,
		RadioButtonModule,
		DropdownModule,
		DialogModule,
		MessagesModule,
		AccordionModule,
		ConfirmDialogModule,
		ToggleButtonModule,
		SelectButtonModule,
		TreeTableModule,
		TreeModule,
		FieldsetModule,
		CalendarModule,
		SpinnerModule,
		MenuModule,
		MultiSelectModule,
		OverlayPanelModule,
		OrganizationChartModule,
		AutoCompleteModule,
		ContextMenuModule,
		InputMaskModule,
		ChipsModule,
		FileUploadModule,
		BreadcrumbModule,
		InputSwitchModule,

		ChartModule,
		MultiSelectModule,
		DropdownModule,
		CalendarModule,
		GalleriaModule,
		LightboxModule,
		TableModule,
		PaginatorModule,
		ScrollPanelModule,
		GMapModule,
		ProgressSpinnerModule,
        CieSelectorComponent,
		LayoutComponent,
		LayoutMenuComponent,
		LayoutContentComponent,
		AreaSelectorComponent,
		MultiAreaSelectorComponent,
		CiudadSelectorComponent,
		//PdfViewerComponent,
		CustomRadioButtonComponent,
		EmpleadoSelectorComponent,
		SelectorRangoFechasComponent,
		DocumentoUploadComponent,
		DataNotFoundComponent,
		RangoFechaSelectorComponent,

		IndicadoresAusentismoComponent,
		PanelGraficaComponent,
		IndicadoresSgeComponent,
		IndicadoresRaiComponent,
		IndicadoresInpComponent,
		PanelFlotanteComponent,
		GaleriaComponent,
		FormularioConstructorComponent,
		FormularioComponent,

		FileSizePipe,
		TienePermisoDirective,
		ConfiguracionGeneralDirective,

		DiagramAllModule, 
		DiagramModule, 
		OverviewAllModule, 
		SymbolPaletteAllModule, 
		SymbolPaletteModule,

		modules
	],
	declarations: [
        LayoutComponent,
		LayoutMenuComponent,
		LayoutContentComponent,
        CieSelectorComponent,
        AreaSelectorComponent,
		MultiAreaSelectorComponent,
		CiudadSelectorComponent,
		//PdfViewerComponent,
		CustomRadioButtonComponent,
		MensajeUsuarioComponent,
		FileSizePipe,
		TienePermisoDirective,
		ConfiguracionGeneralDirective,
		EmpleadoSelectorComponent,
		SelectorRangoFechasComponent,
		DocumentoUploadComponent,
		IndicadoresAusentismoComponent,
		PanelGraficaComponent,
		IndicadoresSgeComponent,
		IndicadoresRaiComponent,
		IndicadoresInpComponent,
		PanelFlotanteComponent,
		GaleriaComponent,
		FormularioConstructorComponent,
		FormularioComponent,
		DataNotFoundComponent,
		RangoFechaSelectorComponent,
		CambioPasswdComponent,
		LoginComponent,
		ContactoComponent,
		IdleTimeoutComponent
	],
	providers: [
		ConfirmationService,
		SesionService,
		EnumeracionesService,
		ComunService,
		MensajeUsuarioService,
		CambioPasswdService,
		ParametroNavegacionService,
		SistemaNivelRiesgoService,
	]
})
export class ComunModule { }
