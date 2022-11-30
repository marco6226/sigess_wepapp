import { Component, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { FilterQuery } from "../../../core/entities/filter-query";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";
import {DesviacionService } from "app/modulos/sec/services/desviacion.service";
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { SesionService } from '../../../core/services/sesion.service';
import { DatePipe } from '@angular/common';
import {ReporteAtService } from "app/modulos/ind/services/reporte-at.service";
import { ReporteATView } from 'app/modulos/ind/entities/ReporteATView'
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { SortOrder } from "app/modulos/core/entities/filter";
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
@Component({
  selector: 'app-home-corona',
  templateUrl: './home-corona.component.html',
  styleUrls: ['./home-corona.component.scss']
})
export class HomeCoronaComponent implements OnInit {
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
  

  constructor(
    private sesionService: SesionService,
    public repService: ReporteService,
    public analisisDesviacionService: AnalisisDesviacionService,
    public desviacionService: DesviacionService,
    public reporteAtService: ReporteAtService,
    private areaService: AreaService,
    private paramNav: ParametroNavegacionService,
  ) { }

  async ngOnInit() {

    this.hastas= new Date(Date.now())
    this.desdes=null
    // this.areasPermiso = await this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
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
      await this.areaService.findByFilter(areafiltQuery).then(
        resp => {this.areaList=<Area[]>resp['data']
        this.areaList.forEach(element => {
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
        });}
    );
    // this.divisionS=this.divisiones[0].value;
    // console.log(this.divisionS)
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
        console.log(result)
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
  Indicadores(){
    console.log('accidentalidad')
    this.paramNav.redirect('app/ind/accidentalidad');
  }
}
