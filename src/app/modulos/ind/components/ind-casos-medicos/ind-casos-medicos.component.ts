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
  selector: 'app-ind-casos-medicos',
  templateUrl: './ind-casos-medicos.component.html',
  styleUrls: ['./ind-casos-medicos.component.scss'],
  providers: [],
})
export class IndCasosMedicosComponent implements OnInit {
  localeES = locale_es;
  NoCasosMedicos:number=2031;
  casosAbiertos:number=1996;
  casosPrioritarios:number=93;
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  division=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
  meses=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',  'Octubre','Noviembre', 'Diciembre'];
  divisiones= new Array();
  divisiones2= new Array();
  divisiones3= new Array();
  casos=[60, 930, 71, 69, 173,180,548];
  casosAbiertosGra=[29, 928, 61, 65, 173,180,531];
  casosPrioritariosGra=[14, 24, 15, 12, 2,6,20];
  casosRetornoGra=[54, 563, 62, 60, 26,8,264];
  casosRetornoGra2=[4,959,77]
  randomIn1Div:any[]=[]
  randomIn1Mes:any[]=[]
  randomRetorno:any[]=[]
  randomSindrome:any[]=[]

  randomEv1Dona: any[] = [];

  Indicadores: any[] = [{label: 'No.Casos', value: 0}, {label: 'Casos abiertos', value: 1}, {label: 'Casos prioritarios', value: 2},{label: 'Casos con retorno', value: 3}];
  Retorno: any[] = [{label: 'Retorno', value: 0}, {label: 'Reintegro', value: 1}, {label: 'Reubicación', value: 2}];
  Sindrome: any[] = [{name: 'SINDROME DE MANGUITO ROTATORIO', code: 0}, 
  {name: 'TRASTORNO DE DISCO LUMBAR Y OTROS, CON RADICULOPATIA', code: 1}, 
  {name: 'LUMBAGO NO ESPECIFICADO', code: 2}, 
  {name: 'SINDROME DEL TUNEL CARPIANO', code: 3}, 
  {name: 'OTRAS DEGENERACIONES DEL DISCO CERVICAL', code: 4}, 
  {name: 'OTROS ESTADOS POSTQUIRURGICOS ESPECIFICADOS', code: 5}, 
  {name: 'EPICONDILITIS MEDIA', code: 6}, 
  {name: 'HIPERTENSION ESENCIAL (PRIMARIA)', code: 7}, 
  {name: 'SINDROME DE ABDUCCION DOLOROSA DEL HOMBRO', code: 8}, 
  {name: 'TENDINITIS CALCIFICANTE DEL HOMBRO', code: 9}];

  selectDivisiones1: any[] = [];
  selectIndicarores1: any[] = [];
  selectIndicarores2: any[] = [];
  selectMeses1: any[] = [];
  selectMeses2: any[] = [];
  selectMeses3: any[] = [];
  selectRetorno: any[] = [];
  selectSindrome: any[] = [];
  selectDiv1: any[] = [];

  flagevent1:boolean=false
  flag1:boolean=false;
  flag2:boolean=false;
  flag3:boolean=false;
  flag4:boolean=false;

  casosGra1=[962, 1069, 0,0,0,0,0,0,0,0,0,0];
  casosAbiertosGra1=[962, 1034,0,0,0,0,0,0,0,0,0,0];
  casosPrioritariosGra1=[44, 49, 0,0,0,0,0,0,0,0,0,0];
  casosRetornoGra1=[506, 534, 0,0,0,0,0,0,0,0,0,0];
  cassosSindrome1=[117,122,54,97,69,56,35,31,23,21]
  yearRange = new Array();
  dateValue= new Date();
  añoPrimero:number=2022;
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

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

  selectYear1:number=2023;
  selectYear2:number=2023;
  selectYear3:number=2023;
  async ngOnInit() {

    let cont1=0;
    this.division.forEach(div => {
      this.randomEv1Dona.push({name:div,value:this.casos[cont1]})
      cont1=cont1+1;
    });

    this.casosMedicos()

    cont1=0;
    this.division.forEach(div => {
      this.divisiones.push({label:div,value:div})
      this.divisiones2.push({name:div,code:cont1})
      this.divisiones3.push({label:div,value:div})
      cont1=cont1+1;
    });
    this.divisiones3.push({label:'Total',value:'Total'})

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
  }

  casosMedicos(){
    let cont1=0
    this.division.forEach(div => {
      this.randomIn1Div.push({name:div,series:[{name:'No.Casos',value:this.casos[cont1]},{name:'Casos abiertos',value:this.casosAbiertosGra[cont1]},{name:'Casos prioritarios',value:this.casosPrioritariosGra[cont1]},{name:'Casos con retorno',value:this.casosRetornoGra[cont1]}]})
      cont1=cont1+1;
    });

    cont1=0
    this.meses.forEach(mes => {
      this.randomIn1Mes.push({name:mes,series:[{name:'No.Casos',value:this.casosGra1[cont1]},{name:'Casos abiertos',value:this.casosAbiertosGra1[cont1]},{name:'Casos prioritarios',value:this.casosPrioritariosGra1[cont1]},{name:'Casos con retorno',value:this.casosRetornoGra1[cont1]}]})
      cont1=cont1+1;
    });

    
    cont1=0
    this.Retorno.forEach(re => {
      this.randomRetorno.push({name:re.label,series:[{name:'No.Casos',value:this.casosRetornoGra2[cont1]}]})
      cont1=cont1+1;
    });

    cont1=0
    this.Sindrome.forEach(si => {
      this.randomSindrome.push({name:si.name,series:[{name:'No.Casos',value:this.cassosSindrome1[cont1]}]})
      cont1=cont1+1;
    });
    this.flagevent1=true
    this.flag1=true
    this.flag2=true
    this.flag3=true
    this.flag4=true
  }

  selectCas1(){
    this.flag1=false
    let cont1=0
    this.randomIn1Div=[]
    this.division.forEach(div => {
      this.randomIn1Div.push({name:div,series:[{name:'No.Casos',value:this.casos[cont1]},{name:'Casos abiertos',value:this.casosAbiertosGra[cont1]},{name:'Casos prioritarios',value:this.casosPrioritariosGra[cont1]},{name:'Casos con retorno',value:this.casosRetornoGra[cont1]}]})
      cont1=cont1+1;
    });
    let randomIn1Div=[]
    if(this.selectDivisiones1.length>0){
      this.selectDivisiones1.forEach(resp1=>{
        let x=this.randomIn1Div.filter((resp)=>{
          return resp.name ==resp1.label
        })
        randomIn1Div.push(x[0])
      }
      )
      this.randomIn1Div=randomIn1Div
    }

    if(this.selectIndicarores1.length>0){
      randomIn1Div=[]
      this.randomIn1Div.forEach(element => {
        let randomEv1CopySeries=[]
  
        if(this.selectIndicarores1.length>0){
          this.selectIndicarores1.forEach(element2 => {
            let x = element['series'].filter(word => {
              return word['name']==element2['label']
            });
            randomEv1CopySeries.push(x[0])
          });
        }else{
          randomEv1CopySeries=element['series']
        }
        randomIn1Div.push({name:element['name'],series:randomEv1CopySeries})
      });
      this.randomIn1Div=randomIn1Div
    }
    this.flag1=true
  }
  chageYear(){
    if(this.selectYear1==2023 && (this.selectDiv1.length==0 || this.selectDiv1.length==7)){
      this.casosGra1=[962, 1069, 0,0,0,0,0,0,0,0,0,0];
      this.casosAbiertosGra1=[962, 1034,0,0,0,0,0,0,0,0,0,0];
      this.casosPrioritariosGra1=[44, 49, 0,0,0,0,0,0,0,0,0,0];
      this.casosRetornoGra1=[506, 534, 0,0,0,0,0,0,0,0,0,0];
    }
    else if(this.selectDiv1.length>0 && this.selectDiv1.length<7 && this.selectYear1==2022){
      this.casosGra1=[ Math.round(Math.random()*1000),  Math.round(Math.random()*1000), 0,0,0,0,0,0,0,0,0,0];
      this.casosAbiertosGra1=[Math.round(Math.random()*1000), Math.round(Math.random()*1000),0,0,0,0,0,0,0,0,0,0];
      this.casosPrioritariosGra1=[Math.round(Math.random()*50), Math.round(Math.random()*50), 0,0,0,0,0,0,0,0,0,0];
      this.casosRetornoGra1=[Math.round(Math.random()*500), Math.round(Math.random()*500), 0,0,0,0,0,0,0,0,0,0];
    }
    else{
      this.casosGra1=[ Math.round(Math.random()*1000),  Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000),Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000)];
      this.casosAbiertosGra1=[ Math.round(Math.random()*1000),  Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000),Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000), Math.round(Math.random()*1000)];
      this.casosPrioritariosGra1=[Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50),Math.round(Math.random()*50), Math.round(Math.random()*50),Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50), Math.round(Math.random()*50)];
      this.casosRetornoGra1=[Math.round(Math.random()*500), Math.round(Math.random()*500), Math.round(Math.random()*500), Math.round(Math.random()*500), Math.round(Math.random()*500), Math.round(Math.random()*500),Math.round(Math.random()*500), Math.round(Math.random()*500),Math.round(Math.random()*500), Math.round(Math.random()*500),Math.round(Math.random()*500), Math.round(Math.random()*500)];
    }

    this.flag2=false
    let cont1=0
    this.randomIn1Mes=[]
    this.meses.forEach(mes => {
      this.randomIn1Mes.push({name:mes,series:[{name:'No.Casos',value:this.casosGra1[cont1]},{name:'Casos abiertos',value:this.casosAbiertosGra1[cont1]},{name:'Casos prioritarios',value:this.casosPrioritariosGra1[cont1]},{name:'Casos con retorno',value:this.casosRetornoGra1[cont1]}]})
      cont1=cont1+1;
    });

    let randomIn1Mes=[]
    if(this.selectMeses1.length>0){
      this.selectMeses1.forEach(resp1=>{
        let x=this.randomIn1Mes.filter((resp)=>{
          return resp.name ==resp1.name
        })
        randomIn1Mes.push(x[0])
      }
      )
      this.randomIn1Mes=randomIn1Mes
    }

    if(this.selectIndicarores2.length>0){
      randomIn1Mes=[]
      this.randomIn1Mes.forEach(element => {
        let randomEv1CopySeries=[]
  
        if(this.selectIndicarores2.length>0){
          this.selectIndicarores2.forEach(element2 => {
            let x = element['series'].filter(word => {
              return word['name']==element2['label']
            });
            randomEv1CopySeries.push(x[0])
          });
        }else{
          randomEv1CopySeries=element['series']
        }
        randomIn1Mes.push({name:element['name'],series:randomEv1CopySeries})
      });
      this.randomIn1Mes=randomIn1Mes
    }

    this.flag2=true
  }
  chageYear2(){
    if(this.selectYear2==2023 && (this.selectMeses2.length==0 || this.selectMeses2.length==12)){
      this.casosRetornoGra2=[4,959,77]
    }else{
      this.casosRetornoGra2=[Math.round(Math.random()*500),Math.round(Math.random()*500),Math.round(Math.random()*500)]
    }

    this.flag3=false
    let cont1=0
    this.randomRetorno=[]
    this.Retorno.forEach(re => {
      this.randomRetorno.push({name:re.label,series:[{name:'No.Casos',value:this.casosRetornoGra2[cont1]}]})
      cont1=cont1+1;
    });

    let randomRetorno=[]
    if(this.selectRetorno.length>0){
      this.selectRetorno.forEach(resp1=>{
        let x=this.randomRetorno.filter((resp)=>{
          return resp.name ==resp1.label
        })
        randomRetorno.push(x[0])
      }
      )
      this.randomRetorno=randomRetorno
    }    
    this.flag3=true
  }
  chageYear3(){
    if(this.selectYear3==2023 && (this.selectMeses3.length==0 || this.selectMeses3.length==12)){
      this.cassosSindrome1=[117,122,54,97,69,56,35,31,23,21]
    }else{
      this.cassosSindrome1=[Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150),Math.round(Math.random()*150)]  
    }

    this.flag4=false
    let cont1=0
    this.randomSindrome=[]
    cont1=0
    this.Sindrome.forEach(si => {
      this.randomSindrome.push({name:si.name,series:[{name:'No.Casos',value:this.cassosSindrome1[cont1]}]})
      cont1=cont1+1;
    });

    let randomSindrome=[]
    if(this.selectSindrome.length>0){
      this.selectSindrome.forEach(resp1=>{
        let x=this.randomSindrome.filter((resp)=>{
          return resp.name ==resp1.name
        })
        randomSindrome.push(x[0])
      }
      )
      this.randomSindrome=randomSindrome
    }   

    this.flag4=true
  }

  divisionCar:any
  changeCard(eve){
      

    if(eve.value=='Total'){
    this.NoCasosMedicos=0
    this.casos.forEach(num=>{
      this.NoCasosMedicos=this.NoCasosMedicos+num
    })

    this.casosAbiertos=0
    this.casosAbiertosGra.forEach(num=>{
      this.casosAbiertos=this.casosAbiertos+num
    })
    this.casosPrioritarios=this.NoCasosMedicos-this.casosAbiertos
  }else{
      let i=this.division.indexOf(eve.value)
      this.NoCasosMedicos=this.casos[i]
      this.casosAbiertos=this.casosAbiertosGra[i]
      this.casosPrioritarios=this.NoCasosMedicos-this.casosAbiertos
    }

  }
}