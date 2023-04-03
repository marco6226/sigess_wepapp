import { Component, OnInit} from "@angular/core";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
// import { multi} from './data';
import {CaracterizacionViewService} from "../../services/caracterizacion-view.service"
import { Carview } from 'app/modulos/ind/entities/caracterizacion';
import { element } from "protractor";
import{datos, division,tipoAccidenteCont,tipo_lesionCont,parte_cuerpoCont,agenteCont,mecanismoCont,sitioCont} from '../../entities/datosGraf4' 
import { SelectItem } from 'primeng/primeng'

import {
  tipo_vinculacion,
  jornada_trabajo,
  tipo_identificacion,
  tipo_identificacion_empresa,
  sitio,
  tipo_lesion,
  parte_cuerpo,
  agente,
  mecanismo,
  lugar,
  tipoAccidente,
  locale_es,
  severidad,
} from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { TipoPeligroService } from "app/modulos/ipr/services/tipo-peligro.service";
import { PeligroService } from "app/modulos/ipr/services/peligro.service";
import { TipoPeligro } from "app/modulos/ipr/entities/tipo-peligro";
import { Peligro } from "app/modulos/ipr/entities/peligro";
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { Cargo } from 'app/modulos/empresa/entities/cargo';

@Component({
  selector: 'app-ind-caracterizacion',
  templateUrl: './ind-caracterizacion.component.html',
  styleUrls: ['./ind-caracterizacion.component.scss'],
  providers: [CaracterizacionViewService,TipoPeligroService, PeligroService,],
})
export class IndCaracterizacionComponent implements OnInit {

  CaracterizacionView;
  ContLeve:number=0
  ContGrave:number=0
  ContSevero:number=0;
  ContMortal:number=0;
  ContHombres:number[]=[0,0,0,0,0,0,0]
  ContMujeres:number[]=[0,0,0,0,0,0,0]
  ContLugarFuera:number[]=[0,0,0,0,0,0,0]
  ContLugarDentro:number[]=[0,0,0,0,0,0,0]
  ContJornadaNormal:number[]=[0,0,0,0,0,0,0]
  ContJornadaExtra:number[]=[0,0,0,0,0,0,0]

  
  ContFechaAccidente:number[]=[0,0,0,0,0,0,0]

  ContFechaIngreso_1:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_1:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_1:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_2:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_2:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_2:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_3:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_3:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_3:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_4:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_4:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_4:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_5:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_5:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_5:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_6:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_6:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_6:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_7:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_7:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_7:number[]=[0,0,0,0,0,0,0]
  ContFechaIngreso_total:number[]=[0,0,0,0,0,0,0]
  ContFechaNacimiento_total:number[]=[0,0,0,0,0,0,0]
  ContHoraAccidente_total:number[]=[0,0,0,0,0,0,0]

  ContTipoATMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContSitioATMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContAgenteMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContMecanismoMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContParteCuerpoMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContTipoLesionMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]

  ContTipoATDiv:number[]=[0,0,0,0,0,0,0]
  ContSitioATDiv:number[]=[0,0,0,0,0,0,0]
  ContAgenteDiv:number[]=[0,0,0,0,0,0,0]
  ContMecanismoDiv:number[]=[0,0,0,0,0,0,0]
  ContParteCuerpoDiv:number[]=[0,0,0,0,0,0,0]
  ContTipoLesionDiv:number[]=[0,0,0,0,0,0,0]

  ContTipoATDivMap=new Map()
  ContSitioATDivMap=new Map()
  ContAgenteDivMap=new Map()
  ContMecanismoDivMap=new Map()
  ContParteCuerpoDivMap=new Map()
  ContTipoLesionDivMap=new Map()


  NombreGra1=['Sexo','Lugar','Jornada'];
  NombreGra2=['Edad','Antigüedad','Hora accidente'];
  divisiones1=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
  filtroEventos: any[] = [[{label: 'Sexo masculino', value: 'Sexo masculino'}, {label: 'Sexo femenino', value: 'Sexo femenino'}],[{label: 'Lugar fuera', value: 'Lugar fuera'},{label: 'Lugar adentro', value: 'Lugar adentro'}],[{label: 'Jornada normal', value: 'Jornada normal'},{label: 'Jornada extra', value: 'Jornada extra'}]];
  filtroEventos2: any[] = [[{name: '18 a 25 años', code: '18 a 25 años'}, {name: '26 a 35 años', code: '26 a 35 años'}, {name: '36 a 45 años', code: '36 a 45 años'}, {name: '46 a 59 años', code: '46 a 59 años'}, {name: '60 años en adelante', code: '60 años en adelante'}],
    [{name: '0 a 1 años', code: '0 a 1 años'},{name: '2 a 5 años', code: '2 a 5 años'}, {name: '6 a 10 años', code: '6 a 10 años'}, {name: '11 a 20 años', code: '11 a 20 años'}, {name: '21 a 30 años', code: '21 a 30 años'}, {name: '31 años en adelante', code: '31 años en adelante'}],
    [{name: '00:00 a 03:59', code: '00:00 a 03:59'},{name: '04:00 a 07:59', code: '04:00 a 07:59'}, {name: '08:00 a 11:59', code: '08:00 a 11:59'}, {name: '12:00 a 15:59', code: '12:00 a 15:59'}, {name: '16:00 a 19:59', code: '16:00 a 19:59'},{name: '20:00 a 23:59', code: '20:00 a 23:59'}]];
  filtroEventos4:any[]
  rangoFechaEdad=['18 a 25 años','26 a 35 años','36 a 45 años','46 a 59 años','60 años en adelante']
  rangoFechaAntiguedad=['0 a 1 años','2 a 5 años','6 a 10 años','11 a 20 años','21 a 30 años','31 años en adelante']
  rangoHoraAccidente=['00:00 a 03:59','04:00 a 07:59','08:00 a 11:59','12:00 a 15:59','16:00 a 19:59','20:00 a 23:59']
  divisiones2= new Array();
  divisiones3= new Array();
  divisiones4= new Array();
  divisiones5= new Array();
  rangoFechaEdad2= new Array();
  rangoFechaAntiguedad2= new Array();
  rangoHoraAccidente2= new Array();
  flagevent1:boolean=false;
  flagevent2:boolean=false;
  flagevent3:boolean=false;
  flagevent4:boolean=false;
  flagevent5:boolean=false;
  flagevent6:boolean=false;
  localeES = locale_es;
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };

  datosGrafica1:any=[];
  datosGrafica2:any=[];
  datosGrafica3:any=[];
  datosGrafica4:any=[];
  datosGrafica5:any=[];
  datosGrafica6:any=[];

  // datosGrafica_total:any=[];
  datosGrafica3_total:any=[];
  datosGrafica4_total:any=[];
  datosGrafica5_total:any=[];
  datosGrafica6_total:any=[];

  datosGrafica3Top:any=[];
  datosGrafica4Top:any=[];
  datosGrafica5Top:any=[];
  datosGrafica6Top:any=[];

  radioGra0:number=0
  radioGra0_1:number=0

  radioGra1:number=0
  radioGra1_1:number=0

  radioGra2:number=0
  radioGra2_1:number=0

  radioGra3:number=0
  radioGra3_1:number=0

  radioGra4:number=0
  radioGra4_1:number=0

  radioGra5:number=0
  radioGra5_1:number=0

  radioGra6:number=0
  radioGra6_1:number=0

  selectEv1: any[] = [];
  selectDiv1: any[] = [];
  selectArea: any[] = [];

  selectDiv2: any[] = [];
  selectEv2: any[] = [];
  selectYear2: any =2023;
  selectMonth2: any[] = [];

  selectDiv3: any[] = [];
  selectEv3: any[] = [];
  selectYear3: any =2023;
  selectMonth3: any[] = [];

  selectDiv4: any[] = [];
  selectEv4: any[] = [];
  selectYear4: any =2023;
  selectMonth4: any[] = [];

  selectDiv5: any[] = [];
  selectEv5: any[] = [];
  selectYear5: any =2023;
  selectMonth5: any[] = [];

  selectDiv6: any[] = [];
  selectPel6Flag: boolean=false;
  selectEv6: any[] = [];
  selectYear6: any =2023;
  selectMonth6: any[] = [];


  Meses= [
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
  ];
  yearRange = new Array();
  añoPrimero:number=2015;
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  labelFilterGra2:string='Seleccione rango edad'

  tipoaccidenteList: SelectItem[];
  sitioaccidenteList: SelectItem[];
  agenteList: SelectItem[];
  mecanismoList: SelectItem[];
  partecuerpoList: SelectItem[];
  tipolesionList: SelectItem[];

  cargoList: SelectItem[];
  constructor(
    private caracterizacionViewService: CaracterizacionViewService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private cargoService: CargoService,
  ) {
    this.tipolesionList = <SelectItem[]>tipo_lesion;
    this.partecuerpoList = <SelectItem[]>parte_cuerpo;
    this.agenteList = <SelectItem[]>agente;
    this.mecanismoList = <SelectItem[]>mecanismo;
    this.sitioaccidenteList = <SelectItem[]>sitio;
    this.tipoaccidenteList = <SelectItem[]>tipoAccidente;

  }

  async ngOnInit() {
    this.cargarTiposPeligro();
    let cargofiltQuery = new FilterQuery();
    cargofiltQuery.sortOrder = SortOrder.ASC;
    cargofiltQuery.sortField = "nombre";
    cargofiltQuery.fieldList = ["id", "nombre"];
    this.cargoService.findByFilter(cargofiltQuery).then((resp) => {
      this.cargoList = [];
      (<Cargo[]>resp['data']).forEach((cargo) => {
          this.cargoList.push({ label: cargo.nombre, value: cargo.id });
      });
  });

    let cont=0
    this.divisiones1.forEach(div => {
      this.divisiones2.push({label:div,value:div})
      this.divisiones3.push({name:div,code:cont})
      this.divisiones4.push({name:div,code:cont})
      this.divisiones5.push({label:div,value:div})
      cont=cont+1;
    });
    this.divisiones2.push({label:'Corona total',value:'Corona total'})
    this.divisiones3.push({name:'Corona total',code:cont})

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
    await this.caracterizacionViewService.findAllCAR().then(async (resp)=>{
      this.CaracterizacionView=resp
      this.CaracterizacionView.map(res1=>{
        res1.hora=Number(res1.hora.substr(0,2))
        res1.fechaaccidente=new Date(res1.fechaaccidente)
        res1.fechanacimientoempleado=new Date(res1.fechanacimientoempleado)
        res1.fechaingresoempleado=new Date(res1.fechaingresoempleado)
      });

      this.CardsClasificacion();
      this.DatosGrafica1();
      this.DatosGrafica2();
      this.DatosGrafica3();
      this.DatosGrafica4();
      this.DatosGrafica5();
    })
    
  }
  CaracterizacionView1:any
  CaracterizacionView2:any
  CaracterizacionView3:any
  CaracterizacionView4:any
  CaracterizacionView5:any
  CaracterizacionView6:any
  CaracterizacionView7:any

  date1: Date;
  date2: Date;
  date3: Date;
  date4: Date;
  date5: Date;
  date6: Date;
  date7: Date;
  date8: Date;
  date9: Date;
  date10: Date;
  date11: Date;
  date12: Date;

  
  CardsClasificacion(){

    this.CaracterizacionView1=this.CaracterizacionView

    if(this.date1 && !this.date2)
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
      return resp.fechaaccidente>=new Date(this.date1)
      })

    if(!this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      // date2=new Date(new Date(date2).setDate(new Date(date2).getDate()-1))
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente< date2;
        })
      }

    if(this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente<date2 && resp.fechaaccidente>=new Date(this.date1)
        })}

    this.ContLeve=0
    this.ContGrave=0
    this.ContSevero=0;
    this.ContMortal=0;

    this.CaracterizacionView1.forEach(element => {
      if(this.radioGra0==0){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==1 && element.emptemporal!=null){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==2 && element.emptemporal==null){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }



    });
  }

  ContCardsClasificacion(element){
    switch (element.severidad) {
      case 'Leve':
        this.ContLeve=this.ContLeve+1;
        break;
      case 'Grave':
        this.ContGrave=this.ContGrave+1;
        break;
      case 'Severo':
        this.ContSevero=this.ContSevero+1;
        break;
      case 'Mortal':
        this.ContMortal=this.ContMortal+1;
        break;
      default:
        break;
    }

  }


  ////////////Primera grafica//////////
  DatosGrafica1(){

      this.flagevent1=false

      this.CaracterizacionView2=this.CaracterizacionView

      if(this.date3 && !this.date4)
        this.CaracterizacionView2=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente>=new Date(this.date3)
        })
  
      if(!this.date3 && this.date4){
        let date4:Date=new Date(new Date(this.date4).setMonth(new Date(this.date4).getMonth()+1))
        // date4=new Date(new Date(date4).setDate(new Date(date4).getDate()-1))
        this.CaracterizacionView2=this.CaracterizacionView.filter(resp=>{
          return resp.fechaaccidente< date4;
          })
        }
  
      if(this.date3 && this.date4){
        let date4:Date=new Date(new Date(this.date4).setMonth(new Date(this.date4).getMonth()+1))
        this.CaracterizacionView2=this.CaracterizacionView.filter(resp=>{
          return resp.fechaaccidente<date4 && resp.fechaaccidente>=new Date(this.date3)
          })}
      this.ContHombres=[0,0,0,0,0,0,0]
      this.ContMujeres=[0,0,0,0,0,0,0]
      this.ContLugarFuera=[0,0,0,0,0,0,0]
      this.ContLugarDentro=[0,0,0,0,0,0,0]
      this.ContJornadaNormal=[0,0,0,0,0,0,0]
      this.ContJornadaExtra=[0,0,0,0,0,0,0]

      this.CaracterizacionView2.forEach(element => {
        if(this.radioGra1==0)this.ContDatosGraf1(element)
        if(this.radioGra1==1 && element.emptemporal!=null)this.ContDatosGraf1(element)
        if(this.radioGra1==2 && element.emptemporal==null)this.ContDatosGraf1(element)
      });
      this.primeraGrafica();
  }

  ContDatosGraf1(element){
    switch (element.padrenombre) {
      case 'Almacenes Corona':
        if(element.generoempleado=='M'){this.ContHombres[0]=this.ContHombres[0]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[0]=this.ContMujeres[0]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[0]=this.ContLugarFuera[0]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[0]=this.ContLugarDentro[0]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[0]=this.ContJornadaNormal[0]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[0]=this.ContJornadaExtra[0]+1;}
        break;
      case 'Bathrooms and Kitchen':
        if(element.generoempleado=='M'){this.ContHombres[1]=this.ContHombres[1]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[1]=this.ContMujeres[1]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[1]=this.ContLugarFuera[1]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[1]=this.ContLugarDentro[1]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[1]=this.ContJornadaNormal[1]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[1]=this.ContJornadaExtra[1]+1;}
        break;
      case 'Comercial Corona Colombia':
        if(element.generoempleado=='M'){this.ContHombres[2]=this.ContHombres[2]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[2]=this.ContMujeres[2]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[2]=this.ContLugarFuera[2]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[2]=this.ContLugarDentro[2]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[2]=this.ContJornadaNormal[2]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[2]=this.ContJornadaExtra[2]+1;}
        break;
      case 'Funciones Transversales':
        if(element.generoempleado=='M'){this.ContHombres[3]=this.ContHombres[3]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[3]=this.ContMujeres[3]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[3]=this.ContLugarFuera[3]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[3]=this.ContLugarDentro[3]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[3]=this.ContJornadaNormal[3]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[3]=this.ContJornadaExtra[3]+1;}
        break;
      case 'Insumos Industriales y Energias':
        if(element.generoempleado=='M'){this.ContHombres[4]=this.ContHombres[4]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[4]=this.ContMujeres[4]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[4]=this.ContLugarFuera[4]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[4]=this.ContLugarDentro[4]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[4]=this.ContJornadaNormal[4]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[4]=this.ContJornadaExtra[4]+1;}
        break;
      case 'Mesa Servida':
        if(element.generoempleado=='M'){this.ContHombres[5]=this.ContHombres[5]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[5]=this.ContMujeres[5]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[5]=this.ContLugarFuera[5]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[5]=this.ContLugarDentro[5]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[5]=this.ContJornadaNormal[5]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[5]=this.ContJornadaExtra[5]+1;}
        break;
      case 'Superficies, materiales y pinturas':
        if(element.generoempleado=='M'){this.ContHombres[6]=this.ContHombres[6]+1;}
        if(element.generoempleado=='F'){this.ContMujeres[6]=this.ContMujeres[6]+1;}
        if(element.lugaraccidente=='FUERA_EMPRESA'){this.ContLugarFuera[6]=this.ContLugarFuera[6]+1;}
        if(element.lugaraccidente=='DENTRO_EMPRESA'){this.ContLugarDentro[6]=this.ContLugarDentro[6]+1;}
        if(element.jornadaaccidente=='NORMAL'){this.ContJornadaNormal[6]=this.ContJornadaNormal[6]+1;}
        if(element.jornadaaccidente=='EXTRA'){this.ContJornadaExtra[6]=this.ContJornadaExtra[6]+1;}
        break;
      default:
        break;
    }
  }

  primeraGrafica(){
    this.flagevent1=false
    let cont1=0
    this.datosGrafica1=[]
    if(this.radioGra1_1==0){
      let sum1=0
      let sum2=0
    this.divisiones1.forEach(div => {
      sum1=sum1+this.ContHombres[cont1]
      sum2=sum2+this.ContMujeres[cont1]
      this.datosGrafica1.push({name:div,series:[{name:'Sexo masculino',value:this.ContHombres[cont1]},{name:'Sexo femenino',value:this.ContMujeres[cont1]}]})
      cont1=cont1+1;
    });
    this.datosGrafica1.push({name:'Corona total',series:[{name:'Sexo masculino',value:sum1},{name:'Sexo femenino',value:sum2}]})
  }

    if(this.radioGra1_1==1){
      let sum1=0
      let sum2=0
    this.divisiones1.forEach(div => {
      sum1=sum1+this.ContLugarFuera[cont1]
      sum2=sum2+this.ContLugarDentro[cont1]
      this.datosGrafica1.push({name:div,series:[{name:'Lugar fuera',value:this.ContLugarFuera[cont1]},{name:'Lugar adentro',value:this.ContLugarDentro[cont1]}]})
      cont1=cont1+1;
    });
    this.datosGrafica1.push({name:'Corona total',series:[{name:'Lugar fuera',value:sum1},{name:'Lugar adentro',value:sum2}]})
  }

    if(this.radioGra1_1==2){
      let sum1=0
      let sum2=0
    this.divisiones1.forEach(div => {
      sum1=sum1+this.ContJornadaNormal[cont1]
      sum2=sum2+this.ContJornadaExtra[cont1]
      this.datosGrafica1.push({name:div,series:[{name:'Jornada normal',value:this.ContJornadaNormal[cont1]},{name:'Jornada extra',value:this.ContJornadaExtra[cont1]}]})
      cont1=cont1+1;
    });
    this.datosGrafica1.push({name:'Corona total',series:[{name:'Jornada normal',value:sum1},{name:'Jornada extra',value:sum2}]})
  }

    this.flagevent1=true
  }

  filtroGraEve1(){
    this.DatosGrafica1()
    this.flagevent1=false
    let datosGrafica1=[]
    if(this.selectDiv1.length>0){
      this.selectDiv1.forEach(resp1=>{
        let x=this.datosGrafica1.filter((resp)=>{
          return resp.name ==resp1.label
        })
        datosGrafica1.push(x[0])
      }
      )
      this.datosGrafica1=datosGrafica1
    }

    if(this.selectEv1.length>0){
      datosGrafica1=[]
      this.datosGrafica1.forEach(element => {
        let randomEv1CopySeries=[]
  
        if(this.selectEv1.length>0){
          this.selectEv1.forEach(element2 => {
            let x = element['series'].filter(word => {
              return word['name']==element2['label']
            });
            randomEv1CopySeries.push(x[0])
          });
        }else{
          randomEv1CopySeries=element['series']
        }
        datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
      });
      this.datosGrafica1=datosGrafica1
    }
    
    this.flagevent1=true
  }

  resetSelect(){
    this.selectEv1=[]
    this.selectDiv1=[]
    this.primeraGrafica()
  }
  
////////////////////Segunda Grafica//////////////////

filtroGraEve2(){
  this.segundaGrafica()
  this.flagevent2=false
  let datosGrafica1=[]
  if(this.selectDiv2.length>0){
    this.selectDiv2.forEach(resp1=>{
      let x=this.datosGrafica2.filter((resp)=>{
        return resp.name ==resp1.label
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica2=datosGrafica1
  }

  if(this.selectEv2.length>0){
    datosGrafica1=[]
    this.datosGrafica2.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv2.length>0){
        this.selectEv2.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['name']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica2=datosGrafica1
  }

  this.flagevent2=true
}

resetVarGraf2(){
  this.ContFechaIngreso_1=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_1=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_1=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_2=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_2=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_2=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_3=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_3=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_3=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_4=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_4=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_4=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_5=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_5=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_5=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_6=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_6=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_6=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_7=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_7=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_7=[0,0,0,0,0,0,0]
  this.ContFechaIngreso_total=[0,0,0,0,0,0,0]
  this.ContFechaNacimiento_total=[0,0,0,0,0,0,0]
  this.ContHoraAccidente_total=[0,0,0,0,0,0,0]
}
  DatosGrafica2(){

    this.CaracterizacionView3=this.CaracterizacionView

    if(this.date5 && !this.date6)
      this.CaracterizacionView3=this.CaracterizacionView3.filter(resp=>{
      return resp.fechaaccidente>=new Date(this.date5)
      })

    if(!this.date5 && this.date6){
      let date6:Date=new Date(new Date(this.date6).setMonth(new Date(this.date6).getMonth()+1))
      // date6=new Date(new Date(date6).setDate(new Date(date6).getDate()-1))
      this.CaracterizacionView3=this.CaracterizacionView3.filter(resp=>{
        return resp.fechaaccidente< date6;
        })
      }

    if(this.date5 && this.date6){
      let date6:Date=new Date(new Date(this.date6).setMonth(new Date(this.date6).getMonth()+1))
      this.CaracterizacionView3=this.CaracterizacionView3.filter(resp=>{
        return resp.fechaaccidente<date6 && resp.fechaaccidente>=new Date(this.date5)
        })}

    if(this.selectYear2){
      this.CaracterizacionView3=this.CaracterizacionView3.filter(resp=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear2
        })
    }

    if(this.selectMonth2.length>0){
      let CaracterizacionView3=[]
      let CaracterizacionView3_1=[]
      this.selectMonth2.forEach(ele=>{
        CaracterizacionView3=this.CaracterizacionView3.filter(resp=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView3.forEach(resp2=>{
          CaracterizacionView3_1.push(resp2)
        })
      })
      this.CaracterizacionView3=CaracterizacionView3_1
    }
    

    this.resetVarGraf2()

    this.CaracterizacionView3.forEach(element => {
      if(this.radioGra2==0)this.ContDatosGraf2(element)
      if(this.radioGra2==1 && element.emptemporal!=null)this.ContDatosGraf2(element)
      if(this.radioGra2==2 && element.emptemporal==null)this.ContDatosGraf2(element)
    });
    // this.segundaGrafica()
    this.filtroGraEve2()
  }
  ContDatosGraf2(element){
    let anios=this.difAnios(element.fechanacimientoempleado, new Date())
    this.fechaNacimiento(anios,element)

    let antiguedad=this.difAnios(element.fechaingresoempleado, new Date())
    this.fechaAntiguedad(antiguedad,element)

    this.horaAccidente(element.hora,element)
  }
  fechaNacimiento(element,element2){
    switch (element2.padrenombre) {
      case 'Almacenes Corona':
        if(element>=18 && element<=25){this.ContFechaNacimiento_1[0]=this.ContFechaNacimiento_1[0]+1;}
        if( element>=26 && element<=35){this.ContFechaNacimiento_1[1]=this.ContFechaNacimiento_1[1]+1;}
        if( element>=36 && element<=45)this.ContFechaNacimiento_1[2]=this.ContFechaNacimiento_1[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_1[3]=this.ContFechaNacimiento_1[3]+1;
        if( element>=60)this.ContFechaNacimiento_1[4]=this.ContFechaNacimiento_1[4]+1;
        break;
      case 'Bathrooms and Kitchen':
        if(element>=18 && element<=25)this.ContFechaNacimiento_2[0]=this.ContFechaNacimiento_2[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_2[1]=this.ContFechaNacimiento_2[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_2[2]=this.ContFechaNacimiento_2[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_2[3]=this.ContFechaNacimiento_2[3]+1;
        if( element>=60)this.ContFechaNacimiento_2[4]=this.ContFechaNacimiento_2[4]+1;
        break;
      case 'Comercial Corona Colombia':
        if(element>=18 && element<=25)this.ContFechaNacimiento_3[0]=this.ContFechaNacimiento_3[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_3[1]=this.ContFechaNacimiento_3[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_3[2]=this.ContFechaNacimiento_3[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_3[3]=this.ContFechaNacimiento_3[3]+1;
        if( element>=60)this.ContFechaNacimiento_3[4]=this.ContFechaNacimiento_3[4]+1;
        break;
      case 'Funciones Transversales':
        if(element>=18 && element<=25)this.ContFechaNacimiento_4[0]=this.ContFechaNacimiento_4[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_4[1]=this.ContFechaNacimiento_4[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_4[2]=this.ContFechaNacimiento_4[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_4[3]=this.ContFechaNacimiento_4[3]+1;
        if( element>=60)this.ContFechaNacimiento_4[4]=this.ContFechaNacimiento_1[4]+1;
        break;
      case 'Insumos Industriales y Energias':
        if(element>=18 && element<=25)this.ContFechaNacimiento_5[0]=this.ContFechaNacimiento_5[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_5[1]=this.ContFechaNacimiento_5[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_5[2]=this.ContFechaNacimiento_5[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_5[3]=this.ContFechaNacimiento_5[3]+1;
        if( element>=60)this.ContFechaNacimiento_5[4]=this.ContFechaNacimiento_5[4]+1;
        break;
      case 'Mesa Servida':
        if(element>=18 && element<=25)this.ContFechaNacimiento_6[0]=this.ContFechaNacimiento_6[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_6[1]=this.ContFechaNacimiento_6[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_6[2]=this.ContFechaNacimiento_6[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_6[3]=this.ContFechaNacimiento_6[3]+1;
        if( element>=60)this.ContFechaNacimiento_6[4]=this.ContFechaNacimiento_6[4]+1;
        break;
      case 'Superficies, materiales y pinturas':
        if(element>=18 && element<=25)this.ContFechaNacimiento_7[0]=this.ContFechaNacimiento_7[0]+1;
        if( element>=26 && element<=35)this.ContFechaNacimiento_7[1]=this.ContFechaNacimiento_7[1]+1;
        if( element>=36 && element<=45)this.ContFechaNacimiento_7[2]=this.ContFechaNacimiento_7[2]+1;
        if( element>=46 && element<=59)this.ContFechaNacimiento_7[3]=this.ContFechaNacimiento_7[3]+1;
        if( element>=60)this.ContFechaNacimiento_7[4]=this.ContFechaNacimiento_7[4]+1;
        break;
      default:
        break;
    }
    if(element>=18 && element<=25)this.ContFechaNacimiento_total[0]=this.ContFechaNacimiento_total[0]+1;
    if( element>=26 && element<=35)this.ContFechaNacimiento_total[1]=this.ContFechaNacimiento_total[1]+1;
    if( element>=36 && element<=45)this.ContFechaNacimiento_total[2]=this.ContFechaNacimiento_total[2]+1;
    if( element>=46 && element<=59)this.ContFechaNacimiento_total[3]=this.ContFechaNacimiento_total[3]+1;
    if( element>=60)this.ContFechaNacimiento_total[4]=this.ContFechaNacimiento_total[4]+1;
  }

  fechaAntiguedad(element,element2){
    switch (element2.padrenombre) {
      case 'Almacenes Corona':
        if(element>=0 && element<=1)this.ContFechaIngreso_1[0]=this.ContFechaIngreso_1[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_1[1]=this.ContFechaIngreso_1[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_1[2]=this.ContFechaIngreso_1[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_1[3]=this.ContFechaIngreso_1[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_1[4]=this.ContFechaIngreso_1[4]+1;
        if( element>=30)this.ContFechaIngreso_1[5]=this.ContFechaIngreso_1[5]+1;
        break;
      case 'Bathrooms and Kitchen':
        if(element>=0 && element<=1)this.ContFechaIngreso_2[0]=this.ContFechaIngreso_2[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_2[1]=this.ContFechaIngreso_2[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_2[2]=this.ContFechaIngreso_2[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_2[3]=this.ContFechaIngreso_2[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_2[4]=this.ContFechaIngreso_2[4]+1;
        if( element>=30)this.ContFechaIngreso_2[5]=this.ContFechaIngreso_2[5]+1;
        break;
      case 'Comercial Corona Colombia':
        if(element>=0 && element<=1)this.ContFechaIngreso_3[0]=this.ContFechaIngreso_3[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_3[1]=this.ContFechaIngreso_3[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_3[2]=this.ContFechaIngreso_3[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_3[3]=this.ContFechaIngreso_3[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_3[4]=this.ContFechaIngreso_3[4]+1;
        if( element>=30)this.ContFechaIngreso_3[5]=this.ContFechaIngreso_3[5]+1;
        break;
      case 'Funciones Transversales':
        if(element>=0 && element<=1)this.ContFechaIngreso_4[0]=this.ContFechaIngreso_4[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_4[1]=this.ContFechaIngreso_4[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_4[2]=this.ContFechaIngreso_4[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_4[3]=this.ContFechaIngreso_4[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_4[4]=this.ContFechaIngreso_4[4]+1;
        if( element>=30)this.ContFechaIngreso_4[5]=this.ContFechaIngreso_4[5]+1;
        break;
      case 'Insumos Industriales y Energias':
        if(element>=0 && element<=1)this.ContFechaIngreso_5[0]=this.ContFechaIngreso_5[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_5[1]=this.ContFechaIngreso_5[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_5[2]=this.ContFechaIngreso_5[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_5[3]=this.ContFechaIngreso_5[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_5[4]=this.ContFechaIngreso_5[4]+1;
        if( element>=30)this.ContFechaIngreso_5[5]=this.ContFechaIngreso_5[5]+1;
        break;
      case 'Mesa Servida':
        if(element>=0 && element<=1)this.ContFechaIngreso_6[0]=this.ContFechaIngreso_6[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_6[1]=this.ContFechaIngreso_6[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_6[2]=this.ContFechaIngreso_6[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_6[3]=this.ContFechaIngreso_6[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_6[4]=this.ContFechaIngreso_6[4]+1;
        if( element>=30)this.ContFechaIngreso_6[5]=this.ContFechaIngreso_6[5]+1;
        break;
      case 'Superficies, materiales y pinturas':
        if(element>=0 && element<=1)this.ContFechaIngreso_7[0]=this.ContFechaIngreso_7[0]+1;
        if( element>=2 && element<=5)this.ContFechaIngreso_7[1]=this.ContFechaIngreso_7[1]+1;
        if( element>=6 && element<=10)this.ContFechaIngreso_7[2]=this.ContFechaIngreso_7[2]+1;
        if( element>=11 && element<=20)this.ContFechaIngreso_7[3]=this.ContFechaIngreso_7[3]+1;
        if( element>=21 && element<=30)this.ContFechaIngreso_7[4]=this.ContFechaIngreso_7[4]+1;
        if( element>=30)this.ContFechaIngreso_7[5]=this.ContFechaIngreso_7[5]+1;
        break;
      default:
        break;
    }

    if( element>=0 && element<=1)this.ContFechaIngreso_total[0]=this.ContFechaIngreso_total[0]+1;
    if( element>=2 && element<=5)this.ContFechaIngreso_total[1]=this.ContFechaIngreso_total[1]+1;
    if( element>=6 && element<=10)this.ContFechaIngreso_total[2]=this.ContFechaIngreso_total[2]+1;
    if( element>=11 && element<=20)this.ContFechaIngreso_total[3]=this.ContFechaIngreso_total[3]+1;
    if( element>=21 && element<=30)this.ContFechaIngreso_total[4]=this.ContFechaIngreso_total[4]+1;
    if( element>=30)this.ContFechaIngreso_total[5]=this.ContFechaIngreso_total[5]+1;

  }

  horaAccidente(element,element2){
    switch (element2.padrenombre) {
      case 'Almacenes Corona':
        if(element>=0 && element<4){this.ContHoraAccidente_1[0]=this.ContHoraAccidente_1[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_1[1]=this.ContHoraAccidente_1[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_1[2]=this.ContHoraAccidente_1[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_1[3]=this.ContHoraAccidente_1[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_1[4]=this.ContHoraAccidente_1[4]+1;}
        if( element>=20){this.ContHoraAccidente_1[5]=this.ContHoraAccidente_1[5]+1;}
        break;
      case 'Bathrooms and Kitchen':
        if(element>=0 && element<4){this.ContHoraAccidente_2[0]=this.ContHoraAccidente_2[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_2[1]=this.ContHoraAccidente_2[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_2[2]=this.ContHoraAccidente_2[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_2[3]=this.ContHoraAccidente_2[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_2[4]=this.ContHoraAccidente_2[4]+1;}
        if( element>=20){this.ContHoraAccidente_2[5]=this.ContHoraAccidente_2[5]+1;}
        break;
      case 'Comercial Corona Colombia':
        if(element>=0 && element<4){this.ContHoraAccidente_3[0]=this.ContHoraAccidente_3[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_3[1]=this.ContHoraAccidente_3[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_3[2]=this.ContHoraAccidente_3[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_3[3]=this.ContHoraAccidente_3[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_3[4]=this.ContHoraAccidente_3[4]+1;}
        if( element>=20){this.ContHoraAccidente_3[5]=this.ContHoraAccidente_3[5]+1;}
        break;
      case 'Funciones Transversales':
        if(element>=0 && element<4){this.ContHoraAccidente_4[0]=this.ContHoraAccidente_4[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_4[1]=this.ContHoraAccidente_4[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_4[2]=this.ContHoraAccidente_4[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_4[3]=this.ContHoraAccidente_4[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_4[4]=this.ContHoraAccidente_4[4]+1;}
        if( element>=20){this.ContHoraAccidente_4[5]=this.ContHoraAccidente_4[5]+1;}
        break;
      case 'Insumos Industriales y Energias':
        if(element>=0 && element<4){this.ContHoraAccidente_5[0]=this.ContHoraAccidente_5[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_5[1]=this.ContHoraAccidente_5[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_5[2]=this.ContHoraAccidente_5[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_5[3]=this.ContHoraAccidente_5[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_5[4]=this.ContHoraAccidente_5[4]+1;}
        if( element>=20){this.ContHoraAccidente_5[5]=this.ContHoraAccidente_5[5]+1;}
        break;
      case 'Mesa Servida':
        if(element>=0 && element<4){this.ContHoraAccidente_6[0]=this.ContHoraAccidente_6[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_6[1]=this.ContHoraAccidente_6[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_6[2]=this.ContHoraAccidente_6[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_6[3]=this.ContHoraAccidente_6[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_6[4]=this.ContHoraAccidente_6[4]+1;}
        if( element>=20){this.ContHoraAccidente_6[5]=this.ContHoraAccidente_6[5]+1;}
        break;
      case 'Superficies, materiales y pinturas':
        if(element>=0 && element<4){this.ContHoraAccidente_7[0]=this.ContHoraAccidente_7[0]+1;}
        if( element>=4 && element<8){this.ContHoraAccidente_7[1]=this.ContHoraAccidente_7[1]+1;}
        if( element>=8 && element<12){this.ContHoraAccidente_7[2]=this.ContHoraAccidente_7[2]+1;}
        if( element>=12 && element<16){this.ContHoraAccidente_7[3]=this.ContHoraAccidente_7[3]+1;}
        if( element>=16 && element<20){this.ContHoraAccidente_7[4]=this.ContHoraAccidente_7[4]+1;}
        if( element>=20){this.ContHoraAccidente_7[5]=this.ContHoraAccidente_7[5]+1;}
        break;
      default:
        break;
    }

    if(element>=0 && element<4){this.ContHoraAccidente_total[0]=this.ContHoraAccidente_total[0]+1;}
    if( element>=4 && element<8){this.ContHoraAccidente_total[1]=this.ContHoraAccidente_total[1]+1;}
    if( element>=8 && element<12){this.ContHoraAccidente_total[2]=this.ContHoraAccidente_total[2]+1;}
    if( element>=12 && element<16){this.ContHoraAccidente_total[3]=this.ContHoraAccidente_total[3]+1;}
    if( element>=16 && element<20){this.ContHoraAccidente_total[4]=this.ContHoraAccidente_total[4]+1;}
    if( element>=20){this.ContHoraAccidente_total[5]=this.ContHoraAccidente_total[5]+1;}
  }
  funcRangoFechaEdad(ele){
    let datos=[]
    let cont1=0
    this.rangoFechaEdad.forEach(div => {
      datos.push({name:div,value:ele[cont1]})
      cont1=cont1+1;
    });
    return datos
  }
  funcRangoFechaAntiguedad(ele){
    let datos=[]
    let cont1=0
    this.rangoFechaAntiguedad.forEach(div => {
      datos.push({name:div,value:ele[cont1]})
      cont1=cont1+1;
    });
    return datos
  }
  funcRangoHoraAccidente(ele){
    let datos=[]
    let cont1=0
    this.rangoHoraAccidente.forEach(div => {
      datos.push({name:div,value:ele[cont1]})
      cont1=cont1+1;
    });
    return datos
  }
  segundaGrafica(){
    this.flagevent2=false
    
    this.datosGrafica2=[]
    if(this.radioGra2_1==0){

      this.datosGrafica2.push({name:'Almacenes Corona',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_1)})
      this.datosGrafica2.push({name:'Bathrooms and Kitchen',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_2)})
      this.datosGrafica2.push({name:'Comercial Corona Colombia',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_3)})
      this.datosGrafica2.push({name:'Funciones Transversales',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_4)})
      this.datosGrafica2.push({name:'Insumos Industriales y Energias',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_5)})
      this.datosGrafica2.push({name:'Mesa Servida',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_6)})
      this.datosGrafica2.push({name:'Superficies, materiales y pinturas',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_7)})
      this.datosGrafica2.push({name:'Corona total',series:this.funcRangoFechaEdad(this.ContFechaNacimiento_total)})

  }

    if(this.radioGra2_1==1){
      this.datosGrafica2.push({name:'Almacenes Corona',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_1)})
      this.datosGrafica2.push({name:'Bathrooms and Kitchen',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_2)})
      this.datosGrafica2.push({name:'Comercial Corona Colombia',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_3)})
      this.datosGrafica2.push({name:'Funciones Transversales',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_4)})
      this.datosGrafica2.push({name:'Insumos Industriales y Energias',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_5)})
      this.datosGrafica2.push({name:'Mesa Servida',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_6)})
      this.datosGrafica2.push({name:'Superficies, materiales y pinturas',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_7)})
      this.datosGrafica2.push({name:'Corona total',series:this.funcRangoFechaAntiguedad(this.ContFechaIngreso_total)})

 
  }

    if(this.radioGra2_1==2){

      this.datosGrafica2.push({name:'Almacenes Corona',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_1)})
      this.datosGrafica2.push({name:'Bathrooms and Kitchen',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_2)})
      this.datosGrafica2.push({name:'Comercial Corona Colombia',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_3)})
      this.datosGrafica2.push({name:'Funciones Transversales',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_4)})
      this.datosGrafica2.push({name:'Insumos Industriales y Energias',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_5)})
      this.datosGrafica2.push({name:'Mesa Servida',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_6)})
      this.datosGrafica2.push({name:'Superficies, materiales y pinturas',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_7)})
      this.datosGrafica2.push({name:'Corona total',series:this.funcRangoHoraAccidente(this.ContHoraAccidente_total)})
  }

    this.flagevent2=true
  }

  resetSelect2(){
    this.selectEv2=[]
    this.selectDiv2=[]
    if(this.radioGra2_1==0){this.labelFilterGra2='Seleccione rango edad'}
    if(this.radioGra2_1==1){this.labelFilterGra2='Seleccione rango antigüedad'}
    if(this.radioGra2_1==2){this.labelFilterGra2='Seleccione rango hora'}
    this.DatosGrafica2()
  }

///////////////Tercera Grafica/////////////////////
filtroGraEve3(){
  this.flagevent3=false
  this.terceraGrafica()
  let datosGrafica1=[]

  if(this.selectEv3.length==0 && this.selectDiv3.length>0){
    // console.log(this.datosGrafica3Top)
    this.datosGrafica3=this.contTotal(this.datosGrafica3)
    this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
    // console.log(this.datosGrafica3Top)
    this.datosGrafica3Top=this.top(this.datosGrafica3,5)

    if(this.selectDiv3.length>0){
      this.selectDiv3.forEach(resp1=>{
        let x=this.datosGrafica3Top.filter((resp)=>{
          return resp.name ==resp1.name
        })
        datosGrafica1.push(x[0])
      })
      this.datosGrafica3Top=datosGrafica1
    }
  }

  if(this.selectDiv3.length>0 && this.selectEv3.length>0){
    this.datosGrafica3=this.contTotal(this.datosGrafica3)
    this.selectDiv3.forEach(resp1=>{
      let x=this.datosGrafica3.filter((resp)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica3Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica3Top.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv3.length>0){
        this.selectEv3.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top=datosGrafica1
  }

  if(this.selectEv3.length>0 && this.selectDiv3.length==0){
    datosGrafica1=[]
    this.datosGrafica3=this.contTotal(this.datosGrafica3)
    this.datosGrafica3.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv3.length>0){
        this.selectEv3.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top=datosGrafica1
  }

  if(this.selectEv3.length==0 && this.selectDiv3.length==0){
    this.datosGrafica3=this.contTotal(this.datosGrafica3)
    this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
    this.datosGrafica3Top=this.top(this.datosGrafica3,5)
  }

  this.flagevent3=true
}

resetVariables3_2(){
  this.selectDiv3= [];
  this.selectEv3= [];
  this.DatosGrafica3();
}
resetVariables(){
  this.contTipoLesion=[]
  this.hashmap1 = new Map();
  this.hashmap2 = new Map();
  this.hashmap3 = new Map();
  this.hashmap4 = new Map();
  this.hashmap5 = new Map();
  this.hashmap6 = new Map();
  this.hashmap7 = new Map();
  this.orderMap1=[]
  this.orderMap2=[]
  this.orderMap3=[]
  this.orderMap4=[]
  this.orderMap5=[]
  this.orderMap6=[]
  this.orderMap7=[]
  this.orderMap=[]

  this.Map1=[]
  this.Map2=[]
  this.Map3=[]
  this.Map4=[]
  this.Map5=[]
  this.Map6=[]
  this.Map7=[]
}
contTipoLesion:any[]=[]
hashmap1 = new Map();
hashmap2 = new Map();
hashmap3 = new Map();
hashmap4 = new Map();
hashmap5 = new Map();
hashmap6 = new Map();
hashmap7 = new Map();


orderMap1=[]
orderMap2=[]
orderMap3=[]
orderMap4=[]
orderMap5=[]
orderMap6=[]
orderMap7=[]
orderMap=[]
DatosGrafica3(){

  this.CaracterizacionView4=this.CaracterizacionView

    if(this.date7 && !this.date8)
      this.CaracterizacionView4=this.CaracterizacionView.filter(resp=>{
      return resp.fechaaccidente>=new Date(this.date7)
      })

    if(!this.date7 && this.date8){
      let date8:Date=new Date(new Date(this.date8).setMonth(new Date(this.date8).getMonth()+1))
      // date8=new Date(new Date(date8).setDate(new Date(date8).getDate()-1))
      this.CaracterizacionView4=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente< date8;
        })
      }

    if(this.date7 && this.date8){
      let date8:Date=new Date(new Date(this.date8).setMonth(new Date(this.date8).getMonth()+1))
      this.CaracterizacionView4=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente<date8 && resp.fechaaccidente>=new Date(this.date7)
        })}

    if(this.selectYear3){
      this.CaracterizacionView4=this.CaracterizacionView4.filter(resp=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear3
        })
    }

    if(this.selectMonth3.length>0){
      let CaracterizacionView4=[]
      let CaracterizacionView4_1=[]
      this.selectMonth3.forEach(ele=>{
        CaracterizacionView4=this.CaracterizacionView4.filter(resp=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView4.forEach(resp2=>{
          CaracterizacionView4_1.push(resp2)
        })
      })
      this.CaracterizacionView4=CaracterizacionView4_1
    }

  this.resetVariables()

  this.CaracterizacionView4.forEach(element => {
    if(this.radioGra3==0)this.ContDatosGraf3(element)
    if(this.radioGra3==1 && element.emptemporal!=null)this.ContDatosGraf3(element)
    if(this.radioGra3==2 && element.emptemporal==null)this.ContDatosGraf3(element)
  });
  this.orderMap=[this.ordenarMap(this.hashmap1,this.Map1),this.ordenarMap(this.hashmap2,this.Map2),this.ordenarMap(this.hashmap3,this.Map3),this.ordenarMap(this.hashmap4,this.Map4),this.ordenarMap(this.hashmap5,this.Map5),this.ordenarMap(this.hashmap6,this.Map6),this.ordenarMap(this.hashmap7,this.Map7)]
  this.terceraGrafica()
  this.datosGrafica3=this.contTotal(this.datosGrafica3)
  this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
  this.datosGrafica3Top=this.top(this.datosGrafica3,5)

  this.filtroGraEve3()
}

Map1:any[]=[]
Map2:any[]=[]
Map3:any[]=[]
Map4:any[]=[]
Map5:any[]=[]
Map6:any[]=[]
Map7:any[]=[]

  ContDatosGraf3(element){
  switch (element.padrenombre) {
    case 'Almacenes Corona':
      if(this.hashmap1.has(element.cargoempleado)){
        this.hashmap1.set(element.cargoempleado,this.hashmap1.get(element.cargoempleado)+1)
      }else{
        this.hashmap1.set(element.cargoempleado, 1);
        this.Map1.push(element.cargoempleado);
      }
      break;
    case 'Bathrooms and Kitchen':
      if(this.hashmap2.has(element.cargoempleado)){
        this.hashmap2.set(element.cargoempleado,this.hashmap2.get(element.cargoempleado)+1)
      }else{
        this.hashmap2.set(element.cargoempleado, 1);
        this.Map2.push(element.cargoempleado);
      }
      break;
    case 'Comercial Corona Colombia':
      if(this.hashmap3.has(element.cargoempleado)){
        this.hashmap3.set(element.cargoempleado,this.hashmap3.get(element.cargoempleado)+1)
      }else{
        this.hashmap3.set(element.cargoempleado, 1);
        this.Map3.push(element.cargoempleado);
      }
      break;
    case 'Funciones Transversales':
      if(this.hashmap4.has(element.cargoempleado)){
        this.hashmap4.set(element.cargoempleado,this.hashmap4.get(element.cargoempleado)+1)
      }else{
        this.hashmap4.set(element.cargoempleado, 1);
        this.Map4.push(element.cargoempleado);
      }
      break;
    case 'Insumos Industriales y Energias':
      if(this.hashmap5.has(element.cargoempleado)){
        this.hashmap5.set(element.cargoempleado,this.hashmap5.get(element.cargoempleado)+1)
      }else{
        this.hashmap5.set(element.cargoempleado, 1);
        this.Map5.push(element.cargoempleado);
      }
      break;
    case 'Mesa Servida':
      if(this.hashmap6.has(element.cargoempleado)){
        this.hashmap6.set(element.cargoempleado,this.hashmap6.get(element.cargoempleado)+1)
      }else{
        this.hashmap6.set(element.cargoempleado, 1);
        this.Map6.push(element.cargoempleado);
      }
      break;
    case 'Superficies, materiales y pinturas':
      if(this.hashmap7.has(element.cargoempleado)){
        this.hashmap7.set(element.cargoempleado,this.hashmap7.get(element.cargoempleado)+1)
      }else{
        this.hashmap7.set(element.cargoempleado, 1);
        this.Map7.push(element.cargoempleado);
      }
      break;
    default:
      break;
  }


}

terceraGrafica(){
  this.flagevent3=false

  this.datosGrafica3=[]
  let cont=0
  this.divisiones1.forEach(element=>{
    let datosGrafica3=[]
    for (let index = 0; index < this.orderMap[cont].length; index++) {
      datosGrafica3.push(this.orderMap[cont][index]);
    }
    this.datosGrafica3.push({name:element,series:datosGrafica3})
    cont++;
  })
 
  this.flagevent3=true
}

resetSelect3(){
  this.selectEv3=[]
}

//////////////////////cuarta grafica///////////////////

filtroGraEve4(){
  this.flagevent4=false
  this.graf4top5()
  let datosGrafica1=[]

  if(this.selectEv4.length==0 && this.selectDiv4.length>0){
    // this.datosGrafica4=this.contTotal(this.datosGrafica4)
    this.datosGrafica4=this.contTotal(this.datosGrafica4)
    this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)
    this.datosGrafica4Top=this.top(this.datosGrafica4,5)

    if(this.selectDiv4.length>0){
      this.selectDiv4.forEach(resp1=>{
        let x=this.datosGrafica4Top.filter((resp)=>{
          return resp.name ==resp1.name
        })
        datosGrafica1.push(x[0])
      })
      this.datosGrafica4Top=datosGrafica1
    }
  }

  if(this.selectDiv4.length>0 && this.selectEv4.length>0){
    this.datosGrafica4=this.contTotal(this.datosGrafica4)
    this.selectDiv4.forEach(resp1=>{
      let x=this.datosGrafica4.filter((resp)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica4Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica4Top.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv4.length>0){
        this.selectEv4.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica4Top=datosGrafica1
  }

  if(this.selectEv4.length>0 && this.selectDiv4.length==0){
    this.datosGrafica4=this.contTotal(this.datosGrafica4)
    datosGrafica1=[]
    this.datosGrafica4.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv4.length>0){
        this.selectEv4.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    
    this.datosGrafica4Top=datosGrafica1
  }

  if(this.selectEv4.length==0 && this.selectDiv4.length==0){
    // this.datosGrafica4=this.contTotal(this.datosGrafica4)
    this.datosGrafica4=this.contTotal(this.datosGrafica4)
    this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)
    this.datosGrafica4Top=this.top(this.datosGrafica4,5)
  }

  this.flagevent4=true
}

DatosGrafica4(){
  this.CaracterizacionView5=this.CaracterizacionView

  this.reinciarVariable()

  if(this.selectYear4){
    this.CaracterizacionView5=this.CaracterizacionView5.filter(resp=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear4
      })
  }

  if(this.selectMonth4.length>0){
    let CaracterizacionView5=[]
    let CaracterizacionView5_1=[]
    this.selectMonth4.forEach(ele=>{
      CaracterizacionView5=this.CaracterizacionView5.filter(resp=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView5.forEach(resp2=>{
        CaracterizacionView5_1.push(resp2)
      })
    })
    this.CaracterizacionView5=CaracterizacionView5_1
  }

  this.CaracterizacionView5.forEach(element => {
    if(this.radioGra4==0)this.ContDatosGraf4(element)
    if(this.radioGra4==1 && element.emptemporal!=null)this.ContDatosGraf4(element)
    if(this.radioGra4==2 && element.emptemporal==null)this.ContDatosGraf4(element)
  });
  this.datos4push.push(this.datos4_1)
  this.datos4push.push(this.datos4_2)
  this.datos4push.push(this.datos4_3)
  this.datos4push.push(this.datos4_4)
  this.datos4push.push(this.datos4_5)
  this.datos4push.push(this.datos4_6)
  this.datos4push.push(this.datos4_7)
  this.graf4top5()
  this.datosGrafica4=this.contTotal(this.datosGrafica4)
  this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)

  this.datosGrafica4Top=this.top(this.datosGrafica4,5)
  // this.filtroGraEve4()
}

tipoAccidente=[]
lugarAccidente=[]
agente=[]
mecanismo=[]
parteCuerpo=[]
tipoLesion=[]
labelGraf4:string="Tipo de accidente"
graf4top5(){
  this.flagevent4=false
  let tipoAccidente=[]
  let lugarAccidente=[]
  let agente=[]
  let mecanismo=[]
  let parteCuerpo=[]
  let tipoLesion=[]
  let order=[]
  this.datosGrafica4=[]

  if(this.radioGra4_1==0){
    this.labelGraf4="Tipo de accidente"
    this.filtroEventos4=this.tipoaccidenteList
    this.datos4push.forEach(ele => {
      order=[]
      this.tipoaccidenteList.forEach(ele2=>{
        if(ele.datos.tipoAccidenteCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.tipoAccidenteCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }

  if(this.radioGra4_1==1){
    this.labelGraf4="Lugar del accidente"
    this.filtroEventos4=this.sitioaccidenteList
    this.datos4push.forEach(ele => {
      order=[]
      this.sitioaccidenteList.forEach(ele2=>{
        if(ele.datos.sitioCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.sitioCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }

  if(this.radioGra4_1==2){
    this.labelGraf4="Agente"
    this.filtroEventos4=this.agenteList
    this.datos4push.forEach(ele => {
      order=[]
      this.agenteList.forEach(ele2=>{
        if(ele.datos.agenteCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.agenteCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }

  if(this.radioGra4_1==3){
    this.labelGraf4="Mecanismo"
    this.filtroEventos4=this.mecanismoList
    this.datos4push.forEach(ele => {
      order=[]
      this.mecanismoList.forEach(ele2=>{
        if(ele.datos.mecanismoCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.mecanismoCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }

  if(this.radioGra4_1==4){
    this.labelGraf4="Parte del cuerpo"
    this.filtroEventos4=this.partecuerpoList
    this.datos4push.forEach(ele => {
      order=[]
      this.partecuerpoList.forEach(ele2=>{
        if(ele.datos.parte_cuerpoCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.parte_cuerpoCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }

  if(this.radioGra4_1==5){
    this.labelGraf4="Tipo de lesión"
    this.filtroEventos4=this.tipolesionList
    this.datos4push.forEach(ele => {
      order=[]
      this.tipolesionList.forEach(ele2=>{
        if(ele.datos.tipo_lesionCont[ele2.value]){order.push({name:ele2.value,value:ele.datos.tipo_lesionCont[ele2.value]})}
        else {order.push({name:ele2.value,value:0})}
      })
        order=this.order(order)
        this.datosGrafica4.push({name:ele.padrenombre,series:order})
      });
  }
  
  this.flagevent4=true
  
}

conteo(element,element2,padrenombre){
  if(element2.has(padrenombre+'/'+element.tipoaccidente)){
    element2.set(element.tipoaccidente,element2.get(element.tipoaccidente)+1)
  }else{
    element2.set(element.tipoaccidente, 1);
  }
}

datos4push
datos4_1:division=new division();
datos4_2:division=new division();
datos4_3:division=new division();
datos4_4:division=new division();
datos4_5:division=new division();
datos4_6:division=new division();
datos4_7:division=new division();

ContDatosGraf4(element){
  switch (element.padrenombre) {
    case 'Almacenes Corona':
      this.datos4_1.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_1.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_1.datos.tipo_lesionCont[element.tipolesion]=this.datos4_1.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_1.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_1.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_1.datos.agenteCont[element.agente]=this.datos4_1.datos.agenteCont[element.agente]+1;
      this.datos4_1.datos.mecanismoCont[element.mecanismo]=this.datos4_1.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_1.datos.sitioCont[element.sitio]=this.datos4_1.datos.sitioCont[element.sitio]+1;
      break;
    case 'Bathrooms and Kitchen':
      this.datos4_2.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_2.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_2.datos.tipo_lesionCont[element.tipolesion]=this.datos4_2.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_2.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_2.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_2.datos.agenteCont[element.agente]=this.datos4_2.datos.agenteCont[element.agente]+1;
      this.datos4_2.datos.mecanismoCont[element.mecanismo]=this.datos4_2.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_2.datos.sitioCont[element.sitio]=this.datos4_2.datos.sitioCont[element.sitio]+1;
      break;
    case 'Comercial Corona Colombia':
      this.datos4_3.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_3.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_3.datos.tipo_lesionCont[element.tipolesion]=this.datos4_3.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_3.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_3.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_3.datos.agenteCont[element.agente]=this.datos4_3.datos.agenteCont[element.agente]+1;
      this.datos4_3.datos.mecanismoCont[element.mecanismo]=this.datos4_3.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_3.datos.sitioCont[element.sitio]=this.datos4_3.datos.sitioCont[element.sitio]+1;
      break;
    case 'Funciones Transversales':
      this.datos4_4.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_4.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_4.datos.tipo_lesionCont[element.tipolesion]=this.datos4_4.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_4.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_4.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_4.datos.agenteCont[element.agente]=this.datos4_4.datos.agenteCont[element.agente]+1;
      this.datos4_4.datos.mecanismoCont[element.mecanismo]=this.datos4_4.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_4.datos.sitioCont[element.sitio]=this.datos4_4.datos.sitioCont[element.sitio]+1;
      break;
    case 'Insumos Industriales y Energias':
      this.datos4_5.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_5.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_5.datos.tipo_lesionCont[element.tipolesion]=this.datos4_5.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_5.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_5.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_5.datos.agenteCont[element.agente]=this.datos4_5.datos.agenteCont[element.agente]+1;
      this.datos4_5.datos.mecanismoCont[element.mecanismo]=this.datos4_5.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_5.datos.sitioCont[element.sitio]=this.datos4_5.datos.sitioCont[element.sitio]+1;
      break;
    case 'Mesa Servida':
      this.datos4_6.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_6.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_6.datos.tipo_lesionCont[element.tipolesion]=this.datos4_6.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_6.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_6.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_6.datos.agenteCont[element.agente]=this.datos4_6.datos.agenteCont[element.agente]+1;
      this.datos4_6.datos.mecanismoCont[element.mecanismo]=this.datos4_6.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_6.datos.sitioCont[element.sitio]=this.datos4_6.datos.sitioCont[element.sitio]+1;
      break;
    case 'Superficies, materiales y pinturas':
      this.datos4_7.datos.tipoAccidenteCont[element.tipoaccidente]=this.datos4_7.datos.tipoAccidenteCont[element.tipoaccidente]+1;
      this.datos4_7.datos.tipo_lesionCont[element.tipolesion]=this.datos4_7.datos.tipo_lesionCont[element.tipolesion]+1;
      this.datos4_7.datos.parte_cuerpoCont[element.partecuerpo]=this.datos4_7.datos.parte_cuerpoCont[element.partecuerpo]+1;
      this.datos4_7.datos.agenteCont[element.agente]=this.datos4_7.datos.agenteCont[element.agente]+1;
      this.datos4_7.datos.mecanismoCont[element.mecanismo]=this.datos4_7.datos.mecanismoCont[element.mecanismo]+1;
      this.datos4_7.datos.sitioCont[element.sitio]=this.datos4_7.datos.sitioCont[element.sitio]+1;
      break;
    default:
      break;
  }
}
reinciarVariable4_1(){
  this.selectEv4=[]
  this.selectDiv4=[]

  this.DatosGrafica4()
}
reinciarVariable(){
  this.datos4push=[];
  this.datos4_1=new division();
  this.datos4_2=new division();
  this.datos4_3=new division();
  this.datos4_4=new division();
  this.datos4_5=new division();
  this.datos4_6=new division();
  this.datos4_7=new division();

  this.datos4_1.padrenombre='Almacenes Corona';
  this.datos4_1.datos= new datos
  this.datos4_1.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_1.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_1.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_1.datos.agenteCont=new agenteCont()
  this.datos4_1.datos.mecanismoCont=new mecanismoCont()
  this.datos4_1.datos.sitioCont=new sitioCont()

  this.datos4_2.padrenombre='Bathrooms and Kitchen';
  this.datos4_2.datos= new datos
  this.datos4_2.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_2.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_2.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_2.datos.agenteCont=new agenteCont()
  this.datos4_2.datos.mecanismoCont=new mecanismoCont()
  this.datos4_2.datos.sitioCont=new sitioCont()

  this.datos4_3.padrenombre='Comercial Corona Colombia';
  this.datos4_3.datos= new datos
  this.datos4_3.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_3.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_3.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_3.datos.agenteCont=new agenteCont()
  this.datos4_3.datos.mecanismoCont=new mecanismoCont()
  this.datos4_3.datos.sitioCont=new sitioCont()

  this.datos4_4.padrenombre='Funciones Transversales';
  this.datos4_4.datos= new datos
  this.datos4_4.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_4.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_4.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_4.datos.agenteCont=new agenteCont()
  this.datos4_4.datos.mecanismoCont=new mecanismoCont()
  this.datos4_4.datos.sitioCont=new sitioCont()

  this.datos4_5.padrenombre='Insumos Industriales y Energias';
  this.datos4_5.datos= new datos
  this.datos4_5.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_5.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_5.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_5.datos.agenteCont=new agenteCont()
  this.datos4_5.datos.mecanismoCont=new mecanismoCont()
  this.datos4_5.datos.sitioCont=new sitioCont()

  this.datos4_6.padrenombre='Mesa Servida';
  this.datos4_6.datos= new datos
  this.datos4_6.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_6.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_6.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_6.datos.agenteCont=new agenteCont()
  this.datos4_6.datos.mecanismoCont=new mecanismoCont()
  this.datos4_6.datos.sitioCont=new sitioCont()

  this.datos4_7.padrenombre='Superficies, materiales y pinturas';
  this.datos4_7.datos= new datos
  this.datos4_7.datos.tipoAccidenteCont=new tipoAccidenteCont()
  this.datos4_7.datos.tipo_lesionCont=new tipo_lesionCont()
  this.datos4_7.datos.parte_cuerpoCont=new parte_cuerpoCont()
  this.datos4_7.datos.agenteCont=new agenteCont()
  this.datos4_7.datos.mecanismoCont=new mecanismoCont()
  this.datos4_7.datos.sitioCont=new sitioCont()
}


//////////quinta grafica///////////////////

filtroGraEve5(){
  this.DatosGrafica5()
  this.flagevent5=false
  let datosGrafica1=[]

  if(this.selectDiv5.length==0 && this.selectEv5.length==0){
    // this.datosGrafica5=this.contTotal(this.datosGrafica5)
    this.datosGrafica5Top=this.top(this.datosGrafica5,5)
  }

  if(this.selectDiv5.length>0 && this.selectEv5.length==0){
    // this.datosGrafica5=this.contTotal(this.datosGrafica5)
    this.selectDiv5.forEach(resp1=>{
      let x=this.datosGrafica5.filter((resp)=>{
        return resp.name ==resp1.label
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top=datosGrafica1
  }

  if(this.selectDiv5.length==0 && this.selectEv5.length>0){
    datosGrafica1=[]
    // this.datosGrafica5=this.contTotal(this.datosGrafica5)
    this.datosGrafica5.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv5.length>0){
        this.selectEv5.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top=datosGrafica1
  }
  
  if(this.selectDiv5.length>0 && this.selectEv5.length>0){
    // this.datosGrafica5=this.contTotal(this.datosGrafica5)
    this.selectDiv5.forEach(resp1=>{
      let x=this.datosGrafica5.filter((resp)=>{
        return resp.name ==resp1.label
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica5Top.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv5.length>0){
        this.selectEv5.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top=datosGrafica1
  }

  this.flagevent5=true

}
resetvariable5_1(){
  this.selectDiv5=[]
  this.selectEv5=[]
  this.DatosGrafica5()
}
resetvariables5(){
  this.mapGraf5_1=new Map()
  this.mapGraf5_2=new Map()
  this.mapGraf5_3=new Map()
  this.mapGraf5_4=new Map()
  this.mapGraf5_5=new Map()
  this.mapGraf5_6=new Map()
  this.mapGraf5_7=new Map()
}
DatosGrafica5(){
  this.resetvariables5()
  this.CaracterizacionView6=this.CaracterizacionView

  if(this.date9 && !this.date10)
  this.CaracterizacionView6=this.CaracterizacionView.filter(resp=>{
  return resp.fechaaccidente>=new Date(this.date9)
  })

if(!this.date9 && this.date10){
  let date10:Date=new Date(new Date(this.date10).setMonth(new Date(this.date10).getMonth()+1))
  // date10=new Date(new Date(date10).setDate(new Date(date10).getDate()-1))
  this.CaracterizacionView6=this.CaracterizacionView.filter(resp=>{
    return resp.fechaaccidente< date10;
    })
  }

if(this.date9 && this.date10){
  let date10:Date=new Date(new Date(this.date10).setMonth(new Date(this.date10).getMonth()+1))
  this.CaracterizacionView6=this.CaracterizacionView.filter(resp=>{
    return resp.fechaaccidente<date10 && resp.fechaaccidente>=new Date(this.date10)
    })}

  this.CaracterizacionView6.forEach(element => {
    if(this.radioGra5==0)this.ContDatosGraf5(element)
    if(this.radioGra5==1 && element.emptemporal!=null)this.ContDatosGraf5(element)
    if(this.radioGra5==2 && element.emptemporal==null)this.ContDatosGraf5(element)
  });

  this.quintaGrafica()
  this.datosGrafica5=this.contTotal(this.datosGrafica5)
  this.datosGrafica5=this.organizarDatosMayorMenor(this.datosGrafica5)
  this.datosGrafica5Top=this.top(this.datosGrafica5,5)
}
mapGraf5_1=new Map()
mapGraf5_2=new Map()
mapGraf5_3=new Map()
mapGraf5_4=new Map()
mapGraf5_5=new Map()
mapGraf5_6=new Map()
mapGraf5_7=new Map()

ContDatosGraf5(element){
  let peligro=JSON.parse(element.peligro);
  if(peligro)peligro=peligro.nombre
  switch (element.padrenombre) {
    case 'Almacenes Corona':
      if(this.mapGraf5_1.has(peligro)){
        this.mapGraf5_1.set(peligro,this.mapGraf5_1.get(peligro)+1)
      }else{
        this.mapGraf5_1.set(peligro,1)
      }
      break;
    case 'Bathrooms and Kitchen':
      if(this.mapGraf5_2.has(peligro)){
        this.mapGraf5_2.set(peligro,this.mapGraf5_2.get(peligro)+1)
      }else{
        this.mapGraf5_2.set(peligro,1)
      }
      break;
    case 'Comercial Corona Colombia':
      if(this.mapGraf5_3.has(peligro)){
        this.mapGraf5_3.set(peligro,this.mapGraf5_3.get(peligro)+1)
      }else{
        this.mapGraf5_3.set(peligro,1)
      }
      break;
    case 'Funciones Transversales':
      if(this.mapGraf5_4.has(peligro)){
        this.mapGraf5_4.set(peligro,this.mapGraf5_4.get(peligro)+1)
      }else{
        this.mapGraf5_4.set(peligro,1)
      }
      break;
    case 'Insumos Industriales y Energias':
      if(this.mapGraf5_5.has(peligro)){
        this.mapGraf5_5.set(peligro,this.mapGraf5_5.get(peligro)+1)
      }else{
        this.mapGraf5_5.set(peligro,1)
      }
      break;
    case 'Mesa Servida':
      if(this.mapGraf5_6.has(peligro)){
        this.mapGraf5_6.set(peligro,this.mapGraf5_6.get(peligro)+1)
      }else{
        this.mapGraf5_6.set(peligro,1)
      }
      break;
    case 'Superficies, materiales y pinturas':
      if(this.mapGraf5_7.has(peligro)){
        this.mapGraf5_7.set(peligro,this.mapGraf5_7.get(peligro)+1)
      }else{
        this.mapGraf5_7.set(peligro,1)
      }
      break;
    default:
      break;
  }

}
quintaGrafica(){
  this.flagevent5=false

  this.datosGrafica5=[]
  let cont=0
  let map=new Map()
  this.divisiones1.forEach(resp=>{
    let order=[]
    if(cont==0)map=this.mapGraf5_1
    if(cont==1)map=this.mapGraf5_2
    if(cont==2)map=this.mapGraf5_3
    if(cont==3)map=this.mapGraf5_4
    if(cont==4)map=this.mapGraf5_5
    if(cont==5)map=this.mapGraf5_6
    if(cont==6)map=this.mapGraf5_7

    this.peligro.forEach(element => {
      if(map.get(element))order.push({name:element,value:map.get(element)})
      if(!map.get(element))order.push({name:element,value:0})
    });
    order=this.order(order)
    this.datosGrafica5.push({name:resp,series:order})
    cont++
  })
  this.flagevent5=true
}




///////////////sexta grafica/////////////
graf6_1:any=[]
graf6_2:any=[]
graf6_3:any=[]
graf6_4:any=[]
graf6_5:any=[]
graf6_6:any=[]
graf6_7:any=[]

filtroGraEve6(){
  this.DatosGrafica6()
  this.flagevent6=false
  let datosGrafica1=[]

  if(this.selectDiv6.length==0 && this.selectEv6.length==0){
    // this.datosGrafica6=this.contTotal(this.datosGrafica6)
    this.datosGrafica6Top=this.top(this.datosGrafica6,5)
  }

  if(this.selectDiv6.length>0 && this.selectEv6.length==0){
    // this.datosGrafica6=this.contTotal(this.datosGrafica6)
    this.selectDiv6.forEach(resp1=>{
      let x=this.datosGrafica6.filter((resp)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top=datosGrafica1
  }

  if(this.selectDiv6.length==0 && this.selectEv6.length>0){
    // this.datosGrafica6=this.contTotal(this.datosGrafica6)
    datosGrafica1=[]
    this.datosGrafica6.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv6.length>0){
        this.selectEv6.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top=datosGrafica1
  }
  
  if(this.selectDiv6.length>0 && this.selectEv6.length>0){
    // this.datosGrafica6=this.contTotal(this.datosGrafica6)
    this.selectDiv6.forEach(resp1=>{
      let x=this.datosGrafica6.filter((resp)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica6Top.forEach(element => {
      let randomEv1CopySeries=[]

      if(this.selectEv6.length>0){
        this.selectEv6.forEach(element2 => {
          let x = element['series'].filter(word => {
            return word['name']==element2['label']
          });
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top=datosGrafica1
  }

  this.flagevent6=true

}

resetVar6(){
  this.selectPel6Flag=false
  this.selectEv6=[]
  this.selectDiv6=[]
  this.DatosGrafica6()
}
DatosGrafica6(){
  this.flagevent6=false
  this.graf6_1=[]
  this.graf6_2=[]
  this.graf6_3=[]
  this.graf6_4=[]
  this.graf6_5=[]
  this.graf6_6=[]
  this.graf6_7=[]

  this.CaracterizacionView7=this.CaracterizacionView

  if(this.selectYear6){
    this.CaracterizacionView7=this.CaracterizacionView7.filter(resp=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear6
      })
  }

  if(this.selectMonth6.length>0){
    let CaracterizacionView7=[]
    let CaracterizacionView7_1=[]
    this.selectMonth6.forEach(ele=>{
      CaracterizacionView7=this.CaracterizacionView7.filter(resp=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView7.forEach(resp2=>{
        CaracterizacionView7_1.push(resp2)
      })
    })
    this.CaracterizacionView7=CaracterizacionView7_1
  }

  this.peligroItemList2.forEach(ele => {
    this.graf6_1.push({name:ele.label,value:0})
    this.graf6_2.push({name:ele.label,value:0})
    this.graf6_3.push({name:ele.label,value:0})
    this.graf6_4.push({name:ele.label,value:0})
    this.graf6_5.push({name:ele.label,value:0})
    this.graf6_6.push({name:ele.label,value:0})
    this.graf6_7.push({name:ele.label,value:0})
  });

  this.CaracterizacionView7.forEach(element => {
    if(this.radioGra6==0)this.ContDatosGraf6(element)
    if(this.radioGra6==1 && element.emptemporal!=null)this.ContDatosGraf6(element)
    if(this.radioGra6==2 && element.emptemporal==null)this.ContDatosGraf6(element)
  });

  this.sextaGrafica()
  // this.datosGrafica6=this.contTotal(this.datosGrafica6)
  this.datosGrafica6=this.contTotal(this.datosGrafica6)
  this.datosGrafica6=this.organizarDatosMayorMenor(this.datosGrafica6)

  this.datosGrafica6Top=this.top(this.datosGrafica6,5)
  this.flagevent6=true
}
  ContDatosGraf6(element){
    let descripcionpeligro=JSON.parse(element.descripcionpeligro)
    if(descripcionpeligro)descripcionpeligro=descripcionpeligro.nombre
    switch (element.padrenombre) {
      case 'Almacenes Corona':
        this.graf6_1.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Bathrooms and Kitchen':
        this.graf6_2.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Comercial Corona Colombia':
        this.graf6_3.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Funciones Transversales':
        this.graf6_4.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Insumos Industriales y Energias':
        this.graf6_5.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Mesa Servida':
        this.graf6_6.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      case 'Superficies, materiales y pinturas':
        this.graf6_7.map(resp=>{
          if(resp.name==descripcionpeligro){
            resp.value=resp.value+1
          }
        })
        break;
      default:
        break;
    }
    

  }
  sextaGrafica(){
    this.datosGrafica6=[]
    this.datosGrafica6.push({name:'Almacenes Corona',series:this.order(this.graf6_1)})
    this.datosGrafica6.push({name:'Bathrooms and Kitchen',series:this.order(this.graf6_2)})
    this.datosGrafica6.push({name:'Comercial Corona Colombia',series:this.order(this.graf6_3)})
    this.datosGrafica6.push({name:'Funciones Transversales',series:this.order(this.graf6_4)})
    this.datosGrafica6.push({name:'Insumos Industriales y Energias',series:this.order(this.graf6_5)})
    this.datosGrafica6.push({name:'Mesa Servida',series:this.order(this.graf6_6)})
    this.datosGrafica6.push({name:'Superficies, materiales y pinturas',series:this.order(this.graf6_7)})    
  }
 
  /////Comun/////
  difAnios(date, otherDate):Number{
    var tiempo=otherDate.getTime() - date.getTime()
    var anios = (Math.floor(tiempo / (1000 * 60 * 60 * 24)))/365;
    return Math.floor(anios)
  }

  ordenarMap(map,ordermap){
    let maporder=[]
    ordermap.forEach(element => {
      maporder.push({name:element,value:map.get(element)})
    });
    maporder.sort(function (a, b) {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });
    return maporder
  }
  
  order(ele){
    ele.sort(function (a, b) {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });
    return ele
  }
  tipoPeligroItemList: SelectItem[];
  peligroItemList: SelectItem[];
  peligroItemList2: any=[];
  peligro:any=[]
  tipoPeligroItemList2:any=[]

  cargarTiposPeligro() {
    this.peligro=[]
    this.tipoPeligroItemList2=[]
    this.tipoPeligroService.findAll().then(
      resp => {
        this.tipoPeligroItemList = [];
        (<TipoPeligro[]>resp['data']).forEach(
          data =>{ 
            this.tipoPeligroItemList.push({ label: data.nombre, value: data })
            this.tipoPeligroItemList2.push({ label: data.nombre, value: data })
            this.peligro.push(data.nombre)
          }
        )   
      }
    );
  }
  cargarPeligro(idtp) {
    this.peligroItemList2=[]
    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
    this.peligroService.findByFilter(filter).then(
      resp => {
        this.peligroItemList = [];
        (<Peligro[]>resp).forEach(
          data => 
            {
                this.peligroItemList.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
                this.peligroItemList2.push({ label: data.nombre, value: data.nombre })
            }
        )
        this.DatosGrafica6()
      }
    );
     }else{
        this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
     }
  }

  SelectPeligro(a: string){
    this.resetVar6()
    this.selectPel6Flag=true
    this.cargarPeligro(a)
    
  }

  top(dato, limit) {
    let dato2=[] 
    dato.forEach(ele =>{
      let cont=0
      let serie=[]
      ele.series.forEach(ele2=>{
        if(ele.series.length>=limit){
          if(cont<limit){
            serie.push({name:ele2.name , value:ele2.value} ) 
          }
        }else{
          serie.push({name:ele2.name , value:ele2.value})
        }
        cont++
      }) 
      dato2.push({name:ele.name ,series:serie} )
    })
    return dato2
  }

  contTotal(datos){
    let name=[]
    let datosGrafica_total=[]
    let total=new Map()
    datos.forEach(resp=>{
      resp.series.forEach(resp2=>{
        if(total.has(resp2.name)){total.set(resp2.name,total.get(resp2.name)+resp2.value)}
        else{total.set(resp2.name,resp2.value)
          name.push(resp2.name)}
      })
    })
    name.forEach(resp=>{
      datosGrafica_total.push({name:resp,value:total.get(resp)})
    })
    
    datos.push({name:'Corona total',series:datosGrafica_total})
  
    return datos
  }

  organizarDatosMayorMenor(dato){
    let datosReturn=[]
    dato.forEach(resp=>{
      let datos=Array.from(resp['series'])
      datos=this.order(datos)
      datosReturn.push({name:resp['name'],series:datos})
    })
    // console.log(datosReturn)
    return datosReturn
  }
}

