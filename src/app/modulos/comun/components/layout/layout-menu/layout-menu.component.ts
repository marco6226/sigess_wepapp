import { Component, OnInit, Input, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { Permiso } from 'app/modulos/empresa/entities/permiso';
import { ParametroNavegacionService } from '../../../../core/services/parametro-navegacion.service';
import { EmpresaService } from '../../../../empresa/services/empresa.service';
import { AliadoInformacion } from '../../../../ctr/entities/aliados';

@Component({
    selector: 'layout-menu',
    templateUrl: './layout-menu.component.html',
    styleUrls: ['./layout-menu.component.scss'],
})
export class LayoutMenuComponent implements OnInit, AfterContentInit {

    @Input('expanded') expanded: boolean = false;
    @Input('disabled') disabled: boolean = false;
    @Input('visible') visible: boolean = true;

    isTemporal:boolean=false;
    items: any[];
    canSaveReportCtr: boolean = false;

    nombreAUC: string;
    nombreSEC: string;
    nombreCOP: string;
    version;
    idEmpresa: any
    
    constructor(
        private sesionService: SesionService,
        private navService: ParametroNavegacionService,
        private empresaService: EmpresaService,
    ) { }

    async ngOnInit() {
        setTimeout(() => {
            this.getAliadoInformacion()
            this.version = this.sesionService.getAppVersion();
        }, 5000);
    }

    getEmpresaID(){
        return this.sesionService.getEmpresa().id
    }

    irHome() {
        this.navService.redirect('/app/home');
    }
    
    async getAliadoInformacion(){
        this.idEmpresa = this.sesionService.getEmpresa().id;
        await this.empresaService.getAliadoInformacion(this.idEmpresa).then((ele: AliadoInformacion[])=>{
            if(ele[0] != undefined){
              this.canSaveReportCtr = ele[0].permitirReportes;
              if(ele[0].istemporal){this.isTemporal = ele[0].istemporal}
              else{this.isTemporal=false}
            }else{this.isTemporal=false}
            this.recargarMenu();
          }).catch((er)=>this.recargarMenu());
    }

    async ngAfterContentInit() { 
        
    }

    recargarMenu() {
        // if(this.idEmpresa=='22')this.isTemporal=true
        let Temporal: any[] = [];
        if(this.isTemporal){
            Temporal=[
                { label: 'Registrar reporte T', codigo: 'RAI_POST_REPT', routerLink: '/app/rai/registroReporteTemporal', class: 'fa fa-h-square' },
                { label: 'Consulta reportes T', codigo: 'RAI_GET_REPT', routerLink: '/app/rai/consultaReportestemporal', class: 'fa fa-list-ul' },
                { label: 'HHT', codigo: 'IND_GET_HHTALIADO', routerLink: '/app/ind/horahombrestrabajada', class: 'fa fa-building' },
                // { label: 'Administración', codigo: 'CTR_ADM', routerLink: '/app/ctr/adminContratistas', class: 'fa fa-handshake-o' },
                // { label: 'Seguimiento', codigo: 'CTR_IND', routerLink: '/app/ctr/seguimientoContratistas', class: 'fa fa-pie-chart' }
            ]
        }else if(this.canSaveReportCtr){
            Temporal=[
                { label: 'Registrar reporte', codigo: 'RAI_POST_REPCTR', routerLink: '/app/rai/registroReporteCtr', class: 'fa fa-h-square' }
            ]
        }

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
                        //{ label: 'HHT', codigo: 'EMP_GET_HHT', routerLink: ['/app/empresa/hht'], class: 'fa fa-database'}
                    ]
            },
            {
                label: 'Aliados',
                class: 'icon-ctr',
                codigo: 'CTR',
                expanded: false,
                items: 
                    [
                        { label: 'Nuevo Aliado', codigo: 'CTR_ADM', routerLink: '/app/ctr/aliado', class: 'fa fa-child' },
                        { label: 'Listado de Aliados', codigo: 'CTR_ADM', routerLink: '/app/ctr/listadoAliados', class: 'fa fa-list-alt' },
                        { label: 'Administración', codigo: 'CTR_IND', routerLink: '/app/ctr/actualizarAliado/'+this.getEmpresaID(), class: 'fa fa-handshake-o' },
                    ].concat(Temporal)
            },
            {
                label: 'Seguimiento Casos medicos', class: 'icon-scm',
                codigo: 'SCM',
                expanded: false,
                items:
                    [
                        { label: 'Creacion de seguimiento caso', codigo: 'SCM_CREATE_CASE', routerLink: '/app/scm/creacion', class: 'fa fa-medkit' },
                        { label: 'Listado de seguimientos', codigo: 'SCM_LIST_CASE', routerLink: '/app/scm/list', class: 'fa fa-list-alt' },
                        { label: 'Permisos', codigo: 'SCM_PERF_SCM', routerLink: '/app/scm/permisos', class: 'fa fa-lock' },

                    ]
            },
            {
                label: 'AutoEvaluación',
                class: 'icon-aue',
                codigo: 'SGE',
                expanded: false,
                items:
                    [
                        { label: 'Elaboración SGE', codigo: 'SGE_POST_SGE', routerLink: '/app/sg/sgeForm', class: 'fa fa-columns' },
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
                        { label: 'Mis tareas', codigo: 'SEC_GET_MYTAR', routerLink: '/app/sec/misTareas', class: 'fa fa-bell' },
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
                        { label: 'HHT', codigo: 'IND_GET_HHT', routerLink: '/app/ind/horahombrestrabajada', class: 'fa fa-building' },
                        { label: 'Consulta tableros', codigo: 'IND_GET_TAB', routerLink: '/app/ind/consultaTablero', class: 'fa fa-line-chart' },
                        { label: 'Ausentismo', codigo: 'IND_GET_AUS', routerLink: '/app/ind/ausentismo', class: 'fa fa-question-circle-o' },
                        { label: 'Talento humano', codigo: 'IND_GET_EMP', routerLink: '/app/ind/emp', class: 'fa fa-users' },
                        { label: 'Autoevaluacion', codigo: 'IND_GET_SGE', routerLink: '/app/ind/sge', class: 'fa fa-columns' },
                        { label: 'Reporte de accidentes', codigo: 'IND_GET_RAI', routerLink: '/app/ind/rai', class: 'fa fa-h-square' },
                        { label: 'Inspecciones', codigo: 'IND_GET_INP', routerLink: '/app/ind/inp', class: 'fa fa-list-ol' },
                        { label: 'Accidentalidad', codigo: 'IND_GET_ACD', routerLink: '/app/ind/accidentalidad', class: 'fa fa-ambulance' },
                        { label: 'Ind. casos medicos corporativo', codigo: 'IND_GET_SCM', routerLink: '/app/ind/indcasosmedicos', class: 'fa fa-medkit' },
                        { label: 'Ind. casos medicos gestión', codigo: 'IND_GET_SCMGESTION', routerLink: '/app/ind/indcasosmedicosgestion', class: 'fa fa-medkit' },
                        { label: 'Indicadores caracterización', codigo: 'IND_GET_CAR', routerLink: '/app/ind/indcaracterizacion', class: 'fa fa-user-md' }
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