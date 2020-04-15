import { Component, OnInit, AfterContentInit, ViewChildren, QueryList, ElementRef, ViewContainerRef } from '@angular/core';
import { TableroService } from '../../services/tablero.service';
import { Tablero } from '../../entities/tablero';
import { Kpi, KpiModel, RangoFechas } from '../../entities/kpi';
import { PanelGraficaComponent } from '../panel-grafica/panel-grafica.component';
import { IndicadorService } from '../../services/indicador.service';
import { ModeloGrafica, Dataset } from '../../entities/modelo-grafica';
import { IfStmt } from '@angular/compiler';
import { Message } from 'primeng/api';
import { HTMLSanitizerService } from '../../../comun/services/htmlsanitizer.service';

@Component({
  selector: 's-consultaTablero',
  templateUrl: './consulta-tablero.component.html',
  styleUrls: ['./consulta-tablero.component.scss'],
  providers: [TableroService, IndicadorService]
})
export class ConsultaTableroComponent implements OnInit {

  @ViewChildren('pnlCharts', { read: ViewContainerRef }) pnlCharts: QueryList<ViewContainerRef>;

  eventsLoaded: boolean;
  tablerosList: Tablero[];
  tabSelected: Tablero;

  msgs: Message[];

  htmlSaneado: string;

  modalVisible: boolean;

  rangoFechas: RangoFechas[];
  datasets: Dataset[];
  crossdata: boolean;

  kpiSelect: Kpi;
  pnlChartSelect: PanelGraficaComponent;
  tabActivo = 0;

  constructor(
    public indicadorService: IndicadorService,
    public tableroService: TableroService
  ) {
    this.tableroService.findAll()
      .then(resp => {
        this.tablerosList = resp['data'];
        this.tabSelected = this.tablerosList[this.tablerosList.length - 1];
        this.tabSelected.kpisObj = JSON.parse(this.tabSelected.kpis);
        let saneador = new HTMLSanitizerService();
        this.htmlSaneado = saneador.runSanitizer(this.tabSelected.plantilla);
        this.inicializarTablero();
      });
  }

  ngOnInit() {

  }

  inicializarTablero() {
    setTimeout(() => {
      let i = 0;
      let arrayCharts = this.pnlCharts.toArray();
      let kpiList: Kpi[] = this.tabSelected.kpisObj;
      kpiList.forEach(kpi => {
        let obj_id = kpi.modelo.obj_id;
        let element = document.getElementById(obj_id);
        if (element != null) {
          for (let i = 0; i < element.childNodes.length; i++) {
            (<any>element.childNodes[i]).remove();
          }
          let pnlGrafComp: PanelGraficaComponent = <PanelGraficaComponent>(<any>arrayCharts[i])._data.componentView.component;
          pnlGrafComp.data = kpi.modelo.dataChart;
          pnlGrafComp.opciones = kpi.modelo.options;
          pnlGrafComp.tipo = kpi.modelo.chartType;
          pnlGrafComp.parametros = kpi.modelo.parametros;
          pnlGrafComp.resumen = kpi.modelo.resumen;

          element.appendChild((<any>arrayCharts[i]).element.nativeElement);
        }
        i += 1;
      });
    }, 50);
  }

  selectTablero(item: Tablero) {
    if (this.tabSelected != null && item.id == this.tabSelected.id)
      return;

    this.tabSelected = item;
    this.tabSelected.kpisObj = JSON.parse(this.tabSelected.kpis);
    this.inicializarTablero();
  }

  actualizarTablero() {
    if (this.rangoFechas == null) {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn',
        summary: 'Consulta no realizada',
        detail: 'Debe establecer al menos un rango de fechas para consultar'
      });
      return;
    }
    let i = 0;
    let arrayCharts = this.pnlCharts.toArray();
    let kpiList: Kpi[] = this.tabSelected.kpisObj;
    kpiList.forEach(kpi => {
      let obj_id = kpi.modelo.obj_id;
      let element = document.getElementById(obj_id);
      if (element != null) {
        for (let i = 0; i < element.childNodes.length; i++) {
          (<any>element.childNodes[i]).remove();
        }
        let params = kpi.modelo.parametros;
        params.param.rangos = this.rangoFechas;
        (<any>arrayCharts[i])._data.componentView.component.parametros = params;

        element.appendChild((<any>arrayCharts[i]).element.nativeElement);
      }
      i += 1;
    });
  }

  actualizarRango(event) {
    this.rangoFechas = event;
  }

  onChartSave(kpi: Kpi, pnlCharts: PanelGraficaComponent) {
    pnlCharts.loading = true;
    this.indicadorService.actualizarKpi(kpi)
      .then(resp => {
        pnlCharts.loading = false;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'DATOS ACTUALIZADOS',
          detail: 'Se han actualizado correctamente los datos'
        });
      })
      .catch(err => pnlCharts.loading = false);
  }

  manejarEvento(event: any, kpi: Kpi, pnlCharts: PanelGraficaComponent) {
    if (event.type == "open") {
      this.modalVisible = true;
      this.datasets = event.datasets;
      this.crossdata = event.crossdata;
      this.rangoFechas = [];
      event.rangos.forEach(rango => {
        let nuevo = new RangoFechas();
        nuevo.nombre = rango.nombre;
        nuevo.desde = new Date(rango.desde);
        nuevo.hasta = new Date(rango.hasta);
        this.rangoFechas.push(nuevo);
      });
      this.kpiSelect = kpi;
      this.pnlChartSelect = pnlCharts;
    }
  }

  // actualizarFechas(rangoFechas, kpi: Kpi, pnlCharts: PanelGraficaComponent) {
  //   if (rangoFechas == null)
  //     return;

  //   pnlCharts.loading = true;
  //   kpi.modelo.parametros.param.rangos = rangoFechas;
  //   this.indicadorService.consultarIndicador(kpi.modelo.parametros)
  //     .then((resp: ModeloGrafica) => {
  //       pnlCharts.loading = false;
  //       kpi.modelo.dataChart = resp;
  //       pnlCharts.refresh();
  //     })
  //     .catch(err => pnlCharts.loading = false);
  // }

  adicionarRango() {
    this.rangoFechas.push(new RangoFechas());
  }

  removerRango(idx: number) {
    if (this.rangoFechas.length == 1) {
      this.msgs = [{
        severity: 'warn',
        summary: 'No es posible eliminar el rango',
        detail: 'Debe estar registrado al menos un rango de fechas'
      }];
      return;
    }
    this.rangoFechas.splice(idx, 1);
    this.rangoFechas = this.rangoFechas.slice();
  }

  actualizarRangos() {
    this.kpiSelect.modelo.parametros.param.rangos = this.rangoFechas;
    this.kpiSelect.modelo.parametros.param.crossdata = this.crossdata;
    this.pnlChartSelect.colors = [];
    this.datasets.forEach(ds => {
      this.pnlChartSelect.colors.push({ backgroundColor: ds.backgroundColor, borderColor: ds.backgroundColor });
    });
    this.pnlChartSelect.parametros = this.kpiSelect.modelo.parametros;
    this.pnlChartSelect.refresh();
    // this.actualizarFechas(this.rangoFechas, this.kpiSelect, this.pnlChartSelect);   
    this.modalVisible = false;
  }


  imprimir() {
    var template = document.getElementById('htmlDiv');
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(template.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  }

  handleChange(e) {
    this.tabActivo = e.index;
  }

}
