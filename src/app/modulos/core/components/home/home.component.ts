import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Area, Estructura } from 'app/modulos/empresa/entities/area';
import { ModeloGraficaService } from 'app/modulos/ind/services/modelo-grafica.service';
import { range } from 'rxjs';
import { FilterQuery } from '../../entities/filter-query';
import { Criteria } from '../../entities/filter';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { TreeNode } from 'primeng/api';
//import { setTimeout } from 'timers';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UsuarioService]
})
export class HomeComponent implements OnInit {
    data: any;
    options: any;
    desde: String;
    arrayIds = [];
    hasta: String;
    options2: any;
    options3: any;
    showData = false;
    data2: any;
    data3: any;
    evtLogList: any[];
    cities1: any[];
    areaSelected: any;
    cities2: any[];
    show = false;
    constructor(
        private usuarioService: UsuarioService,
        private indicadorService: ModeloGraficaService,
        private areaService: AreaService
    ) {
        let date = new Date();
        this.desde = `${date.getFullYear()}-${date.getMonth() - 4}-01`
        this.hasta = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
        this.cities1 = [
            { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
            { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
            { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
            { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
        ];

        //An array of cities
        this.cities2 = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        this.data = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Inspecciones programadas',
                    backgroundColor: '#e09076',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,]
                },
                {
                    label: 'Inspecciones realizadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 56, 27, 19, 60]
                }
            ]
        };
        this.options = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Cumplimiento Inspecciones',
                fontSize: 20
            },
            legend: {
                position: 'right'
            }
        };
        this.options2 = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Cobertura Inspecciones',
                fontSize: 20
            },
            legend: {
                position: 'right'
            }
        };
        this.options3 = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Efectividad Inspecciones',
                fontSize: 20
            },
            legend: {
                position: 'right'
            }
        };
        this.data2 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Inspecciones programadas',
                    backgroundColor: '#b7a6eb',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,]
                },
                {
                    label: 'Inspecciones realizadas',
                    backgroundColor: '#a6ebb7',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 56, 27, 19, 60]
                }
            ]
        };
        this.data3 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Inspecciones programadas',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40, 65]
                },
                {
                    label: 'Inspecciones realizadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 56, 27, 19, 60]
                }
            ]
        }

    }
    async ngOnInit() {
        setTimeout(() => {
            this.show = true
            this.showData = true;
            this.loadAreas();

        }, 1000);
        let arrtest = [1, 2, 4, 5, 4];


        this.usuarioService.consultarHistoriaLogin().then(
            resp => this.evtLogList = resp['data']
        );
    }
    async actualizarArea(areas) {
        this.arrayIds = [];
        console.log(areas);
        for (const area of areas) {
            this.arrayIds.push(area.id)
        }
        this.updateCharts();
    }
    async updateCharts() {
        this.showData = false;
        this.data.labels = [];
        this.data.datasets.forEach((element, index) => {
            this.data.datasets[index].data = [];
        });
        //0 = nrealiz, 1 = n_total, 2 name
        let data: any = await this.indicadorService.findInpN(this.arrayIds, this.desde, this.hasta)
        console.log(data);
        if(data.length < 0) return false;
       // console.log(data);
        for (const iterator of data) {
            console.log(iterator);
            this.data.labels.push(iterator[2])
            this.data.datasets[0].data.push(iterator[1])
            this.data.datasets[1].data.push(iterator[0])
        }
        console.log(this.data);
        this.showData = true;
    }


    selecFromDate(date: Date) {
        this.desde = date.toISOString().slice(0, 10)
        date.toISOString().slice(.1)
        console.log(date.toISOString().slice(0, 10));
    }

    selectToDate(date: Date) {
        this.hasta = date.toISOString().slice(0, 10);
        console.log(date.toISOString().slice(0, 10));
        this.updateCharts();
    }

    loadAreas() {
        let allComplete = {
            organi: false,
            fisica: false
        };

        // Consulta las areas de estructura organizacional
        let filterAreaQuery = new FilterQuery();
        filterAreaQuery.filterList = [
            { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
            { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
        ];
        this.areaService.findByFilter(filterAreaQuery)
            .then(data => {
                let root: TreeNode = {
                    label: '',
                    selectable: false,
                    expanded: true,
                };
                let areasArry: any = data;
                console.log(areasArry.data);
               
                    for (const nivel1 of areasArry.data) {
                        this.arrayIds.push(nivel1)    
                        console.log(nivel1.areaList);
                        for (const nivel2 of nivel1.areaList) {
                            this.arrayIds.push(nivel2)    

                            console.log(nivel2.areaList);  
                        }
                            
                    }
                       /*
                            areasArry.data.forEach(nivel3 => {
                                this.arrayIds.push(nivel3.id)
                                if (nivel3.areaList.length > 0) { 
                                    this.arrayIds.push(nivel3.id)
                                }
                            })*/
                   
                    let areasArray = [];
                    console.log( this.arrayIds.length);
                       for (let index = 0; index < 7; index++) {
                       let i =  Math.floor(Math.random() * this.arrayIds.length)
                        areasArray.push(this.arrayIds[i]);
                           
                       }
                       console.log(areasArray);
              this.actualizarArea(areasArray)
          // this.actualizarArea(this.areas)
                allComplete.organi = true;
                if (allComplete.organi == true && allComplete.fisica == true) {

                }
            })
            .catch(err => {

            });

        // Consulta las areas de estructura fisica
        let filterSedesQuery = new FilterQuery();
        filterSedesQuery.filterList = [
            { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
            { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
        ];
        this.areaService.findByFilter(filterSedesQuery)
            .then(data => {
                let root: TreeNode = {
                    label: '',
                    selectable: false,
                    expanded: true,
                };
                console.log(data);


                allComplete.fisica = true;
                if (allComplete.organi == true && allComplete.fisica == true) {

                }
            })
            .catch(err => {

            });
    }
}
