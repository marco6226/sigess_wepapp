import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Util } from 'app/modulos/comun/util'
import { UIChart } from 'primeng/primeng';
import { ModeloGrafica, Dataset, FichaTecnicaIndicador } from '../../entities/modelo-grafica';
import { Indicador } from '../../entities/indicador';
import { IndicadorService } from '../../services/indicador.service';
import { Kpi, ParametroIndicador, KpiModel } from '../../entities/kpi';

declare var google: any;

@Component({
  selector: 's-panelGrafica',
  templateUrl: './panel-grafica.component.html',
  styleUrls: ['./panel-grafica.component.scss'],
  providers: [IndicadorService]
})
export class PanelGraficaComponent implements OnInit {

  @ViewChild('chart', { static: false }) chart: UIChart;
  @ViewChild('resumenDiv', { static: false }) resumenDiv: HTMLTableElement;

  private _titulo: string;
  public _parametros: ParametroIndicador;

  @Output("onExport") onExport = new EventEmitter<any>();

  @Input("data") data: ModeloGrafica;
  @Input("tipo") tipo: string;
  @Input("opciones") opciones: any;
  @Input("resumen") resumen: boolean;
  @Input("indicador") _indicador: Indicador;
  @Input("cargarMedia") cargarMedia: boolean;
  @Input("rangoUnico") rangoUnico: boolean;
  @Input("kpi") kpi: any;
  @Output("onSave") onSave = new EventEmitter();
  @Output("onSettingsEvent") onSettingsEvent = new EventEmitter();

  overlaysMap: any;
  stylers = Util.map_chart_style;
  tableData: any;
  fichaTecnicaIndicador: FichaTecnicaIndicador;
  colors: any[];
  fichaTecnica: any;

  loading: boolean = false;

  constructor(
    private indicadorService: IndicadorService
  ) { }

  ngOnInit() {
    if (this.kpi == null) {
      this.kpi = {};
      this.kpi.modelo = {};
      this.kpi.modelo.type = this.tipo;
      this.kpi.modelo.chartType = this.tipo;
      this.kpi.modelo.dataChart = this.data;
      this.inicializarOpciones();
      this.kpi.modelo.options = this.opciones;
    }
    this.fichaTecnica = this.kpi.modelo.dataChart.fichaTecnicaIndicador;
    this.colors = [];
    this.kpi.modelo.dataChart.datasets.forEach(ds => {
      this.colors.push({ backgroundColor: ds.backgroundColor, borderColor: ds.borderColor });
    });
    if (this.cargarMedia)
      this.adicionarMedia();
  }

  adicionarMedia() {
    let totalDataset: Dataset = { data: [], label: 'MEDIA', backgroundColor: '#555' };
    this.data.labels.push('TOTAL');

    for (let i = 0; i < this.data.datasets.length; i++) {
      let acumulado = 0;
      let size = this.data.labels.length;
      for (let j = 0; j < this.data.labels.length; j++) {
        let valor = this.data.datasets[i].data[j];
        if (valor == null || isNaN(valor)) {
          size -= 1;
        } else {
          acumulado += valor;
        }
      }
      let promedio = acumulado / size;
      this.data.datasets[i].data.push(promedio);
    }

    for (let i = 0; i < this.data.labels.length; i++) {
      let acumulado = 0;
      let size = this.data.datasets.length;
      for (let j = 0; j < this.data.datasets.length; j++) {
        let valor = this.data.datasets[j].data[i];
        if (valor == null || isNaN(valor)) {
          size -= 1;
        } else {
          acumulado += valor;
        }
      }
      let promedio = acumulado / size;
      totalDataset.data.push(promedio);
    }

    this.data.datasets.push(totalDataset);
    this.inicializarOpciones();
  }

  inicializarOpciones() {

    if (this.tipo == 'map') {
      this.opciones = {
        center: { lat: 4.6, lng: -74.08333 },
        zoom: 6,
        styles: this.stylers
      };
      this.overlaysMap = [];
      for (let i = 0; i < (<any[]>this.data.labels).length; i++) {

        this.data.datasets.forEach(ds => {
          var circle = new google.maps.Circle({
            title: this.data.labels[i] + ' ' + ds.label + ' ' + Math.round(ds.data[i] * 100) / 100 + '%',
            center: {
              lat: this.data.lat[i], lng: this.data.long[i]
            },
            strokeColor: ds.borderColor,
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: ds.backgroundColor,
            fillOpacity: 0.5,
            radius: ds.data[i] * 3000
          });
          circle.addListener('mouseover', function () {
            this.getMap().getDiv().setAttribute('title', this.get('title'));
          });
          circle.addListener('mouseout', function () {
            this.getMap().getDiv().removeAttribute('title');
          });
          this.overlaysMap.push(circle);
        });
      }
    } else {
      this.opciones = {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: this.titulo,
          fontSize: 16,
          fontStyle: 'normal',
          padding: '5',
          maintainAspectRatio: false,
          responsive: true,
          scaleStartValue: 0,
        },
        legend: {
          position: 'bottom'
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
              // OR //
              //beginAtZero: true   // minimum value will be 0.
            }
          }]
        }
      };
    }
  }

  get titulo(): string {
    return this._titulo;
  }

  @Input() set titulo(titulo: string) {
    this._titulo = titulo;
    this.inicializarOpciones();
  }

  get parametros(): ParametroIndicador {
    return this._parametros;
  }

  @Input() set parametros(parametros: ParametroIndicador) {
    this._parametros = parametros;
    // this.refresh();
  }

  public cargarParametros(params: ParametroIndicador) {
    this._parametros = params;
  }

  cambiarGrafica(type: string) {
    this.tipo = type;
    if (type == 'line') {
      this.data.datasets.forEach(ds => {
        ds.fill = false;
      });
    }
    setTimeout(() => {
      this.chart.reinit();
    }, 50);
  }

  refresh() {
    this.loading = true;
    this.indicadorService.consultarIndicador(this._parametros)
      .then(resp => {
        this.data = <ModeloGrafica>resp;
        for (let i = 0; i < this.data.datasets.length; i++) {
          let backgroundColor = this.colors == null || this.colors[i] == null ? Util.randomColor() : this.colors[i].backgroundColor;
          if (this.data.datasets[i].backgroundColor == null) {
            this.data.datasets[i].borderColor = backgroundColor;
            this.data.datasets[i].backgroundColor = backgroundColor;
          }
        }
        this.data.fichaTecnicaIndicador = this.fichaTecnica;
        this.kpi.modelo.dataChart = this.data;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  invertirSeries() {
    this._parametros.param.crossdata = !this._parametros.param.crossdata;
    this.refresh();
  }

  copiarCodigo() {
    let data = this.getData();
    let id = 'ind_' + new Date().valueOf();
    let model = <KpiModel>{ obj_id: id, dataChart: data, options: this.opciones, type: 'chart', chartType: this.tipo, parametros: this._parametros, resumen: this.resumen };


    let obj = '<div id="' + id + '" >';
    obj += '<img src="' + this.chart.chart.canvas.toDataURL("image/png") + '" />';
    obj += (<any>this.resumenDiv).nativeElement.innerHTML + '</div>';

    let kpi: Kpi = { modelo: model };
    this.onExport.emit({ kpi: kpi, object: obj });
  }

  copiarTabla() {
    let data = this.getData();
    let id = 'ind_' + new Date().valueOf();
    let model = <KpiModel>{ obj_id: id, dataChart: data, options: this.opciones, type: 'table', chartType: this.tipo, parametros: this._parametros, resumen: this.resumen };


    let obj = '<div id="' + id + '" >' + (<any>this.resumenDiv).nativeElement.innerHTML + '</div>';
    let kpi: Kpi = { modelo: model };
    this.onExport.emit({ kpi: kpi, object: obj });
  }

  getData() {
    let datasets = [];
    this.chart.data.datasets.forEach(ds => {
      datasets.push({
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor,
        data: ds.data,
        label: ds.label
      });
    });
    return {
      labels: this.chart.data.labels,
      fichaTecnicaIndicador: this.chart.data.fichaTecnicaIndicador,
      title: this.chart.data.title,
      datasets: datasets
    };
  }

  onSaveClick() {
    this.kpi.modelo.dataChart = this.data;
    this.kpi.modelo.options = this.opciones;
    this.kpi.modelo.parametros = this.parametros;
    this.kpi.modelo.resumen = this.resumen;
    this.kpi.modelo.titulo = this.titulo;
    for (const ds of this.kpi.modelo.dataChart.datasets) {
      delete ds['_meta'];
    }
    this.onSave.emit(this.kpi);
  }

  abrirDlg() {
    this.onSettingsEvent.emit({
      type: 'open',
      rangos: this.parametros.param.rangos,
      datasets: this.kpi.modelo.dataChart.datasets,
      crossdata: this.parametros.param.crossdata
    });
  }

}
