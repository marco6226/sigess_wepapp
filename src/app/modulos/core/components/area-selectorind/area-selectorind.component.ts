import { Component, OnInit, EventEmitter, Output, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { SelectItem, Message, TreeNode, Tree } from 'primeng/primeng';
import { Sede } from 'app/modulos/empresa/entities/sede'
import { Area, Estructura } from 'app/modulos/empresa/entities/area'
import { AreaService } from '../../../empresa/services/area.service'
import { config } from 'app/config'
import { Session } from 'app/modulos/core/entities/session';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Criteria } from '../../../core/entities/filter';

@Component({
  selector: 'area-selectorind',
  templateUrl: './area-selectorind.component.html',
  styleUrls: ['./area-selectorind.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaSelectorIndComponent),
      multi: true
    }
    /*
    ,
    {
      provide: NG_VALIDATORS,
      useValue: (c: FormControl) => {
        let err = {
          valueError: {
            msg: 'No se ha seleccionado un area'
          }
        };
        return (c.value == null) ? err : null;
      },
      multi: true
    }
    */
  ]
})
export class AreaSelectorIndComponent implements OnInit, ControlValueAccessor {

  msgs: Message[] = [];
  @Input() name: string;
  @Input() _value: Area;
  @Input() disabled: boolean;
  @Output() onAreaSelect = new EventEmitter();
  areaSelected: any;

  niveles: number = 1;
  areasNodes: TreeNode[] = [];
  sedesNodes: TreeNode[] = [];
  displayDialog: boolean = false;
  lblBtn: string;
  sugerenciasList: TreeNode[];
  loading: boolean = false;
  propagateChange = (_: any) => { };

  constructor(private areaService: AreaService) { }

  // Interface implements

  ngOnInit() {
    this.loadAreas();
    this.areaSelected = this.name
    //console.log(this.name,"63 line");
  }


  writeValue(value: Area) {
    this.value = value;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }


  registerOnTouched() { }


  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.lblBtn = this._value == null ? "--Seleccionar--" : this._value.nombre;
    this.updateUI();
    this.propagateChange(this._value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  // Component methods
  loadAreas() {
    let allComplete = {
      organi: false,
      fisica: false
    };
    this.loading = true;
    // Consulta las areas de estructura organizacional
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterAreaQuery)
      .then(data => {
        let root: TreeNode = {
          label: '',
          selectable: false,
          expanded: false,
        };
        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.areasNodes.push(root);
        allComplete.organi = true;
        if (allComplete.organi == true && allComplete.fisica == true) {
          this.loading = false
        }
      })
      .catch(err => {
        this.loading = false
      });

    // Consulta las areas de estructura fisica
    let filterSedesQuery = new FilterQuery();
    filterSedesQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterSedesQuery)
      .then(data => {
        let root: TreeNode = {
          label: '',
          selectable: false,
          expanded: false,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.sedesNodes.push(root);
        allComplete.fisica = true;
        if (allComplete.organi == true && allComplete.fisica == true) {
          this.loading = false
        }
      })
      .catch(err => {
        this.loading = false
      });
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
        estructura: area.estructura,
        expanded: true,
        nodoPadre: nodoPadre,
        children: null,
        selected: true
      };
      n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : null);
      n.expanded = area.areaList != null && area.areaList.length > 0;
      nodes.push(n);
    }
    return nodes;
  }

  updateUI() {
    if (this.value != null) {
      let areaNode = this.searchNode(this.sedesNodes, this.value.id);
      if (areaNode == null) {
        areaNode = this.searchNode(this.areasNodes, this.value.id);
      }
      this.areaSelected = areaNode;
    } else {
      this.areaSelected = null;
    }
  }

  searchNode(nodes: any[], nodeId: string) {
    let nodeFound = null;
    for (let i = 0; i < nodes.length; i++) {
      let areaNode = nodes[i];
      if (areaNode.id == nodeId) {
        nodeFound = areaNode;
      } else {
        nodeFound = this.searchNode(areaNode.children, nodeId);
      }
      if (nodeFound != null) {
        return nodeFound;
      }
    }
    return nodeFound;
  }

  onAreaChange() {
    this.msgs = [];
    if (this.areaSelected == null) {
      this.msgs.push({ detail: 'Debe seleccionar un área', severity: 'warn' });
      this.value = null;
    } else {
        console.log(this.areaSelected);
      let area = new Area();
    //  area.id = this.areaSelected.id;
     // area.nombre = this.areaSelected.label;
   ///   area.descripcion = this.areaSelected.descripcion;
    //  this.value = area;
    //if( areaSelected.TreeNode.Nodes[0].Expanded == true ) { //some work here}  
      this.onAreaSelect.emit(this.areaSelected);
      this.closeDialog();
    }
  }

  showDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }


  buscarUbicacion(event: any) {
    this.sugerenciasList = [];
    this.busquedaRecursiva(event.query, this.areasNodes);
    this.busquedaRecursiva(event.query, this.sedesNodes);
  }

  busquedaRecursiva(cadena: string, arrayVar: TreeNode[]) {
    for (let i = 0; i < arrayVar.length; i++) {
      let nodo = arrayVar[i];
      if (nodo.children.length > 0) {
        this.busquedaRecursiva(cadena, nodo.children);
      }
      if (nodo.label.toLowerCase().indexOf(cadena.toLowerCase()) >= 0) {
        this.sugerenciasList.push(nodo);
      }
    }
  }

  onSelection(event: any) {
    
    let area = new Area();
    area.id = event.id;
    area.nombre = event.label;
    area.descripcion = event.descripcion;
    this.value = area;
    this.onAreaSelect.emit(area);
  }

  

}
