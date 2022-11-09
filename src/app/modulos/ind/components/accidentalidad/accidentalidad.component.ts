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
import { single } from './data';

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
  single: any[];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
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
    ) {  Object.assign(this, { single });}
    onSelect(data): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
  
    onActivate(data): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
  
    onDeactivate(data): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
  ngOnInit() {
    this.getData()
      .then( () => {
        console.log('areaList: ' + this.areaList);
      });
    
  }
  reporteTabla
  reporteTabla2
  async getData(){
    this.hastas= new Date(Date.now())
    this.desdes=null
    await this.reportes()

    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    this.divisiones.push({label:'Total',value:'Total'})
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      resp => {
        this.areaList = <Area[]>resp['data'];
        this.areaList.forEach(element => {
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
        });
      }
    );
      
      this.reporteTabla=[]
      this.reporteTabla2=[]
      await this.reporteAtService.findAllRAT()
      .then(res => {
        this.reporteTabla=res
        
        this.areaList.forEach(element => {
          
          let cont=0
          let diasPerdidos=0

          this.reporteTabla.forEach(element2 =>{
            if(element['nombre']==element2['padreNombre']){
              cont+=1;
              if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
                diasPerdidos+=JSON.parse(element2['incapacidades']).length
              }
            }
          })
          this.reporteTabla2.push({nombre:element['nombre'],eventos:cont,dias_Perdidos:diasPerdidos})
        });
      });
      this.data = this.reporteTabla2;
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

  async division(event){
    this.divisionS=event.value
    await this.reportes()
  }
}
