import { Causa_Raiz, FactorCausal, Incapacidad, listFactores, listPlanAccion} from './../../entities/factor-causal';
import { InformacionComplementaria} from './../../entities/informacion_complementaria';
import { Component, OnInit, Input } from "@angular/core";
import { Reporte } from 'app/modulos/rai/entities/reporte';

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { ParametroNavegacionService } from "app/modulos/core/services/parametro-navegacion.service";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";
import { TipoPeligroService } from "app/modulos/ipr/services/tipo-peligro.service";
import { PeligroService } from "app/modulos/ipr/services/peligro.service";

import { SistemaCausaInmediataService } from "app/modulos/sec/services/sistema-causa-inmediata.service";
import { SistemaCausaRaizService } from "app/modulos/sec/services/sistema-causa-raiz.service";
import { SistemaCausaRaiz } from "app/modulos/sec/entities/sistema-causa-raiz";
import { CausaRaiz } from "app/modulos/sec/entities/causa-raiz";
import { AnalisisDesviacion } from "app/modulos/sec/entities/analisis-desviacion";
import { TipoPeligro } from "app/modulos/ipr/entities/tipo-peligro";
import { Peligro } from "app/modulos/ipr/entities/peligro";
import {Diagrama, InformeJson} from "../../entities/informeFinal"

import { Desviacion } from "app/modulos/sec/entities/desviacion";
import { TreeNode } from "primeng/primeng";
import { Message } from "primeng/primeng";
import { SistemaCausaInmediata } from "../../entities/sistema-causa-inmediata";
import { CausaInmediata } from "../../entities/causa-inmediata";
import { AnalisisCosto } from "../../entities/analisis-costo";
import { Documento } from "../../../ado/entities/documento";
import {
    SistemaCausaAdministrativa,
    CausaAdministrativa,
} from "../../entities/sistema-causa-administrativa";
import { SistemaCausaAdministrativaService } from "../../services/sistema-causa-administrativa.service";
import { Tarea } from "../../entities/tarea";
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria } from "../../../core/entities/filter";
import { jerarquia } from "../../entities/jerarquia";
import { AuthService } from "app/modulos/core/auth.service";
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { SelectItem, ConfirmationService } from 'primeng/primeng'
import { MiembroEquipo } from './miembros-equipo/miembro-equipo';
import * as moment from 'moment';
import {
    locale_es,
    tipo_identificacion,
    tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import {FlowChartComponent} from './flow-chart/flow-chart.component'
import {
    FileFormats, DiagramComponent, Diagram, PrintAndExport, IExportOptions,BasicShapeModel,NodeModel, UndoRedo, ConnectorModel, PointPortModel, Node, FlowShapeModel, MarginModel, PaletteModel,
    SymbolInfo, DiagramContextMenu, GridlinesModel, SnapSettingsModel, ShapeStyleModel, TextStyleModel, BpmnShape, HtmlModel, IDragEnterEventArgs, SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import {FlowchartService} from '../../services/flowchart.service'

Diagram.Inject(UndoRedo, DiagramContextMenu,PrintAndExport);

@Component({
    selector: "s-analisisDesviacion",
    templateUrl: "./analisis-desviacion.component.html",
    styleUrls: ["./analisis-desviacion.component.scss","./analisis-desviacion.component.css"],
    providers: [

        TipoPeligroService, PeligroService,
        SistemaCausaInmediataService,
        SistemaCausaAdministrativaService,
        FlowChartComponent
    ],
})
export class AnalisisDesviacionComponent implements OnInit {
    @Input("miembros") documento: Documento;
    @Input("collapsed") collapsed: boolean;
    @Input("value") value: AnalisisDesviacion;

    diagram:DiagramComponent;
    // ImgDF:string;
    formtp: FormGroup;
    formp: FormGroup;
    analisisPeligros: FormGroup;
    tareasList: Tarea[];
    flowChartSave: string;
    form2: Peligro;
    
    listaEvidence
    listPlanAccion: listPlanAccion[] =[]
    causaAdminList: TreeNode[] = [];
    causaAdminListSelect: TreeNode[] = [];
    causaAdminAnalisisList: CausaAdministrativa[];

    incapacidadesList: Incapacidad[];

    causaRaizList: TreeNode[] = [];
    causaRaizListSelect: TreeNode[] = [];
    causaRaizAnalisisList: CausaRaiz[];

    causaInmediataList: TreeNode[] = [];
    causaInmediataListSelect: TreeNode[] = [];
    causaInmediataAnalisisList: CausaInmediata[];
    reporteSelect: Reporte[];

    desviacionesList: Desviacion[];
    analisisCosto: AnalisisCosto = new AnalisisCosto();
    participantes: any[];
    documentos: Documento[];
    observacion: string;
    jerarquia: string;
    informacion_complementaria: string;
    analisisId: string;
    Peligro1: string;
    tPeligro1: string;
    msgs: Message[] = [];
    consultar: boolean = false;
    modificar: boolean = false;
    adicionar: boolean = false;
    visibleLnkResetPasswd = true;
    idEmpresa: string;
    datasFC: string
    date1: Date;
    date2: Date;
    flag:Boolean
    display: boolean = false;
    nitEmpresa: string;
    nombreEmpresa: string;

    empresaName: string;
    empresaNit: string;
    empresaDescipcion: string;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    dataListFactor: listFactores[]=[];

    dataFlow: AnalisisDesviacion;
    factorCusal: FactorCausal[]=[]
    informacionComplementaria: InformacionComplementaria;
    informeJson: InformeJson;
    diagrama: Diagrama;
    Evidencias: string | any[];
    img = new Image();
    img2 = new Image();
    imgString:string;
    contFotografia:number=0;
    contDocumental:number=0;
    contPoliticas:number=0;
    contProcedimientos:number=0;
    contMultimedias:number=0;
    disabled:boolean=false;

    tipoPeligroItemList: SelectItem[];
    peligroItemList: SelectItem[];
    InformeJson:InformeJson[];
    displayInforme:boolean=false;
    fields: string[] = [
        'id',
        'nombre',
        'fk_tipo_peligro'
      ];
    ARLfirme= [
        { label: "--Seleccione--", value: null },
        { label: "Objetado", value: "Objetado" },
        { label: "En firme", value: "En firme" },
    ]
    Peligro = [
        { label: "--Seleccione--", value: null },
    ]
    miembros: MiembroEquipo[] = []
    selectedProducts;
    imgIN: string;
    infoIn: FormGroup;
    
    tSelectPeligro(a: string){
        this.tPeligro1=a;
    }
    
    SelectPeligro(a: string){
        this.cargarPeligro(a)
    }
    async test(){
        //console.log(this.incapacidadesList);
        console.log("*****aquí***")
        console.log(this.dataListFactor);        
    }

    constructor(
        private sistCausAdminService: SistemaCausaAdministrativaService,
        private analisisDesviacionService: AnalisisDesviacionService,
        private tipoPeligroService: TipoPeligroService,
        private peligroService: PeligroService,
        private sistemaCausaInmdService: SistemaCausaInmediataService,
        private sistemaCausaRaizService: SistemaCausaRaizService,
        private paramNav: ParametroNavegacionService,
        private authService: AuthService,
        private sesionService: SesionService,
        private comp: FlowChartComponent,
        private FlowchartService:FlowchartService,
        fb: FormBuilder,
    ) {
        this.analisisPeligros = fb.group({
            Peligro: [null, /*Validators.required*/],
            DescripcionPeligro: [null, /*Validators.required*/],
            EnventoARL: [null, /*Validators.required*/],
            ReporteControl: [null, /*Validators.required*/],
            FechaControl: [null, /*Validators.required*/],
            CopiaTrabajador: [null, /*Validators.required*/],
            FechaCopia: [null, /*Validators.required*/],
        });
        this.infoIn = fb.group({
            AnexoF: [null, /*Validators.required*/],
            AnexoO: [null, /*Validators.required*/],
            RepresentanteLegal: [null, /*Validators.required*/],
            RepresentanteInvestigacion: [null, /*Validators.required*/],
            CcLegal: [null, /*Validators.required*/],
            CcInvestigacion: [null, /*Validators.required*/],
            Cargo: [null, /*Validators.required*/],
            Licencia: [null, /*Validators.required*/],
            Expedida: [null, /*Validators.required*/],
            FechaEnvio: [null, /*Validators.required*/],
            FechaI: [null, /*Validators.required*/],
            Diagrama:[null, /*Validators.required*/],
        });
        
        // this.form = fb.group({
        //     id: [null],
        //     tipoPeligro: [null, Validators.required],
        //     peligro: [null, Validators.required],
        //   });
    }

    ngOnInit() {
        console.log(this.sesionService.getEmpresa());
        this.nitEmpresa=this.sesionService.getEmpresa().nit;
        this.nombreEmpresa=this.sesionService.getEmpresa().nombreComercial;
        this.idEmpresa = this.sesionService.getEmpresa().id;
        if (this.value == null) {
            switch (this.paramNav.getAccion<string>()) {
                case "GET":
                    this.consultar = true;
                    this.consultarAnalisis(
                        this.paramNav.getParametro<Desviacion>().analisisId
                    );
                    break;
                case "POST":
                    this.sistCausAdminService
                        .findDefault()
                        .then((resp: SistemaCausaAdministrativa) => {
                            //console.log(resp);
                            this.causaAdminList = this.buildTreeNode(
                                resp.causaAdminList,
                                null,
                                "causaAdminList"
                            );
                        });
                    this.sistemaCausaInmdService
                        .findDefault()
                        .then((data: SistemaCausaInmediata) => {
                            this.causaInmediataList = this.buildTreeNode(
                                data.causaInmediataList,
                                null,
                                "causaInmediataList"
                            );
                        });
                    this.sistemaCausaRaizService
                        .findDefault()
                        .then((data: SistemaCausaRaiz) => {
                            this.causaRaizList = this.buildTreeNode(
                                data.causaRaizList,
                                null,
                                "causaRaizList"
                            );
                            this.desviacionesList =
                                this.paramNav.getParametro<Desviacion[]>();
                            this.adicionar = true;
                        });
                    break;
                case "PUT":
                    this.modificar = true;
                    this.consultarAnalisis(
                        this.paramNav.getParametro<Desviacion>().analisisId
                    );
                    break;
            }
        } else {
            this.consultar = true;
            this.consultarAnalisis(this.value.id);
        }
        this.cargarTiposPeligro();
        this.diagram=this.FlowchartService.getDiagram();
        this.evidencias();

        //this.cargarPeligro(this.analisisPeligros.value['Peligro.id']);

        //this.cargarPeligro();
        //this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
    }

    cargarTiposPeligro() {
        this.tipoPeligroService.findAll().then(
          resp => {
            console.log(resp);
            this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
            (<TipoPeligro[]>resp['data']).forEach(
              data => this.tipoPeligroItemList.push({ label: data.nombre, value: data })
            )   
          }
        );
      }
      cargarPeligro(idtp) {

        //this.peligroService.findAll().then(
        if(idtp != null){
        let filter = new FilterQuery();
        filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
        this.peligroService.findByFilter(filter).then(
          resp => {
            console.log(resp);
            this.peligroItemList = [{ label: '--Seleccione--', value: [null, null]}];
            (<Peligro[]>resp).forEach(
              data => 
                {
                    this.peligroItemList.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
                }
            )
            console.log(this.peligroItemList);
          }
        );
         }else{
            this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
         }
      }
    
    removeDesv(desviacion: Desviacion) {
        if (this.desviacionesList.length == 1) {
            this.msgs = [];
            this.msgs.push({
                severity: "warn",
                detail: "El análisis realizado debe contener al menos una desviación",
            });
            return;
        }
        let auxList = this.desviacionesList;
        this.desviacionesList = [];
        for (let i = 0; i < auxList.length; i++) {
            if (auxList[i].hashId != desviacion.hashId) {
                this.desviacionesList.push(auxList[i]);
            }
        }
    }

    buildTreeNode(
        list: any[],
        parentNode: any,
        listField: string,
        causasList?: any[],
        causasSelectList?: any[]
    ): any {
        let treeNodeList: TreeNode[] = [];
        list.forEach((ci) => {
            let node: any = {
                id: ci.id,
                label: ci.nombre,
                selectable: !this.consultar,
                parent: parentNode,
            };
            if (ci[listField] == null || ci[listField].length == 0) {
                node.children = null;
            } else {
                node.children = this.buildTreeNode(
                    ci[listField],
                    node,
                    listField,
                    causasList,
                    causasSelectList
                );
            }
            if (causasList != null) {
                this.adicionarSelect(node, causasList, causasSelectList);
            }
            treeNodeList.push(node);
        });
        return treeNodeList;
    }

    adicionarSelect(node: any, list: any[], listselec: any[]) {
        if (list == null) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            let itemAnalisis = list[i];
            if (itemAnalisis.id === node.id) {
                this.expandParent(node);
                listselec.push(node);
                return;
            }
        }
    }

    expandParent(node: any) {
        if (node.parent != null) {
            this.expandParent(node.parent);
        }
        node.expanded = true;
    }

    
// mirar
    consultarEvidencia(){
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: this.paramNav.getParametro<Desviacion>().analisisId },
        ];
        this.analisisDesviacionService.findByFilter(fq).then((resp) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            console.log("----->",resp['data'][0].documentosList);
            this.Evidencias=resp['data'][0].documentosList;});
    }
    consultarAnalisis(analisisId: string) {
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: analisisId },
        ];
        this.analisisDesviacionService.findByFilter(fq).then((resp) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            console.log("----->",resp['data'][0].documentosList);
            this.Evidencias=resp['data'][0].documentosList;
            console.log(this.Evidencias);
            this.dataFlow = resp["data"][0];
            this.flowChartSave = resp["data"][0].flow_chart;
            this.factorCusal = JSON.parse(resp["data"][0].factor_causal);
            this.informacionComplementaria = JSON.parse(resp["data"][0].complementaria);
            if(JSON.parse(resp["data"][0].plan_accion) != null){
                this.listPlanAccion = JSON.parse(resp["data"][0].plan_accion);
                console.log(this.listPlanAccion);
                this.habilitarInforme();
            }

            if(JSON.parse(resp["data"][0].miembros_equipo) != null){
                this.miembros = JSON.parse(resp["data"][0].miembros_equipo);
            }
            
            this.informeJson=JSON.parse(resp["data"][0].informe);
            console.log(this.dataFlow.documentosList)
            this.habilitarInforme()
            if(this.informacionComplementaria!=null){
                this.analisisPeligros.patchValue({
                    'Peligro': this.informacionComplementaria.Peligro,
                    'DescripcionPeligro': this.informacionComplementaria.DescripcionPeligro,
                    'EnventoARL': this.informacionComplementaria.EnventoARL,
                    'ReporteControl': this.informacionComplementaria.ReporteControl,
                    'FechaControl': this.informacionComplementaria.FechaControl == null ? null : new Date(this.informacionComplementaria.FechaControl),
                    'CopiaTrabajador': this.informacionComplementaria.CopiaTrabajador,
                    'FechaCopia':this.informacionComplementaria.FechaCopia == null ? null : new Date(this.informacionComplementaria.FechaCopia)
                  });
                this.cargarPeligro(this.analisisPeligros.value['Peligro'])
            }
            if(this.informeJson!=null){
                this.infoIn.patchValue({
                    'AnexoF': this.informeJson.AnexoF,
                    'AnexoO': this.informeJson.AnexoO,
                    'RepresentanteLegal': this.informeJson.RepresentanteLegal,
                    'RepresentanteInvestigacion': this.informeJson.RepresentanteInvestigacion,
                    'CcLegal':this.informeJson.CcLegal,
                    'CcInvestigacion':this.informeJson.CcInvestigacion,
                    'Cargo':this.informeJson.Cargo,
                    'Licencia':this.informeJson.Licencia,
                    'Expedida':this.informeJson.Expedida  == null ? null : new Date(this.informeJson.Expedida),
                    'FechaEnvio':this.informeJson.FechaEnvio == null ? null : new Date(this.informeJson.FechaEnvio),
                    'FechaI' :this.informeJson.FechaI == null ? null : new Date(this.informeJson.FechaI),
                    'Diagrama':this.informeJson.Diagrama,
                  });
            }

            console.log(this.infoIn)
            console.log('este',this.analisisPeligros.value['FechaCopia'])

            
            // if(this.factorCusal){
                this.setListDataFactor();
            // }
            

            this.incapacidadesList = JSON.parse(resp["data"][0].incapacidades)
            console.log(this.incapacidadesList)
            this.desviacionesList = analisis.desviacionesList;
            this.observacion = analisis.observacion;
            this.analisisId = analisis.id;
            this.analisisCosto =
                analisis.analisisCosto == null
                    ? new AnalisisCosto()
                    : analisis.analisisCosto;
            this.causaRaizAnalisisList = analisis.causaRaizList;
            this.causaAdminAnalisisList = analisis.causasAdminList;
            this.participantes = JSON.parse(analisis.participantes);
            this.documentos = analisis.documentosList;
            this.causaInmediataAnalisisList = analisis.causaInmediataList;
            this.tareasList = analisis.tareaDesviacionList;
            this.jerarquia = analisis.jerarquia;
            console.log(jerarquia);
            this.sistCausAdminService
                .findDefault()
                .then(
                    (resp: SistemaCausaAdministrativa) =>
                        (this.causaAdminList = this.buildTreeNode(
                            resp.causaAdminList,
                            null,
                            "causaAdminList",
                            this.causaAdminAnalisisList,
                            this.causaAdminListSelect
                        ))
                );
            this.sistemaCausaRaizService
                .findDefault()
                .then(
                    (scr: SistemaCausaRaiz) =>
                        (this.causaRaizList = this.buildTreeNode(
                            scr.causaRaizList,
                            null,
                            "causaRaizList",
                            this.causaRaizAnalisisList,
                            this.causaRaizListSelect
                        ))
                );
            this.sistemaCausaInmdService
                .findDefault()
                .then(
                    (scr: SistemaCausaInmediata) =>
                        (this.causaInmediataList = this.buildTreeNode(
                            scr.causaInmediataList,
                            null,
                            "causaInmediataList",
                            this.causaInmediataAnalisisList,
                            this.causaInmediataListSelect
                        ))
                );
                this.habilitarInforme()
        });
    }
    guardadModificar(event){
        this.disabled=event;
    }
    miembrosIn(event){
        this.miembros=event;
    }

    selectedProductsIn(event){
        this.selectedProducts=event;
    }
    buildList(list: any[]): any[] {
        if (list == null) {
            return null;
        }
        let crList: any[] = [];
        list.forEach((imp) => {
            let crEntity = { id: imp.id, nombre: imp.label };
            crList.push(crEntity);
        });
        return crList;
    }
    
    a:string;
    async imprimir() {
        // this.diagram=this.FlowchartService.getDiagram();
        // let printOptions: IExportOptions = {};
        // printOptions.mode = 'Data';
        // printOptions.region = 'PageSettings';

        // // this.diagram  = this.comp.exportDF2();
        // console.log(this.diagram)
        // this.a=this.diagram.exportDiagram(printOptions).toString()
        
        // console.log(this.a)
        setTimeout(async () => {
        // this.consultarEvidencia()
        this.nitEmpresa=this.sesionService.getEmpresa().nit;
        this.nombreEmpresa=this.sesionService.getEmpresa().nombreComercial;
        this.idEmpresa = this.sesionService.getEmpresa().id;

        await this.evidencias();
        
        this.img.src=(this.infoIn.value['Diagrama']==undefined)?'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAfSURBVDhPY/wPBAwkACYoTTQY1UAMGNVADKC1BgYGAF6OBBwFRhtVAAAAAElFTkSuQmCC':this.infoIn.value['Diagrama'];
        // console.log(this.img.width)
        // console.log(this.img.height)
        // console.log(Math.round(this.img.width/700))
        // console.log(Math.round(this.img.height/700))
        let print = document.getElementById('print');
        let template = document.getElementById('plantilla');
        template.querySelector('#P_empresa_logo').setAttribute('src', this.sesionService.getEmpresa().logo);
        setTimeout(() => {
            var WinPrint = window.open('', '_blank');
    
            WinPrint.document.write('<style id="print">@page{size:auto;margin: 10mm 0mm 10mm 0mm; padding:0mm;size: landscape}</style>');
            WinPrint.document.write(template.innerHTML);


            let tamy=600;
            let h=(Math.ceil(this.img.height/tamy)==0) ? 1 : Math.ceil(this.img.height/tamy);
            let tamx=1000;
            let w=(Math.ceil(this.img.width/tamx)==0) ? 1 : Math.ceil(this.img.height/tamx);

            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    WinPrint.document.write('<div style="size: auto;  margin: 0mm; padding:0mm" align="center"><h2>Imagen:',(i+1).toString(),'-',(j+1).toString(),'</h2><img height="150%" width="100%" style="display:block; border-collapse: collapse; object-fit: none; object-position: ',(j*(-tamx)).toString(),'px ',(i*(-tamy)).toString(),'px;"  src=',this.infoIn.value['Diagrama'],'></div>');
                    WinPrint.document.write('<p style="page-break-after: always"></p>');
                }
            }
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
        }, 2000);
    }, 500);
    }
    Salida(){}
    guardarAnalisis() {
        this.informacionComplementaria=this.analisisPeligros.value;
        this.informeJson=this.infoIn.value;
        // this.informeJson.Diagrama=this.imgIN;
        this.diagram=this.FlowchartService.getDiagram();
        let printOptions: IExportOptions = {};
        printOptions.mode = 'Data';
        printOptions.region = 'PageSettings'; 
        console.log(this.diagram);
        if(this.diagram){       
        this.imgIN=this.diagram.exportDiagram(printOptions).toString();
        if(this.imgIN!=undefined){
            this.informeJson.Diagrama=this.imgIN;}else{console.log(3)}
        }
        let ad = new AnalisisDesviacion();
        ad.causaRaizList = this.buildList(this.causaRaizListSelect);
        ad.causaInmediataList = this.buildList(this.causaInmediataListSelect);
        ad.causasAdminList = this.buildList(this.causaAdminListSelect);
        ad.desviacionesList = this.desviacionesList;
        ad.analisisCosto = this.analisisCosto;
        ad.observacion = this.observacion;
        ad.participantes = JSON.stringify(this.participantes);
        ad.flow_chart = this.flowChartSave;
        ad.factor_causal= JSON.stringify(this.factorCusal);
        this.setListDataFactor();
        ad.incapacidades= JSON.stringify(this.incapacidadesList);
        ad.plan_accion= JSON.stringify(this.listPlanAccion);
        ad.miembros_equipo= JSON.stringify(this.miembros);
        ad.tareaDesviacionList = this.tareasList;
        if  (ad.tareaDesviacionList) {
        for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
            ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
            ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
        }
        }

        ad.jerarquia = ad.jerarquia;
        ad.complementaria=JSON.stringify(this.informacionComplementaria);
        ad.informe=JSON.stringify(this.informeJson);
        this.analisisDesviacionService.create(ad).then((data) => {
            let analisisDesviacion = <AnalisisDesviacion>data;
            this.manageResponse(analisisDesviacion);
            this.analisisId = analisisDesviacion.id;
            this.documentos = [];
            this.modificar = true;
            this.adicionar = false;
        });

        console.log(ad.tareaDesviacionList);
    }



    modificarAnalisis() {

        this.informacionComplementaria=this.analisisPeligros.value;
        this.informeJson=this.infoIn.value;
        // this.informeJson.Diagrama=this.imgIN;
        setTimeout(() => {
        this.diagram=this.FlowchartService.getDiagram();
        let printOptions: IExportOptions = {};
        printOptions.mode = 'Data';
        printOptions.region = 'PageSettings';
        if(this.diagram){     
        this.imgIN=this.diagram.exportDiagram(printOptions).toString()
        if(this.imgIN!=undefined){
            this.informeJson.Diagrama=this.imgIN;}else{console.log(3)}
        }
        let ad = new AnalisisDesviacion();
        ad.id = this.analisisId;
        ad.causaRaizList = this.buildList(this.causaRaizListSelect);
        ad.causaInmediataList = this.buildList(this.causaInmediataListSelect);
        ad.causasAdminList = this.buildList(this.causaAdminListSelect);
        ad.desviacionesList = this.desviacionesList;
        ad.analisisCosto = this.analisisCosto;
        ad.observacion = this.observacion;
        ad.factor_causal= JSON.stringify(this.factorCusal);
        ad.incapacidades= JSON.stringify(this.incapacidadesList);
        ad.plan_accion= JSON.stringify(this.listPlanAccion);
        this.setListDataFactor();
        // ad.flow_chart = JSON.stringify(this.flowChartSave);
        ad.flow_chart = this.flowChartSave;
        ad.participantes = JSON.stringify(this.participantes);
        ad.tareaDesviacionList = this.tareasList;
        ad.jerarquia = this.jerarquia;
        ad.complementaria=JSON.stringify(this.informacionComplementaria);
        ad.informe=JSON.stringify(this.informeJson);

		ad.miembros_equipo= JSON.stringify(this.miembros);
        if(ad.tareaDesviacionList){
        for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
            ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
            ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
            console.log(ad.tareaDesviacionList);
        }
        
    }
        // setTimeout(() => {
            this.analisisDesviacionService.update(ad).then((data) => {
                console.log(data, "data");
                
                this.manageResponse(<AnalisisDesviacion>data);
                this.modificar = true;
                this.adicionar = false;
            });
        // }, 1000);
        
        console.log(ad.tareaDesviacionList);
        console.log(ad.flow_chart);
    }, 2000);
    }

    manageResponse(ad: AnalisisDesviacion) {
        this.msgs = [];
        if(ad.tareaDesviacionList){
        for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
            ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
            ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
            console.log(ad.tareaDesviacionList);

            console.log(ad.tareaDesviacionList[i]);
            if (ad.tareaDesviacionList[i].empResponsable != null) {
                let email =
                    ad.tareaDesviacionList[i].empResponsable.usuario.email;
                if (email == null || email == "") {
                    this.msgs = [];
                    this.msgs.push({
                        severity: "warn",
                        summary: "Correo electrónico requerido",
                        detail: "Debe especificar el correo electrónico de la cuenta de usuario",
                    });
                    return;
                }
                this.authService
                    .sendNotification(email, ad.tareaDesviacionList[i])
                    .then((resp) => {
                        this.msgs = [];
                        this.msgs.push({
                            severity: resp["tipoMensaje"],
                            detail: resp["detalle"],
                            summary: resp["mensaje"],
                        });
                        this.visibleLnkResetPasswd = true;
                    })
                    .catch((err) => {
                        this.msgs = [];
                        this.msgs.push({
                            severity: err.error["tipoMensaje"],
                            detail: err.error["detalle"],
                            summary: err.error["mensaje"],
                        });
                        this.visibleLnkResetPasswd = true;
                    });
            } else {
                this.msgs = [];
                this.msgs.push({
                    severity: "warn",
                    summary: "empleado requerido",
                    detail: "Debe especificar un usuario responsable de la tarea",
                });
            }
        }
        this.msgs.push({
            severity: "success",
            summary:
                "Investigación de desviación " +
                (this.modificar ? "actualizada" : "registrada"),
            detail:
                "Se ha " +
                (this.modificar ? "actualizado" : "generado") +
                " correctamente la investigación",
        });
    }
}

    confirmarActualizacion(event: Documento) {
        
        // this.Evidencias= this.Evidencias.filter(val => val.id !== event.id);
        this.msgs = [];
        this.msgs.push({
            severity: "success",
            summary: "Descripción actualizada",
            detail: "Se ha actualizado la descripción del documento",
        });
    }
    
    adicionarParticipante() {
        if (this.participantes == null) this.participantes = [];
        this.participantes.push({});
    }

    removeParti(index: number) {
        this.participantes.splice(index, 1);
    }

    /************************ TAREAS ***************************** */
    onEvent(event) {
        this.tareasList = event.data;
        console.log(this.tareasList, ": Las tareas");
    }

    setFactorCausal(event: FactorCausal[]){
        console.log(event,"sip");
        console.log(this.factorCusal);
        
        if (!this.factorCusal) {
        this.factorCusal=[];
            
        }
        event.forEach(element => {
            // this.factorCusal.push(element)
            let x = this.factorCusal.find((x)=>x.id == element.id)
            console.log(x);
            
            if(x!=undefined){
                // this.listFC.forEach(element => {
                    if(element.id===x.id){
                        // element.nombre = x.nombre;
                        x.nombre = element.nombre;
                    }
                // });
            }else{
                this.factorCusal.push(element);
            }

        });
        console.log(this.factorCusal);

        console.log(this.factorCusal);
        this.setListDataFactor();
        
    }


    dataDiagram(event){
        // console.log(event);
        this.flowChartSave = event;
        // console.log(this.flowChartSave);
        
    }

    getListIncapacidades(event){
        console.log(event);
        this.incapacidadesList = event;
        
    }

    async evidencias(){
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: this.paramNav.getParametro<Desviacion>().analisisId },
        ];
        await this.analisisDesviacionService.findByFilter(fq).then((resp) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            console.log("----->",resp['data'][0].documentosList);
            this.Evidencias=resp['data'][0].documentosList;});
            setTimeout(() => {
                this.contFotografia=0;
                this.contDocumental=0;
                this.contPoliticas=0;
                this.contProcedimientos=0;
                this.contMultimedias=0;
                for(let i=0; i< this.Evidencias.length; i++){
                let value=this.Evidencias[i].proceso;
                switch (value) {
                    case 'fotografica':
                    this.contFotografia++;
                    break;
                    case 'documental':
                    this.contDocumental++;
                    break;
                    case 'politicas':
                    this.contPoliticas++;
                    break;
                    case 'procedimientos':
                    this.contProcedimientos++;
                    break;
                    case 'multimedias':
                    this.contMultimedias++;
                    break;
                    default:
                    break;
                }
                }
         }, 300);
      }

    tempData: listFactores[]=[];

    setListDataFactor(){
        try {          
            this.tempData = []
            this.factorCusal.forEach(data => {
                console.log(data);            
                data.seccion.forEach(data1 => {
                    data1.desempeno.forEach(data2 => {   
                        if (data2.selected) {
                            data2.areas.forEach(data3 => {
                                data3.subProd.forEach(data4 => {
                                    data4.causa.forEach(element => {    
    
                                        if (element.esCausa) {      
                                            if (!this.dataListFactor.find(ele=> {
                                                console.log(ele,data,data1,data2,element);
                                                
                                                return ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre
                                            })) {
                                                this.tempData.push({nombre:data.nombre, pregunta:data2.pregunta,metodologia: element.ProcedimientoFC, accion:'Sin Plan de Accion'})
                                            }else{
                                                this.dataListFactor.forEach(ele =>{
                                                    if(ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre){
                                                        this.tempData.push(ele)                                                
                                                    }
                                                })
                                            }
                                        }                                
                                    });
                                });
                            });    
                        }                        
                    });
                });
                data.causa_Raiz.forEach(data1 => {
                    this.selectCausaRaiz(data.nombre, data1.label, data1)
                });
                
            });
            console.log(this.tempData);
            
            this.dataListFactor = this.tempData;
        } catch (error) {
                
        }
        this.habilitarInforme()
    }
    validators:boolean=true;
    getValidator(event){
        this.validators=event;
    }
    selectCausaRaiz(nombre, pregunta ,datos){
        console.log(datos);

        if (datos.data.name=='Si') {
            if (!this.dataListFactor.find(ele=> {return ele.pregunta == pregunta && ele.metodologia == datos.label})) {
                this.tempData.push({nombre:nombre, pregunta: pregunta,metodologia: datos.label, accion:'Sin Plan de Accion'})
            }else{
                this.dataListFactor.forEach(ele =>{
                    if(ele.pregunta == pregunta && ele.metodologia == datos.label){
                        this.tempData.push(ele)                                                
                    }
                })
            }
            // this.tempData.push({nombre:nombre, pregunta:pregunta, metodologia: datos.label, accion:'Sin Plan de Accion'})            
        }

        if(datos.children){
            datos.children.forEach(element => {
                this.selectCausaRaiz(nombre, pregunta ,element)
            });
        }
    

        console.log(this.tempData);
        

        // datos.forEach(element => {
        //     console.log(element);
            
        //    if(element.data == 'Si'){
        //     this.tempData.push({nombre:nombre, pregunta:element.label,metodologia: element.ProcedimientoFC, accion:'Sin Plan de Accion'})
        //    }
        // });
        
    }

    habilitarInforme(){
        let validador = true
        if(this.listPlanAccion.length>0){
        
            this.listPlanAccion.forEach(element => {



                // let isPlanAccionFinish = element.causaRaiz.find(ele=>{
                //     return ele.revisado.isComplete == true
                // })
                // //   console.log(isPlanAccionFinish);
                //   if (isPlanAccionFinish == undefined) {
                //     validador = false;
                //   }
                //   isPlanAccionFinish.forEach(element => {
                //     this.dataListFactor
                //   });
                console.log(element);
                
                element.causaRaiz.forEach(causa => {
                    console.log(causa);

                    if (causa.revisado.isComplete) {
                        let nombre = element.nombreFC.split(', ')
                        let causas = causa.causaRaiz.split(', ')
                        


                        for (let index = 0; index < nombre.length; index++) {
                            // console.log(nombre[index],causas[index]);
                            
                            let dataFactor = this.dataListFactor.find(ele=> {
                                return ele.nombre == nombre[index] && ele.metodologia == causas[index]
                            })

                            // console.log(dataFactor);

                            if (dataFactor) {
                                dataFactor.accion = 'Con Plan de Accion'                            
                            }
                            
                        }
                    }
                    else{
                        console.log("algo no es verdad");
                        validador = false
                    }
                });

                
                

                // let dataFactor2 = this.dataListFactor.splice()
                // console.log(dataFactor2);

                
            });     
        }else{
            validador=false
        }   

        if(this.dataListFactor){
            console.log("datalist", this.dataListFactor);
            this.dataListFactor.forEach(element => {
                if(element.accion=="Sin Plan de Accion"){
                    validador=false
                }
            });
        }

        this.displayInforme = validador;
    }

}
