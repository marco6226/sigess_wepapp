import { Component, OnInit } from '@angular/core';
import { IndicadorEmpresaService } from '../../services/indicador-emp.service';
import { RangoModel } from '../../../comun/components/selector-rango-fechas/selector-rango-fechas.component';
import { Util } from '../../../comun/util';
import { Empleado } from '../../../empresa/entities/empleado';

@Component({
  selector: 'app-indicadores-emp',
  templateUrl: './indicadores-emp.component.html',
  styleUrls: ['./indicadores-emp.component.scss'],
  providers: [IndicadorEmpresaService]
})
export class IndicadoresEmpComponent implements OnInit {


  rangosCons: RangoModel[];
  chartsCons: any[];

  rangosEmp: RangoModel[];
  chartsEmp: any[];
  empleadoSelect: Empleado;

  indSelect: boolean = true;

  constructor(
    private indEmpService: IndicadorEmpresaService
  ) { }

  ngOnInit() {
    let anioActual = new Date().getFullYear();
    this.rangosCons = [
      { color: Util.randomColor(), desde: new Date((anioActual - 1), 0, 1), hasta: new Date((anioActual - 1), 11, 31) },
      { color: Util.randomColor(), desde: new Date(anioActual, 0, 1), hasta: new Date(anioActual, 11, 31) }
    ];
    this.rangosEmp = this.rangosCons.slice();
    this.construirGraficas(this.rangosCons);
  }

  onEmpleadoSelect(empleado: Empleado) {
    this.empleadoSelect = empleado;
    this.construirGraficas(this.rangosEmp, empleado.id);
  }

  construirGraficas(rangos:RangoModel[], empleadoId?:string) {
    this.indEmpService.consultar(rangos, empleadoId).then(
      resp => {
        let varChartsName = empleadoId ? 'chartsEmp' : 'chartsCons';
        this[varChartsName] = [];
        let data = <any[]>resp;

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
            case 'comp_tabla':
              type = 'table';
              break;
            default:
              type = 'bar';
          }

          let chart = {
            type: type,
            labels: d.labels,
            datasets: d.datasets,
            title: d.title,
          };
          this[varChartsName].push(chart);
        });
      }
    );
  }

  actualizarRangosCons(event: any) {
    this.construirGraficas(this.rangosCons, null);
  }

  actualizarRangosEmp(event: any) {
    this.construirGraficas(this.rangosEmp, this.empleadoSelect.id);
  }

}
