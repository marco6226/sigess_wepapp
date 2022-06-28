import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TipoPeligro } from 'app/modulos/ipr/entities/tipo-peligro'
import { Peligro } from 'app/modulos/ipr/entities/peligro'
import { PeligroIpecr } from 'app/modulos/ipr/entities/peligro-ipecr'
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'
import { Fuente } from 'app/modulos/ipr/entities/fuente'
import { Control } from 'app/modulos/ipr/entities/control'
import { Efecto } from 'app/modulos/ipr/entities/efecto'
import { SistemaNivelRiesgo } from 'app/modulos/core/entities/sistema-nivel-riesgo'
import { SelectItem, ConfirmationService } from 'primeng/primeng'
import { FuenteService } from 'app/modulos/ipr/services/fuente.service'
import { EfectoService } from 'app/modulos/ipr/services/efecto.service'
import { ControlService } from 'app/modulos/ipr/services/control.service'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { TipoPeligroService } from 'app/modulos/ipr/services/tipo-peligro.service'
import { SistemaNivelRiesgoService } from 'app/modulos/core/services/sistema-nivel-riesgo.service'
import { PeligroService } from 'app/modulos/ipr/services/peligro.service'
import { PeligroIpecrService } from 'app/modulos/ipr/services/peligro-ipecr.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 's-formularioPeligro',
  templateUrl: './formulario-peligro.component.html',
  styleUrls: ['./formulario-peligro.component.scss'],
  providers: [TipoPeligroService, PeligroService, FuenteService, EfectoService, ControlService, SistemaNivelRiesgoService, PeligroIpecrService]
})
export class FormularioPeligroComponent implements OnInit {

  @Input("readOnly") readOnly: boolean;
  @Input("ipecrId") ipecrId: string;
  @Output("onSave") onSave = new EventEmitter<any>();
  @Output("onDelete") onDelete = new EventEmitter<any>();

  adicionar: boolean;
  visibleDlg: boolean;
  nivelDeficienciaItemList: SelectItem[] = [
    { label: '--Seleccione--', value: null },
    { label: 'Muy Alto', value: 10 },
    { label: 'Alto', value: 6 },
    { label: 'Medio', value: 2 },
    { label: 'Bajo', value: 1 },
  ];
  nivelExposicionItemList: SelectItem[] = [
    { label: '--Seleccione--', value: null },
    { label: 'Continua', value: 4 },
    { label: 'Frecuente', value: 3 },
    { label: 'Ocasional', value: 2 },
    { label: 'Esporádica', value: 1 },
  ];
  consecuenciaItemList: SelectItem[];
  controlItemList: SelectItem[];
  efectoItemList: SelectItem[];
  fuenteItemList: SelectItem[];
  peligroItemList: SelectItem[];
  tipoPeligroItemList: SelectItem[];

  sistemaNivelRiesgo: SistemaNivelRiesgo;
  peligroIpecrSelect: PeligroIpecr;
  peligroIpecrList: PeligroIpecr[] = [];
  form: FormGroup;
  rowGroupMetadata: any;
  visibleDlgParam: boolean;

  constructor(
    private confirmationService: ConfirmationService,
    private peligroIpecrService: PeligroIpecrService,
    private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private fb: FormBuilder,
    private fuenteService: FuenteService,
    private efectoService: EfectoService,
    private controlService: ControlService,
  ) {
    this.form = fb.group({
      id: [null],
      proceso: [null, Validators.required],
      zonaLugar: [null, Validators.required],
      tarea: [null, Validators.required],
      actividad: [null, Validators.required],
      peorConsecuencia: [null, Validators.required],
      rutinario: [null, Validators.required],
      nivelDeficiencia: [null, Validators.required],
      nivelExposicion: [null, Validators.required],
      tipoPeligro: [null, Validators.required],
      peligro: [null, Validators.required],
      fuenteList: [null, Validators.required],
      efectoList: [null, Validators.required],
      controlList: [null, Validators.required],
      necesidadControlList: null,
      numeroExpuestos: [null, Validators.required],
      probabilidad: null,
      consecuencia: null,
    });
  }

  ngOnInit() {
    if (this.ipecrId != null) {
      let filterQuery = new FilterQuery();
      filterQuery.sortField = 'proceso';
      filterQuery.sortOrder = -1;
      filterQuery.filterList = [];
      let filter = new Filter();
      filter.criteria = Criteria.EQUALS;
      filter.field = "ipecr.id";
      filter.value1 = this.ipecrId;
      filterQuery.filterList.push(filter);
      this.peligroIpecrService.findByFilter(filterQuery).then(
        data => {
          this.peligroIpecrList = <PeligroIpecr[]>data;
          this.updateRowGroupMetaData();
        }
      );
    }

    this.sistemaNivelRiesgoService.findDefault().then(
      data => {
        this.sistemaNivelRiesgo = (<SistemaNivelRiesgo>data);
        this.consecuenciaItemList = [{ label: '--seleccione--', value: null }];
        this.sistemaNivelRiesgo.consecuenciaList.forEach(
          consec => this.consecuenciaItemList.push({ label: consec.nombre, value: consec })
        )
      }
    );
    this.cargarTiposPeligro();
  }

  cargarTiposPeligro() {
    this.tipoPeligroService.findAll().then(
      resp => {

        this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
        (<TipoPeligro[]>resp['data']).forEach(
          tp => this.tipoPeligroItemList.push({ label: tp.nombre, value: tp })
        )
        if (this.form.value.tipoPeligro != null) {
          for (let i = 0; i < this.tipoPeligroItemList.length; i++) {
            let tp = this.tipoPeligroItemList[i].value;
            if (tp != null && tp.id == this.form.value.tipoPeligro.id) {
              this.form.patchValue({
                tipoPeligro: this.tipoPeligroItemList[i].value
              });
              break;
            }
          }
        }

      }
    );
  }

  onSelect(selection: PeligroIpecr, event: any) {
    if (event.ctrlKey) {
      this.peligroIpecrSelect = null;
    } else {
      this.peligroIpecrSelect = selection;
    }
  }

  abrirDlgAdicionarPeligro() {
    this.visibleDlg = true;
    this.adicionar = true;
    this.patchForm();
  }

  guardarActualizarPeligro() {
    let peligroIpecr = new PeligroIpecr();
    peligroIpecr.ipecr = new Ipecr();
    peligroIpecr.ipecr.id = this.ipecrId;
    peligroIpecr.id = this.form.value.id;
    peligroIpecr.peligro = this.form.value.peligro;
    peligroIpecr.peligro.tipoPeligro = this.form.value.tipoPeligro;
    peligroIpecr.fuenteList = this.form.value.fuenteList;
    peligroIpecr.efectoList = this.form.value.efectoList;
    peligroIpecr.controlList = this.form.value.controlList;
    peligroIpecr.necesidadControlList = this.form.value.necesidadControlList;
    peligroIpecr.numeroExpuestos = this.form.value.numeroExpuestos;
    peligroIpecr.probabilidad = this.form.value.probabilidad;
    peligroIpecr.consecuencia = this.form.value.consecuencia;
    peligroIpecr.proceso = this.form.value.proceso;
    peligroIpecr.zonaLugar = this.form.value.zonaLugar;
    peligroIpecr.tarea = this.form.value.tarea;
    peligroIpecr.actividad = this.form.value.actividad;
    peligroIpecr.rutinario = this.form.value.rutinario;
    peligroIpecr.nivelDeficiencia = this.form.value.nivelDeficiencia;
    peligroIpecr.nivelExposicion = this.form.value.nivelExposicion;
    peligroIpecr.peorConsecuencia = this.form.value.peorConsecuencia;
    this.determinarNivelRiesgo(peligroIpecr);

    if (peligroIpecr.id == null) {
      this.peligroIpecrService.create(peligroIpecr).then(
        data => {
          peligroIpecr.id = (<PeligroIpecr>data).id;
          let inserto = false;
          for (let i = this.peligroIpecrList.length - 1; i >= 0; i--) {
            if (this.peligroIpecrList[i].proceso === peligroIpecr.proceso) {
              this.peligroIpecrList.splice(i + 1, 0, peligroIpecr);
              inserto = true;
              break;
            }
          }
          if (!inserto) {
            this.peligroIpecrList.push(peligroIpecr);
          }
          this.peligroIpecrList = this.peligroIpecrList.slice();
          this.visibleDlg = false;
          this.onSave.emit({ valor: peligroIpecr, accion: 'POST' });
          this.updateRowGroupMetaData();
        }
      );
    } else {
      this.peligroIpecrService.update(peligroIpecr).then(
        data => {
          for (let i = 0; i < this.peligroIpecrList.length; i++) {
            if (this.peligroIpecrList[i].id == peligroIpecr.id) {
              this.peligroIpecrList[i] = <PeligroIpecr>data;
              break;
            }
          }
          this.updateRowGroupMetaData();
          this.peligroIpecrList = this.peligroIpecrList.slice();
          this.visibleDlg = false;
          this.onSave.emit({ valor: peligroIpecr, accion: 'PUT' });
        }
      );
    }

  }

  determinarNivelRiesgo(peligroIpecr: PeligroIpecr) {
    let valorProbabilidad = peligroIpecr.nivelExposicion * peligroIpecr.nivelDeficiencia;
    peligroIpecr.valorProbabilidad = valorProbabilidad;
    for (let i = 0; i < this.sistemaNivelRiesgo.probabilidadList.length; i++) {
      if (this.sistemaNivelRiesgo.probabilidadList[i].valorMinimo <= valorProbabilidad && valorProbabilidad <= this.sistemaNivelRiesgo.probabilidadList[i].valorMaximo) {
        peligroIpecr.probabilidad = this.sistemaNivelRiesgo.probabilidadList[i];
        break;
      }
    }

    let valorRiesgo = peligroIpecr.consecuencia.valor * peligroIpecr.valorProbabilidad;
    peligroIpecr.valorRiesgo = valorRiesgo;
    for (let i = 0; i < this.sistemaNivelRiesgo.nivelRiesgoList.length; i++) {
      if (this.sistemaNivelRiesgo.nivelRiesgoList[i].valorMinimo <= valorRiesgo && valorRiesgo <= this.sistemaNivelRiesgo.nivelRiesgoList[i].valorMaximo) {
        peligroIpecr.nivelRiesgo = this.sistemaNivelRiesgo.nivelRiesgoList[i];
        break;
      }
    }
  }

  onTipoPeligroSelect(event: any) {
    this.actualizarOpcionesPeligro(event.value.id);
  }

  actualizarOpcionesPeligro(tipoPeligroId: string) {
    this.peligroItemList = [];
    this.controlItemList = [];
    this.efectoItemList = [];
    this.fuenteItemList = [];
    this.form.patchValue({
      'peligro': null,
      'fuenteList': null,
      'efectoList': null,
      'controlList': null,
      'necesidadControlList': null,
    });
    if (tipoPeligroId == null) {
      return;
    }
    this.peligroItemList.push({ label: '--seleccione--', value: null });
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    let filter = new Filter();
    filter.criteria = Criteria.EQUALS;
    filter.field = "tipoPeligro.id";
    filter.value1 = tipoPeligroId;
    filterQuery.filterList.push(filter);

    return new Promise(
      resolve => {
        this.peligroService.findByFilter(filterQuery).then(
          data => (<Peligro[]>data).forEach(
            tp => this.peligroItemList.push({ label: tp.nombre, value: tp })
          )
        ).then(
          data => resolve(this.peligroItemList)
        );
      }
    );
  }


  onPeligroChange(event: any) {
    this.actualizarOpcionesFCE(event.value.id);
  }

  actualizarOpcionesFCE(peligroId: string) {
    this.fuenteItemList = [];
    this.efectoItemList = [];
    this.controlItemList = [];
    this.form.patchValue({
      'fuenteList': null,
      'efectoList': null,
      'controlList': null,
      'necesidadControlList': null,
    });
    if (peligroId == null) {
      return;
    }

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    let filter = new Filter();
    filter.criteria = Criteria.EQUALS;
    filter.field = "peligro.id";
    filter.value1 = peligroId;
    filterQuery.filterList.push(filter);

    return new Promise<void>(
      resolve => {

        this.fuenteService.findByFilter(filterQuery).then(
          data => (<Fuente[]>data).forEach(
            fuente => this.fuenteItemList.push({ label: fuente.nombre, value: fuente })
          )
        ).then(
          data => {
            if (this.fuenteItemList.length > 0 && this.efectoItemList.length > 0 && this.controlItemList.length > 0) {
              resolve();
            }
          }
        );

        this.efectoService.findByFilter(filterQuery).then(
          data => (<Efecto[]>data).forEach(
            efecto => this.efectoItemList.push({ label: efecto.nombre, value: efecto })
          )
        ).then(
          data => {
            if (this.fuenteItemList.length > 0 && this.efectoItemList.length > 0 && this.controlItemList.length > 0) {
              resolve();
            }
          }
        );

        this.controlService.findByFilter(filterQuery).then(
          data => (<Control[]>data).forEach(
            control => this.controlItemList.push({ label: control.nombre, value: control })
          )
        ).then(
          data => {
            if (this.fuenteItemList.length > 0 && this.efectoItemList.length > 0 && this.controlItemList.length > 0) {
              resolve();
            }
          }
        );
      }
    );


  }


  abrirDlgModificarPeligro() {
    this.visibleDlg = true;
    this.adicionar = false;
    this.patchForm();
  }

  patchForm() {
    if (this.peligroIpecrSelect == null) {
      this.form.reset();
    } else {
      this.actualizarOpcionesPeligro(this.peligroIpecrSelect.peligro.tipoPeligro.id).then(
        peligros => this.actualizarOpcionesFCE(this.peligroIpecrSelect.peligro.id).then(
          data =>
            this.form.patchValue({
              id: this.adicionar ? null : this.peligroIpecrSelect.id,
              proceso: this.peligroIpecrSelect.proceso,
              zonaLugar: this.peligroIpecrSelect.zonaLugar,
              tarea: this.peligroIpecrSelect.tarea,
              actividad: this.peligroIpecrSelect.actividad,
              rutinario: this.peligroIpecrSelect.rutinario,
              nivelDeficiencia: this.peligroIpecrSelect.nivelDeficiencia,
              nivelExposicion: this.peligroIpecrSelect.nivelExposicion,
              tipoPeligro: this.buscarItem(this.peligroIpecrSelect.peligro.tipoPeligro, this.tipoPeligroItemList),
              peligro: this.buscarItem(this.peligroIpecrSelect.peligro, this.peligroItemList),
              fuenteList: this.buscarItem(this.peligroIpecrSelect.fuenteList, this.fuenteItemList),
              efectoList: this.buscarItem(this.peligroIpecrSelect.efectoList, this.efectoItemList),
              controlList: this.buscarItem(this.peligroIpecrSelect.controlList, this.controlItemList),
              necesidadControlList: this.buscarItem(this.peligroIpecrSelect.necesidadControlList, this.controlItemList),
              numeroExpuestos: this.peligroIpecrSelect.numeroExpuestos,
              probabilidad: this.peligroIpecrSelect.probabilidad,
              consecuencia: this.peligroIpecrSelect.consecuencia,
              peorConsecuencia: this.peligroIpecrSelect.peorConsecuencia
            })
        )
      );
    }
  }

  buscarItem(obj: any, lista: Array<SelectItem>) {
    if (lista == null || obj == null)
      return null;

    if (obj instanceof Array) {
      let itemsList = <SelectItem[]>[];
      for (let i = 0; i < lista.length; i++) {
        for (let j = 0; j < (<any[]>obj).length; j++) {
          if (lista[i].value != null && lista[i].value.id == (<any[]>obj)[j].id) {
            itemsList.push(lista[i].value);
          }
        }
      }
      return itemsList;
    } else {
      for (let i = 0; i < lista.length; i++) {
        if (lista[i].value != null && obj.id == lista[i].value.id) {
          return lista[i].value;
        }
      }
    }
    return null;
  }

  confirmEliminarPeligro() {
    this.confirmationService.confirm({
      header: 'Eliminar peligro ' + this.peligroIpecrSelect.peligro.nombre,
      message: "¿Esta seguro de realizar esta acción?",
      accept: () => {
        this.eliminarPeligro();
      }
    });
  }

  eliminarPeligro() {
    this.peligroIpecrService.delete(this.peligroIpecrSelect.id).then(
      data => {
        for (let i = 0; i < this.peligroIpecrList.length; i++) {
          if (this.peligroIpecrList[i].id == this.peligroIpecrSelect.id) {
            this.peligroIpecrList.splice(i, 1);
            break;
          }
        }
        this.updateRowGroupMetaData();
        this.peligroIpecrList = this.peligroIpecrList.slice();
        this.onDelete.emit(this.peligroIpecrSelect);
      }
    ).then(resp => this.peligroIpecrSelect = null);
  }


  /* **************** */
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.peligroIpecrList) {
      for (let i = 0; i < this.peligroIpecrList.length; i++) {
        let rowData = this.peligroIpecrList[i];
        let proceso = rowData.proceso;
        if (i == 0) {
          this.rowGroupMetadata[proceso] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.peligroIpecrList[i - 1];
          let previousRowGroup = previousRowData.proceso;
          if (proceso === previousRowGroup)
            this.rowGroupMetadata[proceso].size++;
          else
            this.rowGroupMetadata[proceso] = { index: i, size: 1 };
        }
      }
    }
  }


  abrirParametrizacion() {
    this.visibleDlgParam = true;
  }

  actualizarPeligros() {
    let peligro = new Peligro();
    peligro.id = this.form.value.peligro.id;
    peligro.tipoPeligro = new TipoPeligro();
    peligro.tipoPeligro.id = this.form.value.peligro.tipoPeligro.id;
    this.peligroIpecrSelect = new PeligroIpecr();
    this.peligroIpecrSelect = <PeligroIpecr>{
      id: this.form.value.id,
      proceso: this.form.value.proceso,
      zonaLugar: this.form.value.zonaLugar,
      tarea: this.form.value.tarea,
      actividad: this.form.value.actividad,
      rutinario: this.form.value.rutinario,
      nivelDeficiencia: this.form.value.nivelDeficiencia,
      nivelExposicion: this.form.value.nivelExposicion,
      peligro: peligro,
      fuenteList: this.form.value.fuenteList == null ? null : this.form.value.fuenteList,
      efectoList: this.form.value.efectoList == null ? null : this.form.value.efectoList,
      controlList: this.form.value.controlList == null ? null : this.form.value.controlList,
      necesidadControlList: this.form.value.necesidadControlList == null ? null : this.form.value.necesidadControlList,
      numeroExpuestos: this.form.value.numeroExpuestos,
      probabilidad: this.form.value.probabilidad,
      consecuencia: this.form.value.consecuencia,
      peorConsecuencia:this.form.value.peorConsecuencia
    };
    this.patchForm();
    //this.cargarTiposPeligro();
  }

}
