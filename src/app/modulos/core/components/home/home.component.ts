import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Area, Estructura } from 'app/modulos/empresa/entities/area';
import { ModeloGraficaService } from 'app/modulos/ind/services/modelo-grafica.service';
import { range } from 'rxjs';
import { FilterQuery } from '../../entities/filter-query';
import { Criteria } from '../../entities/filter';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { TreeNode } from 'primeng/api';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';

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
    options4: any;
    options5: any;
    options6: any;
    showData = false;
    data2: any;
    data3: any;
    data4: any;
    data5: any;
    data6: any;
    evtLogList: any[];
    cities1: any[];
    areaSelected: any;
    cities2: any[];
    show = false;
    localeES = locale_es;
    constructor(
        private usuarioService: UsuarioService,
        private indicadorService: ModeloGraficaService,
        private areaService: AreaService
    ) {
        let date = new Date();
        this.desde = `${date.getFullYear()}-${date.getMonth() - 8}-01`
        this.hasta = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
       
        this.data = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Inspecciones programadas',
                    backgroundColor: '#00BCD4',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,]
                },
                {
                    label: 'Inspecciones realizadas',
                    backgroundColor: '#37474F',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 56, 27, 19, 60]
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
                yAxes: [{stacked: false,
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
                yAxes: [{stacked: false,
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
                yAxes: [{stacked: false,
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
                yAxes: [{stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: false,ticks: {
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
                yAxes: [{stacked: false,
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
                yAxes: [{stacked: false,
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
            labels: ['Cobertura'],
            datasets: [
                {
                    label: 'Sedes programadas',
                    backgroundColor: '#283593',
                    borderColor: '#1E88E5',
                    data: []
                },
                {
                    label: 'Sedes Inspeccionadas',
                    backgroundColor: '#E91E63',
                    borderColor: '#7CB342',
                    data: []
                }
            ],
            scales: {
                yAxes: [{stacked: false,
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
                    data: [65]
                },
                {
                    label: 'Hallazgos gestionados',
                    backgroundColor: '#6CA752',
                    borderColor: '#7CB342',
                    data: [28]
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
        }
        this.data4 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'AT ocurridos',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: [65]
                },
                {
                    label: 'AT investigados',
                    backgroundColor: '#09A0B6',
                    borderColor: '#7CB342',
                    data: [28]
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
        };
        this.data5 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Observaciones reportadas',
                    backgroundColor: '#377DC0',
                    borderColor: '#1E88E5',
                    data: [65]
                },
                {
                    label: 'Observaciones aceptadas',
                    backgroundColor: '#FF60CA',
                    borderColor: '#7CB342',
                    data: [28]
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
        }
        this.data6 = {
            labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
            datasets: [
                {
                    label: 'Tareas planeadas',
                    backgroundColor: '#d9c077',
                    borderColor: '#1E88E5',
                    data: [65]
                },
                {
                    label: 'Tareas gestionadas',
                    backgroundColor: '#7790d9',
                    borderColor: '#7CB342',
                    data: [28]
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
        }
       
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
    async actualizarArea(areas) {
        this.arrayIds = [];
        
        for (const area of areas) {
            this.arrayIds.push(area.id)
        }
        this.updateCharts();
        this.updateCharts2();
        this.updateCharts3();
        this.updateCharts4();
        this.updateCharts5();
        this.updateCharts6();
       
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
        
        this.showData = true;
    }
    async updateCharts2() {
         this.showData = false;
       // this.data2.labels = ['Programadas', 'Realizadas'];
        this.data2.datasets.forEach((element, index) => {
            this.data2.datasets[index].data = [];
        });
        //0 = nrealiz, 1 = n_total, 2 name
        let data2: any = await  this.indicadorService.findInpCobertura(this.arrayIds, this.desde, this.hasta)
        if(data2.length < 0) return false;
        console.log(data2);
       
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
        
       let data3: any = await  this.indicadorService.findInpEfectividad(this.arrayIds, this.desde, this.hasta)
       if(data3.length < 0) return false;
       for (const iterator of data3) {
       console.log("efectividad");
       console.log(data3);
       
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
    
   let data4: any = await  this.indicadorService.findInpCoberturaAt(this.arrayIds, this.desde, this.hasta)
   if(data4.length < 0) return false;
   for (const iterator of data4) {
   console.log("cobertura at");
   console.log(data4);
   
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
    
   let data5: any = await  this.indicadorService.findInpEficaciaAuc(this.arrayIds, this.desde, this.hasta)
   if(data5.length < 0) return false;
   for (const iterator of data5) {
   console.log("eficaciaauc");
   console.log(data5);
   
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
    
   let data6: any = await  this.indicadorService.findInpEfectividadAt(this.arrayIds, this.desde, this.hasta)
   if(data6.length < 0) return false;
   for (const iterator of data6) {
   console.log("efectividad AT");
   console.log(data6);
   
   this.data6.labels.push(iterator[2]);            
   this.data6.datasets[0].data.push(iterator[1]);
   this.data6.datasets[1].data.push(iterator[0]);
  
   this.showData = true;
}
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
        this.updateCharts2();
        this.updateCharts3();
 		this.updateCharts4();
 		this.updateCharts5();
		 this.updateCharts6();
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
                        
                        for (const nivel2 of nivel1.areaList) {
                            this.arrayIds.push(nivel2)    

                              
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
                       for (let index = 0; index < 35; index++) {
                       let i =  Math.floor(Math.random() * this.arrayIds.length)
                        areasArray.push(this.arrayIds[i]);
                           
                       }
                      
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
