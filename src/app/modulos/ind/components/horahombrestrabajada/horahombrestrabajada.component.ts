import { Component, OnInit } from '@angular/core';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { SelectItem } from 'primeng/primeng';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { SortOrder } from "app/modulos/core/entities/filter";
import { Criteria } from "../../../core/entities/filter";
//import { TipoAreaService } from './services/tipo-area.service';
import { HhtService } from 'app/modulos/empresa/services/hht.service'
import { Hht } from "../../../empresa/entities/hht";
import { Form, FormBuilder, FormControl, FormGroup, Validators ,FormGroupDirective} from "@angular/forms";
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service'

@Component({
  selector: 'app-horahombrestrabajada',
  templateUrl: './horahombrestrabajada.component.html',
  styleUrls: ['./horahombrestrabajada.component.scss'],
  providers: [HhtService]
})
export class HorahombrestrabajadaComponent implements OnInit {
  fechaActual = new Date();
  areaList: Area[] = [];
  dateValue= new Date();
  añoPrimero:number=2015;
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);
  yearRange = new Array();
  valor:Hht;
  idHHT:number;
  anioSelect:number;
  empresaSelect:string;
  TotalAnioNH;
  TotalAnioHHT;
  mesesHHT1;
  flagAnio:boolean=false;
  flagEmpresa:boolean=false;
  // empresasHHT: FormGroup;
  // areaHHT: FormGroup;
  // mesesHHT: FormGroup;
  // valorHHT: FormGroup;
  // ubicaionHHT:FormGroup;
Meses={
  0:{
    HHT:null,
    NH:null
  },
  1:{
    HHT:null,
    NH:null
  },
  2:{
    HHT:null,
    NH:null
  },
  3:{
    HHT:null,
    NH:null
  },
  4:{
    HHT:null,
    NH:null
  },
  5:{
    HHT:null,
    NH:null
  },
  6:{
    HHT:null,
    NH:null
  },
  7:{
    HHT:null,
    NH:null
  },
  8:{
    HHT:null,
    NH:null
  },
  9:{
    HHT:null,
    NH:null
  },
  10:{
    HHT:null,
    NH:null
  },
  11:{
    HHT:null,
    NH:null
  }
}

Ubicacion= [
    'Girardota',
    'Funza',
    'Madrid',
];

meses = [
  {label: 'Enero', value: 'Enero'},
  {label: 'Febrero', value: 'Febrero'},
  {label: 'Marzo', value: 'Marzo'},
  {label: 'Abril', value: 'Abril'},
  {label: 'Mayo', value: 'Mayo'},
  {label: 'Junio', value: 'Junio'},
  {label: 'Julio', value: 'Julio'},
  {label: 'Agosto', value: 'Agosto'},
  {label: 'Septiembre', value: 'Septiembre'},
  {label: 'Octubre', value: 'Octubre'},
  {label: 'Noviembre', value: 'Noviembre'},
  {label: 'Diciembre', value: 'Diciembre'}
];
Temporales= [
  {label: 'Corona', value: 'Corona'},
  {label: 'Temporal uno', value: 'Temporal uno'},
  {label: 'Temporal dos', value: 'Temporal dos'},
  {label: 'Temporal tres', value: 'Temporal tres'},
];

  constructor(
    private areaService: AreaService,
    private hhtService: HhtService,
    private empresaService: EmpresaService,
    private  fb: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.areasNivel0();
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
    this.CreateMesesHHT1()
    await this.cargarHHT()
  }

  anioSelecionado(event){
    this.anioSelect=event.value
    this.flagAnio=true;
    this.getBDhht()
  }

  empresaSelecionado(event){
    console.log('entre')
    console.log(event.value)
    this.empresaSelect=event.value
    this.flagEmpresa=true;
    this.getBDhht()
  }

  async getBDhht(){
    if(this.flagAnio && this.flagEmpresa){
      let hhtfiltQuery = new FilterQuery();
        hhtfiltQuery.sortOrder = SortOrder.ASC;
        hhtfiltQuery.sortField = "id";
        // cargofiltQuery.filterList = [{ field: 'anio', criteria: Criteria.EQUALS, value1:  this.empresaSelect}];
        hhtfiltQuery.filterList = [
            { criteria: Criteria.EQUALS, field: "anio", value1: this.anioSelect.toString() },
            { criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.empresaSelect }
        ];
        // cargofiltQuery.fieldList = ["id", "nombre"];
        await this.hhtService.findByFilter(hhtfiltQuery).then((resp) => {
          
          if(resp['data'].length>0){
            this.mesesHHT1=[]
            resp['data'].forEach(element => {
              this.mesesHHT1.push(JSON.parse(element.valor))
            });
          }else{
            this.CreateMesesHHT1()
          }
          this.sumaTotalMesAño()
        });
    }
  }
  sumaTotalMesAño(){
    for (let i = 0; i < 12; i++) {
      this.Meses[i].NH=0
      for (let k = 0; k < this.areaList.length; k++) {
        this.Meses[i].NH=this.Meses[i].NH+this.mesesHHT1[i][k].Total3NH
      }

      this.Meses[i].HHT=0
      for (let k = 0; k < this.areaList.length; k++) {
        this.Meses[i].HHT=this.Meses[i].HHT+this.mesesHHT1[i][k].Total3HHT
      }
      
    }

    this.TotalAnioNH=0;
    for (let k = 0; k < 12; k++) {
      this.TotalAnioNH=this.TotalAnioNH+this.Meses[k].NH
    }

    this.TotalAnioHHT=0;
    for (let k = 0; k < 12; k++) {
      this.TotalAnioHHT=this.TotalAnioHHT+this.Meses[k].HHT
    }
  }
  sumaTotalArea(i,j,H){
    if(H=='NH'){
      let NH1=(this.mesesHHT1[i][j]['Girardota'].NH==null)?0:parseFloat(this.mesesHHT1[i][j]['Girardota'].NH);
      let NH2=(this.mesesHHT1[i][j]['Funza'].NH==null)?0:parseFloat(this.mesesHHT1[i][j]['Funza'].NH);
      let NH3=(this.mesesHHT1[i][j]['Madrid'].NH==null)?0:parseFloat(this.mesesHHT1[i][j]['Madrid'].NH);

      this.mesesHHT1[i][j].Total3NH=NH1+NH2+NH3

      this.Meses[i].NH=0
      for (let k = 0; k < this.areaList.length; k++) {
        this.Meses[i].NH=this.Meses[i].NH+this.mesesHHT1[i][k].Total3NH
      }

      this.TotalAnioNH=0;
      for (let k = 0; k < 12; k++) {
        this.TotalAnioNH=this.TotalAnioNH+this.Meses[k].NH
      }
      
    }else{
      let HHT1=(this.mesesHHT1[i][j]['Girardota'].HHT==null)?0:parseFloat(this.mesesHHT1[i][j]['Girardota'].HHT);
      let HHT2=(this.mesesHHT1[i][j]['Funza'].HHT==null)?0:parseFloat(this.mesesHHT1[i][j]['Funza'].HHT);
      let HHT3=(this.mesesHHT1[i][j]['Madrid'].HHT==null)?0:parseFloat(this.mesesHHT1[i][j]['Madrid'].HHT);

      this.mesesHHT1[i][j].Total3HHT=HHT1+HHT2+HHT3

      this.Meses[i].HHT=0
      for (let k = 0; k < this.areaList.length; k++) {
        this.Meses[i].HHT=this.Meses[i].HHT+this.mesesHHT1[i][k].Total3HHT
      }

      this.TotalAnioHHT=0;
      for (let k = 0; k < 12; k++) {
        this.TotalAnioHHT=this.TotalAnioHHT+this.Meses[k].HHT
      }
    }
  }


  CreateMesesHHT1(){
    let area2
    this.mesesHHT1=[]
    for (let index = 0; index < 12; index++) {
      area2=[]
      this.areaList.forEach((resp)=>{
        area2.push({
          Total3NH:null,
          Total3HHT:null,
          Girardota:({
            HHT:null,
            NH:null
          }),
          Funza:({
            HHT: null,
            NH: null
          }),
          Madrid:({
            HHT:null,
            NH: null
          })
        })
      });
      this.mesesHHT1.push(area2)
    }
  }

  async areasNivel0(){
      let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["id", "nombre","nivel"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
      await this.areaService.findByFilter(areafiltQuery).then(
        resp => (this.areaList=<Area[]>resp['data'])
    );
  }

  async cargarHHT(){
    await this.hhtService.findAll().then((resp)=>{
      this.idHHT=resp['data'].length+1;
      });

  }
  async guardarHht(){

      let cont=0;
      this.meses.forEach(async element => {
        cont=cont+1
        let ad = new Hht();
        ad.anio=this.anioSelect;
        ad.id=this.idHHT.toString();
        this.idHHT=this.idHHT+1;
        ad.mes=element.label;
        ad.valor=JSON.stringify(this.mesesHHT1[cont-1]);
        ad.empresaSelect=this.empresaSelect;
        await this.hhtService.create(ad);
        
      });
    
  }

}
