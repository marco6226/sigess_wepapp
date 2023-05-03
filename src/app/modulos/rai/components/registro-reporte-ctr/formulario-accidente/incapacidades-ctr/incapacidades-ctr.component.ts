import { Component, Input, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { Incapacidad } from 'app/modulos/sec/entities/factor-causal';
import * as moment from 'moment'
import { ConfirmationService, MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-incapacidades-ctr',
  templateUrl: './incapacidades-ctr.component.html',
  styleUrls: ['./incapacidades-ctr.component.scss']
})
export class IncapacidadesCtrComponent implements OnInit {

  @Input() incapacidades: Incapacidad[] = [];
  selectedIncapacidad: any;
  isVisibleDialog: boolean = false;
  tipoList = [
    { label: 'Inicial', value: 'Inicial' },
    { label: 'Prorroga', value: 'Prorroga' },
  ];
  @Input('consultar') consultar: boolean;
  localeES: any = locale_es;
  isNewIncapacidad: boolean = false;
  isUpdateIncapacidad: boolean = false;
  @Input() disabled: boolean;
  generoIncapacidad: boolean = false;
  id: number = null;
  tipo: string = null;
  cie10: any = null;
  fechaInicio: Date = null;
  fechaFin: Date = null;
  diasAusencia: number = 0;

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
  }

  nuevaIncapacidad(){
    this.isVisibleDialog = true;
    this.isNewIncapacidad = true;
  }

  hideDialog(){
    this.isVisibleDialog = false;
    this.isNewIncapacidad = false;
    this.isUpdateIncapacidad = false;
    this.generoIncapacidad = false;
    this.tipo = null;
    this.cie10 = null;
    this.fechaFin = null;
    this.fechaInicio = null;
    this.diasAusencia = null;
  }

  saveIncapacidad(){

    let incapacidad: Incapacidad = {
      id : null,
      cie10: this.cie10 ? this.cie10 : null,
      fechaInicio: this.fechaInicio ? this.fechaInicio : null,
      fechaFin: this.fechaFin ? this.fechaFin : null,
      diasAusencia: this.diasAusencia,
      generoIncapacidad: String(this.generoIncapacidad),
      tipo: this.tipo,
      diagnostico: this.cie10 ? this.cie10.nombre : null
    }

    if(this.id){
      let x = this.incapacidades.find(ele => {
        return ele.id == this.id;
      });
      x.generoIncapacidad = String(this.generoIncapacidad);
      x.tipo = this.tipo;
      x.cie10 = this.cie10;
      x.diagnostico = this.cie10 ? this.cie10.nombre : null;
      x.fechaInicio = this.fechaInicio ? this.fechaInicio : null;
      x.fechaFin = this.fechaFin ? this.fechaFin : null;
      x.diasAusencia = this.diasAusencia;
    }else{
      this.id = this.incapacidades[this.incapacidades.length-1] ? 
                this.incapacidades[this.incapacidades.length-1].id + 1
                : this.incapacidades.length + 1;
      incapacidad.id = this.id;
      this.incapacidades.push(incapacidad);
    }

    this.id = null;
    this.hideDialog();
  }

  editIncapacidad(incapacidadId: number){
    this.isVisibleDialog = true;
    this.isUpdateIncapacidad = true;
    let incapacidad = this.incapacidades.find(incapacidad => incapacidad.id === incapacidadId);
    if(incapacidad){
      this.id = incapacidad.id;
      this.generoIncapacidad = Boolean(incapacidad.generoIncapacidad);
      this.tipo = incapacidad.tipo;
      this.cie10 = incapacidad.cie10;
      this.cie10.nombre = incapacidad.cie10 ? incapacidad.cie10.nombre : null;
      this.fechaInicio = incapacidad.fechaInicio ? incapacidad.fechaInicio : null;
      this.fechaFin = incapacidad.fechaFin ? incapacidad.fechaFin : null;
      this.diasAusencia = incapacidad.diasAusencia;
    }
  }

  deleteIncapacidad(incapacidadId: number){
    this.confirmationService.confirm({
      header: 'Confirmar',
      key: 'confirmIncapacidad',
      message: '¿Seguro que desea eliminar la incapacidad?',
      icon: 'fa fa-circle-exclamation',
      accept: () => {
        this.incapacidades = this.incapacidades
        .filter(incapacidad => incapacidad.id !== incapacidadId);
      }
    })
  }

  get daysCount() {
    if(this.generoIncapacidad){
      let fecha1 = moment(this.fechaInicio);
      let fecha2 = moment(this.fechaFin);

      this.diasAusencia = Math.abs(fecha1.diff(fecha2, 'days')) +1
    }else{
      this.diasAusencia = 0;
    }
    return this.diasAusencia;
  }

  formIncapacidadIsValid() {
    return this.tipo && this.cie10 
    && this.fechaInicio && this.fechaFin &&  this.diasAusencia;
  }

}
