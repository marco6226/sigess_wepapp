import { Component, OnInit } from '@angular/core';

import { Area, Estructura } from 'app/modulos/empresa/entities/area'
import { Sede } from 'app/modulos/empresa/entities/sede'
import { TipoArea } from 'app/modulos/empresa/entities/tipo-area'
import { AreaService } from 'app/modulos/empresa/services/area.service'
import { TipoAreaService } from 'app/modulos/empresa/services/tipo-area.service'
import { SedeService } from 'app/modulos/empresa/services/sede.service'
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { SelectItem, Message, ConfirmationService, TreeNode } from 'primeng/primeng';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Criteria } from 'app/modulos/core/entities/filter';
import { ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {

  msgs: Message[] = [];

  varSelected: string;
  varNodes: string;

  estructuraSelected: string;
  areaSelected: any;
  sedeSelected: any;
  areasNodes: TreeNode[] = [];
  sedesNodes: TreeNode[] = [];
  tiposAreaList: SelectItem[] = [{ label: '--Seleccione--', value: null }];
  visibleForm: boolean;
  form: FormGroup;
  visibleTree: boolean = false;
  adicionar: boolean;
  modificar: boolean;

  constructor(
    private areaService: AreaService,
    private sesionService: SesionService,
    private tipoAreaService: TipoAreaService,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      'id': [null],
      'nombre': ['', Validators.required],
      'descripcion': [null],
      'tipoAreaId': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadAreas();
  }

  loadAreas() {
    // Consulta los tipos de area
    this.tipoAreaService.findAll().then(
      data => (<TipoArea[]>data['data']).forEach(ta => this.tiposAreaList.push({ label: ta.nombre, value: ta.id }))
    );
    // Consulta las areas de estructura organizacional
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterAreaQuery).then(
      data => {
        let root: TreeNode = {
          label: this.sesionService.getEmpresa().razonSocial,
          selectable: false,
          expanded: true,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.areasNodes.push(root);
        this.visibleTree = true;
      }
    );
    // Consulta las areas de estructura fisica
    let filterSedesQuery = new FilterQuery();
    filterSedesQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterSedesQuery).then(
      data => {
        let root: TreeNode = {
          label: this.sesionService.getEmpresa().razonSocial,
          selectable: false,
          expanded: true,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.sedesNodes.push(root);
        this.visibleTree = true;
      }
    );
  }

  createTreeNode(areas: Area[], nodoPadre: TreeNode): TreeNode[] {
    let nodes: TreeNode[] = [];
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];
      let n = {
        id: area.id,
        label: area.nombre,
        descripcion: area.descripcion,
        tipoAreaId: area.tipoArea.id,
        expanded: true,
        nodoPadre: nodoPadre,
        children: null
      };
      n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : null);
      nodes.push(n);
    }
    return nodes;
  }


  showAddForm(estructSelected: string) {
    this.estructuraSelected = estructSelected;
    // Dependiendo de la estructura trabajada, se establecen las variables 
    // de este objeto que representan el nodo arbol y el nodo seleccionado
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.varSelected = 'areaSelected';
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        this.varSelected = 'sedeSelected';
        this.varNodes = 'sedesNodes';
        break;
    }
    //-------

    this.visibleForm = true;
    this.adicionar = true;
    this.modificar = false;
    this.form.reset();
  }

  showUpdateForm(estructSelected: string) {
    this.estructuraSelected = estructSelected;

    // Dependiendo de la estructura trabajada, se establecen las variables 
    // de este objeto que representan el nodo arbol y el nodo seleccionado
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.varSelected = 'areaSelected';
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        this.varSelected = 'sedeSelected';
        this.varNodes = 'sedesNodes';
        break;
    }
    //-------

    if (this[this.varSelected] != null) {
      this.visibleForm = true;
      this.adicionar = false;
      this.modificar = true;
      this.form.patchValue({
        'id': this[this.varSelected].id,
        'nombre': this[this.varSelected].label,
        'descripcion': this[this.varSelected].descripcion,
        'tipoAreaId': this[this.varSelected].tipoAreaId
      });
    } else {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn',
        summary: 'Debe seleccionar un nodo',
        detail: 'para realizar la actualización del mismo'
      });
    }
  }

  closeForm() {
    this.visibleForm = false;
    this.adicionar = false;
    this.modificar = false;
  }

  onAreaDelete(estructura: string) {
    // Dependiendo de la estructura trabajada, se establecen las variables 
    // de este objeto que representan el nodo arbol y el nodo seleccionado
    switch (estructura) {
      case Estructura.ORGANIZACIONAL.toString():
        this.varSelected = 'areaSelected';
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        this.varSelected = 'sedeSelected';
        this.varNodes = 'sedesNodes';
        break;
    }
    //-------

    if (this[this.varSelected] != null) {
      this.areaService.delete(this[this.varSelected].id).then(
        data => this.manageDelete()
      );
    } else {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn',
        summary: 'Debe seleccionar un nodo',
        detail: 'para realizar la eliminación del mismo'
      });
    }
  }
  manageDelete() {
    let nodoPadre = this[this.varSelected].nodoPadre;
    for (let i = 0; i < nodoPadre.children.length; i++) {
      if (nodoPadre.children[i].id == this[this.varSelected].id) {
        nodoPadre.children.splice(i, 1);
        break;
      }
    }
    if (this[this.varSelected].children != null) {
      this[this.varSelected].children.forEach(ar => {
        ar.nodoPadre = nodoPadre;
        nodoPadre.children.push(ar);
      });
    }
    nodoPadre.children = nodoPadre.children.slice();
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Nodo eliminado', detail: 'se ha realizado la eliminación del nodo ' + this[this.varSelected].label });
    this[this.varSelected] = null;

    this.varNodes = null;
    this.varSelected = null;
  }

  onSubmit() {
    if (this.form.valid && this.estructuraSelected != null) {
      let area: Area = new Area();
      area.nombre = this.form.value.nombre;
      area.descripcion = this.form.value.descripcion;
      area.tipoArea = new TipoArea();
      area.tipoArea.id = this.form.value.tipoAreaId;
      area.estructura = this.estructuraSelected;

      if (this.modificar) {
        area.id = this[this.varSelected].id;
        this.areaService.update(area).then(
          resp => this.manageCreateResponse(<Area>resp)
        );
      } else if (this.adicionar) {
        if (this[this.varSelected] != null) {
          area.areaPadre = new Area();
          area.areaPadre.id = this[this.varSelected].id;
        }
        this.areaService.create(area).then(
          resp => this.manageCreateResponse(<Area>resp)
        );
      }
    }
  }

  manageCreateResponse(area: Area) {

    this.msgs = [];
    if (this.adicionar) {
      if (this[this.varSelected] != null && this[this.varSelected].children == null) {
        this[this.varSelected].children = [];
      }
      let node = {
        id: area.id,
        label: area.nombre,
        descripcion: area.descripcion,
        tipoAreaId: area.tipoArea.id,
        expanded: true,
        nodoPadre: null,
      };
      if (this[this.varSelected] != null) {
        node.nodoPadre = this[this.varSelected];
        this[this.varSelected].children.push(node);
        this[this.varSelected].children = this[this.varSelected].children.slice();
      } else {
        node.nodoPadre = this[this.varNodes][0];
        this[this.varNodes][0].children.push(node);
        this[this.varNodes][0].children = this[this.varNodes][0].children.slice();
      }

      this.msgs.push({
        severity: 'success',
        summary: 'Adición realizada!',
        detail: 'Se ha creado correctamente el nodo ' + area.nombre
      });
    } else if (this.modificar) {
      this[this.varSelected].label = area.nombre;
      this.msgs.push({
        severity: 'success',
        summary: 'Actualización realizada!',
        detail: 'Se ha actualizado correctamente el nodo ' + area.nombre
      });
    }
    this.varNodes = null;
    this.varSelected = null;
    this.closeForm();
  }

}
