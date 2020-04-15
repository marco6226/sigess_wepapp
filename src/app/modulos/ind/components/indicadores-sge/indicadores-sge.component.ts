import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { IndicadorSgeService } from 'app/modulos/ind/services/indicador-sge.service'
import { IndicadorSge } from 'app/modulos/ind/entities/indicador-sge'

import { SistemaGestionService } from 'app/modulos/sg/services/sistema-gestion.service'
import { SistemaGestion } from 'app/modulos/sg/entities/sistema-gestion'
import { SelectItem } from 'primeng/primeng'
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Util } from 'app/modulos/comun/util'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 's-indicadoresSge',
  templateUrl: './indicadores-sge.component.html',
  styleUrls: ['./indicadores-sge.component.scss'],
  providers: [IndicadorSgeService, SistemaGestionService, SesionService]
})
export class IndicadoresSgeComponent implements OnInit {

  @Input("empresa") empresa: Empresa;

  dataInd: any;
  optionsInd: any;

  dataIndGen: any;
  optionsIndGen: any;

  sgeList: SelectItem[];
  sgeSelected: SelectItem;
  rangoFechasList: any[];

  constructor(
    private sesionService: SesionService,
    private indicadorSgeService: IndicadorSgeService,
    private sistemaGestionService: SistemaGestionService,
  ) {

  }

  ngOnInit() {
    if (this.empresa == null) {
      this.empresa = this.sesionService.getEmpresa();
    }

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    let filtroEmpresa = new Filter();
    filtroEmpresa.criteria = Criteria.EQUALS;
    filtroEmpresa.field = "empresa.id";
    filtroEmpresa.value1 = this.empresa.id;
    filterQuery.filterList.push(filtroEmpresa);

    this.sistemaGestionService.findByFilter(filterQuery).then(
      data => {
        if (data != null && (<SistemaGestion[]>data).length > 0) {
          this.sgeList = [];
          (<SistemaGestion[]>data).forEach(element => {
            this.sgeList.push({ label: element.nombre, value: element })
          });
          this.sgeSelected = this.sgeList[0];
          this.construirGraficas(this.sgeSelected.value, this.rangoFechasList);
        }
      }
    );
  }


  cambiarSge(event: any) {
    if (this.sgeSelected != null)
      this.construirGraficas(this.sgeSelected.value, this.rangoFechasList);
  }

  actualizar(event: any) {
    this.rangoFechasList = event;
    if (this.sgeSelected != null)
      this.construirGraficas(this.sgeSelected.value, this.rangoFechasList);
  }

  construirGraficas(sge: SistemaGestion, rangoFechasList: any[]) {
    let filterList: Filter[] = [];
    filterList.push({ field: 'sgeId', value1: sge.sistemaGestionPK.id, criteria: Criteria.EQUALS, value2: null });
    filterList.push({ field: 'sgeVersion', value1: sge.sistemaGestionPK.version.toString(), criteria: Criteria.EQUALS, value2: null });
    if (rangoFechasList != null) {
      rangoFechasList.forEach(rango => {
        filterList.push({ field: 'fechaEvaluacion', value1: rango.desde, value2: rango.hasta, criteria: Criteria.BETWEEN });
      });
    }
    let filtroEmpresa = new Filter();
    filtroEmpresa.criteria = Criteria.EQUALS;
    filtroEmpresa.field = "empresaId";
    filtroEmpresa.value1 = this.empresa.id;
    filterList.push(filtroEmpresa);

    let filterQuery = new FilterQuery();
    filterQuery.filterList = filterList;

    this.indicadorSgeService.findByFilter(filterQuery).then(
      data => {
        let indicadores = (<IndicadorSge[]>data);
        if (indicadores != null && indicadores.length > 0) {
          let labels = indicadores[0].elementos;
          let labelsGen = [];
          let datasetsInd = [];
          let colorGen = Util.randomColor();
          let datasetsIndGen = [{ label: '', data: [], fill: true, borderColor: colorGen, backgroundColor: colorGen }];
          let dataGen = [];
          indicadores.forEach(ind => {
            let color = Util.randomColor();
            let dsInd = { label: new Date(ind.fechaEvaluacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), data: ind.valores, fill: false, borderColor: color, backgroundColor: color };
            //let dsIndGen = { label: "new Date(ind.fechaEvaluacion).toLocaleString()", data: ind.promedio, fill: false, borderColor: color, backgroundColor: color };
            datasetsInd.push(dsInd);

            labelsGen.push(new Date(ind.fechaEvaluacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }));
            dataGen.push(ind.promedio);
          });
          datasetsIndGen[0].data = dataGen;

          this.dataInd = {
            labels: labels,
            datasets: datasetsInd,
            title: 'Cumplimiento de elementos'
          };
          this.dataIndGen = {
            labels: labelsGen,
            datasets: datasetsIndGen,
            title: 'Cumplimiento general de evaluaciones'
          };
        }
      }
    );
  }

  cargarDataGraficas(datasetsInd: any) {


  }

}
