import { Component, OnInit, AfterViewInit} from "@angular/core";
import { ReporteAtService } from "./../../services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
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
  providers: [],
})

export class AccidentalidadComponent implements OnInit, AfterViewInit {
  ili:number=0.0471;
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
    private areaService: AreaService
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
    this.getEventosAt();
  }

  async ngOnInit() {
    if(this.ili<=this.metaIli){
    this.colorIli="card l-bg-green-dark"}
    else {this.colorIli="card l-bg-red-dark"}

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
    // this.selectEv1()
    await this.getData()
      .then( async () => {
        // console.log('areaList: ' + this.areaList);
        this.flag=true
        this.flag1=true
        await this.selectEv1()
        await this.selectIn1()
        await this.selectIn2()
        await this.selectEv2()
        await this.selectILI1()
        await this.selectILI2()
        await this.selectILI3()
        await this.selectILI1_2()
        await this.selectILI2_2()
        await this.selectILI3_2()
        this.dona1dp();
      });
      this.optionsCombo_2={
        title: 'ILI', 
        height: 400,
        width: 800,
        xAxis: {
            title: 'Divisiones',
            labelRotation: -60,
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
      this.optionsCombo={
        title: 'ILI', 
        height: 400,
        width: 800,
        xAxis: {
            title: 'Divisiones',
            labelRotation: -60,
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
        result.forEach(element => {
        if(element['incapacidades']!=null && element['incapacidades']!='null'){
          this.diasPerdidos=this.diasPerdidos+JSON.parse(element['incapacidades']).length
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

  Meses2= [
    {name:'Enero',code:'Enero'},
    {name:'Febrero',code:'Febrero'},
    {name:'Marzo',code:'Marzo'},
    {name:'Abril',code:'Abril'},
    {name:'Mayo',code:'Mayo'},
    {name:'Junio',code:'Junio'},
    {name:'Julio',code:'Julio'},
    {name:'Agosto',code:'Agosto'},
    {name:'Septiembre',code:'Septiembre'},
    {name:'Octubre',code:'Octubre'},
    {name:'Noviembre',code:'Noviembre'},
    {name:'Diciembre',code:'Diciembre'},
    {name:'Corona total',code:'Corona total'}
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

  randomEv1: any[];
  randomEv2: any[];
  randomIn1: any[];
  randomIn2: any[];
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
  flagevent1:boolean=false;
  flagevent2:boolean=false;
  flagILI:boolean=false;
  flagILI_2:boolean=false;
  flagILI2:boolean=false;
  flagILI2_2:boolean=false;
  flagILI3:boolean=false;
  flagILI3_2:boolean=false;
  hastaEv1: Date=new Date(Date.now());
  hastaEv2: Date=new Date(Date.now());
  hastaIn1: Date=new Date(Date.now());
  hastaIn2: Date=new Date(Date.now());
  hastaILI1: Date=new Date(Date.now());
  hastaILI2: Date=new Date(Date.now());
  hastaILI3: Date=new Date(Date.now());
  hastaILI1_2: Date=new Date(Date.now());
  hastaILI2_2: Date=new Date(Date.now());
  hastaILI3_2: Date=new Date(Date.now());
  desdeEv1: Date;
  desdeEv2: Date;
  desdeIn1: Date;
  desdeIn2: Date;
  desdeILI1: Date;
  desdeILI2: Date;
  desdeILI3: Date;
  desdeILI1_2: Date;
  desdeILI2_2: Date;
  desdeILI3_2: Date;
  divisiones3: any[]


  // randomIn1
  async selectIn1(){

    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomIn1=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0
    
    this.divisiones2.forEach(division => {

      let I1=Math.random()*14//getRandomInt(3)
      let I2=Math.random()*14//getRandomInt(3)
      let I3=Math.random()*14//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;

      this.randomIn1.push({name:division['label'],series:[{name:'Tasa de Frecuencia',value:I1},{name:'Tasa de Severidad',value:I2},{name:'Proporción AT mortal',value:I3}]})
    });
    this.randomIn1.pop();
    this.randomIn1.push({name:'Corona total',series:[{name:'Tasa de Frecuencia',value:TI1},{name:'Tasa de Severidad',value:TI2},{name:'Proporción AT mortal',value:TI3}]})
    
    let randomIn1Copy=[]
    // console.log(this.selectDivisiones1)
    // console.log(this.randomIn1)
    if(this.selectDivisiones1.length>0){
      this.selectDivisiones1.forEach(element => {
        let x= this.randomIn1.filter(word => {
          return word['name']==element['label']
        });
        randomIn1Copy.push(x[0])
      });
      this.randomIn1=randomIn1Copy
    }

    randomIn1Copy=[]
    
    this.randomIn1.forEach(element => {
      let randomIn1CopySeries=[]

      if(this.selectIndicarores1.length>0){
        this.selectIndicarores1.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomIn1CopySeries.push(x[0])
        });
      }else{
        randomIn1CopySeries=element['series']
      }
      randomIn1Copy.push({name:element['name'],series:randomIn1CopySeries})
    });
    this.randomIn1=randomIn1Copy

    let num1=0
    num1=this.randomIn1.length*this.randomIn1[0].series.length
    // console.log(num1)
    if(num1>20){
      this.flagtasa1=false
    }else{
      this.flagtasa1=true
    }
  
    this.flagevent1=true
  }
  async selectIn2(){
    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomIn2=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0

    // console.log(this.Meses2)
    this.Meses2.forEach(division => {

      let I1=Math.random()*14//getRandomInt(3)
      let I2=Math.random()*14//getRandomInt(3)
      let I3=Math.random()*14//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;
      this.randomIn2.push({name:division['name'],series:[{name:'Tasa de Frecuencia',value:I1},{name:'Tasa de Severidad',value:I2},{name:'Proporción AT mortal',value:I3}]})
    });
    this.randomIn2.pop();
    this.randomIn2.push({name:'Corona total',series:[{name:'Tasa de Frecuencia',value:TI1},{name:'Tasa de Severidad',value:TI2},{name:'Proporción AT mortal',value:TI3}]})
    
    let randomIn2Copy=[]
    // console.log(this.selectMeses1)
    // console.log(this.randomIn2)
    if(this.selectMeses1.length>0){
      // this.divisiones3=[]
      this.selectMeses1.forEach(element => {
        let x= this.randomIn2.filter(word => {
          return word['name']==element['name']
        });
        // // console.log(x)
        randomIn2Copy.push(x[0])
      });
      this.randomIn2=randomIn2Copy
    }

    randomIn2Copy=[]
    
    this.randomIn2.forEach(element => {
      let randomIn2CopySeries=[]

      if(this.selectIndicarores2.length>0){
        this.selectIndicarores2.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomIn2CopySeries.push(x[0])
        });
      }else{
        randomIn2CopySeries=element['series']
      }
      randomIn2Copy.push({name:element['name'],series:randomIn2CopySeries})
    });
    this.randomIn2=randomIn2Copy

    let num2=0
    num2=this.randomIn2.length*this.randomIn2[0].series.length
    // console.log(num2)
    if(num2>20){
      this.flagtasa2=false
    }else{
      this.flagtasa2=true
    }
    this.flagevent1=true
  }

  async selectILI1(){
    let flagSelectEvent=this.flagevent1
    this.flagILI=false
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
    },
  ]
    this.flagILI=true
  }

  async selectILI1_2(){
    let flagSelectEvent=this.flagevent1
    this.flagILI_2=false
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
    this.flagILI_2=true
  }

  async selectILI2(){
    let flagSelectEvent=this.flagevent1
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
    let flagSelectEvent=this.flagevent1
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
    let flagSelectEvent=this.flagevent1
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
    let flagSelectEvent=this.flagevent1
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

  async selectEv1(){

    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomEv1=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0
    
    this.divisiones2.forEach(division => {

      let I1=Math.round(Math.random()*14)//getRandomInt(3)
      let I2=Math.round(Math.random()*14)//getRandomInt(3)
      let I3=Math.round(Math.random()*14)//getRandomInt(3)
      let I4=Math.round(Math.random()*14)//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;
      TI4+=I4;
      this.randomEv1.push({name:division['label'],series:[{name:'Numero AT',value:I1},{name:'Numero días perdidos',value:I2},{name:'Numero AT mortales',value:I3},{name:'Numero AT con cero días',value:I4}]})
    });
    this.randomEv1.pop();
    this.randomEv1.push({name:'Corona total',series:[{name:'Numero AT',value:TI1},{name:'Numero días perdidos',value:TI2},{name:'Numero AT mortales',value:TI3},{name:'Numero AT con cero días',value:TI4}]})
    
    let randomEv1Copy=[]
    // console.log(this.selectDivisiones1)
    // console.log(this.randomEv1)
    if(this.selectDivisiones2.length>0){
      this.selectDivisiones2.forEach(element => {
        let x= this.randomEv1.filter(word => {
          return word['name']==element['label']
        });
        randomEv1Copy.push(x[0])
      });
      this.randomEv1=randomEv1Copy
    }

    randomEv1Copy=[]
    
    this.randomEv1.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEventos1.length>0){
        this.selectEventos1.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      randomEv1Copy.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.randomEv1=randomEv1Copy
    this.flagevent1=true
  }


  async selectEv2(){

    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomEv2=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0
    
    this.Meses.forEach(division => {

      let I1=Math.round(Math.random()*14)//getRandomInt(3)
      let I2=Math.round(Math.random()*14)//getRandomInt(3)
      let I3=Math.round(Math.random()*14)//getRandomInt(3)
      let I4=Math.round(Math.random()*14)//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;
      TI4+=I4;
      this.randomEv2.push({name:division['label'],series:[{name:'Numero AT',value:I1},{name:'Numero días perdidos',value:I2},{name:'Numero AT mortales',value:I3},{name:'Numero AT con cero días',value:I4}]})
    });
    this.randomEv2.pop();
    this.randomEv2.push({name:'Corona total',series:[{name:'Numero AT',value:TI1},{name:'Numero días perdidos',value:TI2},{name:'Numero AT mortales',value:TI3},{name:'Numero AT con cero días',value:TI4}]})
    
    let randomEv2Copy=[]
    // console.log(this.selectMeses2)
    // console.log(this.randomEv2)
    if(this.selectMeses2.length>0){
      this.selectMeses2.forEach(element => {
        let x= this.randomEv2.filter(word => {
          return word['name']==element['name']
        });
        randomEv2Copy.push(x[0])
      });
      this.randomEv2=randomEv2Copy
    }

    randomEv2Copy=[]
    
    this.randomEv2.forEach(element => {
      let randomEv2CopySeries=[]

      if(this.selectEventos2.length>0){
        this.selectEventos2.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv2CopySeries.push(x[0])
        });
      }else{
        randomEv2CopySeries=element['series']
      }
      randomEv2Copy.push({name:element['name'],series:randomEv2CopySeries})
    });
    this.randomEv2=randomEv2Copy
    this.flagevent1=true
  }

  selectedCities:any[];
  flagDona1:boolean=false
  flagDona2:boolean=false
  flagDona3:boolean=false

  //Eventos At
  getEventosAt(filter?: string){
    let divisiones: string[] = [];
    let reporteAt = [];
    let randomEv1Dona: any[] = [];
    this.reporteAtService.findAllRAT().then(
      (res: any[]) => {
        let padreNombreList = [];
        try {
          switch(filter){
            case 'temp':
              res.forEach((at: any) => {
                reporteAt.push(at);
                if(at.temporal && at.temporal){
                  padreNombreList.push(at.padreNombre);
                }
              });
              padreNombreList.forEach((item: string) => {
                if(!divisiones.includes(item)){
                  divisiones.push(item);
                }
              });
              let eventosAttemp = [];
              divisiones.forEach(
                division => {
                  let data = {name: division, value: 0};
                  data.value = reporteAt.filter(at => at.padreNombre === division && at.temporal).length;
                  eventosAttemp.push(data);
                }
              );
              randomEv1Dona.push(...eventosAttemp);
              Object.assign(this, {randomEv1Dona});
              break;
            case 'dir':
              res.forEach((at: any) => {
                reporteAt.push(at);
                if(at.temporal == null){
                  padreNombreList.push(at.padreNombre);
                }
              });
              padreNombreList.forEach((item: string) => {
                if(!divisiones.includes(item)){
                  divisiones.push(item);
                }
              });
              let eventosAtdir = [];
              divisiones.forEach(
                division => {
                  let data = {name: division, value: 0};
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
          // Optimizando
          // padreNombreList = res.map(at => at.padreNombre);
          // reporteAt = res.map(at => at);
          // divisiones = padreNombreList.
          res.forEach((at: any) => {
            reporteAt.push(at);
            padreNombreList.push(at.padreNombre);
          });
          padreNombreList.forEach((item: string) => {
            if(!divisiones.includes(item)){
              divisiones.push(item);
            }
          });
          let eventosAt = [];
          divisiones.forEach(
            division => {
              let data = {name: division, value: 0};
              data.value = reporteAt.filter(at => at.padreNombre === division).length;
              eventosAt.push(data);
            }
          );
          randomEv1Dona.push(...eventosAt);
          Object.assign(this, {randomEv1Dona});
        }
      }
    );
  }

  //Dias perdidos
  dona1dp(){
    //total
    this.randomEv1Donadb=[]
    let division=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
    division.forEach(div => {
      this.randomEv1Donadb.push({name:div,value:Math.round(Math.random()*10)})
    });
  }
}
