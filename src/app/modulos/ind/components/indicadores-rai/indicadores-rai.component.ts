import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa'

import { ModeloGraficaService } from '../../services/modelo-grafica.service'
import { SelectItem } from 'primeng/primeng'
import { tipo_reporte } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Util } from 'app/modulos/comun/util'

@Component({
  selector: 's-indicadoresRai',
  templateUrl: './indicadores-rai.component.html',
  styleUrls: ['./indicadores-rai.component.scss'],
  providers: [ModeloGraficaService]
})
export class IndicadoresRaiComponent implements OnInit {

  @Input("empresa") empresa: Empresa;
  tipoReporteList: SelectItem[];
  tipoReporteSelected: string;
  chartList: any[];
  anioActual: number = new Date().getFullYear();

  constructor(
    private indicadorService: ModeloGraficaService,
  ) { }

  ngOnInit() {
    this.tipoReporteList = tipo_reporte.slice();
    this.tipoReporteSelected = this.tipoReporteList[0].value;
    console.log(this.tipoReporteList);
    let anioActual = new Date().getFullYear();
    let rangos = [
      { desde: new Date(anioActual + '-01-01'), hasta: new Date(anioActual + '-06-30'), color: Util.randomColor() },
      { desde: new Date(anioActual + '-07-01'), hasta: new Date(anioActual + '-12-31'), color: Util.randomColor() }
    ];
    this.actualizarGraficas(this.tipoReporteSelected, rangos);
  }

  actualizarRangos(event) {
    this.actualizarGraficas(this.tipoReporteSelected, event);
  }

  actualizarTipoReporte(event) {
  }

  actualizarGraficas(tipo, rangos: any[]) {
      console.log(rangos);
    let strRango: string = '{';
    rangos.forEach(rango => {
      strRango += '"[';
      strRango += rango.desde.toISOString();
      strRango += ',';
      strRango += rango.hasta.toISOString();
      strRango += ']",';
    });
    strRango = strRango.substring(0, strRango.length == 1 ? 1 : strRango.length - 1);
    strRango += '}';

    this.indicadorService.findRai(tipo, strRango, (this.empresa == null ? null : this.empresa.id)).then(
      data => { 
        this.chartList = <any[]>data
        this.chartList.forEach(chart => {
          for (let i = 0; i < chart.datasets.length; i++) {
            chart.datasets[i].borderColor = rangos[i].color;
            chart.datasets[i].backgroundColor = rangos[i].color;
          }
        });
      }
    );

  }
}
