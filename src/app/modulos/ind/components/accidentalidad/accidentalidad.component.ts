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
  providers: [HhtService],
})

export class AccidentalidadComponent implements OnInit, AfterViewInit, OnDestroy {
  ili:number=0.0171;
  metaIli:number=0.02953;
  colorIli?:string;
  optionsCombo: any={};
  optionsCombo_2: any={};
  optionsCombo2: any={};
  optionsCombo3: any={};
  categoriesCombo: any=[];
  categoriesCombo_2: any=[];
  // categoriesCombo3: any=[];
  // categoriesCombo3: any=[];
  seriesCombo: any=[];

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
  // divisiones5= new Array();
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

  fakeData: division[] = [
    {name: 'BAÑOS Y COCINAS', acumulado: 0.040, meta: 0.034, eventos: 67, diasPerdidos: 646, frecuencia: 2.1, severidad: 20.4},
    {name: 'SUPERFICIES MATERIALES Y PINTURAS', acumulado: 0.255, meta: 0.034, eventos: 36, diasPerdidos: 1035, frecuencia: 3.37, severidad: 97.0},
    {name: 'INSUMOS Y MANEJO DE ENERGÍA', acumulado: 0.028, meta: 0.090, eventos: 12, diasPerdidos: 173, frecuencia: 1.42, severidad: 20.42},
  ];

  data: [];

  constructor(
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService,
    private hhtService: HhtService
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
    }).catch((e) => {
      console.error('error: ', e);
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('dataEventos1');
  }

  async ngOnInit() {
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('dataEventos1');

    if(this.ili<=this.metaIli){
    this.colorIli="card l-bg-green-dark"}
    else {this.colorIli="card l-bg-red-dark"}

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    await this.getData()
      .then( async () => {
        // console.log('areaList: ' + this.areaList);
        this.flag=true
        this.flag1=true
        // await this.selectEv2()
        await this.selectILI1()
        await this.selectILI2()
        await this.selectILI3()
        await this.selectILI1_2()
        await this.selectILI2_2()
        await this.selectILI3_2()
      });
      this.optionsCombo_2={
        title: 'ILI', 
        height: 400,
        width: 800,
        xAxis: {
            title: 'Divisiones',
            labelRotation: 300,
            labelAlign: 'right', // left, middle, right,
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
      this.optionsCombo={
        title: 'ILI', 
        height: 400,
        width: 800,
        xAxis: {
            title: 'Divisiones',
            labelRotation: 300,
            labelAlign: 'right', // left, middle, right,
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
    this.optionsCombo2={
      title: 'ILI', 
      height: 600,
      width: 850,
      xAxis: {
          title: 'Divisiones',
          labelRotation: 90,
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
  }
  reporteTabla
  reporteTabla2
  totalDiasPerdidosDv: any[];
  totalEventosDv: any[];
  totalEventosDv2: any[];
  totalDiasEventos: any[];
  random: any[];
  async getData(){
    this.datosRandom()
    this.hastas= new Date(Date.now())
    this.desdes=null
    this.hasta= new Date(Date.now())
    this.desde=null
    await this.reportes()

    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre"];
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

  // async getData2(){
  //   let flagSelectDiv=this.flagdiv
  //   let flagSelectEvent=this.flagevent
  //   this.flag=false
  //   this.flagdiv=false
  //   this.flagevent=false
  //   this.reporteTabla=[]
  //   this.totalDiasPerdidosDv=[]
  //   this.totalEventosDv=[]
  //   this.totalDiasEventos=[]
  //   await this.reporteAtService.findAllRAT()
  //   .then(res => {
  //     this.reporteTabla=res
      
  //     this.areaList.forEach(element => {
        
  //       let cont=0
  //       let diasPerdidos=0

  //       this.reporteTabla.forEach(element2 =>{
  //         if(element['nombre']==element2['padreNombre'] && new Date(element2['fechaReporte'])>=new Date(this.desde) && new Date(element2['fechaReporte'])<new Date(this.hasta)){
  //           cont+=1;
  //           if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
  //             diasPerdidos+=JSON.parse(element2['incapacidades']).length
  //           }
  //         }
  //       })
  //       this.totalDiasPerdidosDv.push({name:element['nombre'],value:diasPerdidos})
  //       this.totalEventosDv.push({name:element['nombre'],value:cont})
  //       this.totalDiasEventos.push({name:element['nombre'],series:[{name:'Eventos AT',value:cont},{name:'Días perdidos',value:diasPerdidos}]})
  //     });
  //   });
  //   this.flag=true

  //   this.flagdiv=flagSelectDiv
  //   this.flagevent=flagSelectEvent
  // }

  async reportes(){
    if(this.divisionS==null || this.divisionS=='Total'){
      this.hastas= new Date(Date.now())
      this.desdes=null
      await this.reporteAtService.findAllRAT().then(async (resp)=>{
        this.reporteat=resp
        const result = await this.reporteat.filter(word => {

          return new Date(word['fechaReporte'])> this.desdes && new Date(word['fechaReporte'])< this.hastas
        });

        //No. de reportes
        this.NoEventos= result.length;

        //No. de días perdidos
        this.diasPerdidos=0;
        // result.forEach(element => {
        // if(element['incapacidades']!=null && element['incapacidades']!='null'){
        //   this.diasPerdidos=this.diasPerdidos+JSON.parse(element['incapacidades']).length
        // }
        // });
        result.forEach(element => {
          if(element['incapacidades']!=null && element['incapacidades']!='null'){
            this.diasPerdidos = this.diasPerdidos + JSON.parse(element['incapacidades'])
                                                        .reduce((count, incapacidad) => {
                                                          return count + incapacidad.diasAusencia;
                                                        }, 0);
          }
        });
      });
    }else{
      await this.reporteAtService.findAllRAT().then(async (resp)=>{
        this.reporteat=resp
        const result = await this.reporteat.filter(word => {

          return new Date(word['fechaReporte'])> this.desdes && new Date(word['fechaReporte'])< this.hastas && word['padreNombre'] == this.divisionS
        });

        //No. de reportes
        this.NoEventos= result.length;

        //No. de días perdidos
        this.diasPerdidos=0;
        result.forEach(element => {
        if(element['incapacidades']!=null && element['incapacidades']!='null'){
          this.diasPerdidos=this.diasPerdidos+JSON.parse(element['incapacidades']).length
        }
        });
      });
    }

  }


  async selecFromDate1(date: Date) {
    this.desdes=new Date(date)
    await this.reportes()
  }
  async selectToDate1(date: Date) {
    this.hastas=new Date(date)
    await this.reportes()
  }
  async selecFromDate2(date: Date) {
    this.desdes=new Date(date)
    await this.reportes()
  }
  async selectToDate2(date: Date) {
    this.hastas=new Date(date)
    await this.reportes()
  }
  async division(event){
    this.divisionS=event.value
    await this.reportes()
  }

  onSelect(data): void {
    switch (JSON.parse(JSON.stringify(data))) {
      case 'Eventos AT':
        this.flagevent=true
        this.flagdiv=false
        break;
      case 'Días perdidos':      
        this.flagevent=false
        this.flagdiv=true
      default:
        break;
    }
  }
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
    {label:'Diciembre',value:'Diciembre'},
    {label:'Corona total',value:'Corona total'}
  ];

  datosRandom(){
    this.random=[]
    this.meses.forEach(mes => {
      this.random.push({name:mes,series:[{name:'Tasa de Frecuencia (%)',value:Math.random()*100},{name:'Tasa Severidad (%)',value:Math.random()*100}]})
    });
  }



  ///////////////////////////////////////////////////////////////

  selectDivisiones1: any[] = [];
  selectIndicarores1: any[] = [];
  selectDivisiones2: any[] = [];
  selectDivisionesILI1: any[] = [];
  selectDivisionesILI2: any[] = [];
  selectDivisionesILI3: any[] = [];
  selectDivisionesILI1_2: any[] = [];
  selectDivisionesILI2_2: any[] = [];
  selectDivisionesILI3_2: any[] = [];
  selectIndicarores2: any[] = [];
  selectMeses1: any[] = [];
  selectMeses2: any[] = [];

  selectEventos1: any[] = [];
  selectEventos2: any[] = [];


  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Proporción AT mortal', value: 2}];
  Eventos: any[] = [{label: 'Numero AT', value: 0}, {label: 'Numero días perdidos', value: 1}, {label: 'Numero AT mortales', value: 2}, {label: 'Numero AT con cero días', value: 3}];

  dataEventos1: any[];
  evento1Desde: Date[] | null = null;
  evento1Hasta: Date[] | null = null;
  randomEv2: any[];
  tasaFrecuencia1: any[];
  tasaFrecuencia2: any[];
  tasaDesde: Date = new Date();
  tasaHasta: Date = new Date();
  tasasNotFound: boolean = false;
  tasasNotFound2: boolean = false;
  filtroAnioTasa_1: number = new Date().getFullYear();
  divisionesCorona: string[] = ['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total']
  filtroAnioTasa_2: number = new Date().getFullYear();
  filtroDivisionesTasa_2: string[] = [];
  dataEventos2: any[] = [];
  filtroAnioEventos2: number = new Date().getFullYear();
  randomILI: any[];
  randomILI_2: any[];
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

  async selectILI1(){
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=IL1+IL2+IL3+IL4+IL5+IL6+IL7
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m
    // console.log(this.selectDivisionesILI1)
    let dataILICopy=[]
    let dataMetaCopy=[]
    let categoriesComboCopy=[]
    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7, IL8]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m, IL8m]
    this.categoriesCombo=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
    
    if(this.selectDivisionesILI1.length>0){
      this.selectDivisionesILI1.forEach((resp)=>{
        dataILICopy.push(dataILI[resp.code])
        dataMetaCopy.push(dataMeta[resp.code])
        categoriesComboCopy.push(this.categoriesCombo[resp.code])
      })
      setTimeout(() => {
        dataILI=dataILICopy
        dataMeta=dataMetaCopy
        this.categoriesCombo=categoriesComboCopy
      }, 100);
    }

    this.randomILI=[{
      name: 'ILI',
      type: 'verticalBar',
      data: dataILI
    },
    {
      name: 'Meta',
      type: 'line',
      data: dataMeta
    }]
  }

  async selectILI1_2(){
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=Math.random()*0.01
    let IL9=Math.random()*0.01
    let IL10=Math.random()*0.01
    let IL11=Math.random()*0.01
    let IL12=Math.random()*0.01
    let IL13=IL1+IL2+IL3+IL4+IL5+IL6+IL7+IL8+IL9+IL10+IL11+IL12
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=0.002
    let IL9m=0.006
    let IL10m=0.004
    let IL11m=0.005
    let IL12m=0.001
    let IL13m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m+IL8m+IL9m+IL10m+IL11m+IL12m
    // console.log(this.selectDivisionesILI1_2)
    let dataILICopy=[]
    let dataMetaCopy=[]
    let categoriesComboCopy=[]
    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7, IL8, IL9, IL10, IL11, IL12, IL13]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m, IL8m, IL9m, IL10m, IL11m, IL12m, IL13m]
    this.categoriesCombo_2=['Enero',
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
    'Diciembre','Corona total'];
    
    if(this.selectDivisionesILI1_2.length>0){
      this.selectDivisionesILI1_2.forEach((resp)=>{
        dataILICopy.push(dataILI[resp.code])
        dataMetaCopy.push(dataMeta[resp.code])
        categoriesComboCopy.push(this.categoriesCombo_2[resp.code])
      })
      setTimeout(() => {
        dataILI=dataILICopy
        dataMeta=dataMetaCopy
        this.categoriesCombo_2=categoriesComboCopy
      }, 100);
    }

    this.randomILI_2=[{
      name: 'ILI',
      type: 'verticalBar',
      data: dataILI
    },
    {
      name: 'Meta',
      type: 'line',
      data: dataMeta
    },
  ]
  }

  async selectILI2(){
    this.flagILI2=false
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=IL1+IL2+IL3+IL4+IL5+IL6+IL7
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m
    let dataILICopy=[]

    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7,IL8]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m,IL8m]
    let division=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Coronta total'];
    
    let cont=0
    if(this.selectDivisionesILI2.length>0){
      this.selectDivisionesILI2.forEach((resp)=>{
        let ILI=dataILI[resp.code]
        let dif1=dataILI[resp.code]-dataMeta[resp.code]
        let dif2=dif1
        if(dif1<0){
          dif2=0
          dif1=-dif1
        }else{
          ILI=dataMeta[resp.code]
          dif1=0
        }
        dataILICopy.push({name:division[resp.code],series:[{name:'ILI',value:ILI},{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
      })
    }else{
      division.forEach(resp => {
        let ILI=dataILI[cont]
        let dif1=dataILI[cont]-dataMeta[cont]
        let dif2=dif1
        if(dif1<0){
          dif2=0
          dif1=-dif1
        }else{
          ILI=dataMeta[cont]
          dif1=0
        }
        dataILICopy.push({name:division[cont],series:[{name:'ILI',value:ILI},{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
        cont+=1
      });
    }

    this.randomILI2=dataILICopy
    this.flagILI2=true
  }


  async selectILI2_2(){
    this.flagILI2_2=false
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=Math.random()*0.01
    let IL9=Math.random()*0.01
    let IL10=Math.random()*0.01
    let IL11=Math.random()*0.01
    let IL12=Math.random()*0.01
    let IL13=IL1+IL2+IL3+IL4+IL5+IL6+IL7+IL8+IL9+IL10+IL11+IL12
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=0.002
    let IL9m=0.006
    let IL10m=0.004
    let IL11m=0.005
    let IL12m=0.001
    let IL13m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m+IL8m+IL9m+IL10m+IL11m+IL12m
    let dataILICopy=[]


    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7, IL8, IL9, IL10, IL11, IL12, IL13]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m, IL8m, IL9m, IL10m, IL11m, IL12m, IL13m]
    let division=['Enero',
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
    'Diciembre','Corona total'];
    
    let cont=0
    if(this.selectDivisionesILI2_2.length>0){
      this.selectDivisionesILI2_2.forEach((resp)=>{
        let ILI=dataILI[resp.code]
        let dif1=dataILI[resp.code]-dataMeta[resp.code]
        let dif2=dif1
        if(dif1<0){
          dif2=0
          dif1=-dif1
        }else{
          ILI=dataMeta[resp.code]
          dif1=0
        }
        dataILICopy.push({name:division[resp.code],series:[{name:'ILI',value:ILI},{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
      })
    }else{
      division.forEach(resp => {
        let ILI=dataILI[cont]
        let dif1=dataILI[cont]-dataMeta[cont]
        let dif2=dif1
        if(dif1<0){
          dif2=0
          dif1=-dif1
        }else{
          ILI=dataMeta[cont]
          dif1=0
        }
        dataILICopy.push({name:division[cont],series:[{name:'ILI',value:ILI},{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
        cont+=1
      });
    }

    this.randomILI2_2=dataILICopy
    this.flagILI2_2=true
  }

  async selectILI3(){
    this.flagILI3=false
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=IL1+IL2+IL3+IL4+IL5+IL6+IL7
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m
    let dataILICopy=[]

    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7,IL8]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m,IL8m]
    let division=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Coronta total'];
    
    let cont=0
    if(this.selectDivisionesILI3.length>0){
      this.selectDivisionesILI3.forEach((resp)=>{
        let ILI=dataILI[resp.code]
        let dif1=dataILI[resp.code]-dataMeta[resp.code]
        let dif2=dif1
        if(dif1>0){
          dif2=0
        }else{
          dif1=0
        }
        dataILICopy.push({name:division[resp.code],series:[{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
      })
    }else{
      division.forEach(resp => {
        let dif1=dataILI[cont]-dataMeta[cont]
        let dif2=dif1
        if(dif1>0){
          dif2=0
        }else{
          dif1=0
        }
        dataILICopy.push({name:division[cont],series:[{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
        cont+=1
      });
    }

    this.randomILI3=dataILICopy
    this.flagILI3=true
  }

  async selectILI3_2(){
    this.flagILI3_2=false
    let IL1=Math.random()*0.01
    let IL2=Math.random()*0.01
    let IL3=Math.random()*0.01
    let IL4=Math.random()*0.01
    let IL5=Math.random()*0.01
    let IL6=Math.random()*0.01
    let IL7=Math.random()*0.01
    let IL8=Math.random()*0.01
    let IL9=Math.random()*0.01
    let IL10=Math.random()*0.01
    let IL11=Math.random()*0.01
    let IL12=Math.random()*0.01
    let IL13=IL1+IL2+IL3+IL4+IL5+IL6+IL7+IL8+IL9+IL10+IL11+IL12
    let IL1m=0.002
    let IL2m=0.003
    let IL3m=0.002
    let IL4m=0.006
    let IL5m=0.004
    let IL6m=0.005
    let IL7m=0.001
    let IL8m=0.002
    let IL9m=0.006
    let IL10m=0.004
    let IL11m=0.005
    let IL12m=0.001
    let IL13m=IL1m+IL2m+IL3m+IL4m+IL5m+IL6m+IL7m+IL8m+IL9m+IL10m+IL11m+IL12m
    let dataILICopy=[]


    let dataILI=[IL1, IL2, IL3, IL4, IL5, IL6, IL7, IL8, IL9, IL10, IL11, IL12, IL13]
    let dataMeta=[IL1m, IL2m, IL3m, IL4m, IL5m, IL6m, IL7m, IL8m, IL9m, IL10m, IL11m, IL12m, IL13m]
    let division=['Enero',
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
    'Diciembre','Corona total'];
    
    let cont=0
    if(this.selectDivisionesILI3_2.length>0){
      this.selectDivisionesILI3_2.forEach((resp)=>{
        let ILI=dataILI[resp.code]
        let dif1=dataILI[resp.code]-dataMeta[resp.code]
        let dif2=dif1
        if(dif1>0){
          dif2=0
        }else{
          dif1=0
        }
        dataILICopy.push({name:division[resp.code],series:[{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
      })
    }else{
      division.forEach(resp => {
        let dif1=dataILI[cont]-dataMeta[cont]
        let dif2=dif1
        if(dif1>0){
          dif2=0
        }else{
          dif1=0
        }
        dataILICopy.push({name:division[cont],series:[{name:'Meta',value:dif1},{name:'Metas',value:dif2}]})
        cont+=1
      });
    }

    this.randomILI3_2=dataILICopy
    this.flagILI3_2=true
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

      dataEv1Dona = dataEv1Dona.filter(at => at.fechaReporte >= this.filtroFechaAt[0] && at.fechaReporte <= this.filtroFechaAt[1]);
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

      dataDiasPerdidosAtList = dataDiasPerdidosAtList.filter(at => at.fechaReporte > this.filtroFechaDiasPerdidos[0] && at.fechaReporte < this.filtroFechaDiasPerdidos[1]);
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
        {criteria: Criteria.EQUALS, field: "empresaSelect", value1: 'Corona'}
      ];
      
      this.hhtService.findByFilter(filterQuery).then((res: any) => {
        
        if(res.data.length > 0) {
          
          divisiones.forEach(division => {
            
            let trabajadoresTotales = 0;
            let data = {
              name: division,
              series: []
            };

            let indexDiv = this.divisionesCorona.indexOf(division);
            res.data.forEach(elem => {
              trabajadoresTotales = trabajadoresTotales + JSON.parse(elem.valor)[indexDiv]['Total3NH'];
            });
            
            let totalAt = reportesAt.filter(at => at.padreNombre === division).length;
            let diasPerdidos = reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                        && at.incapacidades !== 'null')
                                          .reduce((count, item) => {
                                            return count + JSON.parse(item.incapacidades).reduce((count2, incapacidad) => {
                                              return count2 + incapacidad.diasAusencia;
                                            }, 0);
                                          }, 0);
            let AtMortales = reportesAt.filter(at => at.padreNombre === division && at.causoMuerte === true).length;
            
            data.series.push({
              name: 'Tasa de Frecuencia',
              value: isNaN(Number((totalAt * 100)/trabajadoresTotales)) ? 0.0 : Number(Number((totalAt * 100)/trabajadoresTotales).toFixed(3))
            });
            data.series.push({
              name: 'Tasa de Severidad',
              value: isNaN(Number((diasPerdidos * 100)/trabajadoresTotales)) ? 0.0 : Number(Number((diasPerdidos * 100)/trabajadoresTotales).toFixed(3))
            });
            data.series.push({
              name: 'Proporción AT mortal',
              value: isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(3))
            });
            
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
      console.log(indicadores);
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
        {criteria: Criteria.EQUALS, field: "empresaSelect", value1: 'Corona'}
      ];

      this.hhtService.findByFilter(filterQuery).then((res: any) => {
        if(res.data.length > 0){
          this.Meses.forEach((mes, index) => {
            if(mes.label === 'Corona total') return;

            let trabajadoresTotales2 = 0;
            let totalAt = 0;
            let diasPerdidos = 0;
            let atMortales = 0;
            let data = {
              name: mes.label,
              series: []
            };
            
            trabajadoresTotales2 = res.data.filter(hhtData => mes.label === hhtData.mes)
            .reduce((count, data) => {
              return count + JSON.parse(data.valor).reduce((count2, data2) => {
                return count2 + data2['Total3NH']
              }, 0);
            }, 0);

            totalAt = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth()).length;
            
            diasPerdidos = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                  .reduce((count, item) => {
                                                    return count + JSON.parse(item.incapacidades).reduce((count2, incapacidad) => {
                                                      return count2 + incapacidad.diasAusencia;
                                                    }, 0);
                                                  }, 0);
            atMortales = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;
            // console.log(trabajadoresTotales2, totalAt, diasPerdidos, atMortales);
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
            tasaFrecuencia2.push(data);
          });
          
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
      if(this.evento1Desde && this.evento1Hasta) reportesAt = reportesAt.filter(at => at.fechaReporte > this.evento1Desde && at.fechaReporte < this.evento1Hasta);
      
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
      this.Meses.forEach((mes, index) => {
        if(this.Meses.length === index + 1) return;
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
        console.info(data);
        
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
}
