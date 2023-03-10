import { Component, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { ReporteAtService } from "./../../services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
import { HhtService } from "app/modulos/empresa/services/hht.service";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { DataHht, Hht } from "app/modulos/empresa/entities/hht";
// import { multi} from './data';

class division {
  name: string;
  acumulado: number;
  meta: number;
  eventos: number;
  diasPerdidos: number;
  frecuencia: number;
  severidad: number;
}

@Component({
  selector: "s-accidentalidad",
  templateUrl: "./accidentalidad.component.html",
  styleUrls: ["./accidentalidad.component.scss"],
  providers: [HhtService, SesionService],
})

export class AccidentalidadComponent implements OnInit, AfterViewInit, OnDestroy {
  
  ili:number=0.0171;
  metaIli:number=0;
  colorIli?:string;
  categoriesCombo: any=[];
  seriesCombo: any=[];
  selectedAnioIli_1: number = new Date().getFullYear();
  dataIli_1: any;
  optionsIli_1: any = {
    title: 'ILI por división', 
    height: 400,
    width: 800,
    xAxis: {
      title: 'Divisiones',
      labelRotation: 300,
      labelAlign: 'middle', // left, middle, right,
      labelEllipsisSize: 80
    },
    yAxis: {
      leftTitle: 'ILI',
      rightTitle: 'Meta',
      labelEllipsisSize: 8
    },
    plotOptions: {
      groupBarPadding: 1,
      innerBarPadding: 3
    },
    legend: {
      labelEllipsisSize: 80
    }
  };
  optionsIli_2: any = {
    title: 'ILI por mes', 
    height: 400,
    width: 800,
    xAxis: {
        title: 'Meses',
        labelRotation: 300,
        labelAlign: 'middle', // left, middle, right,
        labelEllipsisSize: 80
    },
    yAxis: {
        leftTitle: 'ILI',
        rightTitle: 'Meta',
        labelEllipsisSize: 8
    },
    plotOptions: {
        groupBarPadding: 1,
        innerBarPadding: 3
    },
    legend: {
        labelEllipsisSize: 80
    }
  };
  dataIli_2: any;
  selectedAnioIli_2: number = new Date().getFullYear();
  multi: any[];
  localeES = locale_es;
  desde: Date;
  hasta: Date;
  NoEventos:number;
  diasPerdidos:number;
  incapacidades;
  areasPermiso: string;
  reporteat;
  filtroFechaAt: Date[] = [];
  filtroFechaDiasPerdidos: Date[] = [];
  desdes: Date;
  hastas: Date;
  pipe = new DatePipe('en-US');
  todayWithPipe = null;
  areaList: Area[] = [];
  divisiones= new Array();
  divisiones2= new Array();
  divisiones4= new Array();
  divisionS=null;
  divisiones5=[
    {name:'Enero',code:0},
    {name:'Febrero',code:1},
    {name:'Marzo',code:2},
    {name:'Abril',code:3},
    {name:'Mayo',code:4},
    {name:'Junio',code:5},
    {name:'Julio',code:6},
    {name:'Agosto',code:7},
    {name:'Septiembre',code:8},
    {name:'Octubre',code:9},
    {name:'Noviembre',code:10},
    {name:'Diciembre',code:11},
    {name:'Corona total',code:12}
  ]
  fieldsR: string[] = [
    'id'
  ];
  fieldsAD: string[] = [
    'incapacidades',
    'fechaElaboracion'
  ];
  fieldsD: string[] = [
    'analisisId'
  ];
  fieldR: string[] = [
    'id'
  ];

  view: any[] = [1200, 400];
  view2: any[] = [850, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  // options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Divisiones';
  xAxisLabel2 = 'Eventos AT/Días perdidos';
  xAxisLabel3 = 'Meses';
  showYAxisLabel = true;
  yAxisLabel = 'Días perdidos';
  yAxisLabel2 = 'Divisiones';
  yAxisLabel3 = 'Tasa frecuencia/Tasa Severidad (%)';
  legendTitle: string = 'Years';
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme2 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme3 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme4 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  title: string = 'Accidentalidad';
  data: [];
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  Meses= [
    {label:'Enero',value:'Enero'},
    {label:'Febrero',value:'Febrero'},
    {label:'Marzo',value:'Marzo'},
    {label:'Abril',value:'Abril'},
    {label:'Mayo',value:'Mayo'},
    {label:'Junio',value:'Junio'},
    {label:'Julio',value:'Julio'},
    {label:'Agosto',value:'Agosto'},
    {label:'Septiembre',value:'Septiembre'},
    {label:'Octubre',value:'Octubre'},
    {label:'Noviembre',value:'Noviembre'},
    {label:'Diciembre',value:'Diciembre'}
  ];
  selectedDivisionResumen: string = null;
  selectDivisiones1: any[] = [];
  selectIndicarores1: any[] = [];
  selectDivisiones2: any[] = [];
  selectDivisionesILI1: any[] = [];
  selectDivisionesILI2: any[] = [];
  selectIndicarores2: any[] = [];
  selectMeses1: any[] = [];
  selectMeses2: any[] = [];
  selectMesesILI2: any[] = [];
  selectEventos1: any[] = [];
  selectEventos2: any[] = [];
  mesesILI2: string[] = [];
  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Proporción AT mortal', value: 2}];
  Eventos: any[] = [{label: 'Numero AT', value: 0}, {label: 'Numero días perdidos', value: 1}, {label: 'Numero AT mortales', value: 2}, {label: 'Numero AT con cero días', value: 3}];
  dataEventos1: any[];
  evento1Desde: Date | null = null;
  evento1Hasta: Date | null = null;
  randomEv2: any[];
  tasaFrecuencia1: any[];
  tasaFrecuencia2: any[];
  tasaDesde: Date = new Date();
  tasaHasta: Date = new Date();
  tasasNotFound: boolean = false;
  tasasNotFound2: boolean = false;
  filtroAnioTasa_1: number = new Date().getFullYear();
  divisionesCorona: string[] = ['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
  divisionesCoronaConId: any[] = [];
  divisionesCoronaIli1: string[] = [];
  filtroAnioTasa_2: number = new Date().getFullYear();
  filtroDivisionesTasa_2: string[] = [];
  filtroDivisionEventos2: any[] = [];
  filtroMesesIli_1: any[] = []; 
  dataEventos2: any[] = [];
  filtroAnioEventos2: number = new Date().getFullYear();
  randomILI: any[];
  randomILI2: any[];
  randomILI2_2: any[];
  randomILI3: any[];
  randomILI3_2: any[];
  randomEv1Dona: any[];
  randomEv2Dona: any[];
  randomEv3Dona: any[];
  randomEv1Donadb: any[];
  randomEv2Donadb: any[];
  randomEv3Donadb: any[];
  flagdiv1:boolean=false;
  flagdiv2:boolean=false;
  flagevent2:boolean=false;
  flagILI2:boolean=false;
  flagILI2_2:boolean=false;
  flagILI3:boolean=false;
  flagILI3_2:boolean=false;
  hastaEv2: Date=new Date(Date.now());
  hastaIn1: Date=new Date(Date.now());
  hastaIn2: Date=new Date(Date.now());
  hastaILI1: Date=new Date(Date.now());
  hastaILI2: Date=new Date(Date.now());
  hastaILI3: Date=new Date(Date.now());
  hastaILI1_2: Date=new Date(Date.now());
  hastaILI2_2: Date=new Date(Date.now());
  hastaILI3_2: Date=new Date(Date.now());
  desdeEv2: Date;
  desdeIn1: Date;
  desdeIn2: Date;
  desdeILI1: Date;
  desdeILI2: Date;
  desdeILI3: Date;
  desdeILI1_2: Date;
  desdeILI2_2: Date;
  desdeILI3_2: Date;
  divisiones3: any[];
  reporteTabla
  reporteTabla2
  totalDiasPerdidosDv: any[];
  totalEventosDv: any[];
  totalEventosDv2: any[];
  totalDiasEventos: any[];
  random: any[];

  constructor(
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService,
    private hhtService: HhtService,
    private sessionService: SesionService
    ) { 
      // Object.assign(this, { multi })
      }
    flag:boolean=false
    flag1:boolean=false
    flagdiv:boolean=false
    flagevent:boolean=false
    flagtasa1:boolean=false
    flagtasa2:boolean=false
    flagtasaILI:boolean=false
    yearRange = new Array();
    añoPrimero:number=2015;
    dateValue= new Date();
    añoActual:number=this.dateValue.getFullYear();
    yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);
    
  ngAfterViewInit(){
    this.cargarEventosAt().then(() => {
      this.tasaDesde.setMonth(new Date().getMonth()-1);
      this.tasaDesde.setDate(1);
      this.tasaHasta.setDate(1);

      this.getEventosAt();
      this.getDiasPerdidosAt();
      this.getTasas_1();
      this.getTasas_2();
      this.getEventos_1();
      this.getEventos_2();
      this.getIli_1();
      this.getIli_2();
    }).catch((e) => {
      console.error('error: ', e);
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('tasaFrecuencia2');
    localStorage.removeItem('dataEventos1');
    localStorage.removeItem('dataEventos2');
    localStorage.removeItem('dataIli_1');
    localStorage.removeItem('dataIli_2');
  }

  async ngOnInit() {
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('tasaFrecuencia2');
    localStorage.removeItem('dataEventos1');
    localStorage.removeItem('dataEventos2');
    localStorage.removeItem('dataIli_1');
    localStorage.removeItem('dataIli_2');

    if(this.ili<=this.metaIli){
    this.colorIli="card l-bg-green-dark"}
    else {this.colorIli="card l-bg-red-dark"}

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    this.getData().then();
    
    this.loadResumen();
  }

  async getData(){
    this.hastas= new Date(Date.now())
    this.desdes=null
    this.hasta= new Date(Date.now())
    this.desde=null

    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre", "id"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    this.divisiones2=[]
    this.divisiones4=[]
    this.divisiones.push({label:'Total',value:'Total'})
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      resp => {
        this.areaList = <Area[]>resp['data'];
        let cont=0
        this.areaList.forEach(element => {
          this.divisionesCoronaConId.push({nombre: element.nombre, id: element.id});
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
          this.divisiones2.push({label:element['nombre'],value:element['nombre']})
          this.divisiones4.push({name:element['nombre'],code:cont})
          cont+=1
        });
        this.divisiones4.push({name:'Corona total',code:cont})
        this.divisiones2.push({label:'Corona total',value:'Corona total'})
      }
    );
      // console.log(this.divisiones2)
      this.reporteTabla=[]
      this.reporteTabla2=[]
      this.totalDiasPerdidosDv=[]
      this.totalEventosDv=[]
      this.totalEventosDv2=[]
      this.totalDiasEventos=[]
      await this.reporteAtService.findAllRAT()
      .then(res => {
        this.reporteTabla=res
        
        this.areaList.forEach(element => {
          let cont: number = 0;
          let diasPerdidos: number=0

          this.reporteTabla.forEach(element2 =>{
            if(element['nombre']==element2['padreNombre']){
              cont+=1;
              if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
                diasPerdidos+=JSON.parse(element2['incapacidades']).length
              }
            }
          })
          this.totalDiasPerdidosDv.push({name:element['nombre'],value:diasPerdidos})
          this.totalEventosDv.push({name:element['nombre'],value:cont})
          this.reporteTabla2.push({nombre:element['nombre'],eventos:cont,dias_Perdidos:diasPerdidos})
          this.totalDiasEventos.push({name:element['nombre'],series:[{name:'Eventos AT',value:cont},{name:'Días perdidos',value:diasPerdidos}]})
        });
      });
      this.totalEventosDv2=this.totalEventosDv
      this.data = this.reporteTabla2;
  }

  loadResumen(){
    
    let date: Date = new Date(new Date(this.hastas).setMonth(new Date(this.hastas).getMonth()+1));
    this.reporteAtService.findAllRAT().then(async (resp)=>{
      this.reporteat = resp
      let result: any[] = await this.reporteat.filter(word => {
        return new Date(word['fechaReporte'])> this.desdes && new Date(word['fechaReporte'])< date
      });

      if(this.selectedDivisionResumen && this.selectedDivisionResumen !== 'Total') result = result.filter(at => at.padreNombre === this.selectedDivisionResumen);

      //No. de reportes
      this.NoEventos= result.length;

      //No. de días perdidos
      this.diasPerdidos=0;
      result.forEach(element => {
        if(element['incapacidades']!=null && element['incapacidades']!='null'){
          this.diasPerdidos = this.diasPerdidos + JSON.parse(element['incapacidades'])
                                                      .reduce((count, incapacidad) => {
                                                        return count + incapacidad.diasAusencia;
                                                      }, 0);
        }
      });
    });

    let filterQuery = new FilterQuery();
    let empresaId = this.sessionService.getEmpresa().id; 
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: date.getFullYear().toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    this.hhtService.findByFilter(filterQuery)
    .then((res: any) => {
      if(res.data.length > 0){
        // console.log('res:',res);
        // console.log('data',res.data);
        // console.log('ILI_Anual:', JSON.parse(res.data[0].valor).ILI_Anual);
        this.metaIli = JSON.parse(res.data[0].valor).ILI_Anual;
        // console.log('meta', this.metaIli);
      }
    });
  }

  async cargarEventosAt(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.reporteAtService.findAllRAT().then((reportesAt: any[]) => {
        localStorage.setItem('reportesAt', JSON.stringify(reportesAt.map(rep => rep)));
        resolve(true);
      }).catch((err) => {
        reject(false);
      })
    });
  }

  //Eventos At
  getEventosAt(filter?: string){
    this.filtroFechaAt = [];
    let divisiones: string[] = [];
    let randomEv1Dona: any[] = [];
    let auxRandomEv1Dona = [];
    let padreNombreList = [];
    let reporteAt = JSON.parse(localStorage.getItem('reportesAt')).map(at => at);
    reporteAt.forEach((at: any) => {
      padreNombreList.push(at.padreNombre);
    });
    padreNombreList.forEach((item: string) => {
      if(!divisiones.includes(item)){
        divisiones.push(item);
      }
    });
    divisiones.sort();
    try {
      switch(filter){
        case 'temp':
          let eventosAttemp = [];
          divisiones.forEach(
            division => {
              let data = {name: division, value: 0};
              auxRandomEv1Dona = auxRandomEv1Dona.concat(reporteAt.filter(at => at.padreNombre === division && at.temporal));
              data.value = reporteAt.filter(at => at.padreNombre === division && at.temporal).length;
              eventosAttemp.push(data);
            }
          );
          randomEv1Dona.push(...eventosAttemp);
          Object.assign(this, {randomEv1Dona});
          break;
        case 'dir':
          let eventosAtdir = [];
          divisiones.forEach(
            division => {
              let data = {name: division, value: 0};
              auxRandomEv1Dona = auxRandomEv1Dona.concat(reporteAt.filter(at => at.padreNombre === division && at.temporal ==null));
              data.value = reporteAt.filter(at => at.padreNombre === division && at.temporal == null).length;
              eventosAtdir.push(data);
            }
          );
          randomEv1Dona.push(...eventosAtdir);
          Object.assign(this, {randomEv1Dona});
          break;
        default:
          throw 'error';
      }
    }catch(err){
      let eventosAt = [];
      divisiones.forEach(
        division => {
          let data = {name: division, value: 0};
          auxRandomEv1Dona = auxRandomEv1Dona.concat(reporteAt.filter(at => at.padreNombre === division));
          data.value = reporteAt.filter(at => at.padreNombre === division).length;
          eventosAt.push(data);
        }
      );
      randomEv1Dona.push(...eventosAt);
      Object.assign(this, {randomEv1Dona});
    }
    localStorage.setItem('reporteAtList', JSON.stringify(reporteAt.map(at => at)));
  }

  selectRangoEventosAt(event: Date, filter: string){

    if(typeof this.filtroFechaAt === "undefined") this.filtroFechaAt = [];

    if(filter === 'desde'){
      this.filtroFechaAt[0] = event;
    }else if(filter === 'hasta'){
      this.filtroFechaAt[1] = event;
    }
    
    if(this.filtroFechaAt[0] && this.filtroFechaAt[1]){
      let dataEv1Dona: any[] = JSON.parse(localStorage.getItem('reporteAtList'));
      let listaDivisiones: any[] = dataEv1Dona.map(at => at.padreNombre);
      let divisiones: any[] = listaDivisiones.filter((item, index) => {
        return listaDivisiones.indexOf(item) === index;
      });

      let dateFinal: Date = new Date(new Date(this.filtroFechaAt[1]).setMonth(new Date(this.filtroFechaAt[1]).getMonth()+1));
      dataEv1Dona = dataEv1Dona.filter(at => at.fechaReporte >= this.filtroFechaAt[0] && at.fechaReporte <= dateFinal);
      let randomEv1Dona: any[] = [];
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        data.value = dataEv1Dona.filter(at => at.padreNombre === division).length;
        randomEv1Dona.push(data);
      });
      Object.assign(this, {randomEv1Dona});
    }
  }

  //Dias perdidos
  getDiasPerdidosAt(filter?: string){
    this.filtroFechaDiasPerdidos = [];
    this.filtroFechaAt = [];
    let divisiones: string[] = [];
    let randomEv1Donadb = [];
    let auxRandomEv1Donadb = [];
    let listaDivisionesDp;
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt'));
    listaDivisionesDp = reportesAt.map(atDp => atDp.padreNombre);
    divisiones = listaDivisionesDp.filter((item, index) => {
      return listaDivisionesDp.indexOf(item) === index; 
    }).sort();
    try {
      switch(filter){
        case 'temp':
          divisiones.forEach(division => {
            let data = {name: division, value: 0};
            auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                            && at.incapacidades !== 'null' && at.temporal));
            data.value = reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                && at.incapacidades !== 'null' && at.temporal)
                                  .reduce((count, itemActual) => {
                                    return count + JSON.parse(itemActual.incapacidades).reduce((count2, dataIncapacidad) => {
                                      return count2 + dataIncapacidad.diasAusencia;
                                    }, 0);
                                  }, 0);
            randomEv1Donadb.push(data);
          });
          Object.assign(this, {randomEv1Donadb});
          break;
        case 'dir':
          divisiones.forEach(division => {
            let data = {name: division, value: 0};
            auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                                                  && at.incapacidades !== 'null' && !at.temporal));
            data.value = reportesAt
                          .filter(at => at.padreNombre === division 
                                          && at.incapacidades !== null 
                                          && at.incapacidades !== 'null' && !at.temporal)
                          .reduce((cont, itemActual) => {
                            return cont + JSON.parse(itemActual.incapacidades).reduce((cont2, dataIncapacidad) => {
                              return cont2 + dataIncapacidad.diasAusencia;
                            }, 0);
                          }, 0);
            randomEv1Donadb.push(data);
          });
          Object.assign(this, {randomEv1Donadb});
          break;
        default:
          throw 'error';
        }
    }catch (error) {
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                                              && at.incapacidades !== 'null'));
        data.value = reportesAt
                      .filter(at => at.padreNombre === division && at.incapacidades !== null && at.incapacidades !== 'null')
                      .reduce((count, itemActual) => {
                        return count + JSON.parse(itemActual.incapacidades).reduce((count2, dataIncapacidad) => {
                          return count2 + dataIncapacidad.diasAusencia;
                        }, 0);
                      }, 0);
        randomEv1Donadb.push(data);
      });
      Object.assign(this, {randomEv1Donadb});
    }
    localStorage.setItem('diasPerdidosAtList', JSON.stringify(auxRandomEv1Donadb.map(at => at)));
  }

  selectRangoDiasPerdidosAt(event: Date, filter: string){
    if(typeof this.filtroFechaDiasPerdidos === "undefined") this.filtroFechaDiasPerdidos = [];

    if(filter === 'desde'){
      this.filtroFechaDiasPerdidos[0] = new Date(event);
    }else if(filter === 'hasta'){
      this.filtroFechaDiasPerdidos[1] = new Date(event);
    }
    
    if(this.filtroFechaDiasPerdidos[0] && this.filtroFechaDiasPerdidos[1]){
      let dataDiasPerdidosAtList: any[] = JSON.parse(localStorage.getItem('diasPerdidosAtList'));
      let listaDivisiones: any[] = dataDiasPerdidosAtList.map(at => at.padreNombre);
      let divisiones: any[] = listaDivisiones.filter((item, index) => {
        return listaDivisiones.indexOf(item) === index;
      });

      let dateFinal: Date = new Date(new Date(this.filtroFechaDiasPerdidos[1]).setMonth(new Date(this.filtroFechaDiasPerdidos[1]).getMonth()+1));
      dataDiasPerdidosAtList = dataDiasPerdidosAtList.filter(at => at.fechaReporte > this.filtroFechaDiasPerdidos[0] && at.fechaReporte < dateFinal);
      let randomEv1Donadb: any[] = [];
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        data.value = dataDiasPerdidosAtList.filter(at => at.padreNombre === division && at.incapacidades != null && at.incapacidades != 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2, dataIncapacidad) => {
                                                return count2 + dataIncapacidad.diasAusencia;
                                              }, 0)
                                            }, 0);
        randomEv1Donadb.push(data);
      });
      Object.assign(this, {randomEv1Donadb});
    }
  }

  // Tasas
  async getTasas_1(filter?: string){
    let tasaFrecuencia1: any[] = [];
    let filterQuery = new FilterQuery();

    if(!this.tasaDesde && !this.tasaHasta) return;
    
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).filter(at => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_1);
    let listaDivisiones: any[] = reportesAt.map(at => at.padreNombre);
    let divisiones: any[] = listaDivisiones.filter((item, index) => {
      return listaDivisiones.indexOf(item) === index;
    }).sort();

    try{
      switch (filter) {
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal);
          throw 'temp';
        default:
          throw 'err';
      }
    }catch (e){
      // if(this.tasaDesde && this.tasaHasta){
      //   reportesAt = reportesAt.filter(at => at.fechaReporte > this.tasaDesde && at.fechaReporte < this.tasaHasta);
      // }
      filterQuery.sortOrder = SortOrder.ASC;
      filterQuery.sortField = "id";
      filterQuery.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresaSelect", value1: '22'}
      ];
      
      this.hhtService.findByFilter(filterQuery).then((res: any) => {
        
        if(res.data.length > 0) {
          
          this.divisionesCoronaConId.forEach(division => {
            
            let trabajadoresTotales = 0;
            let data = {
              name: division.nombre,
              series: []
            };
            
            res.data.forEach(elem => {
              let data: DataHht = <DataHht>JSON.parse(elem.valor).Data;
              let trabajadoresPorArea = 0;
              data.Areas.forEach(area => {
                if(division.id == area.id){
                  if(area.Plantas.length > 0){
                    trabajadoresPorArea += area.Plantas.reduce((count, planta) => {
                      if(planta.NumPersonasPlanta != null) return count + planta.NumPersonasPlanta;
                      return count;
                    }, 0);
                  }else{
                    trabajadoresPorArea += area.NumPersonasArea;
                  }
                }
              });
              trabajadoresTotales = trabajadoresTotales + trabajadoresPorArea;
            });
            // console.log(trabajadoresTotales);
            // debugger
            let totalAt = reportesAt.filter(at => at.padreNombre === division.nombre).length;
            let diasPerdidos = reportesAt.filter(at => at.padreNombre === division.nombre && at.incapacidades !== null 
                                                        && at.incapacidades !== 'null')
                                          .reduce((count, item) => {
                                            return count + JSON.parse(item.incapacidades).reduce((count2, incapacidad) => {
                                              return count2 + incapacidad.diasAusencia;
                                            }, 0);
                                          }, 0);
            let AtMortales = reportesAt.filter(at => at.padreNombre === division.nombre && at.causoMuerte === true).length;
            
            let TF = isNaN(Number((totalAt * 100)/trabajadoresTotales)) ? 0.0 : Number(Number((totalAt * 100)/trabajadoresTotales).toFixed(3));
            let TS = isNaN(Number((diasPerdidos * 100)/trabajadoresTotales)) ? 0.0 : Number(Number((diasPerdidos * 100)/trabajadoresTotales).toFixed(3));
            let PAT = isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(3));
            data.series.push({
              name: 'Tasa de Frecuencia',
              value: TF
            });
            data.series.push({
              name: 'Tasa de Severidad',
              value: TS
            });
            data.series.push({
              name: 'Proporción AT mortal',
              value: PAT
            });
            // console.log(TF, TS, PAT, ' : ', totalAt, diasPerdidos, AtMortales);
            
            tasaFrecuencia1.push(data);
          });
          // Corona total
          let dataTotal = {
            name: 'Corona total',
            series: []
          };
          
          dataTotal.series.push({
            name: 'Tasa de Frecuencia',
            value: tasaFrecuencia1.map(tasaXDiv => {
                      return tasaXDiv.series.find(tasa => tasa.name == 'Tasa de Frecuencia').value;
                    }).reduce((count, item) => count + item)
          });
          dataTotal.series.push({
            name: 'Tasa de Severidad',
            value: tasaFrecuencia1.map(tasaXDiv => {
                      return tasaXDiv.series.find(tasa => tasa.name == 'Tasa de Severidad').value;
                    }).reduce((count, item) => count + item)
          });
          dataTotal.series.push({
            name: 'Proporción AT mortal',
            value: tasaFrecuencia1.map(tasaXDiv => {
                      return tasaXDiv.series.find(tasa => tasa.name == 'Proporción AT mortal').value;
                    }).reduce((count, item) => count + item)
          });
          
          tasaFrecuencia1.push(dataTotal);
          // Fin Corona total
          
          Object.assign(this, {tasaFrecuencia1});
          localStorage.setItem('tasaFrecuencia1', JSON.stringify(tasaFrecuencia1.map(item => item)));
          this.filtroTasas1_1();
          
          this.tasasNotFound = false;
        }else{
          this.tasasNotFound = true;
        };
      });
    }
  }

  filtroTasas1_1() {
    let tasaFrecuencia1: any[] = JSON.parse(localStorage.getItem('tasaFrecuencia1'));
    if(this.selectDivisiones1.length > 0){
      let divisiones = this.selectDivisiones1.map(div => div.value);
      tasaFrecuencia1 = tasaFrecuencia1.filter(tasasXDivision => divisiones.includes(tasasXDivision.name));
    }
    if(this.selectIndicarores1.length > 0){
      let indicadores = this.selectIndicarores1.map(indicador => indicador.label);
      tasaFrecuencia1.forEach(tf1 => {
        tf1.series = tf1.series.filter(dataSeries => indicadores.includes(dataSeries.name));
      });
    }
    Object.assign(this, {tasaFrecuencia1});
  }

  getTasas_2(filter?: string){
    let tasaFrecuencia2: any[] = [];
    let filterQuery = new FilterQuery();

    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).filter(at => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_2);
    let listaDivisiones: any[] = reportesAt.map(at => at.padreNombre);
    let divisiones: any[] = listaDivisiones.filter((item, index) => {
      return listaDivisiones.indexOf(item) === index;
    }).sort();

    try {
      switch (filter) {
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal);
          throw 'temp';
        default:
          throw 'err';
      }
    } catch (error) {
      
      if(this.filtroDivisionesTasa_2.length > 0) reportesAt = reportesAt.filter(at => this.filtroDivisionesTasa_2.includes(at.padreNombre));
      // console.log(reportesAt);

      filterQuery.sortOrder = SortOrder.ASC;
      filterQuery.sortField = "id";
      filterQuery.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaSelect", value1: '22'}
      ];

      this.hhtService.findByFilter(filterQuery).then((res: any) => {
        if(res.data.length > 0){
          this.Meses.forEach((mes, index) => {

            let trabajadoresTotales2 = 0;
            let totalAt = 0;
            let diasPerdidos = 0;
            let atMortales = 0;
            let data = {
              name: mes.label,
              series: []
            };

            res.data.forEach(elem => {
              let data: DataHht = <DataHht>JSON.parse(elem.valor).Data;
              let trabajadoresPorArea = 0;
              // console.log(data.mes, mes.label);
              
              if(data.mes === mes.label){
                data.Areas.forEach(area => {
                  if(area.Plantas.length > 0){
                    trabajadoresPorArea += area.Plantas.reduce((count, planta) => {
                      if(planta.NumPersonasPlanta != null) return count + planta.NumPersonasPlanta;
                      return count;
                    }, 0);
                  }else{
                    trabajadoresPorArea += area.NumPersonasArea;
                  }
                });
              }
              trabajadoresTotales2 = trabajadoresTotales2 + trabajadoresPorArea;
            });
            // console.log(trabajadoresTotales2);
            // debugger
            totalAt = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth()).length;
            
            diasPerdidos = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                  .reduce((count, item) => {
                                                    return count + JSON.parse(item.incapacidades).reduce((count2, incapacidad) => {
                                                      return count2 + incapacidad.diasAusencia;
                                                    }, 0);
                                                  }, 0);
            atMortales = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;

            let tasaFrecuencia = Number(Number((totalAt * 100)/trabajadoresTotales2).toFixed(3));
            data.series.push({
              name: 'Tasa de Frecuencia',
              value: isNaN(tasaFrecuencia) || tasaFrecuencia === Infinity ? 0.0 : tasaFrecuencia
            });
            let tasaSeveridad = Number(Number((diasPerdidos * 100)/trabajadoresTotales2).toFixed(3));
            data.series.push({
              name: 'Tasa de Severidad',
              value: isNaN(tasaSeveridad) || tasaSeveridad === Infinity ? 0.0 : tasaSeveridad
            });
            let proporcionAtMortal = Number(Number((atMortales * 100)/totalAt).toFixed(3));
            data.series.push({
              name: 'Proporción AT mortal',
              value: isNaN(proporcionAtMortal) || proporcionAtMortal === Infinity ? 0.0 : proporcionAtMortal 
            });
            // console.log(totalAt, diasPerdidos, atMortales, ' : ', tasaFrecuencia, tasaSeveridad, proporcionAtMortal);
            
            tasaFrecuencia2.push(data);
          });
          
          localStorage.setItem('tasaFrecuencia2', JSON.stringify(tasaFrecuencia2));
          Object.assign(this, {tasaFrecuencia2});
          this.filtroTasas_2();
          this.tasasNotFound2 = false;
        }else{
          this.tasasNotFound2 = true;
        }
      });
    }
  }

  filtroTasas_2(){

    let tasaFrecuencia2 = JSON.parse(localStorage.getItem('tasaFrecuencia2'));
    if(this.selectMeses1.length > 0){
      tasaFrecuencia2 = tasaFrecuencia2.filter(tasaXMes => this.selectMeses1.includes(tasaXMes.name));
    }

    if(this.selectIndicarores2.length > 0){
      let indicadores = this.selectIndicarores2.map(el => el.label);
      tasaFrecuencia2 = tasaFrecuencia2.map(tasaXMes => {
        return {
          name: tasaXMes.name,
          series: tasaXMes.series.filter(el => indicadores.includes(el.name))
        }
      })
    }

    Object.assign(this, {tasaFrecuencia2});
  }

  getEventos_1(filtro?: string){
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt'));
    let dataEventos1: any[] = [];
    let listaDivisiones = reportesAt.map(at => at.padreNombre);
    let divisiones = listaDivisiones.filter((div, index) => {
      return listaDivisiones.indexOf(div) === index;
    }).sort();
    try{
      switch (filtro) {
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal !== null);
          throw 'temp';
        default:
          throw 'err';
      }
    }catch(err){
      if(this.evento1Desde && this.evento1Hasta) {
        let dateFinal: Date = new Date(new Date(this.evento1Hasta).setMonth(new Date(this.evento1Hasta).getMonth()+1));
        reportesAt = reportesAt.filter(at => at.fechaReporte > this.evento1Desde && at.fechaReporte < dateFinal);
      };
      
      let numAtTotal = 0;
      let diasPerdidosTotal = 0;
      let atMortalesTotales = 0;
      let atCeroDiasTotales = 0;

      divisiones.forEach((division: any) => {
        let data = {
          name: division,
          series: []
        }

        let numeroAt: number = reportesAt.filter(at => at.padreNombre === division).length;
        let diasPerdidos: number = reportesAt.filter(at => at.padreNombre===division && at.incapacidades!==null && at.incapacidades!=='null')
                                      .reduce((count, incapacidades) => {
                                        return count + JSON.parse(incapacidades.incapacidades).reduce((count2, incapacidad) => {
                                          return count2 + incapacidad.diasAusencia;
                                        }, 0);
                                      }, 0);
        let atMortales: number = reportesAt.filter(at => at.padreNombre === division && at.causoMuerte == true).length;
        let atCeroDias: number = reportesAt.filter(at => at.padreNombre === division && (at.incapacidades === null || at.incapacidades === 'null')).length;
        // console.log('div:',division,'numat:', numeroAt,'dperd:', diasPerdidos,'atmort:', atMortales,'atcero:', atCeroDias);
        numAtTotal += numeroAt;
        diasPerdidosTotal += diasPerdidos;
        atMortalesTotales += atMortales;
        atCeroDiasTotales += atCeroDias;

        data.series.push({
          name: this.Eventos[0].label,
          value: numeroAt
        });
        data.series.push({
          name: this.Eventos[1].label,
          value: diasPerdidos
        });
        data.series.push({
          name: this.Eventos[2].label,
          value: atMortales
        });
        data.series.push({
          name: this.Eventos[3].label,
          value: atCeroDias
        });

        dataEventos1.push(data);
      });
      
      let dataTotal = {
        name: 'Corona total',
        series: []
      }

      dataTotal.series.push({
        name: this.Eventos[0].label,
        value: numAtTotal
      });
      dataTotal.series.push({
        name: this.Eventos[1].label,
        value: diasPerdidosTotal
      });
      dataTotal.series.push({
        name: this.Eventos[2].label,
        value: atMortalesTotales
      });
      dataTotal.series.push({
        name: this.Eventos[3].label,
        value: atCeroDiasTotales
      });

      dataEventos1.push(dataTotal);

      Object.assign(this, {dataEventos1});
      localStorage.setItem('dataEventos1', JSON.stringify(dataEventos1.map(data => data)));
      this.filtroEventos_1();
    }
  }

  filtroEventos_1(){
    let dataEventos1: any[] = JSON.parse(localStorage.getItem('dataEventos1'));
    if(this.selectDivisiones2.length > 0){
      let divisiones = this.selectDivisiones2.map(div => div.label)
      dataEventos1 = dataEventos1.filter(data => divisiones.includes(data.name));
    }

    if(this.selectEventos1.length > 0){
      let eventos = this.selectEventos1.map(ev => ev.label);
      dataEventos1 = dataEventos1.map(data => {
        return {
          name: data.name,
          series: data.series.filter(item => eventos.includes(item.name))
        }
      });
    }

    Object.assign(this, {dataEventos1});
  }

  getEventos_2(filtros?: string){
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).filter(at => new Date(at.fechaReporte).getFullYear() === this.filtroAnioEventos2);
    let dataEventos2: any[] = [];
    
    try{
      switch(filtros){
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal !== null);
          throw 'temp';
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        default: 
          throw 'err';
      }
    }catch(e){
      if(this.filtroDivisionEventos2.length > 0) reportesAt = reportesAt.filter(at => this.filtroDivisionEventos2.includes(at.padreNombre));
      this.Meses.forEach((mes, index) => {
        // if(this.Meses.length === index + 1) return;
        let data = {
          name: mes.label,
          series: []
        };

        let numeroAt = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index).length;
        let diasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index
                                                &&  at.incapacidades !== null && at.incapacidades !== 'null')
                                      .reduce((count, at) => {
                                        return count + JSON.parse(at.incapacidades).reduce((count2, incapacidad) => {
                                          return count2 + incapacidad.diasAusencia;
                                        }, 0);
                                      }, 0);
        let atMortales = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index && at.causoMuerte).length;
        let atCeroDias = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index &&
                                                (at.incapacidades === null || at.incapacidades === 'null')).length;
        
        data.series.push({
          name: this.Eventos[0].label,
          value: numeroAt
        });
        data.series.push({
          name: this.Eventos[1].label,
          value: diasPerdidos
        });
        data.series.push({
          name: this.Eventos[2].label,
          value: atMortales
        });
        data.series.push({
          name: this.Eventos[3].label,
          value: atCeroDias
        });
        
        dataEventos2.push(data);
      });
      Object.assign(this, {dataEventos2});
      localStorage.setItem('dataEventos2', JSON.stringify(dataEventos2.map(data => data)));
      this.filtroEventos_2();
    }
  }

  filtroEventos_2(){
    let dataEventos2: any[] = JSON.parse(localStorage.getItem('dataEventos2'));
    
    if(this.selectMeses2.length > 0){
      dataEventos2 = dataEventos2.filter(data => this.selectMeses2.includes(data.name));
    }

    if(this.selectEventos2.length > 0){
      let eventos = this.selectEventos2.map(ev => ev.label);
      dataEventos2 = dataEventos2.map(data => {
        return {
          name: data.name,
          series: data.series.filter(el => eventos.includes(el.name))
        }
      })
    }

    Object.assign(this, {dataEventos2});
  }

  getIli_1(){
    this.divisionesCoronaIli1 = this.divisionesCorona.map(div => {
      return  div;
    });
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).filter(at => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_1);
    let dataIli_1: any[] = [];

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: '22'}
    ];

    this.hhtService.findByFilter(filterQuery).then((res: any) => {
      if(this.filtroMesesIli_1.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesIli_1.includes(this.meses[new Date(at.fechaReporte).getMonth()]));
      let data = {
        name: 'ILI',
        type: 'verticalBar',
        data: []
      };

      this.divisionesCoronaConId.forEach((division, index) => {
        
        let accidentesConDiasPerdidos = reportesAt.filter(at => at.padreNombre === division.nombre && at.incapacidades !== null
                                                                && at.incapacidades !== 'null').length;
        let hhtCorona = 0;
        res.data.forEach(elem => {
          let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          if(this.filtroMesesIli_1.length > 0){
            if(this.filtroMesesIli_1.includes(dataHHT.mes)){
              dataHHT.Areas.forEach(area => {
                if(area.id == division.id){
                  if(area.Plantas.length > 0){
                    hhtCorona += area.Plantas.reduce((count, planta) => {
                      if(planta.HhtPlanta != null) return count + planta.HhtPlanta;
                      return count;
                    }, 0);
                  }else if(area.HhtArea){
                    hhtCorona += area.HhtArea;
                  }
                }
              });
            }
          }else {
            dataHHT.Areas.forEach(area => {
              if(division.id == area.id){
                if(area.Plantas.length > 0){
                  hhtCorona += area.Plantas.reduce((count, planta) => {
                    if(planta.HhtPlanta != null) return count + planta.HhtPlanta;
                    return count;
                  }, 0);
                }else if(area.HhtArea){
                  hhtCorona += area.HhtArea;
                }
              }
            });
          }
        });
        // console.log(division.nombre, hhtCorona);
        let totalDiasSeveridad = reportesAt.filter(at => at.padreNombre === division.nombre && at.incapacidades !== 'null' && at.incapacidades !== null)
                                          .reduce((count, at) => {
                                            return count + JSON.parse(at.incapacidades).reduce((count2, incapacidades) => {
                                              return count2 + incapacidades.diasAusencia;
                                            }, 0);
                                          }, 0);
        // console.log('adp:',accidentesConDiasPerdidos,'hht:',hhtCorona,'tds:',totalDiasSeveridad);

        let IF = (accidentesConDiasPerdidos/hhtCorona) * 240000;
        let IS = (totalDiasSeveridad/hhtCorona*240000);
        let ILI = (IF*IS)/1000;
        
        // console.log('if: ',IF,'is:',IS,'ILI:',ILI);
        
        data.data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(4)));
      });
      
      dataIli_1.push(data);
      localStorage.setItem('dataIli_1', JSON.stringify(dataIli_1));
      this.filtroIli_1();
      Object.assign(this, {dataIli_1});
    });
  }

  filtroIli_1(){
    let dataIli_1: any = JSON.parse(localStorage.getItem('dataIli_1'));
    let divisionesCoronaIli1 = this.divisionesCorona.map(div => div);
    if(this.selectDivisionesILI1.length > 0){
      let selectedDivisiones = this.selectDivisionesILI1.map(div => div.label);
      divisionesCoronaIli1 = divisionesCoronaIli1.filter(div => selectedDivisiones.includes(div));
      dataIli_1[0].data = dataIli_1[0].data.filter((data, index) => selectedDivisiones.includes(this.divisionesCorona[index]));
    }
    Object.assign(this, {divisionesCoronaIli1});
    Object.assign(this, {dataIli_1});
  }

  getIli_2(){
    this.mesesILI2 = this.meses.map(mes => mes);
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).filter(at => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_2);
    let dataIli_2: any[] = [];

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: '22'}
    ];
    this.hhtService.findByFilter(filterQuery).then((res: any) => {
      if(this.selectDivisionesILI2.length && !this.selectDivisionesILI2.includes('Corona total')){
        reportesAt = reportesAt.filter(at => this.selectDivisionesILI2.includes(at.padreNombre));
      }
      let data = {
        name: 'ILI',
        type: 'verticalBar',
        data: []
      };
      this.meses.forEach((mes, index) => {
        let accidentesConDiasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index
                                                  && at.incapacidades !== null && at.incapacidades !== 'null'  ).length;
        let hhtCorona = 0;
        res.data.forEach(elem => {
          let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          if(this.selectDivisionesILI2.length > 0 && !this.selectDivisionesILI2.includes('Corona total')){
            if(mes == dataHHT.mes){
              dataHHT.Areas.forEach(area => {
                let areaActual = this.divisionesCoronaConId.filter(ar => ar.id == area.id)[0].nombre;
                if(this.selectDivisionesILI2.includes(areaActual)){
                  if(area.Plantas.length > 0){
                    hhtCorona += area.Plantas.reduce((count, planta) => {
                      if(planta.HhtPlanta != null) return count + planta.HhtPlanta;
                      return count;
                    }, 0);
                  }else if(area.HhtArea){
                    hhtCorona += area.HhtArea
                  }  
                }
              });
            }
          }else {
            if(mes == dataHHT.mes){
              dataHHT.Areas.forEach(area => {
                if(area.Plantas.length > 0){
                  hhtCorona += area.Plantas.reduce((count, planta) => {
                    if(planta.HhtPlanta != null) return count + planta.HhtPlanta;
                    return count;
                  }, 0);
                }else if(area.HhtArea){
                  hhtCorona += area.HhtArea
                }
              });
            }
          }
        });
        let totalDiasSeveridad = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index 
                                                        && at.incapacidades !== null && at.incapacidades !== 'null')
                                            .reduce((count, at) => {
                                              return count + JSON.parse(at.incapacidades).reduce((count2, incapacidad) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
        
        let IF = (accidentesConDiasPerdidos/hhtCorona)*240000;
        let IS = (totalDiasSeveridad/hhtCorona*240000);
        let ILI = (IF*IS)/1000;
        // console.log(accidentesConDiasPerdidos, hhtCorona, totalDiasSeveridad, IF, IS, ILI);
        
        data.data.push(isNaN(ILI) ? 0.0 : ILI === Infinity ? 0.0 : Number(ILI.toFixed(4)));
      });
      dataIli_2.push(data);
      localStorage.setItem('dataIli_2', JSON.stringify(dataIli_2));
      this.filtroIli_2();
      Object.assign(this, {dataIli_2})
    });
  }

  filtroIli_2(){
    let dataIli_2 = JSON.parse(localStorage.getItem('dataIli_2'));
    let mesesILI2 = this.meses.map(mes => mes);
    if(this.selectMesesILI2.length > 0){
      mesesILI2 = this.meses.filter(mes => this.selectMesesILI2.includes(mes))
      dataIli_2[0].data = dataIli_2[0].data.filter((data, index) => this.selectMesesILI2.includes(this.meses[index]));
    }

    Object.assign(this, {mesesILI2});
    Object.assign(this, {dataIli_2});
  }
}
