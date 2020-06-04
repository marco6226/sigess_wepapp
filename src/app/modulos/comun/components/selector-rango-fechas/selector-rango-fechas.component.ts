import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Util } from 'app/modulos/comun/util'

@Component({
  selector: 's-selectorRangoFechas',
  templateUrl: './selector-rango-fechas.component.html',
  styleUrls: ['./selector-rango-fechas.component.scss']
})
export class SelectorRangoFechasComponent implements OnInit {

  @Output('onchange') onchange = new EventEmitter();
  fechaActual = new Date();
  yearRange: string = (this.fechaActual.getFullYear() - 10) + ":" + this.fechaActual.getFullYear();
  fechaDesde: Date;
  fechaHasta: Date;
  @Input('value') rangosList: RangoModel[];
  localeES: any = locale_es;
  rangoSelect:RangoModel;

  constructor() { }

  ngOnInit() {
    this.construirRangosUI();
  }

  adicionarNuevoRango() {
    let rangoNuevo = { desde: this.fechaDesde, hasta: this.fechaHasta, color: Util.randomColor() };
    if (this.rangosList == null) {
      this.rangosList = [];
      this.rangosList.push(rangoNuevo);
    } else if (this.rangosList.length == 0) {
      this.rangosList.push(rangoNuevo);
    } else {
      this.construirRangosUI(rangoNuevo);
    }

    this.fechaDesde = null;
    this.fechaHasta = null;
    this.onchange.emit(this.rangosList);
  }

  construirRangosUI(rangoNuevo?: any) {
    for (let i = 0; i < this.rangosList.length; i++) {
      let rangoAnterior = (i == 0 ? null : this.rangosList[i]);
      let rango = this.rangosList[i];
      let rangoSiguiente = (i == this.rangosList.length - 1 ? null : this.rangosList[i + 1]);

      if (rangoNuevo == null) {
        continue;
      }
      if (rangoNuevo.desde >= rango.desde && (rangoSiguiente == null || rangoNuevo.desde <= rangoSiguiente.desde)) {
        this.rangosList.splice(i + 1, 0, rangoNuevo);
        break;
      } else if (rangoNuevo.desde <= rango.desde && (rangoAnterior == null || rangoNuevo.desde >= rangoAnterior.desde)) {
        this.rangosList.splice(i, 0, rangoNuevo);
        break;
      }
    }
  }

  removerRango(index: number) {
    this.rangosList.splice(index, 1);
    this.onchange.emit(this.rangosList);
  }

  cambiarColor(event:any){
    //console.log(event);
    this.onchange.emit(this.rangosList);
  }

}

export interface RangoModel {
  desde: Date;
  hasta: Date;
  color: string;
}
