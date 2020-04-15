import { Component, OnInit } from '@angular/core';

import { TarjetaService } from 'app/modulos/observaciones/services/tarjeta.service'
import { Tarjeta } from 'app/modulos/observaciones/entities/tarjeta'
import { Observacion } from 'app/modulos/observaciones/entities/observacion'
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-registro-observaciones',
  templateUrl: './registro-observaciones.component.html',
  styleUrls: ['./registro-observaciones.component.scss']
})
export class RegistroObservacionesComponent implements OnInit {

  tarjetaList: Tarjeta[];
  tarjetaSelect: Tarjeta;
  msgs: Message[] = [];

  constructor(
    private tarjetaService: TarjetaService,
  ) { }

  ngOnInit() {
    this.tarjetaService.findAll().then(
      data => this.tarjetaList = <Tarjeta[]>data
    );
  }

  selectTarjeta(tarjeta: Tarjeta) {
    this.tarjetaSelect = tarjeta;
    this.tarjetaSelect.campos = JSON.parse(tarjeta.campos);
  }

  onSave(observacion: Observacion) {
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'REPORTE REALIZADO',
      detail: 'Se ha registrado correctamente el reporte'
    });
    this.tarjetaSelect = null;
  }
}
