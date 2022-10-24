import { AliadosComponent } from './../ctr/components/aliados/aliados.component';
import { AliadosListComponent } from './../ctr/components/aliados-list/aliados-list.component';
import { NgModule } from '@angular/core';

// CommonModule se encuentra en ComunModule (personalizado) por lo que no es
// necesario volver a importarlo aqui, sin embargo ComunModule 
// si es necesario ya que es quien lo contiene
//import { CommonModule } from '@angular/common';

import { ComunModule } from 'app/modulos/comun/comun.module';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';

import { EmpresaAdminComponent } from 'app/modulos/empresa/components/empresa-admin/empresa-admin.component';
import { AreaComponent } from 'app/modulos/empresa/components/area/area.component';
import { CargoComponent } from 'app/modulos/empresa/components/cargo/cargo.component';
import { EmpleadoComponent } from 'app/modulos/empresa/components/empleado/empleado.component';
import { HhtComponent } from 'app/modulos/empresa/components/hht/hht.component';

import { ListasInspeccionComponent } from 'app/modulos/inspecciones/components/listas-inspeccion/listas-inspeccion.component';
import { ElaboracionListaComponent } from 'app/modulos/inspecciones/components/elaboracion-lista/elaboracion-lista.component';
import { ProgramacionComponent } from 'app/modulos/inspecciones/components/programacion/programacion.component';
import { ConsultaInspeccionesComponent } from 'app/modulos/inspecciones/components/consulta-inspecciones/consulta-inspecciones.component';
import { ElaboracionInspeccionesComponent } from 'app/modulos/inspecciones/components/elaboracion-inspecciones/elaboracion-inspecciones.component';

import { ParametrizacionPeligrosComponent } from 'app/modulos/ipr/components/parametrizacion-peligros/parametrizacion-peligros.component';
import { FormularioIpecrComponent } from 'app/modulos/ipr/components/formulario-ipecr/formulario-ipecr.component';
import { ConsultaIpecrComponent } from 'app/modulos/ipr/components/consulta-ipecr/consulta-ipecr.component';

import { PerfilComponent } from 'app/modulos/admin/components/perfil/perfil.component';
import { UsuarioComponent } from 'app/modulos/admin/components/usuario/usuario.component';
import { PermisosComponent } from 'app/modulos/admin/components/permisos/permisos.component';

import { SgeFormComponent } from 'app/modulos/sg/components/sge-form/sge-form.component';
import { ConsultaEvaluacionComponent } from 'app/modulos/sg/components/consulta-evaluacion/consulta-evaluacion.component';
import { EvaluacionComponent } from 'app/modulos/sg/components/evaluacion/evaluacion.component';
import { SistemaGestionComponent } from 'app/modulos/sg/components/sistema-gestion/sistema-gestion.component';

import { ConsultaDesviacionComponent } from 'app/modulos/sec/components/consulta-desviacion/consulta-desviacion.component';
import { ConsultaAnalisisDesviacionComponent } from 'app/modulos/sec/components/consulta-analisis-desviacion/consulta-analisis-desviacion.component';
import { AnalisisDesviacionComponent } from 'app/modulos/sec/components/analisis-desviacion/analisis-desviacion.component';
import { GestionTareasComponent } from 'app/modulos/sec/components/gestion-tareas/gestion-tareas.component';
import { AsignacionTareasComponent } from 'app/modulos/sec/components/asignacion-tareas/asignacion-tareas.component';
import { MisTareasComponent } from 'app/modulos/sec/components/mis-tareas/mis-tareas.component';


import { TarjetaComponent } from 'app/modulos/observaciones/components/tarjeta/tarjeta.component';
import { RegistroObservacionesComponent } from 'app/modulos/observaciones/components/registro-observaciones/registro-observaciones.component';
import { ConsultaObservacionesComponent } from 'app/modulos/observaciones/components/consulta-observaciones/consulta-observaciones.component';
import { GestionObservacionesComponent } from 'app/modulos/observaciones/components/gestion-observaciones/gestion-observaciones.component';

import { RegistroReportesComponent } from 'app/modulos/rai/components/registro-reportes/registro-reportes.component'
import { RegistroReporteTemporalComponent } from 'app/modulos/rai/components/registro-reporte-temporal/registro-reporte-temporal.component'
import { ConsultaReportesComponent } from 'app/modulos/rai/components/consulta-reportes/consulta-reportes.component'
import { ConsultarReporteTemporalComponent } from 'app/modulos/rai/components/consultar-reporte-temporal/consultar-reporte-temporal.component'

import { GestionDocumentalComponent } from 'app/modulos/ado/components/gestion-documental/gestion-documental.component';

import { ReporteAusentismoComponent } from 'app/modulos/aus/components/reporte-ausentismo/reporte-ausentismo.component';
import { ConsultaAusentismoComponent } from 'app/modulos/aus/components/consulta-ausentismo/consulta-ausentismo.component';

import { IndicadoresAusentismoComponent } from 'app/modulos/ind/components/indicadores-ausentismo/indicadores-ausentismo.component';
import { IndicadoresSgeComponent } from 'app/modulos/ind/components/indicadores-sge/indicadores-sge.component';
import { IndicadoresRaiComponent } from 'app/modulos/ind/components/indicadores-rai/indicadores-rai.component';
import { IndicadoresInpComponent } from 'app/modulos/ind/components/indicadores-inp/indicadores-inp.component';

import { AdminContratistasComponent } from 'app/modulos/ctr/components/admin-contratistas/admin-contratistas.component'
import { SeguimientoContratistasComponent } from 'app/modulos/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component'
import { TipoAreaComponent } from '../empresa/components/tipo-area/tipo-area.component';
import { CargueDatosComponent } from '../empresa/components/cargue-datos/cargue-datos.component';
import { UsuarioPreferenciasComponent } from '../empresa/components/usuario-preferencias/usuario-preferencias.component';
import { EvaluacionDesempenoComponent } from '../empresa/components/evaluacion-desempeno/evaluacion-desempeno.component';
import { EvaluacionDesempenoFormComponent } from '../empresa/components/evaluacion-desempeno-form/evaluacion-desempeno-form.component';
import { IndicadoresEmpComponent } from '../ind/components/indicadores-emp/indicadores-emp.component';
import { ContextoOrganizacionComponent } from '../empresa/components/contexto-organizacion/contexto-organizacion.component';
import { HomeComponent } from './components/home/home.component';
import { ElaboracionTableroComponent } from '../ind/components/elaboracion-tablero/elaboracion-tablero.component';
import { ConsultaTableroComponent } from '../ind/components/consulta-tablero/consulta-tablero.component';
import { HorahombrestrabajadaComponent } from '../ind/components/horahombrestrabajada/horahombrestrabajada.component';
import { ConsultaActasComponent } from '../cop/components/consulta-actas/consulta-actas.component';
import { CargaArchivoComponent } from '../rai/components/carga-archivo/carga-archivo.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ManualesComponent } from '../ayuda/components/manuales/manuales.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { CardModule } from 'primeng/card';
import { AreaSelectorIndComponent } from './components/area-selectorind/area-selectorind.component';
import { ModeloGraficaService } from '../ind/services/modelo-grafica.service';
import { FormularioScmComponent } from '../scm/components/formulario-scm/formulario-scm.component';
import { ScmComponent } from '../scm/components/scm/scm.component';
import { RecomendationsformComponent } from '../scm/components/recomendationsform/recomendationsform.component';
import { SeguimientosformComponent } from '../scm/components/seguimientosform/seguimientosform.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TareaComponent } from '../sec/components/tarea/tarea.component';
import { ScmpermisosComponent } from '../scm/components/scmpermisos/scmpermisos.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AliadosActualizarComponent } from '../ctr/components/aliados-actualizar/aliados-actualizar.component';
const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'contacto', component: ContactoComponent },
    {
        path: 'app', component: InicioComponent, canActivate: [AuthGuardService],
        children: [
            {
                path: 'home', component: HomeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'terminos', component: TerminosCondicionesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'empresa',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'empresa', component: EmpresaAdminComponent, data: { state: 'app/empresa/empresa' } },
                    { path: 'contextoOrganizacion', component: ContextoOrganizacionComponent },
                    { path: 'area', component: AreaComponent },
                    { path: 'tipoArea', component: TipoAreaComponent },
                    { path: 'cargo', component: CargoComponent },
                    { path: 'empleado', component: EmpleadoComponent, data: { state: 'app/empresa/empleado' } },
                    { path: 'evaluacionDesempeno', component: EvaluacionDesempenoComponent },
                    { path: 'evaluacionDesempenoForm', component: EvaluacionDesempenoFormComponent },
                    { path: 'cargueDatos', component: CargueDatosComponent },
                    { path: 'usuarioPreferencias', component: UsuarioPreferenciasComponent },
                    { path: 'hht', component: HhtComponent },
                ]
            },
            {
                path: 'ctr',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'adminContratistas', component: AdminContratistasComponent },
                    { path: 'aliado', component: AliadosComponent },
                    { path: 'listadoAliados', component: AliadosListComponent },
                    { path: 'actualizarAliado/:id', component: AliadosActualizarComponent },
                    { path: 'seguimientoContratistas', component: SeguimientoContratistasComponent },
                ]
            },
            {
                path: 'admin',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'perfil', component: PerfilComponent },
                    { path: 'usuario', component: UsuarioComponent },
                    { path: 'permisos', component: PermisosComponent }
                ]
            },
            {
                path: 'inspecciones',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'listasInspeccion', component: ListasInspeccionComponent },
                    { path: 'elaboracionLista', component: ElaboracionListaComponent },
                    { path: 'programacion', component: ProgramacionComponent },
                    { path: 'elaboracionInspecciones', component: ElaboracionInspeccionesComponent },
                    { path: 'elaboracionInspecciones/:id', component: ElaboracionInspeccionesComponent},
                    { path: 'elaboracionInspecciones/:id/:version', component: ElaboracionInspeccionesComponent},
                    { path: 'consultaInspecciones', component: ConsultaInspeccionesComponent },
                    { path: 'elaboracionLista/:id/:version', component: ElaboracionListaComponent}
                ]
            },
            {
                path: 'sg',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'sgeForm', component: SgeFormComponent },
                    { path: 'sistemasGestion', component: SistemaGestionComponent },
                    { path: 'evaluacion', component: EvaluacionComponent },
                    { path: 'consultaEvaluaciones', component: ConsultaEvaluacionComponent }
                ]
            },
            {
                path: 'sec',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'desviaciones', component: ConsultaDesviacionComponent },
                    // { path: 'consultaAnalisisDesviaciones', component: ConsultaAnalisisDesviacionComponent },
                    { path: 'analisisDesviacion', component: AnalisisDesviacionComponent },
                    { path: 'tareas', component: GestionTareasComponent },
                    { path: 'tareasAsignadas', component: AsignacionTareasComponent },
                    { path: 'misTareas', component: MisTareasComponent },
                    { path: 'tarea/:id', component: TareaComponent }
                ]
            },
            {
                path: 'auc',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'tarjeta', component: TarjetaComponent },
                    { path: 'observaciones', component: RegistroObservacionesComponent },
                    { path: 'consultaObservaciones', component: ConsultaObservacionesComponent },
                    { path: 'gestionObservaciones', component: GestionObservacionesComponent }
                ]
            },
            {
                path: 'rai',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'cargaArchivo', component: CargaArchivoComponent },
                    { path: 'registroReporte', component: RegistroReportesComponent },
                    { path: 'registroReporteTemporal', component: RegistroReporteTemporalComponent },
                    { path: 'consultaReportes', component: ConsultaReportesComponent },
                    { path: 'consultaReportestemporal', component: ConsultarReporteTemporalComponent }
                ]
            },
            {
                path: 'ado',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'gestionDocumental', component: GestionDocumentalComponent },
                ]
            },
            {
                path: 'scm',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'creacion', component: FormularioScmComponent },
                    { path: 'list', component: ScmComponent },
                    { path: 'case/:id', component: FormularioScmComponent },
                    { path: 'permisos', component: ScmpermisosComponent },

                ]
            },
            {
                path: 'aus',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'reporteAusentismo', component: ReporteAusentismoComponent },
                    { path: 'consultaAusentismo', component: ConsultaAusentismoComponent },
                ]
            },
            {
                path: 'ind',
                canActivate: [AuthGuardService],
                children: [
                    // { path: 'elaboracionTablero', component: ElaboracionTableroComponent },
                    { path: 'horahombrestrabajada', component: HorahombrestrabajadaComponent },
                    { path: 'consultaTablero', component: ConsultaTableroComponent },
                    { path: 'emp', component: IndicadoresEmpComponent },
                    { path: 'ausentismo', component: IndicadoresAusentismoComponent },
                    { path: 'sge', component: IndicadoresSgeComponent },
                    { path: 'rai', component: IndicadoresRaiComponent },
                    { path: 'inp', component: IndicadoresInpComponent },
                ]
            },
            {
                path: 'ipr',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'peligros', component: ParametrizacionPeligrosComponent },
                    { path: 'formularioIpecr', component: FormularioIpecrComponent },
                    { path: 'consultaIpecr', component: ConsultaIpecrComponent },
                ]
            },
            {
                path: 'cop',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'consultaActas', component: ConsultaActasComponent },
                ]
            },
            {
                path: 'ayuda',
                canActivate: [AuthGuardService],
                children: [
                    { path: 'manuales', component: ManualesComponent },
                ]
            },

        ]
    },
    // { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes),
        //CommonModule,
        ComunModule,
        CardModule,
        NgCircleProgressModule.forRoot({
            "backgroundColor": "#F1F1F1",
            "backgroundPadding": -18,
            "showSubtitle": false,
            "outerStrokeWidth": 10,
            "outerStrokeColor": "#FF6347",
            "innerStrokeColor": "#32CD32",
            "innerStrokeWidth": 1,
            "responsive": false,
            "startFromZero": false
        })
    ],
    declarations: [
        InicioComponent,
        AreaSelectorIndComponent,
        HomeComponent,
        TerminosCondicionesComponent,
        FileUploaderComponent
    ],
    exports: [
        FileUploaderComponent,ComunModule
    ],
    providers: [AuthGuardService, AuthService, ModeloGraficaService],
})
export class CoreModule { }
