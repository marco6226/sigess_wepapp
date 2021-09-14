import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa'

import { Area } from 'app/modulos/empresa/entities/area'
import { ModeloGraficaService } from '../../services/modelo-grafica.service'
import { Util } from 'app/modulos/comun/util'

@Component({
    selector: 's-indicadoresInp',
    templateUrl: './indicadores-inp.component.html',
    styleUrls: ['./indicadores-inp.component.scss'],
    providers: [ModeloGraficaService]
})
export class IndicadoresInpComponent implements OnInit {

    @Input("empresa") empresa: Empresa;
    areaSelected: Area;
    rangoSelected: any;
    chartList: any[];

    constructor(
        private indicadorService: ModeloGraficaService,
    ) { }

    ngOnInit() {
        let anioActual = new Date().getFullYear();
        this.rangoSelected = [
            { desde: new Date(anioActual + '-01-01'), hasta: new Date(anioActual + '-06-30'), color: Util.randomColor() },
            { desde: new Date(anioActual + '-07-01'), hasta: new Date(anioActual + '-12-31'), color: Util.randomColor() }
        ];;
        this.actualizarGraficas(null, this.rangoSelected);
    }

    actualizarRangos(event) {
        this.rangoSelected = event;
        this.actualizarGraficas(this.areaSelected, this.rangoSelected);
    }

    actualizarArea(event) {
        this.areaSelected = event;
        this.actualizarGraficas(this.areaSelected, this.rangoSelected);
    }


    actualizarGraficas(area: Area, rangos: any[]) {
        let strRango: string = '{';
        rangos.forEach(rango => {
            strRango += '"[';
            strRango += rango.desde.toISOString();
            strRango += ',';
            strRango += rango.hasta.toISOString();
            strRango += ']",';
        });
        strRango = strRango.substring(0, strRango.length - 1);
        strRango += '}';
        this.indicadorService.findInp(area == null ? -1 : area.id, strRango, this.empresa == null ? null : this.empresa.id).then(
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
