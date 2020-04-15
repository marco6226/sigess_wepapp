import { Component, OnInit } from '@angular/core';
import { PerfilService } from './../../services/perfil.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'

import { Message } from 'primeng/primeng';
import { Perfil } from 'app/modulos/empresa/entities/perfil'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [PerfilService],
})
export class PerfilComponent implements OnInit {

  empresaId: string;
  perfilList: Perfil[];
  visibleDlg: boolean;
  perfil: Perfil;
  msgs: Message[];
  visibleBtnSave: boolean;
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'id',
    'nombre',
    'descripcion'
  ];


  constructor(
    private perfilService: PerfilService
  ) {
  }

  ngOnInit() {
    this.loading = true;
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

    this.perfilService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.perfilList = [];
        (<any[]>resp['data']).forEach(dto => this.perfilList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  abrirDlgNuevo() {
    this.visibleDlg = true;
    this.perfil = new Perfil();
    this.visibleBtnSave = true;
  }

  abrirDlgModificar() {
    this.visibleDlg = true;
    this.visibleBtnSave = false;
  }

  hideDlg() {
    this.perfil = null;
  }

  adicionar() {
    this.perfilService.create(this.perfil).then(
      resp => this.manageResponse(<Perfil>resp, false)
    );
  }

  modificar() {
    this.perfilService.update(this.perfil).then(
      resp => this.manageResponse(<Perfil>resp, true)
    );
  }

  manageResponse(perfil: Perfil, isUpdate: boolean) {
    if (!isUpdate) {
      this.perfilList.push(perfil);
      this.perfilList = this.perfilList.slice();
    }
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'Perfil creado',
      detail: 'Se ha ' + (isUpdate ? 'actualizado' : 'creado') + ' correctamente el perfil ' + perfil.nombre
    });
    this.visibleDlg = false;
    this.perfil = null;
  }
}
