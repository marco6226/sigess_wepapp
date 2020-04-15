import { Component, OnInit } from '@angular/core';
import { TipoArea } from '../../entities/tipo-area';
import { FilterQuery } from '../../../core/entities/filter-query';
import { TipoAreaService } from '../../services/tipo-area.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Empresa } from '../../entities/empresa';

import { Message } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 's-tipoArea',
  templateUrl: './tipo-area.component.html',
  styleUrls: ['./tipo-area.component.scss']
})
export class TipoAreaComponent implements OnInit {


  msgs: Message[] = [];
  tiposAreaList: TipoArea[];
  tipoAreaSelect: TipoArea;
  loading: boolean = true;
  totalRecords: number;
  isUpdate: boolean;
  visibleForm: boolean;
  form: FormGroup;
  fields: string[] = [
    'id',
    'nombre',
    'descripcion'
  ];

  constructor(
    private tipoAreaService: TipoAreaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
  ) {
    this.form = fb.group({
      'id': [null],
      'nombre': ['', Validators.required],
      'descripcion': ['']
    });
  }

  ngOnInit(

  ) {

  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.tipoAreaService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.tiposAreaList = [];
        (<any[]>resp['data']).forEach(dto => this.tiposAreaList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }


  showAddForm() {
    this.visibleForm = true;
    this.isUpdate = false;
  }

  showUpdateForm() {
    this.visibleForm = true;
    this.isUpdate = true;
    this.form.patchValue({
      'id': this.tipoAreaSelect.id,
      'nombre': this.tipoAreaSelect.nombre,
      'descripcion': this.tipoAreaSelect.descripcion
    });
  }

  onDelete() {
    if (this.tiposAreaList != null) {
      this.confirmationService.confirm({
        header: 'Eliminar tipo de área "' + this.tipoAreaSelect.nombre + '"',
        message: '¿Esta seguro de borrar este tipo de área?',
        accept: () => this.delete()
      });
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un tipo de área", detail: "Debe seleccionar un tipo de área para eliminarlo" });
    }
  }

  delete() {
    this.tipoAreaService.delete(this.tipoAreaSelect.id).then(
      data => {
        this.tipoAreaSelect = null;
        let tipoAreaEliminado = <TipoArea>data;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: "Cargo eliminado", detail: "Ha sido eliminado el tipo de área " + tipoAreaEliminado.nombre });
        for (let i = 0; i < this.tiposAreaList.length; i++) {
          if (this.tiposAreaList[i].id == tipoAreaEliminado.id) {
            this.tiposAreaList.splice(i, 1);
            this.tiposAreaList = this.tiposAreaList.slice();
            break;
          }
        }
      }
    );
  }

  onSubmit() {
    let tipoArea = new TipoArea();
    tipoArea.id = this.form.value.id;
    tipoArea.nombre = this.form.value.nombre;
    tipoArea.descripcion = this.form.value.descripcion;

    if (this.isUpdate) {
      this.tipoAreaService.update(tipoArea).then(
        data => this.manageUpdateResponse(<TipoArea>data)
      );
    } else {
      this.tipoAreaService.create(tipoArea).then(
        data => this.manageCreateResponse(<TipoArea>data)
      );
    }
  }

  manageUpdateResponse(tipoArea: TipoArea) {
    for (let i = 0; i < this.tiposAreaList.length; i++) {
      if (this.tiposAreaList[i].id == tipoArea.id) {
        this.tiposAreaList[i] = tipoArea;
        break;
      }
    }
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: "Cargo actualizado", detail: "Se ha actualizado el cargo " + tipoArea.nombre });
    this.closeForm();
    this.form.reset();
  }

  manageCreateResponse(tipoArea: TipoArea) {
    if (this.tiposAreaList == null) {
      this.tiposAreaList = [];
    }
    this.tiposAreaList.push(tipoArea);
    this.tiposAreaList = this.tiposAreaList.slice();
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: "Nuevo tipo de área creado", detail: "Se ha creado el tipo de área " + tipoArea.nombre });
    this.closeForm();
    this.form.reset();
  }

  closeForm() {
    this.visibleForm = false;
  }

}
