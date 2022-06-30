import { Causa_Raiz, FactorCausal, Incapacidad, listFactores, listPlanAccion } from './../../entities/factor-causal';
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
import * as moment from 'moment';
import {
    locale_es,
    tipo_identificacion,
    tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";

@Component({
    selector: "s-analisisDesviacion",
    templateUrl: "./analisis-desviacion.component.html",
    styleUrls: ["./analisis-desviacion.component.scss"],
    providers: [
        TipoPeligroService, PeligroService,
        SistemaCausaInmediataService,
        SistemaCausaAdministrativaService,
    ],
})
export class AnalisisDesviacionComponent implements OnInit {
    @Input("collapsed") collapsed: boolean;
    @Input("value") value: AnalisisDesviacion;
    formtp: FormGroup;
    formp: FormGroup;
    analisisPeligros: FormGroup;
    tareasList: Tarea[];
    flowChartSave: string;
    form2: Peligro;

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

    display: boolean = false;

    empresaName: string;
    empresaNit: string;
    empresaDescipcion: string;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    dataListFactor: listFactores[]=[];

    dataFlow: AnalisisDesviacion;
    factorCusal: FactorCausal[]=[]

    tipoPeligroItemList: SelectItem[];
    peligroItemList: SelectItem[];

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
    tipoPeligro = [
        { label: "--Seleccione--", value: null },
        { label: "BIOLOGICO", value: "BIOLOGICO" },
        { label: "FISICOS", value: "FISICOS" },
        { label: "QUIMICOS", value: "QUIMICOS" },
        { label: "PSICOSOCIAL", value: "PSICOSOCIAL" },
        { label: "BIOMECANICOS", value: "BIOMECANICOS" },
        { label: "ELECTRICO", value: "ELECTRICO" },
        { label: "MECANICO", value: "MECANICO" },
        { label: "FISICOQUIMICO", value: "FISICOQUIMICO" },
        { label: "LOCATIVOS", value: "LOCATIVOS" },
        { label: "TRANSITO - VÍAL", value: "TRANSITO-VÍAL" },
        { label: "PUBLICO", value: "PUBLICO" },
        { label: "TRABAJO EN ALTURAS", value: "TRABAJO_EN_ALTURAS" },
        { label: "TAREA DE ALTO RIESGO - CONFINADOS", value: "TAREA_DE_ALTO_RIESGO-CONFINADOS" },
        { label: "FENOMENOS NATURALES", value: "FENOMENOS_NATURALES" },
    ]
    Peligro = [
        { label: "--Seleccione--", value: null },
    ]

    tSelectPeligro(a: string){
        this.tPeligro1=a;
    }
    
    SelectPeligro(a: string){
        console.log('a');
        console.log(a['id']);
        
        this.Peligro1=a;
        this.cargarPeligro(a['id']);
        console.log(this.tipoPeligroItemList);
        console.log(this.peligroItemList);
        // switch (a['nombre']) {
        //     case "BIOLÓGICO":
        //         this.Peligro = [
        //             { label: "--Seleccione--", value: null },
        //             { label: "Virus", value: "Virus" },
        //             { label: "Bacterias", value: "Bacterias" },
        //             { label: "Hongos", value: "Hongos" },
        //             { label: "Rickettsias", value: "Rickettsias" },
        //             { label: "Parásitos", value: "Parásitos" },
        //             { label: "Picaduras", value: "Picaduras" },
        //             { label: "Mordeduras", value: "Mordeduras" },
        //             { label: "Fluidos corporales", value: "Fluidos_corporales" }
        //         ]
        //     break;
        //     case "FISICOS":
        //         this.Peligro = [
        //             { label: "--Seleccione--", value: null },
        //             { label: "Ruido (de impacto,intermitente,continuo)", value: "0" },
        //             { label: "Iluminación (luz visible por exceso o deficiencia)", value: "1" },
        //             { label: "Vibración (cuerpo entero, segmentaria)", value: "2" },
        //             { label: "Temperaturas extremas por Calor", value: "3" },
        //             { label: "Temperaturas extremas por Frio", value: "4" },
        //             { label: "Presión atmosférica (alta y baja)", value: "5" },
        //             { label: "Radiaciones ionizantes (rayos x, gama, beta y alfa)", value: "6" },
        //             { label: "Radiaciones no ionizantes  (láser, ultravioleta, infrarroja, radiofrecuencia, microondas)", value: "7" }
        //         ]
        //     break;
        // }
        // return this.Peligro;
    }
    test(){
        //console.log(this.incapacidadesList);
        console.log("*****aquí***")
        console.log(this.analisisPeligros.get('tipoPeligro').value)
        console.log(this.analisisPeligros.value)
        console.log(this.tipoPeligroItemList)
        console.log(this.peligroItemList)
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
        fb: FormBuilder,
    ) {
        this.analisisPeligros = fb.group({
            tipoPeligro: [null, /*Validators.required*/],
            descripcionPeligro: [null,/*Validators.required*/],
            aRLfirme: [null, /*Validators.required*/],
        });
        // this.form = fb.group({
        //     id: [null],
        //     tipoPeligro: [null, Validators.required],
        //     peligro: [null, Validators.required],
        //   });


    }

    ngOnInit() {
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
        //this.cargarPeligro();
    }

    cargarTiposPeligro() {
        this.tipoPeligroService.findAll().then(
          resp => {
            console.log(resp);
            this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
            (<TipoPeligro[]>resp['data']).forEach(
              data => this.tipoPeligroItemList.push({ label: data.nombre, value: data })
            )
            // if (this.formtp.value.tipoPeligro != null) {
            //   for (let i = 0; i < this.tipoPeligroItemList.length; i++) {
            //     let data = this.tipoPeligroItemList[i].value;
            //     if (data != null && data.id == this.formtp.value.tipoPeligro.id) {
            //       this.formtp.patchValue({
            //         tipoPeligro: this.tipoPeligroItemList[i].value
            //       });
            //       break;
            //     }
            //   }
            // }
    
          }
        );
      }
      cargarPeligro(idtp) {

        //this.peligroService.findAll().then(

        let filter = new FilterQuery();
        filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp }];
        this.peligroService.findByFilter(filter).then(
          resp => {
            console.log(resp);
            this.peligroItemList = [{ label: '--Seleccione--', value: [null, null]}];
            (<Peligro[]>resp).forEach(
              data => 
                {
                    console.log(data);
                    this.peligroItemList.push({ label: data.nombre, value: [data.id, data.nombre] })
                }
            )
            console.log(this.peligroItemList);
            // if (this.formp.value.nombre != null) {
            //   for (let i = 0; i < this.peligroItemList.length; i++) {
            //     let data = this.peligroItemList[i].value;
            //     if (data != null && data.id == this.formp.value.Peligro.id) {
            //       this.formp.patchValue({
            //         Peligro: this.peligroItemList[i].value
            //       });
            //       break;
            //     }
            //   }
            // }
          }
        );
        //this.peligroItemList.findIndex('id');
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

    consultarAnalisis(analisisId: string) {
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: analisisId },
        ];
        this.analisisDesviacionService.findByFilter(fq).then((resp) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            console.log("----->",resp["data"][0]);
            
            this.dataFlow = resp["data"][0];
            this.flowChartSave = resp["data"][0].flow_chart;

            this.factorCusal = JSON.parse(resp["data"][0].factor_causal);
            console.log(this.factorCusal);
            
            // if(this.factorCusal){
                this.setListDataFactor();
            // }

            this.incapacidadesList = JSON.parse(resp["data"][0].incapacidades)
            
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
        });
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
    async imprimir() {
        let template = document.getElementById('plantilla');
        if (this.desviacionesList) {
            const date = new Date (this.desviacionesList[0].concepto);
            const fechahora = new Date();
            template.querySelector('#P_lista_nombre').textContent =this.desviacionesList[0].concepto.toString();
            template.querySelector('#P_codigo').textContent ="texto"
            template.querySelector('#P_version').textContent = '' + this.desviacionesList[0].concepto;
            template.querySelector('#P_formulario_nombre').textContent = this.desviacionesList[0].concepto;
            template.querySelector('#P_empresa_logo').setAttribute('src', this.sesionService.getEmpresa().logo);
          if(this.desviacionesList != null ){
            template.querySelector('#P_firma').textContent = this.desviacionesList[0].concepto;
            template.querySelector('#P_cargo').textContent = " Cargo: " + this.desviacionesList[0].concepto;          
        }else{
            template.querySelector('#P_firma').textContent = this.desviacionesList[0].concepto;
           
        }
            let  a: string | ArrayBuffer=this.desviacionesList[0].concepto.toString();
            let b: string | ArrayBuffer=this.desviacionesList[0].concepto.toString();
           
            


            let camposForm = template.querySelector('#L_campos_formulario');
            const tr = camposForm.cloneNode(true);
            tr.childNodes[0].textContent = "Ubicación"
            tr.childNodes[1].textContent = this.desviacionesList[0].concepto;
            camposForm.parentElement.appendChild(tr);
            const tfecha = camposForm.cloneNode(true);
            tfecha.childNodes[0].textContent = 'Fecha y Hora de realización'
            tfecha.childNodes[1].textContent = fechahora.toDateString();
           /* camposForm.parentElement.appendChild(tfecha);
            this.listaInspeccion.formulario.campoList.forEach(campo => {
                let tr = camposForm.cloneNode(true);
                tr.childNodes[0].textContent = campo.nombre;
                for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                    let rc = this.inspeccion.respuestasCampoList[i];
                    if (rc.campoId == campo.id) {
                        tr.childNodes[1].textContent = campo.respuestaCampo.valor;
                        break;
                    }
                }
                camposForm.parentElement.appendChild(tr);
                
            });*/


            let elemList = template.querySelector('#L_elementos_lista');
           // this.agregarElementos(<HTMLElement>elemList, this.desviacionesList[0].concepto);
            elemList.remove();
            //this.pdfGenerado = true;
        }

        setTimeout(() => {
            var WinPrint = window.open('', '_blank');
            
            WinPrint.document.write(template.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
        }, 400);
    }

    guardarAnalisis() {
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
        ad.tareaDesviacionList = this.tareasList;
        if  (ad.tareaDesviacionList) {
        for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
            ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
            ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
        }
        }

        ad.jerarquia = ad.jerarquia;

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

    
        // let Pe = new Peligro();
        // let tp = new TipoPeligro();

        // //Pe.id=this.form.value.peligro.id;
        // Pe.nombre=this.Peligro1;
        // console.log(this.analisisPeligros.value);
        // Pe.tipoPeligro= this.analisisPeligros.value.tipoPeligro.id;
        
        // //tp.id=this.form.value.peligro.tipoPeligro.id;
        // tp.nombre=this.tPeligro1;
        // //tp.peligroList=this.form.value.peligro;

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
        this.setListDataFactor();
        // ad.flow_chart = JSON.stringify(this.flowChartSave);
        ad.flow_chart = this.flowChartSave;
        ad.participantes = JSON.stringify(this.participantes);
        ad.tareaDesviacionList = this.tareasList;
        ad.jerarquia = this.jerarquia;
        for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
            ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
            ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
            console.log(ad.tareaDesviacionList);
        }

        // setTimeout(() => {
            this.analisisDesviacionService.update(ad).then((data) => {
                console.log(data, "data");
                
                this.manageResponse(<AnalisisDesviacion>data);
                this.modificar = true;
                this.adicionar = false;
            });
        // }, 1000);

        // // setTimeout(() => {
        //     this.peligroService.update(Pe).then((data) => {
        //         console.log(data, "data");
                
        //         this.manageResponse(<AnalisisDesviacion>data);
        //         this.modificar = true;
        //         this.adicionar = false;
        //     });
        // // }, 1000);

        // // setTimeout(() => {
        //     this.tipoPeligroService.update(tp).then((data) => {
        //         console.log(data, "data");
                
        //         this.manageResponse(<AnalisisDesviacion>data);
        //         this.modificar = true;
        //         this.adicionar = false;
        //     });
        // // }, 1000);

        
        console.log(ad.tareaDesviacionList);
        console.log(ad.flow_chart);
    }

    manageResponse(ad: AnalisisDesviacion) {
        this.msgs = [];
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

    confirmarActualizacion(event: Documento) {
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
                                            if (!this.dataListFactor.find(ele=> {return ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC})) {
                                                this.tempData.push({nombre:data.nombre, pregunta:data2.pregunta,metodologia: element.ProcedimientoFC, accion:'Sin Plan de Accion'})
                                            }else{
                                                this.dataListFactor.forEach(ele =>{
                                                    if(ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC){
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
            this.dataListFactor = this.tempData;
        } catch (error) {
                
        }
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
}
