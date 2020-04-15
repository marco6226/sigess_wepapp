import { Component, OnInit } from '@angular/core';
import { CargoService } from 'app/modulos/empresa/services/cargo.service'
import { CompetenciaService } from 'app/modulos/empresa/services/competencia.service'
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { Empresa } from 'app/modulos/empresa/entities/empresa'

import { Message, SelectItem, TreeNode } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ConfirmationService } from 'primeng/primeng';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { competencias, perfil_educativo } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Competencia } from '../../entities/competencia';
import { Criteria } from '../../../core/entities/filter';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss'],
  providers: [CompetenciaService]
})
export class CargoComponent implements OnInit {

  msgs: Message[] = [];
  cargosList: Cargo[];
  cargoSelect: Cargo;
  visibleForm: boolean;
  visibleFormComp: boolean;
  form: FormGroup;
  empresaId = this.sesionService.getEmpresa().id;
  isUpdate: boolean;
  modeloCompt: TreeNode[];

  loading: boolean;
  totalRecords: number;
  // fields: string[] = [
  //   'id',
  //   'nombre',
  //   'descripcion',
  //   'ficha'
  // ];
  fields: string[] = null;

  funciones: any[];
  formacionList: any[];
  competenciasList: any[];
  perfilEducativoList: any[];

  competenciasOpts: Competencia[];
  perfilEducativoOpts: SelectItem[] = [{ label: '--Seleccione--', value: null }].concat(perfil_educativo);

  constructor(
    private competenciaService: CompetenciaService,
    private cargoService: CargoService,
    private fb: FormBuilder,
    private sesionService: SesionService,
    private confirmationService: ConfirmationService
  ) {
    this.form = fb.group({
      'id': [null],
      'nombre': ['', Validators.required],
      'valorMinimo': null,
      'unidadMinima': null,
      'valorDeseable': null,
      'unidadDeseable': null,
      'descripcion': [''],
      'funciones': [null]
    });
  }

  ngOnInit() {
    let fq = new FilterQuery();
    fq.filterList = [{ field: 'competencia', criteria: Criteria.IS_NULL }];
    this.competenciaService.findByFilter(fq).then(
      resp => {
        this.competenciasOpts = resp['data'];
        this.construirArbolCompt(this.competenciasOpts);
      }
    );
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

    this.cargoService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.cargosList = [];
        (<any[]>resp['data']).forEach(dto => this.cargosList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  showAddForm() {
    this.visibleForm = true;
    this.isUpdate = false;

    this.form.reset();
    this.funciones = [];
    this.perfilEducativoList = [];
    this.formacionList = [];
  }

  showUpdateForm() {
    if (this.cargoSelect != null) {

      this.form.reset();
      this.funciones = [];
      this.perfilEducativoList = [];
      this.formacionList = [];

      this.visibleForm = true;
      this.isUpdate = true;


      let ficha = JSON.parse(this.cargoSelect.ficha);
      if (ficha != null) {
        this.formacionList = ficha.formacion;
        this.perfilEducativoList = ficha.perfilEducativo;
        this.funciones = ficha.funciones;
      }
      this.form.patchValue({
        id: this.cargoSelect.id,
        nombre: this.cargoSelect.nombre,
        descripcion: this.cargoSelect.descripcion,
        valorMinimo: ficha == null ? null : ficha.experienciaLaboral.valorMinimo,
        unidadMinima: ficha == null ? null : ficha.experienciaLaboral.unidadMinima,
        valorDeseable: ficha == null ? null : ficha.experienciaLaboral.valorDeseable,
        unidadDeseable: ficha == null ? null : ficha.experienciaLaboral.unidadDeseable,
      });

      this.competenciasList = [];
      this.cargoSelect.competenciasList.forEach(comp => {
        this.competenciasList.push({ data: comp });
      });



    } else {
      this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para modificar" });
    }
  }

  onCargoDelete() {
    if (this.cargoSelect != null) {
      this.confirmationService.confirm({
        header: 'Eliminar cargo "' + this.cargoSelect.nombre + '"',
        message: '¿Esta seguro de borrar este cargo?',
        accept: () => this.deleteCargo()
      });
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para eliminarlo" });
    }
  }

  deleteCargo() {
    this.cargoService.delete(this.cargoSelect.id).then(
      data => {
        this.cargoSelect = null;
        let cargoEliminado = <Cargo>data;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: "Cargo eliminado", detail: "Ha sido eliminado el cargo " + cargoEliminado.nombre });
        for (let i = 0; i < this.cargosList.length; i++) {
          if (this.cargosList[i].id == cargoEliminado.id) {
            this.cargosList.splice(i, 1);
            this.cargosList = this.cargosList.slice();
            break;
          }
        }
      }
    );
  }

  onSubmit() {
    let cargo = new Cargo();
    cargo.id = this.form.value.id;
    cargo.nombre = this.form.value.nombre;
    cargo.descripcion = this.form.value.descripcion;
    cargo.empresa = new Empresa();
    cargo.empresa.id = this.empresaId;
    cargo.ficha = JSON.stringify({
      funciones: this.funciones,
      perfilEducativo: this.perfilEducativoList,
      formacion: this.formacionList,
      experienciaLaboral: {
        valorMinimo: this.form.value.valorMinimo,
        unidadMinima: this.form.value.unidadMinima,
        valorDeseable: this.form.value.valorDeseable,
        unidadDeseable: this.form.value.unidadDeseable,
      }
    });

    if (this.competenciasList != null) {
      cargo.competenciasList = [];
      this.competenciasList.forEach(comp => {
        cargo.competenciasList.push(comp.data);
      });
    }

    if (this.isUpdate) {
      this.cargoService.update(cargo).then(
        data => this.manageUpdateResponse(<Cargo>data)
      );
    } else {
      this.cargoService.create(cargo).then(
        data => this.manageCreateResponse(<Cargo>data)
      );
    }
  }

  manageUpdateResponse(cargo: Cargo) {
    for (let i = 0; i < this.cargosList.length; i++) {
      if (this.cargosList[i].id == cargo.id) {
        this.cargosList[i] = cargo;
        break;
      }
    }
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: "Cargo actualizado", detail: "Se ha actualizado el cargo " + cargo.nombre });
    this.closeForm();
  }

  manageCreateResponse(cargo: Cargo) {
    if (this.cargosList == null) {
      this.cargosList = [];
    }
    this.cargosList.push(cargo);
    this.cargosList = this.cargosList.slice();
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: "Nuevo cargo creado", detail: "Se ha creado el cargo " + cargo.nombre });
    this.closeForm();
  }

  closeForm() {
    this.visibleForm = false;
  }

  /* Metodos para formulario de cargo*/

  addFuncion() {
    if (this.funciones == null) {
      this.funciones = [{ value: '' }];
    } else {
      this.funciones.push({ value: '' });
    }
  }
  removerFuncion(index: number) {
    this.funciones.splice(index, 1);
  }


  addFormacion() {
    if (this.formacionList == null) {
      this.formacionList = [{ minima: '', deseable: '' }];
    } else {
      this.formacionList.push({ minima: '', deseable: '' });
    }
  }
  removerFormacion(index: number) {
    this.formacionList.splice(index, 1);
  }


  addCompetencia() {
    if (this.competenciasList == null) {
      this.competenciasList = [{ value: '' }];
    } else {
      this.competenciasList.push({ value: '' });
    }
  }
  removerCompetencia(index: number) {
    this.competenciasList.splice(index, 1);
  }

  addPerfilEdu() {
    if (this.perfilEducativoList == null) {
      this.perfilEducativoList = [{ minima: '', deseable: '' }];
    } else {
      this.perfilEducativoList.push({ minima: '', deseable: '' });
    }
  }
  removerPerfilEdu(index: number) {
    this.perfilEducativoList.splice(index, 1);
  }

  construirArbolCompt(list: Competencia[]) {
    this.modeloCompt = [];
    this.recursiveBuildCompt(list, this.modeloCompt);
    this.modeloCompt = this.modeloCompt.slice();
  }

  recursiveBuildCompt(list: Competencia[], nodes: TreeNode[]) {
    list.forEach(comp => {
      let node: TreeNode = { data: comp };
      if (comp.competenciaList != null && comp.competenciaList.length > 0) {
        node.children = [];
        this.recursiveBuildCompt(comp.competenciaList, node.children);
      }
      nodes.push(node);
    });
  }
}
