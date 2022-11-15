import { Component, OnInit} from "@angular/core";
import { ReporteAtService } from "./../../services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
import { multi} from './data';

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

export class AccidentalidadComponent implements OnInit {
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
  divisionS=null;

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

  view: any[] = [1000, 400];
  view2: any[] = [700, 400];

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
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA','#5AA985', '#A10342', '#C7B000','#5AA454', '#A10A28', '#C7B42C', '#AAAAAA','#5AA985', '#A10342', '#C7B000']
  };

  colorScheme2 = {
    domain: ['#0000FF', '#C7B000', '#A10A28','#5AA985']
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
      Object.assign(this, { multi })
      }
    flag:boolean=false
    flag1:boolean=false
    flagdiv:boolean=false
    flagevent:boolean=false
  async ngOnInit() {
    // this.selectEv1()
    await this.getData()
      .then( async () => {
        console.log('areaList: ' + this.areaList);
        this.flag=true
        this.flag1=true
        await this.selectEv1()
        await this.selectIn1()
        await this.selectIn2()
        await this.selectEv2()
      });
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
    this.divisiones.push({label:'Total',value:'Total'})
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      resp => {
        this.areaList = <Area[]>resp['data'];
        this.areaList.forEach(element => {
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
          this.divisiones2.push({label:element['nombre'],value:element['nombre']})
        });
      }
    );
      
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

  async getData2(){
    let flagSelectDiv=this.flagdiv
    let flagSelectEvent=this.flagevent
    this.flag=false
    this.flagdiv=false
    this.flagevent=false
    this.reporteTabla=[]
    this.totalDiasPerdidosDv=[]
    this.totalEventosDv=[]
    this.totalDiasEventos=[]
    await this.reporteAtService.findAllRAT()
    .then(res => {
      this.reporteTabla=res
      
      this.areaList.forEach(element => {
        
        let cont=0
        let diasPerdidos=0

        this.reporteTabla.forEach(element2 =>{
          if(element['nombre']==element2['padreNombre'] && new Date(element2['fechaReporte'])>=new Date(this.desde) && new Date(element2['fechaReporte'])<new Date(this.hasta)){
            cont+=1;
            if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
              diasPerdidos+=JSON.parse(element2['incapacidades']).length
            }
          }
        })
        this.totalDiasPerdidosDv.push({name:element['nombre'],value:diasPerdidos})
        this.totalEventosDv.push({name:element['nombre'],value:cont})
        this.totalDiasEventos.push({name:element['nombre'],series:[{name:'Eventos AT',value:cont},{name:'Días perdidos',value:diasPerdidos}]})
      });
    });
    this.flag=true

    this.flagdiv=flagSelectDiv
    this.flagevent=flagSelectEvent
  }

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
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
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
    {label:'Diciembre',value:'Diciembre'}
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
    {name:'Diciembre',code:'Diciembre'}
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
  selectIndicarores2: any[] = [];
  selectMeses1: any[] = [];
  selectMeses2: any[] = [];

  selectEventos1: any[] = [];
  selectEventos2: any[] = [];


  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Indice de Frecuencia', value: 2}, {label: 'Proporción AT mortal', value: 3}];
  Eventos: any[] = [{label: 'Numero AT', value: 0}, {label: 'Numero días perdidos', value: 1}, {label: 'Numero AT mortales', value: 2}, {label: 'Numero AT con cero días', value: 3}];

  randomEv1: any[];
  randomEv2: any[];
  randomIn1: any[];
  randomIn2: any[];
  flagdiv1:boolean=false;
  flagdiv2:boolean=false;
  flagevent1:boolean=false;
  flagevent2:boolean=false;
  hastaEv1: Date=new Date(Date.now());
  hastaEv2: Date=new Date(Date.now());
  hastaIn1: Date=new Date(Date.now());
  hastaIn2: Date=new Date(Date.now());
  desdeEv1: Date;
  desdeEv2: Date;
  desdeIn1: Date;
  desdeIn2: Date;
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

    if(this.selectDivisiones1.length>0){
      this.divisiones3=[]
      this.selectDivisiones1.forEach(element => {
        let x= this.divisiones2.filter(word => {
          return word['label']==element['label']
        });
        // console.log(x)
        this.divisiones3.push(x[0])
      });
    }else{
      this.divisiones3=this.divisiones2
    }
    
    this.divisiones3.forEach(division => {

      let I1=Math.random()*14//getRandomInt(3)
      let I2=Math.random()*14//getRandomInt(3)
      let I3=Math.random()*14//getRandomInt(3)
      let I4=Math.random()*14//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;
      TI4+=I4;
      this.randomIn1.push({name:division['label'],series:[{name:'Tasa de Frecuencia',value:I1},{name:'Tasa de Severidad',value:I2},{name:'Indice de Frecuencia',value:I3},{name:'Proporción AT mortal',value:I4}]})
    });
    this.randomIn1.push({name:'Corona total',series:[{name:'Tasa de Frecuencia',value:TI1},{name:'Tasa de Severidad',value:TI2},{name:'Indice de Frecuencia',value:TI3},{name:'Proporción AT mortal',value:TI4}]})
    
    let randomIn1Copy=[]
    
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
    this.flagevent1=true
  }
  // async selectIn2(){
  //   console.log(this.divisiones2)
  // }
  async selectIn2(){
    console.log(this.selectIndicarores2)
    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomIn2=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0

    if(this.selectMeses1.length>0){
      this.divisiones3=[]
      this.selectMeses1.forEach(element => {
        let x= this.Meses2.filter(word => {
          return word['name']==element['name']
        });
        // console.log(x)
        this.divisiones3.push(x[0])
      });
    }else{
      this.divisiones3=this.Meses2
    }
    
    this.divisiones3.forEach(division => {

      let I1=Math.random()*14//getRandomInt(3)
      let I2=Math.random()*14//getRandomInt(3)
      let I3=Math.random()*14//getRandomInt(3)
      let I4=Math.random()*14//getRandomInt(3)
  
      TI1+=I1;
      TI2+=I2;
      TI3+=I3;
      TI4+=I4;
      this.randomIn2.push({name:division['name'],series:[{name:'Tasa de Frecuencia',value:I1},{name:'Tasa de Severidad',value:I2},{name:'Indice de Frecuencia',value:I3},{name:'Proporción AT mortal',value:I4}]})
    });
    this.randomIn2.push({name:'Corona total',series:[{name:'Tasa de Frecuencia',value:TI1},{name:'Tasa de Severidad',value:TI2},{name:'Indice de Frecuencia',value:TI3},{name:'Proporción AT mortal',value:TI4}]})
    
    let randomIn2Copy=[]
    
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
    this.flagevent1=true
  }



  async selectEv1(){

    let flagSelectEvent=this.flagevent1
    this.flagevent1=false
    this.randomEv1=[]

    let TI1=0.0
    let TI2=0.0
    let TI3=0.0
    let TI4=0.0

    if(this.selectDivisiones2.length>0){
      this.divisiones3=[]
      this.selectDivisiones2.forEach(element => {
        let x= this.divisiones2.filter(word => {
          return word['label']==element['label']
        });
        console.log(x)
        this.divisiones3.push(x[0])
      });
    }else{
      this.divisiones3=this.divisiones2
    }
    
    this.divisiones3.forEach(division => {

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
    this.randomEv1.push({name:'Corona total',series:[{name:'Numero AT',value:TI1},{name:'Numero días perdidos',value:TI2},{name:'Numero AT mortales',value:TI3},{name:'Numero AT con cero días',value:TI4}]})
    
    let randomEv1Copy=[]
    
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

    if(this.selectMeses2.length>0){
      this.divisiones3=[]
      this.selectMeses2.forEach(element => {
        let x= this.Meses.filter(word => {
          return word['label']==element['name']
        });
        // console.log(x)
        this.divisiones3.push(x[0])
      });
    }else{
      this.divisiones3=this.Meses
    }
    
    this.divisiones3.forEach(division => {

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
    this.randomEv2.push({name:'Corona total',series:[{name:'Numero AT',value:TI1},{name:'Numero días perdidos',value:TI2},{name:'Numero AT mortales',value:TI3},{name:'Numero AT con cero días',value:TI4}]})
    
    let randomEv2Copy=[]
    
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
  test(){
    console.log(this.selectedCities)
  }
}
