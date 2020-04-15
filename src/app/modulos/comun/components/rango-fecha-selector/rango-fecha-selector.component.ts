import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 's-rangoFechaSelector',
  templateUrl: './rango-fecha-selector.component.html',
  styleUrls: ['./rango-fecha-selector.component.scss']
})
export class RangoFechaSelectorComponent implements OnInit {

  es = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: 'Hoy',
    clear: 'Limpiar'
  };

  @Output("onSelect") onSelection = new EventEmitter<Date[]>();
  desde: Date;
  hasta: Date;

  constructor() { }

  ngOnInit() {
  }

  onSelect(event: any) {
    // if (this.desde != null || this.hasta != null) {
    this.onSelection.emit([this.desde, this.hasta]);
    // }
  }

}
