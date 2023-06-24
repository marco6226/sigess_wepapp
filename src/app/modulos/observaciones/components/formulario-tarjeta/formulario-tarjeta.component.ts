import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tarjeta } from 'app/modulos/observaciones/entities/tarjeta';
import { Observacion } from 'app/modulos/observaciones/entities/observacion';
import { ObservacionService } from 'app/modulos/observaciones/services/observacion.service';
import { DomSanitizer } from '@angular/platform-browser';

import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { SistemaCausaRaizService } from 'app/modulos/sec/services/sistema-causa-raiz.service';
import { TreeNode } from 'primeng/primeng';
import { SistemaCausaRaiz } from 'app/modulos/sec/entities/sistema-causa-raiz';
import { CausaRaiz } from 'app/modulos/sec/entities/causa-raiz';
import { Implicacion } from 'app/modulos/observaciones/entities/implicacion';
import { SistemaNivelRiesgoService } from 'app/modulos/core/services/sistema-nivel-riesgo.service';
import { SistemaNivelRiesgo } from 'app/modulos/core/entities/sistema-nivel-riesgo';
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo';
import { Message, SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Directorio } from '../../../ado/entities/directorio';
import { SesionService } from 'app/modulos/core/services/sesion.service';

@Component({
    selector: 's-formulario-tarjeta',
    templateUrl: './formulario-tarjeta.component.html',
    styleUrls: ['./formulario-tarjeta.component.scss'],
})
export class FormularioTarjetaComponent implements OnInit {
    @Input('tarjeta') tarjeta: Tarjeta;
    @Input('observacion') observacion: Observacion = new Observacion();
    @Output('onSave') onSave = new EventEmitter<Observacion>();
    causaRaizList: TreeNode[] = [];
    causaRaizSelectList: TreeNode[];
    implicacionTree: TreeNode[] = [];
    implicacionSelectList: TreeNode[] = [];
    afectaSelectList: string[];
    nivelRiesgoList: SelectItem[] = [{ label: '--Nivel Riesgo--', value: null }];
    form: FormGroup;
    visibleDlg: boolean;
    imagenesList: any[];
    msgs: Message[];
    idEmpresa: string;

    constructor(
        private directorioService: DirectorioService,
        private domSanitizer: DomSanitizer,
        private sistemaCausaRaizService: SistemaCausaRaizService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private observacionService: ObservacionService,
        private fb: FormBuilder,
        public sesionService: SesionService
    ) {
        this.form = fb.group({
            id: null,
            tipoObservacion: [null, Validators.required],
            afecta: new FormControl(),
            descripcion: [null, Validators.required],
            recomendacion: null,
            personasobservadas: null,
            personasabordadas: null,
            nivelRiesgo: null,
            causaRaiz: null,
            area: [null, Validators.required],
        });
    }

    ngOnInit() {
        this.idEmpresa = this.sesionService.getEmpresa().id;
        this.implicacionTree = this.buildImplicacionTree(this.tarjeta.implicacionList);
        this.sistemaNivelRiesgoService.findDefault().then((data) =>
            (<SistemaNivelRiesgo>data).nivelRiesgoList.forEach((element) => {
                this.nivelRiesgoList.push({ label: element.nombre, value: element });
            })
        );
        this.sistemaCausaRaizService.findDefault().then((data) => (this.causaRaizList = this.buildTreeNode((<SistemaCausaRaiz>data).causaRaizList)));
    }

    buildImplicacionTree(implicacionList: Implicacion[]) {
        let treeNodeList: TreeNode[] = [];
        implicacionList.forEach((implicacion) => {
            let node = {
                id: implicacion.id,
                label: implicacion.nombre,
                children: implicacion.implicacionList == null || implicacion.implicacionList.length == 0 ? null : this.buildImplicacionTree(implicacion.implicacionList),
            };
            treeNodeList.push(node);
        });
        return treeNodeList;
    }

    buildTreeNode(crList: CausaRaiz[]): any {
        let treeNodeList: TreeNode[] = [];
        crList.forEach((cr) => {
            let node = {
                id: cr.id,
                label: cr.nombre,
                children: cr.causaRaizList == null || cr.causaRaizList.length == 0 ? null : this.buildTreeNode(cr.causaRaizList),
            };
            treeNodeList.push(node);
        });
        return treeNodeList;
    }

    buildImplicacionList(impTree: any[]): Implicacion[] {
        if (impTree == null) {
            return null;
        }
        let impList: Implicacion[] = [];
        impTree.forEach((imp) => {
            let impEntity = new Implicacion();
            impEntity.id = imp.id;
            impList.push(impEntity);
        });
        return impList;
    }

    buildCausaRaizList(crTree: any[]): CausaRaiz[] {
        if (crTree == null) {
            return null;
        }
        let crList: CausaRaiz[] = [];
        crTree.forEach((imp) => {
            let crEntity = new CausaRaiz();
            crEntity.id = imp.id;
            crList.push(crEntity);
        });
        return crList;
    }

    onSubmit() {
        let observacion = new Observacion();
        observacion.tipoObservacion = this.form.value.tipoObservacion;
        observacion.descripcion = this.form.value.descripcion;
        observacion.implicacionList = this.buildImplicacionList(this.implicacionSelectList);
        observacion.area = this.form.value.area;
        observacion.afecta = this.afectaSelectList;
        observacion.recomendacion = this.form.value.recomendacion;
        observacion.personasabordadas = this.form.value.personasabordadas;
        observacion.personasobservadas = this.form.value.personasobservadas;
        observacion.causaRaizList = this.buildCausaRaizList(this.causaRaizSelectList);
        observacion.nivelRiesgo = this.form.value.nivelRiesgo;
        observacion.tarjeta = new Tarjeta();
        observacion.tarjeta.id = this.tarjeta.id;
        this.observacionService.create(observacion).then((data) => {
            observacion = <Observacion>data;
            if (this.imagenesList != null) {
                this.imagenesList.forEach((imgObj) => {
                    this.directorioService.uploadv5(imgObj.file, null, 'AUC', observacion.id, null, 'PUBLICO', null);
                });
            }
            this.onSave.emit(observacion);
        });
    }

    showDialog() {
        this.visibleDlg = true;
    }

    onArchivoSelect(event) {
        let file = event.target.files[0];
        this.msgs = [];
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
            this.msgs.push({ severity: 'error', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg' });
            return;
        }
        if (file.size > 30_500_000) {
            this.msgs.push({ severity: 'error', summary: 'Tamaño máximo superado 30.5 MB', detail: 'La imágen supera el tamaño máximo permitido' });
            return;
        }
        if (this.imagenesList == null) this.imagenesList = [];
        let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.imagenesList.push({ source: urlData, file: file });
        this.imagenesList = this.imagenesList.slice();
    }
}
