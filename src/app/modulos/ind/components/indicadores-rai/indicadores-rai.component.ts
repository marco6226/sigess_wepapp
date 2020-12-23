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
  data: any;
  data7: any;
  options7: any;
    showData = false;
    desde: String;
    arrayIds = [];
    hasta: String;
  anioActual: number = new Date().getFullYear();

  constructor(
    private indicadorService: ModeloGraficaService,
  ) { this.data7 = {
    labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
    datasets: [
        {
            label: 'Area',
            backgroundColor: '#d9c077',
            borderColor: '#1E88E5',
            data: [65]
        },
        {
            label: 'Tipo',
            backgroundColor: '#7790d9',
            borderColor: '#7CB342',
            data: [65]
        }
    ],
    options: {
        scales: {
            yAxes: [{stacked: false,
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                stacked: false,
                }]
        }
    }
}}

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
  
  async updateCharts7() {
    this.showData = false;
    this.data7.labels = [];
    this.data7.datasets.forEach((element, index) => {
        this.data7.datasets[index].data = [];
   });
    
   let data7: any = await  this.indicadorService.findTipoAt(this.arrayIds, this.desde, this.hasta)
   if(data7.length < 0) return false;
   for (const iterator of data7) {
    console.log(data7);
    console.log(iterator);
    this.data7.labels.push(iterator[1]);            
    this.data7.datasets[0].data.push(iterator[0]);
   // this.data7.datasets[1].data.push(iterator[0])
  
   this.showData = true;
   console.log(iterator[1]);
   console.log(iterator[2]);
   console.log(iterator[3]);
}
}
}
