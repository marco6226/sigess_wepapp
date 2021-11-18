import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Area, Estructura } from 'app/modulos/empresa/entities/area';
import { ModeloGraficaService } from 'app/modulos/ind/services/modelo-grafica.service';
import { range, Observable } from 'rxjs';
import { FilterQuery } from '../../entities/filter-query';
import { Criteria } from '../../entities/filter';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { TreeNode } from 'primeng/api';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ParametroNavegacionService } from '../../services/parametro-navegacion.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UsuarioService]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    data: any;
    options: any;
    desde: Date;
    desdes: String;
    hastas: String;
    arrayIds = [];
    hasta: Date;
    options2: any;
    options3: any;
    options4: any;
    options5: any;
    options6: any;
    showData = false;
    testing = false;
    data2: any;
    data3: any;
    data4: any;
    data5: any;
    data6: any;
    data7: any;
    data8: any;
    data9: any;
    data10: any;
    data11: any;
    planeadas: any;
    ejecutadas: any;
    inptotal: any;
    planeadasat: any;
    ejecutadasat: any;
    inptotalat: any;
    planeadasauc: any;
    ejecutadasauc: any;
    inptotalauc: any;
    evtLogList: any[];
    cities1: any[];
    areaSelected: any;
    cities2: any[];
    show = false;
    mostrar = 2000;
    localeES = locale_es;
    value: Date;
    constructor(
        private usuarioService: UsuarioService,
        private indicadorService: ModeloGraficaService,
        private areaService: AreaService
    ) {

        var date = new Date();
        date.setFullYear(date.getFullYear() - 1);



        this.desde = date;

        this.hasta = new Date;

        this.desdes = moment(this.desde).utc().format('YYYY-MM-DD');
        this.hastas = moment(this.hasta).utc().format('YYYY-MM-DD');



        this.data = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Inspecciones programadas',
                    backgroundColor: '#00BCD4',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Inspecciones realizadas',
                    backgroundColor: '#37474F',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
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
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false,
                }]
            },
            type: 'horizontalBar',
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
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    }
                }],
                xAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    }
                }]
            },
            type: 'horizontalBar',
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
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false,
                }]
            },
            type: 'horizontalBar',
        }; this.options4 = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Cumplimiento AT',
                fontSize: 20
            },
            legend: {
                position: 'right'
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false, ticks: {
                        beginAtZero: true,
                        min: 0
                    }
                }]
            },
            type: 'horizontalBar',
        };
        this.options5 = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Eficacia Observaciones',
                fontSize: 20
            },
            legend: {
                position: 'right'
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false,
                }]
            },
            type: 'horizontalBar',
        };
        this.options6 = {
            title: {
                display: true,
                circumference: 50 * Math.PI,
                text: 'Efectividad AT',
                fontSize: 20
            },
            legend: {
                position: 'right'
            },
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false,
                }]
            },
            type: 'horizontalBar',
        };
        this.data2 = {
            labels: [''],
            datasets: [
                {
                    label: 'Sedes programadas',
                    backgroundColor: '#efb810',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Sedes Inspeccionadas',
                    backgroundColor: '#81D8D0',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        min: 0,
                        beginAtZero: true

                    }
                }],
                xAxes: [{
                    stacked: false
                }]
            },
            type: 'horizontal bar',
        };
        this.data3 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Hallazgos encontrados',
                    backgroundColor: '#747874',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Hallazgos gestionados',
                    backgroundColor: '#6CA752',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        }
        this.data4 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'AT ocurridos',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'AT investigados',
                    backgroundColor: '#09A0B6',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        };
        this.data5 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Observaciones reportadas',
                    backgroundColor: '#377DC0',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Observaciones aceptadas',
                    backgroundColor: '#FF60CA',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        }
        setTimeout(async () => {
            this.testing = true;
        }, 3000);
        this.data6 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Tareas planeadas',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Tareas gestionadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        }
        this.data7 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Tareas planeadas',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Tareas gestionadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        }
        this.data11 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Tareas planeadas',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Tareas gestionadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            options: {
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                    }]
                }
            }
        }
        // this.data7 = 42 + 4 ;
        this.data8 = 42 + 4;
        this.data9 = 41 + 4;

        this.data10 = "textosss";

    }
    ngOnDestroy(): void {
        localStorage.removeItem('url');
    }
    ngAfterViewInit(): void {



    }
    async ngOnInit() {

        setTimeout(() => {
            this.show = true
            this.showData = true;
            this.loadAreas();
        }, 3000);
        let arrtest = [1, 2, 4, 5, 4];


        this.usuarioService.consultarHistoriaLogin().then(
            resp => this.evtLogList = resp['data']
        );

        
    }

    actualizarArea(areas) {
        this.arrayIds = [];

        for (const area of areas) {
            this.arrayIds.push(area.id)
        }
        this.testing = false;
        this.updateCharts();
        this.updateCharts2();
        this.updateCharts3();
        this.updateCharts4();
        this.updateCharts5();
        this.updateCharts6();
        this.cumplimientoinp();
        this.cumplimientoAT();
        this.cumplimientoauc();
        setTimeout(() => {
            this.testing = true;
        }, 1000);

        

    }

    async updateCharts() {
        this.showData = false;
        this.data.labels = [];
        this.data.datasets.forEach((element, index) => {
            this.data.datasets[index].data = [];
        });

        let data: any = await this.indicadorService.findInpN(this.arrayIds, this.desdes, this.hastas)
        let date = new Date();

        if (data.length < 0) return false;

        for (const iterator of data) {

            this.data.labels.push(iterator[2])
            this.data.datasets[0].data.push(iterator[1])
            this.data.datasets[1].data.push(iterator[0])
        }

        this.showData = true;
    }
    async cumplimientoinp() {

        let data7: any = await this.indicadorService.findInptotal(this.arrayIds, this.desdes, this.hastas)


        if (data7[0][0] != null) {
            this.ejecutadas = data7[0][0];
            this.planeadas = data7[0][1];
            this.inptotal = (this.ejecutadas / this.planeadas) * 100;
            

        } else {
            this.data7 == null;
            this.inptotal = 0;
            
        }

    }
    async cumplimientoAT() {

        let data8: any = await this.indicadorService.findAttotal(this.arrayIds, this.desdes, this.hastas)


        if (data8[0][0] != null) {
            this.ejecutadasat = data8[0][0];
            this.planeadasat = data8[0][1];
            this.inptotalat = (this.ejecutadasat / this.planeadasat) * 100;


        }
        else
            this.data8 == null;

    }
    async cumplimientoauc() {

        let data9: any = await this.indicadorService.findAuctotal(this.arrayIds, this.desdes, this.hastas)


        if (data9[0][0] != null) {
            this.ejecutadasauc = data9[0][0];
            this.planeadasauc = data9[0][1];
            this.inptotalauc = (this.ejecutadasauc / this.planeadasauc) * 100;



        }
        else
            this.data9 == null;
    }
    async updateCharts2() {
        this.showData = false;

        this.data2.datasets.forEach((element, index) => {
            this.data2.datasets[index].data = [];
        });

        let data2: any = await this.indicadorService.findInpCobertura(this.arrayIds, this.desdes, this.hastas)


        if (data2.length < 0) return false;

        {
            this.data2.datasets[0].data.push(data2[0]);
            this.data2.datasets[1].data.push(data2[1]);

            this.showData = true;
        }
    }
    async updateCharts3() {
        this.showData = false;
        this.data3.labels = [];
        this.data3.datasets.forEach((element, index) => {
            this.data3.datasets[index].data = [];
        });

        let data3: any = await this.indicadorService.findInpEfectividad(this.arrayIds, this.desdes, this.hastas)


        if (data3.length < 0) return false;
        for (const iterator of data3) {


            this.data3.labels.push(iterator[2]);
            this.data3.datasets[0].data.push(iterator[1]);
            this.data3.datasets[1].data.push(iterator[0]);

            this.showData = true;
        }
    }
    async updateCharts4() {
        this.showData = false;
        this.data4.labels = [];
        this.data4.datasets.forEach((element, index) => {
            this.data4.datasets[index].data = [];
        });

        let data4: any = await this.indicadorService.findInpCoberturaAt(this.arrayIds, this.desdes, this.hastas)

        if (data4.length < 0) return false;
        for (const iterator of data4) {



            this.data4.labels.push(iterator[2]);
            this.data4.datasets[0].data.push(iterator[1]);
            this.data4.datasets[1].data.push(iterator[0]);

            this.showData = true;
        }
        
    }
    async updateCharts5() {
        this.showData = false;
        this.data5.labels = [];
        this.data5.datasets.forEach((element, index) => {
            this.data5.datasets[index].data = [];
        });

        let data5: any = await this.indicadorService.findInpEficaciaAuc(this.arrayIds, this.desdes, this.hastas)



        if (data5.length < 0) return false;
        for (const iterator of data5) {
            

            this.data5.labels.push(iterator[2]);
            this.data5.datasets[0].data.push(iterator[1]);
            this.data5.datasets[1].data.push(iterator[0]);

            this.showData = true;
        }
    }

    async updateCharts6() {
        this.showData = false;
        this.data6.labels = [];
        this.data6.datasets.forEach((element, index) => {
            this.data6.datasets[index].data = [];
        });

        let data6: any = await this.indicadorService.findInpEfectividadAt(this.arrayIds, this.desdes, this.hastas)

        if (data6.length < 0) return false;
        for (const iterator of data6) {
            

            this.data6.labels.push(iterator[2]);
            this.data6.datasets[0].data.push(iterator[1]);
            this.data6.datasets[1].data.push(iterator[0]);

            this.showData = true;
        }
    }


    selecFromDate(date: Date) {
        this.desdes = date.toISOString().slice(0, 10)
        date.toISOString().slice(.1)
        
    }

    selectToDate(date: Date) {
        this.hastas = date.toISOString().slice(0, 10);
        
        this.testing = false;
        this.updateCharts();
        this.updateCharts2();
        this.updateCharts3();
        this.updateCharts4();
        this.updateCharts5();
        this.updateCharts6();
        this.cumplimientoinp();
        this.cumplimientoAT();
        this.cumplimientoauc();
        setTimeout(() => {
            this.testing = true;
        }, 1000);


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


                for (const nivel1 of areasArry.data) {
                    this.arrayIds.push(nivel1)

                    for (const nivel2 of nivel1.areaList) {
                        this.arrayIds.push(nivel2)


                    }

                }


                let areasArray = [];

                for (let index = 0; index < 35; index++) {
                    let i = Math.floor(Math.random() * this.arrayIds.length)
                    areasArray.push(this.arrayIds[i]);

                }

                this.actualizarArea(areasArray)

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
                allComplete.fisica = true;
                if (allComplete.organi == true && allComplete.fisica == true) {

                }
            })
            .catch(err => {

            });
    }
}
