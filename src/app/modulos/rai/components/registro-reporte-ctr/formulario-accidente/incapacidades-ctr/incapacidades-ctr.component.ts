import { Component, Input, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { Incapacidad } from 'app/modulos/sec/entities/factor-causal';

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
  localeES: any = locale_es;
  isNewIncapacidad: boolean = false;
  isUpdateIncapacidad: boolean = false;

  generoIncapacidad: boolean = false;
  tipo: string = null;
  cie10: any = null;
  fechaInicio: Date = null;
  fechaFin: Date = null;
  diasAusencia: number = null;

  constructor() { }

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
    console.log('save');

    this.hideDialog();
  }

  editIncapacidad(incapacidad: any){
    this.isUpdateIncapacidad = true;
  }

  deleteIncapacidad(){
  }

}
