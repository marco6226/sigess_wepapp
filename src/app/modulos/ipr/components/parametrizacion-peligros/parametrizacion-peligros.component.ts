import { Component, OnInit } from '@angular/core';
import { TipoPeligro } from 'app/modulos/ipr/entities/tipo-peligro'
import { Peligro } from 'app/modulos/ipr/entities/peligro'
import { Efecto } from 'app/modulos/ipr/entities/efecto'
import { Control } from 'app/modulos/ipr/entities/control'
import { Fuente } from 'app/modulos/ipr/entities/fuente'
import { TipoControl } from 'app/modulos/ipr/entities/tipo-control'
import { Message, SelectItem } from 'primeng/primeng'

import { TipoPeligroService } from 'app/modulos/ipr/services/tipo-peligro.service'
import { PeligroService } from 'app/modulos/ipr/services/peligro.service'
import { FuenteService } from 'app/modulos/ipr/services/fuente.service'
import { EfectoService } from 'app/modulos/ipr/services/efecto.service'
import { ControlService } from 'app/modulos/ipr/services/control.service'
import { TipoControlService } from 'app/modulos/ipr/services/tipo-control.service'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 's-parametrizacionPeligros',
  templateUrl: './parametrizacion-peligros.component.html',
  styleUrls: ['./parametrizacion-peligros.component.scss'],
  providers: [TipoPeligroService, PeligroService, FuenteService, EfectoService, ControlService, TipoControlService]
})
export class ParametrizacionPeligrosComponent implements OnInit {

  msgs: Message[];
  tipoPeligroSelect: TipoPeligro;
  nombreTipoPeligro: string;
  tipoPeligroList: TipoPeligro[] = [];

  peligroSelect: Peligro;
  nombrePeligro: string;
  peligroList: Peligro[] = [];

  efectoSelect: Efecto;
  nombreEfecto: string;
  efectoList: Efecto[] = [];

  tipoControlSelect: TipoControl;
  nombreTipoControl: string;
  tipoControlList: TipoControl[] = [];

  controlSelect: Control;
  nombreControl: string;
  controlList: Control[] = [];

  fuenteSelect: Fuente;
  nombreFuente: string;
  fuenteList: Fuente[] = [];

  tipoControlItemsList: SelectItem[] = [];
  tipoControlItemSelect: TipoControl;

  visibleDlgTipoControl: boolean;

  constructor(
    private tipoControlService: TipoControlService,
    private controlService: ControlService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private fuenteService: FuenteService,
    private efectoService: EfectoService,
  ) { }

  ngOnInit() {
    this.tipoControlItemsList.push({ label: '--Tipo de control--', value: null });
    this.tipoControlService.findAll().then(
      resp => {
        this.tipoControlList = (<TipoControl[]>resp['data']);
        this.cargarItemsTipoControl();
      }
    );
    this.tipoPeligroService.findAll().then(
      resp => this.tipoPeligroList = <TipoPeligro[]>resp['data']
    );
  }

  cargarItemsTipoControl() {
    this.tipoControlItemsList = [];
    this.tipoControlItemsList.push({ label: '--Tipo de control--', value: null });
    this.tipoControlList.forEach(tc => {
      this.tipoControlItemsList.push({ label: tc.nombre, value: tc });
    });
  }

  // ********* Métodos de tipos de peligro ********************

  adicionarTipoPeligro() {
    let tp = new TipoPeligro();
    tp.nombre = this.nombreTipoPeligro;
    this.tipoPeligroService.create(tp).then(
      data => {
        this.tipoPeligroList.push(<TipoPeligro>data);
        this.tipoPeligroList = this.tipoPeligroList.slice();
        this.nombreTipoPeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de peligro adicionado', detail: 'Se ha adicionado correctamente el tipo de peligro "' + tp.nombre + '"' });
      }
    );
  }

  modificarTipoPeligro() {
    this.tipoPeligroSelect.nombre = this.nombreTipoPeligro;
    this.tipoPeligroService.update(this.tipoPeligroSelect).then(
      data => {
        this.nombreTipoPeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de peligro modificado', detail: 'Se ha modificado correctamente el tipo de peligro "' + this.tipoPeligroSelect.nombre + '"' });
      }
    );
  }

  eliminarTipoPeligro() {
    this.tipoPeligroService.delete(this.tipoPeligroSelect.id).then(
      data => {
        for (let i = 0; i < this.tipoPeligroList.length; i++) {
          if (this.tipoPeligroList[i].id == this.tipoPeligroSelect.id) {
            this.tipoPeligroList.splice(i, 1);
            break;
          }
        }
        this.tipoPeligroList = this.tipoPeligroList.slice();
        this.nombreTipoPeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de peligro eliminado', detail: 'Se ha eliminado correctamente el tipo de peligro "' + this.tipoPeligroSelect.nombre + '"' });
        this.tipoPeligroSelect = null;
      }
    );
  }

  onSelectTipoPeligro(event) {
    this.nombreTipoPeligro = event.data.nombre;
    this.peligroSelect = null;
    this.nombrePeligro = null;

    this.efectoList = null;
    this.efectoSelect = null;
    this.nombreEfecto = null;
    this.fuenteList = null;
    this.fuenteSelect = null;
    this.nombreFuente = null;
    this.controlList = null;
    this.controlSelect = null;
    this.nombreControl = null;
    this.tipoControlItemSelect = null;

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    let filter = new Filter();
    filter.criteria = Criteria.EQUALS;
    filter.field = "tipoPeligro.id";
    filter.value1 = this.tipoPeligroSelect.id;
    filterQuery.filterList.push(filter);
    this.peligroService.findByFilter(filterQuery).then(
      data => this.peligroList = <Peligro[]>data
    );
  }


  // ********* Métodos de peligro ********************
  comprobarSeleccionPeligro() {
    if (this.peligroSelect == null) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Seleccione un peligro', detail: 'Debe seleccionar el peligro' });
      return false;
    }
    return true;
  }

  adicionarPeligro() {
    let p = new Peligro();
    p.nombre = this.nombrePeligro;
    p.tipoPeligro = this.tipoPeligroSelect;

    this.peligroService.create(p).then(
      data => {
        this.peligroList.push(<Peligro>data);
        this.peligroList = this.peligroList.slice();
        this.nombrePeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Peligro adicionado', detail: 'Se ha adicionado correctamente el peligro "' + p.nombre + '"' });
      }
    );
  }

  modificarPeligro() {
    this.peligroSelect.nombre = this.nombrePeligro;
    this.peligroService.update(this.peligroSelect).then(
      data => {
        this.nombrePeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Peligro modificado', detail: 'Se ha modificado correctamente el peligro "' + this.peligroSelect.nombre + '"' });
      }
    );
  }

  eliminarPeligro() {
    this.peligroService.delete(this.peligroSelect.id).then(
      data => {
        for (let i = 0; i < this.peligroList.length; i++) {
          if (this.peligroList[i].id == this.peligroSelect.id) {
            this.peligroList.splice(i, 1);
            break;
          }
        }
        this.peligroList = this.peligroList.slice();
        this.nombrePeligro = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Peligro eliminado', detail: 'Se ha eliminado correctamente el peligro "' + this.peligroSelect.nombre + '"' });
        this.peligroSelect = null;
      }
    );
  }

  onSelectPeligro(event) {
    this.nombrePeligro = event.data.nombre;

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    let filter = new Filter();
    filter.criteria = Criteria.EQUALS;
    filter.field = "peligro.id";
    filter.value1 = this.peligroSelect.id;
    filterQuery.filterList.push(filter);

    this.fuenteService.findByFilter(filterQuery).then(
      data => this.fuenteList = <Fuente[]>data
    );

    this.efectoService.findByFilter(filterQuery).then(
      data => this.efectoList = <Efecto[]>data
    );

    this.controlService.findByFilter(filterQuery).then(
      data => this.controlList = <Control[]>data
    );
  }

  // ********* Métodos de efecto ********************
  adicionarEfecto() {
    let efecto = new Efecto();
    efecto.nombre = this.nombreEfecto;
    efecto.peligro = this.peligroSelect;

    this.efectoService.create(efecto).then(
      data => {
        this.efectoList.push(<Efecto>data);
        this.efectoList = this.efectoList.slice();
        this.nombreEfecto = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Efecto adicionado', detail: 'Se ha adicionado correctamente el efecto "' + efecto.nombre + '"' });
      }
    );
  }

  modificarEfecto() {
    this.efectoSelect.nombre = this.nombreEfecto;
    this.efectoService.update(this.efectoSelect).then(
      data => {
        this.nombreEfecto = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Efecto modificado', detail: 'Se ha modificado correctamente el efecto "' + this.efectoSelect.nombre + '"' });
      }
    );
  }

  eliminarEfecto() {
    this.efectoService.delete(this.efectoSelect.id).then(
      data => {
        for (let i = 0; i < this.efectoList.length; i++) {
          if (this.efectoList[i].id == this.efectoSelect.id) {
            this.efectoList.splice(i, 1);
            break;
          }
        }
        this.efectoList = this.efectoList.slice();
        this.nombreEfecto = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Efecto eliminado', detail: 'Se ha eliminado correctamente el efecto "' + this.efectoSelect.nombre + '"' });
        this.efectoSelect = null;
      }
    );
  }
  onSelectEfecto(event) {
    this.nombreEfecto = event.data.nombre;
  }


  // ********* Métodos de control ********************

  adicionarControl() {
    let c = new Control();
    c.nombre = this.nombreControl;
    c.peligro = this.peligroSelect;
    c.tipoControl = this.tipoControlItemSelect;

    this.controlService.create(c).then(
      data => {
        this.controlList.push(<Control>data);
        this.controlList = this.controlList.slice();
        this.nombreControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Control adicionado', detail: 'Se ha adicionado correctamente el control "' + c.nombre + '"' });
      }
    );
  }

  modificarControl() {
    this.controlSelect.nombre = this.nombreControl;
    this.controlSelect.tipoControl = this.tipoControlItemSelect;
    this.controlService.update(this.controlSelect).then(
      data => {
        this.nombreControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Control modificado', detail: 'Se ha modificado correctamente el control "' + this.controlSelect.nombre + '"' });
      }
    );
  }

  eliminarControl() {
    this.controlService.delete(this.controlSelect.id).then(
      data => {
        for (let i = 0; i < this.controlList.length; i++) {
          if (this.controlList[i].id == this.controlSelect.id) {
            this.controlList.splice(i, 1);
            break;
          }
        }
        this.controlList = this.controlList.slice();
        this.nombreControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Control eliminado', detail: 'Se ha eliminado correctamente el control "' + this.controlSelect.nombre + '"' });
        this.controlSelect = null;
      }
    );
  }

  onSelectControl(event) {
    this.nombreControl = event.data.nombre;
    this.tipoControlItemSelect = event.data.tipoControl;
  }

  // ********* Métodos de fuente ********************
  adicionarFuente() {
    let fuente = new Fuente();
    fuente.nombre = this.nombreFuente;
    fuente.peligro = this.peligroSelect;

    this.fuenteService.create(fuente).then(
      data => {
        this.fuenteList.push(<Fuente>data);
        this.fuenteList = this.fuenteList.slice();
        this.nombreFuente = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Fuente adicionada', detail: 'Se ha adicionado correctamente la fuente "' + fuente.nombre + '"' });
      }
    );
  }

  modificarFuente() {
    this.fuenteSelect.nombre = this.nombreFuente;
    this.fuenteService.update(this.fuenteSelect).then(
      data => {
        this.nombreFuente = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Fuente modificada', detail: 'Se ha modificado correctamente la fuente "' + this.fuenteSelect.nombre + '"' });
      }
    );
  }

  eliminarFuente() {
    this.fuenteService.delete(this.fuenteSelect.id).then(
      data => {
        for (let i = 0; i < this.fuenteList.length; i++) {
          if (this.fuenteList[i].id == this.fuenteSelect.id) {
            this.fuenteList.splice(i, 1);
            break;
          }
        }
        this.fuenteList = this.fuenteList.slice();
        this.nombreFuente = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Fuente eliminada', detail: 'Se ha eliminado correctamente la fuente "' + this.fuenteSelect.nombre + '"' });
        this.fuenteSelect = null;
      }
    );
  }

  onSelectFuente(event) {
    this.nombreFuente = event.data.nombre;
  }

  /* **************** Métods tipo control *************** */

  showDlgTipoControl() {
    this.visibleDlgTipoControl = true;
  }
  adicionarTipoControl() {
    let tc = new TipoControl();
    tc.nombre = this.nombreTipoControl;
    this.tipoControlService.create(tc).then(
      data => {
        this.tipoControlList.push(<TipoControl>data);
        this.tipoControlList = this.tipoControlList.slice();
        this.nombreTipoControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de control adicionado', detail: 'Se ha adicionado correctamente el tipo de control "' + tc.nombre + '"' });
        this.cargarItemsTipoControl();
      }
    );
  }

  modificarTipoControl() {
    this.tipoControlSelect.nombre = this.nombreTipoControl;
    this.tipoControlService.update(this.tipoControlSelect).then(
      data => {
        this.nombreTipoControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de control modificado', detail: 'Se ha modificado correctamente el tipo de control "' + this.tipoControlSelect.nombre + '"' });

        this.cargarItemsTipoControl();
      }
    );
  }

  eliminarTipoControl() {
    this.tipoControlService.delete(this.tipoControlSelect.id).then(
      data => {
        for (let i = 0; i < this.tipoControlList.length; i++) {
          if (this.tipoControlList[i].id == this.tipoControlSelect.id) {
            this.tipoControlList.splice(i, 1);
            break;
          }
        }
        this.tipoControlList = this.tipoControlList.slice();
        this.nombreTipoControl = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Tipo de control eliminado', detail: 'Se ha eliminado correctamente el tipo de control "' + this.tipoControlSelect.nombre + '"' });
        this.tipoControlSelect = null;
        this.cargarItemsTipoControl();
      }
    );
  }

  onSelectTipoControl(event) {
    this.nombreTipoControl = event.data.nombre;
  }


}
