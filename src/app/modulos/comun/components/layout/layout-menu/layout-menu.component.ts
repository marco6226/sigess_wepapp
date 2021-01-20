import { Component, OnInit, Input, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { Permiso } from 'app/modulos/empresa/entities/permiso';
import { ParametroNavegacionService } from '../../../../core/services/parametro-navegacion.service';

@Component({
    selector: 'layout-menu',
    templateUrl: './layout-menu.component.html',
    styleUrls: ['./layout-menu.component.scss'],
})
export class LayoutMenuComponent implements OnInit, AfterContentInit {

    @Input('expanded') expanded: boolean = false;
    @Input('disabled') disabled: boolean = false;
    @Input('visible') visible: boolean = true;
    items: any[];

    nombreAUC: string;
    nombreSEC: string;
    nombreCOP: string;

    constructor(
        private sesionService: SesionService,
        private navService: ParametroNavegacionService,
    ) { }

    ngOnInit() {

    }

    irHome() {
        this.navService.redirect('/app/home');
    }


    ngAfterContentInit() {
        this.recargarMenu();
    }

    recargarMenu() {
        this.nombreAUC = this.sesionService.getConfigParam('NOMB_MOD_AUC');
        this.nombreSEC = this.sesionService.getConfigParam('NOMB_MOD_SEC');
        this.nombreCOP = this.sesionService.getConfigParam('NOMB_MOD_COP');
        this.items = [
            {
                label: 'Administracion',
                class: 'icon-adm',
                codigo: 'ADM',
                expanded: false,
                items:
                    [
                        { label: 'Perfiles', codigo: 'ADM_GET_PERF', routerLink: ['/app/admin/perfil'], class: 'fa fa-user-plus' },
                        { label: 'Permisos', codigo: 'ADM_GET_PERM_PERF', routerLink: ['/app/admin/permisos'], class: 'fa fa-lock' },
                        { label: 'Usuarios', codigo: 'ADM_GET_USR', routerLink: ['/app/admin/usuario'], class: 'fa fa-user' },
                    ]
            },
            {
                label: 'Empresa',
                class: 'icon-emp',
                codigo: 'EMP',
                expanded: false,
                items:
                    [
                        { label: 'Información Empresa', codigo: 'EMP_GET_EMPS', routerLink: ['/app/empresa/empresa'], class: 'fa fa-building' },
                        { label: 'Contexto organización', codigo: 'EMP_GET_CTXEMP', routerLink: ['/app/empresa/contextoOrganizacion'], class: 'fa fa-puzzle-piece' },
                        { label: 'Tipos área', codigo: 'EMP_GET_TIPOAREA', routerLink: ['/app/empresa/tipoArea'], class: 'fa fa-object-group' },
                        { label: 'Organización', codigo: 'EMP_GET_AREA', routerLink: ['/app/empresa/area'], class: 'fa fa-sitemap' },
                        { label: 'Cargos', codigo: 'EMP_GET_CARGO', routerLink: ['/app/empresa/cargo'], class: 'fa fa-briefcase' },
                        { label: 'Talento humano', codigo: 'EMP_GET_EMPL', routerLink: ['/app/empresa/empleado'], class: 'fa fa-users' },
                        { label: 'Evaluación desempeño', codigo: 'EMP_GET_EVALDES', routerLink: ['/app/empresa/evaluacionDesempeno'], class: 'fa fa-list' },
                        { label: 'Cargue datos', codigo: 'EMP_POST_LOADEMP', routerLink: ['/app/empresa/cargueDatos'], class: 'fa fa-database' },
                        //{ label: 'HHT', codigo: 'EMP_GET_HHT', routerLink: ['/app/empresa/hht'] }
                    ]
            },
            {
                label: 'Contratistas',
                class: 'icon-ctr',
                codigo: 'CTR',
                expanded: false,
                items:
                    [
                        { label: 'Administración', codigo: 'CTR_ADM', routerLink: '/app/ctr/adminContratistas', class: 'fa fa-handshake-o' },
                        { label: 'Seguimiento', codigo: 'CTR_IND', routerLink: '/app/ctr/seguimientoContratistas', class: 'fa fa-pie-chart' }
                    ]
            },
            {
                label: 'Seguimiento Casos medicos', class: 'icon-scm',
                codigo: 'SGE',
                expanded: false,
                items:
                    [
                        { label: 'Creacion de caso', codigo: 'ADO_GET_DIR', routerLink: '/app/scm/creacion', class: 'fa fa-medkit' },
                        { label: 'SCM', codigo: 'ADO_GET_DIR', routerLink: '/app/scm/list', class: 'fa fa-list-alt' },

                    ]
            },
            {
                label: 'AutoEvaluación',
                class: 'icon-aue',
                codigo: 'SGE',
                expanded: false,
                items:
                    [
                        { label: 'Elaboracion SGE', codigo: 'SGE_POST_SGE', routerLink: '/app/sg/sgeForm', class: 'fa fa-columns' },
                        { label: 'Sistemas de Gestión', codigo: 'SGE_GET_SGE', routerLink: '/app/sg/sistemasGestion', class: 'fa fa-th' },
                        { label: 'Consulta Evaluacion', codigo: 'SGE_GET_EVAL', routerLink: '/app/sg/consultaEvaluaciones', class: 'fa fa-list-ul' }
                    ]
            },
            {
                label: 'IPECR',
                class: 'icon-ipr',
                codigo: 'IPECR',
                expanded: false,
                items:
                    [
                        { label: 'Parametrización peligros', codigo: 'IPECR_PARAMPEL', routerLink: '/app/ipr/peligros', class: 'fa fa-gear' },
                        { label: 'Elaboración IPECR', codigo: 'IPECR_ELABIPECR', routerLink: '/app/ipr/formularioIpecr', class: 'fa fa-exclamation-circle' },
                        { label: 'Consulta IPECR', codigo: 'IPECR_GET_IPECR', routerLink: '/app/ipr/consultaIpecr', class: 'fa fa-list-ul' },
                    ]
            },
            {
                label: 'Inspeccion',
                class: 'icon-inp',
                codigo: 'INP',
                expanded: false,
                items:
                    [
                        { label: 'Listas de Inspección', codigo: 'INP_GET_LISTINP', routerLink: ['/app/inspecciones/listasInspeccion'], class: 'fa fa-list-ol' },
                        { label: 'Elaboración Listas', codigo: 'INP_POST_LISTINP', routerLink: ['/app/inspecciones/elaboracionLista'], class: 'fa fa-cogs' },
                        { label: 'Programación', codigo: 'INP_GET_PROG', routerLink: ['/app/inspecciones/programacion'], class: 'fa fa-calendar' },
                        { label: 'Inspecciones Realizadas', codigo: 'INP_GET_INP', routerLink: ['/app/inspecciones/consultaInspecciones'], class: 'fa fa-check-square' }
                    ]
            },
            {
                label: this.nombreAUC,
                class: 'icon-auc',
                codigo: 'AUC',
                expanded: false,
                items:
                    [
                        { label: 'Tarjetas', codigo: 'AUC_POST_TARJ', routerLink: '/app/auc/tarjeta' },
                        { label: 'Reportar', codigo: 'AUC_POST_OBS', routerLink: '/app/auc/observaciones', class: 'fa fa-eye' },
                        { label: 'Consultar', codigo: 'AUC_GET_OBS', routerLink: '/app/auc/consultaObservaciones', class: 'fa fa-list-ul' }
                    ]
            },
            {
                label: 'Reporte A/I',
                class: 'icon-rai',
                codigo: 'RAI',
                expanded: false,
                items:
                    [
                        { label: 'Cargar archivo', codigo: 'RAI_POST_ARCH', routerLink: '/app/rai/cargaArchivo', class: 'fa fa-upload' },
                        { label: 'Registrar reporte', codigo: 'RAI_POST_REP', routerLink: '/app/rai/registroReporte', class: 'fa fa-h-square' },
                        { label: 'Consulta reportes', codigo: 'RAI_GET_REP', routerLink: '/app/rai/consultaReportes', class: 'fa fa-list-ul' }
                    ]
            },
            {
                label: 'Ausentismo',
                class: 'icon-aus',
                codigo: 'AUS',
                expanded: false,
                items:
                    [
                        { label: 'Reporte de ausentismo', codigo: 'AUS_POST_REPAUS', routerLink: '/app/aus/reporteAusentismo', class: 'fa fa-question-circle-o' },
                        { label: 'Consulta de reportes', codigo: 'AUS_GET_REPAUS', routerLink: '/app/aus/consultaAusentismo', class: 'fa fa-list-ul' },
                    ]
            },
            {
                label: 'Información Documentada', class: 'icon-ado',
                codigo: 'ADO',
                expanded: false,
                items:
                    [
                        { label: 'Gestión documental', codigo: 'ADO_GET_DIR', routerLink: '/app/ado/gestionDocumental', class: 'fa fa-files-o' },
                    ]
            },

            {
                //label: this.nombreSEC,
                label: 'Seguimiento y Control',
                class: 'icon-sec',
                expanded: false,
                codigo: 'SEC',
                items:
                    [
                        { label: 'Investigación', codigo: 'SEC_GET_DESV', routerLink: '/app/sec/desviaciones', class: 'fa fa-exclamation-triangle' },
                        // { label: 'Investigaciones', codigo: 'SEC_GET_ANADESV', routerLink: '/app/sec/consultaAnalisisDesviaciones', class: 'fa fa-exchange' },
                        { label: 'Tareas asignadas', codigo: 'SEC_GET_TAR', routerLink: '/app/sec/tareasAsignadas', class: 'fa fa-tasks' },
                    ]
            },
            {
                label: 'Indicadores',
                class: 'icon-ind',
                codigo: 'IND',
                expanded: false,
                items:
                    [
                        // { label: 'Elaboracion tableros', codigo: 'IND_POST_TAB', routerLink: '/app/ind/elaboracionTablero', class: 'fa fa-wrench' },
                        { label: 'Consulta tableros', codigo: 'IND_GET_TAB', routerLink: '/app/ind/consultaTablero', class: 'fa fa-line-chart' },
                        { label: 'Ausentismo', codigo: 'IND_GET_AUS', routerLink: '/app/ind/ausentismo', class: 'fa fa-question-circle-o' },
                        { label: 'Talento humano', codigo: 'IND_GET_EMP', routerLink: '/app/ind/emp', class: 'fa fa-users' },
                        { label: 'Autoevaluacion', codigo: 'IND_GET_SGE', routerLink: '/app/ind/sge', class: 'fa fa-columns' },
                        { label: 'Reporte de accidentes', codigo: 'IND_GET_RAI', routerLink: '/app/ind/rai', class: 'fa fa-h-square' },
                        { label: 'Inspecciones', codigo: 'IND_GET_INP', routerLink: '/app/ind/inp', class: 'fa fa-list-ol' },
                    ]
            },
            {
                label: this.nombreCOP,
                class: 'icon-cop',
                codigo: 'COP',
                expanded: false,
                items:
                    [
                        { label: 'Actas', codigo: 'COP_GET_ACT', routerLink: '/app/cop/consultaActas', class: 'fa fa-book' }
                    ]
            },
            {
                label: "Ayuda",
                class: 'icon-help',
                codigo: 'CONF_GET_MANUSR',
                expanded: false,
                items:
                    [
                        { label: 'Manuales', codigo: 'CONF_GET_MANUSR', routerLink: '/app/ayuda/manuales', class: 'fa fa-book' }
                    ]
            }
        ];
    }

    toggleMenu(item: itemMenu, container: HTMLDivElement) {
        item.expanded = !item.expanded;
        container.style.maxHeight = item.expanded ? container.scrollHeight + "px" : null;
    }


}

interface itemMenu {
    label: string,
    class: string,
    codigo: string,
    expanded: boolean,
    items: any[]
}