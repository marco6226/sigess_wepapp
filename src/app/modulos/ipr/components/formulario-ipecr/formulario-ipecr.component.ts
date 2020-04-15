import { Component, OnInit } from '@angular/core';
import { CargoService } from 'app/modulos/empresa/services/cargo.service'
import { IpecrService } from 'app/modulos/ipr/services/ipecr.service'
import { ParticipanteIpecrService } from 'app/modulos/ipr/services/participante-ipecr.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'
import { ParticipanteIpecr } from 'app/modulos/ipr/entities/participante-ipecr'
import { TIPO_PARTICIPANTE } from 'app/modulos/core/enums/enumeraciones'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 's-formularioIpecr',
  templateUrl: './formulario-ipecr.component.html',
  styleUrls: ['./formulario-ipecr.component.scss'],
  providers: [CargoService, IpecrService, ParticipanteIpecrService]
})
export class FormularioIpecrComponent implements OnInit {

  consultar: boolean;
  modificar: boolean;
  adicionar: boolean;

  visibleDlgPart:boolean;
  msgs: Message[] = [];
  tipoParticipanteItemList: SelectItem[];
  participantesList: ParticipanteIpecr[] = [];
  participanteSelect: ParticipanteIpecr;
  cargoItemsList: SelectItem[];
  form: FormGroup;
  formPart: FormGroup;

  constructor(
    private confirmationService: ConfirmationService,
    private paramNavService: ParametroNavegacionService,
    private ipecrService: IpecrService,
    private partIpecrService: ParticipanteIpecrService,
    private cargoService: CargoService,
    private fb: FormBuilder,
  ) {
    this.tipoParticipanteItemList = (<SelectItem[]>[{ label: '--seleccione--', value: null }]).concat(<SelectItem[]>TIPO_PARTICIPANTE);
    this.form = this.fb.group({
      'id': [null],
      'cargo': [null, Validators.required],
      'areaList': null,
      'rutinario': null,
      'ejecucion': null,
      'grupoExpSimilarList': null,
      'fechaElaboracion': new Date(),
      'numTrabajadoresPropios': null,
      'numTrabajadoresExternos': null,
      'descripcion': null
    });

    this.formPart = this.fb.group({
      'id': [null],
      'tipo': [null, Validators.required],
      'nombres': [null, Validators.required],
      'apellidos': [null, Validators.required],
      'cargo': [null, Validators.required]
    });

    let accion = this.paramNavService.getAccion();
    if (accion != null) {
      this.consultar = accion == 'GET';
      this.modificar = accion == 'PUT';
    } else {
      this.adicionar = true;
    }

    if (this.consultar == true || this.modificar == true) {
      let ipecr = this.paramNavService.getParametro<Ipecr>();
      this.form.patchValue({
        'id': ipecr.id,
        'cargo': ipecr.cargo,
        'areaList': ipecr.areaList[0],
        'rutinario': ipecr.rutinario,
        'ejecucion': ipecr.ejecucion,
        'fechaElaboracion': ipecr.fechaElaboracion,
        'numTrabajadoresPropios': ipecr.numTrabajadoresPropios,
        'numTrabajadoresExternos': ipecr.numTrabajadoresExternos,
        'actividad': ipecr.actividad,
        'proceso': ipecr.proceso,
        'descripcion': ipecr.descripcion,
        'grupoExpSimilarList': ipecr.grupoExpSimilarList
      });

      let filterQuery = new FilterQuery();
      let filter = new Filter();
      filter.criteria = Criteria.EQUALS;
      filter.field = "ipecr.id";
      filter.value1 = ipecr.id;
      filterQuery.filterList = [filter];

      this.partIpecrService.findByFilter(filterQuery).then(
        data => this.participantesList = <ParticipanteIpecr[]>data
      );
      if (this.consultar == true) {
        this.form.disable();
      }
    }
    this.cargoItemsList = [];
    this.cargoItemsList.push({ label: '--Seleccione--', value: null });
    this.cargoService.findAll().then(
      resp => {
        (<Cargo[]>resp['data']).forEach(cargo => this.cargoItemsList.push({ label: cargo.nombre, value: cargo }));
        this.form.patchValue({ 'cargo': this.form.value.cargo, });
      }
    );
    this.paramNavService.reset();
  }

  ngOnInit() {

  }

  onParticipanteSelect(event) {
    let part: ParticipanteIpecr = event.data;
    this.formPart.patchValue({
      id: part.id,
      nombres: part.nombres,
      apellidos: part.apellidos,
      tipo: part.tipo,
      cargo: part.cargo
    });
  }

  adicionarParticipante() {
    let part = new ParticipanteIpecr();
    part.nombres = this.formPart.value.nombres;
    part.apellidos = this.formPart.value.apellidos;
    part.cargo = this.formPart.value.cargo;
    part.tipo = this.formPart.value.tipo;
    part.ipecr = new Ipecr();
    part.ipecr.id = this.form.value.id;

    this.partIpecrService.create(part).then(
      data => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Participante registrado', detail: 'Se ha registrado correctamente el participante' });
        this.participantesList.push(<ParticipanteIpecr>data);
        this.participantesList = this.participantesList.slice();
      }
    );
  }

  modificarParticipante() {
    this.participanteSelect.nombres = this.formPart.value.nombres;
    this.participanteSelect.apellidos = this.formPart.value.apellidos;
    this.participanteSelect.cargo = this.formPart.value.cargo;
    this.participanteSelect.tipo = this.formPart.value.tipo;
    this.partIpecrService.update(this.participanteSelect).then(
      data => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Participante modificado', detail: 'Se ha modificado correctamente el participante' });
      }
    );
  }

  confirmarEliminarParticipante() {

    this.confirmationService.confirm({
      message: 'Eliminar participante ' + this.participanteSelect.nombres + " " + this.participanteSelect.apellidos,
      header: '¿Confirma esta acción?',
      accept: () => {
        this.eliminarParticipante();
      }
    });
  }

  eliminarParticipante() {
    this.partIpecrService.delete(this.participanteSelect.id).then(
      data => {
        for (let i = 0; i < this.participantesList.length; i++) {
          if (this.participantesList[i].id == this.participanteSelect.id) {
            this.participantesList.splice(i, 1);
            this.participantesList = this.participantesList.slice();
            break;
          }
        }
        this.participanteSelect = null;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Participante eliminado', detail: 'Se ha eliminado correctamente el participante' });
      }
    );
  }

  onSubmit() {
    let ipecr = new Ipecr();
    ipecr.cargo = this.form.value.cargo;
    ipecr.actividad = this.form.value.actividad;
    if (this.form.value.areaList != null) {
      ipecr.areaList = [this.form.value.areaList];
    }
    ipecr.descripcion = this.form.value.descripcion;
    ipecr.ejecucion = this.form.value.ejecucion;
    ipecr.fechaElaboracion = this.form.value.fechaElaboracion;
    ipecr.numTrabajadoresExternos = this.form.value.numTrabajadoresExternos;
    ipecr.numTrabajadoresPropios = this.form.value.numTrabajadoresPropios;
    ipecr.proceso = this.form.value.proceso;
    ipecr.rutinario = this.form.value.rutinario;
    ipecr.grupoExpSimilarList = this.form.value.grupoExpSimilarList;
    if (this.adicionar == true) {
      this.ipecrService.create(ipecr).then(
        data => {
          ipecr = <Ipecr>data;
          this.form.patchValue({
            id: ipecr.id
          });
          this.adicionar = false;
          this.modificar = true;
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Ipecr registrado', detail: 'Se ha registrado correctamente el ipecr' });
        }
      );
    } else if (this.modificar == true) {
      ipecr.id = this.form.value.id;
      this.ipecrService.update(ipecr).then(
        data => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Ipecr actualizado', detail: 'Se ha actualizado correctamente el ipecr' });
        }
      );
    }

  }

  manejarRespuesta(event: any) {
    let accion = event.accion == 'POST' ? 'registrado' : 'actualizado';
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Peligro ' + accion, detail: 'Se ha ' + accion + ' correctamente el peligro' });
  }

  manejarRespDelete(event: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Peligro ' + event.peligro.nombre + ' eliminado', detail: 'Se ha eliminado correctamente el peligro' });
  }
}
