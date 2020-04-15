import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';

import { SistemaGestionPK } from 'app/modulos/sg/entities/sistema-gestion-pk';
import { SistemaGestion } from 'app/modulos/sg/entities/sistema-gestion';
import { Documento } from 'app/modulos/ado/entities/documento'
import { SistemaGestionService } from 'app/modulos/sg/services/sistema-gestion.service';
import { ElementoService } from 'app/modulos/sg/services/elemento.service';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { Elemento } from 'app/modulos/sg/entities/elemento';

import 'rxjs/add/operator/switchMap';

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 'app-sge-form',
  templateUrl: './sge-form.component.html',
  styleUrls: ['./sge-form.component.scss'],
  providers: [ElementoService]
})
export class SgeFormComponent implements OnInit {

  msgs: Message[];
  action: string;
  editable: boolean;
  sistemaGestion: SistemaGestion;
  form: FormGroup;
  isUpdate: boolean;
  btnLabel: string;
  visibleDocSelector: boolean = false;
  elementoDocSelect: Elemento;
  isLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sistemaGestionService: SistemaGestionService,
    private fb: FormBuilder,
    private sesionService: SesionService,
    private elementoService: ElementoService,
  ) {


  }

  ngOnInit() {

    this.form = this.fb.group({
      'id': null,
      'nombre': [null, Validators.required],
      'codigo': [null],
      'descripcion': [null]
    });

    this.route.params.subscribe(
      params => {
        this.action = params['action'];
        if (this.action == 'UPDATE') {
          this.editable = true;
          this.btnLabel = "Actualizar";
          this.isUpdate = true;
        } else if (this.action == 'GET') {
          this.editable = false;
          this.isUpdate = false;
          this.form.disable();
        }

        if (params['id'] == null || params['version'] == null || this.action == null) {
          this.sistemaGestion = new SistemaGestion();
          this.btnLabel = "Guardar";
          this.isUpdate = false;
          this.editable = true;
          this.isLoaded = true;
        } else {
          this.findSGE(params['id'], params['version']);
        }
      }
    );

  }

  findSGE(id: string, version: number) {

    let filterQuery = new FilterQuery();
    let filterId = new Filter();
    filterId.criteria = Criteria.EQUALS;
    filterId.field = "sistemaGestionPK.id";
    filterId.value1 = id;

    let filterVersion = new Filter();
    filterVersion.criteria = Criteria.EQUALS;
    filterVersion.field = "sistemaGestionPK.version";
    filterVersion.value1 = version.toString();

    let filterElem = new Filter();
    filterElem.criteria = Criteria.EQUALS;
    filterElem.field = "consultarElementos";
    filterElem.value1 = 'true';

    filterQuery.filterList = [filterId, filterVersion, filterElem];

    this.sistemaGestionService.findByFilter(filterQuery).then(
      data => {
        this.sistemaGestion = (<SistemaGestion[]>data)[0];
        this.form.patchValue({
          id: this.sistemaGestion.sistemaGestionPK,
          nombre: this.sistemaGestion.nombre,
          codigo: this.sistemaGestion.codigo,
          descripcion: this.sistemaGestion.descripcion
        });
        this.isLoaded = true;
      }
    );
  }

  save() {
    this.sistemaGestion.sistemaGestionPK = this.form.value.id;
    this.sistemaGestion.codigo = this.form.value.codigo;
    this.sistemaGestion.descripcion = this.form.value.descripcion;
    this.sistemaGestion.nombre = this.form.value.nombre;
    if (this.isUpdate) {
      this.sistemaGestionService.update(this.sistemaGestion).then(
        data => this.manageResponse(<SistemaGestion>data)
      );
    } else {
      this.sistemaGestionService.create(this.sistemaGestion).then(
        data => {
          this.manageResponse(<SistemaGestion>data);
          this.isUpdate = true;
          this.btnLabel = "Actualizar";
        }
      );
    }

  }

  manageResponse(sge: SistemaGestion) {
    this.form.value.id = sge.sistemaGestionPK;
    this.msgs = [];
    this.msgs.push(
      {
        severity: 'success',
        summary: 'Sistema de gestión ' + (this.isUpdate ? 'actualizado' : 'creado'),
        detail: 'Se ha ' + (this.isUpdate ? 'actualizado' : 'creado') + ' correctamente el sistema de gestión ' + this.sistemaGestion.nombre
      });
  }

  /* Métodos de documentos de elementos*/
  abrirDlgDocumento(elemento: Elemento) {
    this.visibleDocSelector = true;
    this.elementoDocSelect = elemento;
  }

  onDocumentSave(documentosList: Documento[]) {
    this.elementoDocSelect.documentosList = documentosList;
    this.elementoService.actualizarDocumentos(this.elementoDocSelect).then(
      data => {
        this.elementoDocSelect = <Elemento>data;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Elemento actualizado',
          detail: 'Se han actualizado los documentos del elemento ' + this.elementoDocSelect.codigo + ' ' + this.elementoDocSelect.nombre
        });
      }
    );
  }

}
