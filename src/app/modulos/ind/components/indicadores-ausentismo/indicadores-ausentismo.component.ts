
declare var google: any;

import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

import { IndicadorAusentismoService } from 'app/modulos/ind/services/indicador-ausentismo.service'
import { IndicadorAusentismo } from 'app/modulos/ind/entities/indicador-ausentismo'
import { CausaAusentismoService } from 'app/modulos/aus/services/causa-ausentismo.service'
import { CausaAusentismo } from 'app/modulos/aus/entities/causa-ausentismo'
import { SelectItem } from 'primeng/primeng'
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Util } from 'app/modulos/comun/util'

import { Message } from 'primeng/components/common/api';


@Component({
  selector: 's-indicadoresAusentismo',
  templateUrl: './indicadores-ausentismo.component.html',
  styleUrls: ['./indicadores-ausentismo.component.scss'],
  providers: [IndicadorAusentismoService, CausaAusentismoService]
})
export class IndicadoresAusentismoComponent implements OnInit {

  @Input("empresa") empresa: Empresa;

  dataIndFrec: any;
  dataIndSev: any;
  dataIndIli: any;
  dataIndNumCasos: any;
  dataIndNumDias: any;

  caractCharts = [];

  causaAusentismoList: SelectItem[];
  causaAusentismoSelected: CausaAusentismo;

  aniosList: SelectItem[];
  aniosListSelect: number[];
  causasMsg: Message[] = [];
  indSelect: boolean = true;
  rangoCarac: any[];


  options: any;
  overlays: any[];

  constructor(
    private indicadorAusentismoService: IndicadorAusentismoService,
    private causaAusentismoService: CausaAusentismoService,
  ) {
  }

  ngOnInit() {
    let anioActual = new Date().getFullYear();
    this.aniosListSelect = [anioActual - 1, anioActual];
    this.aniosList = [];
    for (let i = (anioActual - 5); i <= anioActual; i++) {
      this.aniosList.push({ label: "" + i, value: i });
    }

    this.rangoCarac = [
      { color: Util.randomColor(), desde: new Date((anioActual - 1), 0, 1), hasta: new Date((anioActual - 1), 11, 31) },
      { color: Util.randomColor(), desde: new Date(anioActual, 0, 1), hasta: new Date(anioActual, 11, 31) }
    ];
    this.actualizarRangos(this.rangoCarac);

    let filterQuery = new FilterQuery();
    if (this.empresa != null) {
      filterQuery.filterList = [];
      let filtroEmpresa = new Filter();
      filtroEmpresa.criteria = Criteria.EQUALS;
      filtroEmpresa.field = "empresa.id";
      filtroEmpresa.value1 = this.empresa.id;
      filterQuery.filterList.push(filtroEmpresa);
    }
    this.causaAusentismoService.findByFilter(filterQuery).then(
      data => {
        if (data == null || (<CausaAusentismo[]>data).length <= 0) {
          this.causasMsg.push({ severity: 'warn', summary: '', detail: 'No se han parametrizado aún las causas de ausentismo' });
        } else {
          this.causaAusentismoList = [];
          (<CausaAusentismo[]>data).forEach(ca => {
            this.causaAusentismoList.push({ label: ca.nombre, value: ca });
          });
          this.causaAusentismoSelected = this.causaAusentismoList[0].value;
          this.construirGraficas(this.causaAusentismoSelected, this.aniosListSelect);
        }
      }
    );
  }

  cambiarCausaAusentismo(event: any) {
    this.causaAusentismoSelected = event.value;
    this.construirGraficas(this.causaAusentismoSelected, this.aniosListSelect);
  }

  cambiarAnio(event: any) {
    if (this.causaAusentismoSelected != null)
      this.construirGraficas(this.causaAusentismoSelected, this.aniosListSelect);
  }

  construirGraficas(causaAusentismo: CausaAusentismo, anioList: number[]) {
    let datasetsIndFrec = [];
    let datasetsIndSev = [];
    let datasetsIndIli = [];
    let datasetsIndNumCasos = [];
    let datasetsIndNumDias = [];

    anioList.forEach(anio => {
      let color = Util.randomColor();
      let dsIndFrec = { label: anio, data: [], fill: false, borderColor: color };
      let dsIndSev = { label: anio, data: [], fill: false, borderColor: color };
      let dsIndIli = { label: anio, data: [], fill: false, borderColor: color };
      let dsIndNumCasos = { label: anio, data: [], fill: false, borderColor: color };
      let dsIndNumDias = { label: anio, data: [], fill: false, borderColor: color };

      datasetsIndFrec.push(dsIndFrec);
      datasetsIndSev.push(dsIndSev);
      datasetsIndIli.push(dsIndIli);
      datasetsIndNumCasos.push(dsIndNumCasos);
      datasetsIndNumDias.push(dsIndNumDias);

      this.indicadorAusentismoService.findByAnioCausa(anio, causaAusentismo.id, this.empresa == null ? null : this.empresa.id).then(
        data => {
          let indiceAusentismoList = <IndicadorAusentismo[]>data;
          indiceAusentismoList.forEach(indAus => {
            dsIndFrec.data.push(indAus.indiceFrecuencia);
            dsIndSev.data.push(indAus.indiceSeveridad);
            dsIndIli.data.push(indAus.indiceLesionIncapacitante);
            dsIndNumCasos.data.push(indAus.numeroCasos);
            dsIndNumDias.data.push(indAus.numeroDias);
          });
        }
      ).then(param => {
        if (anio == anioList[anioList.length - 1]) {
          this.cargarDataGraficas(datasetsIndFrec, datasetsIndSev, datasetsIndIli, datasetsIndNumCasos, datasetsIndNumDias);
        }
      });
    });
  }

  cargarDataGraficas(datasetsIndFrec: any, datasetsIndSev: any, datasetsIndIli: any, datasetsIndNumCasos: any, datasetsIndNumDias: any) {
    let labels = locale_es.monthNames.slice();

    this.dataIndFrec = {
      type: 'line',
      labels: labels,
      datasets: datasetsIndFrec,
      title: 'Indice de frecuencia ',
    };
    this.dataIndSev = {
      type: 'line',
      labels: labels,
      datasets: datasetsIndSev,
      title: 'Indice de severidad ',
    };
    this.dataIndIli = {
      type: 'line',
      labels: labels,
      datasets: datasetsIndIli,
      title: 'Indice de lesión incapacitante (ILI) ',
    };
    this.dataIndNumCasos = {
      type: 'line',
      labels: labels,
      datasets: datasetsIndNumCasos,
      title: 'Cantidad de casos',
    };
    this.dataIndNumDias = {
      type: 'line',
      labels: labels,
      datasets: datasetsIndNumDias,
      title: 'Cantidad de dias',
    };

  }

  /** gráficas de caracterizacion */

  actualizarRangos(event: any) {
    console.log(event);
    this.indicadorAusentismoService.indCaract(event, '0').then(
      data => this.construirGraficasCaract(<any[]>data, event)
    );
  }

  construirGraficasCaract(data: any[], rangos) {
    this.caractCharts = [];
    data.forEach(dat => {
      let d = JSON.parse(dat.datos);

      let i = 0;
      d.datasets.forEach(dset => {
        dset['backgroundColor'] = rangos[i].color;
        dset['borderColor'] = rangos[i].color;
        i++;
      });

      let type: string;
      switch (dat.indicador) {
        case 'cie':
          type = 'bar';
          break;
        case 'ciudad':
          type = 'map';
          break;
        default:
          type = 'bar';
      }

      let chart = {
        type: type,
        lat: d.lat,
        long: d.long,
        labels: d.labels,
        datasets: d.datasets,
        title: d.title,
      };
      this.caractCharts.push(chart);
    });
  }

}
