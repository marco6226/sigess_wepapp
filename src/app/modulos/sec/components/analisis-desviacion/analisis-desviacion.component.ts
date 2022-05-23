import { FactorCausal } from './../../entities/factor-causal';
import { Component, OnInit, Input } from "@angular/core";
import { Reporte } from 'app/modulos/rai/entities/reporte';

import { ParametroNavegacionService } from "app/modulos/core/services/parametro-navegacion.service";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";

import { SistemaCausaInmediataService } from "app/modulos/sec/services/sistema-causa-inmediata.service";
import { SistemaCausaRaizService } from "app/modulos/sec/services/sistema-causa-raiz.service";
import { SistemaCausaRaiz } from "app/modulos/sec/entities/sistema-causa-raiz";
import { CausaRaiz } from "app/modulos/sec/entities/causa-raiz";
import { AnalisisDesviacion } from "app/modulos/sec/entities/analisis-desviacion";
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
        SistemaCausaInmediataService,
        SistemaCausaAdministrativaService,
    ],
})
export class AnalisisDesviacionComponent implements OnInit {
    @Input("collapsed") collapsed: boolean;
    @Input("value") value: AnalisisDesviacion;

    tareasList: Tarea[];
    flowChartSave: string;

    causaAdminList: TreeNode[] = [];
    causaAdminListSelect: TreeNode[] = [];
    causaAdminAnalisisList: CausaAdministrativa[];

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
    msgs: Message[] = [];
    consultar: boolean = false;
    modificar: boolean = false;
    adicionar: boolean = false;
    visibleLnkResetPasswd = true;
    idEmpresa: string;

    empresaName: string;
    empresaNit: string;
    empresaDescipcion: string;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    dataFlow: AnalisisDesviacion;
    factorCusal: FactorCausal[]=[]

    constructor(
        private sistCausAdminService: SistemaCausaAdministrativaService,
        private analisisDesviacionService: AnalisisDesviacionService,
        private sistemaCausaInmdService: SistemaCausaInmediataService,
        private sistemaCausaRaizService: SistemaCausaRaizService,
        private paramNav: ParametroNavegacionService,
        private authService: AuthService,
        private sesionService: SesionService,
    ) {}

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
            this.dataFlow = resp["data"][0];
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
        let ad = new AnalisisDesviacion();
        ad.id = this.analisisId;
        ad.causaRaizList = this.buildList(this.causaRaizListSelect);
        ad.causaInmediataList = this.buildList(this.causaInmediataListSelect);
        ad.causasAdminList = this.buildList(this.causaAdminListSelect);
        ad.desviacionesList = this.desviacionesList;
        ad.analisisCosto = this.analisisCosto;
        ad.observacion = this.observacion;
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
        this.factorCusal=[];
        event.forEach(element => {
            this.factorCusal.push(element)
        });
        // this.factorCusal.push(event)
        console.log(this.factorCusal);
        
    }


    dataDiagram(event){
        // console.log(event);
        this.flowChartSave = event;
    }

    test(){
        console.log(this.flowChartSave);
        
    }

}
