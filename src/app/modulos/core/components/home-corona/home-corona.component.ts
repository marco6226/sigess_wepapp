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

  desdes: Date;
  hastas: Date;

  pipe = new DatePipe('en-US');
  todayWithPipe = null;

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
  ) { }

  async ngOnInit() {
    let fq1 = new FilterQuery();
    fq1.fieldList = this.fieldR;
    await this.reporteAtService.findAllRAT().then((resp)=>{
      console.log(resp)
    });
    // await this.reporteAtService.findByFilter(fq1).then((resp)=>{
    //   console.log(resp)
    // });
    this.hastas= new Date(Date.now())
    this.desdes=null
    this.areasPermiso = await this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    await this.reporte()
    await this.desviacion()
  }
  async reporte(){
    // await this.repService.findAll().then((resp)=>{
    //   console.log(resp)//fechaAccidente
    // })

    let filterList: Filter[] = [];
    filterList.push({ criteria: Criteria.BETWEEN, field: "fechaAccidente", value1: this.pipe.transform(this.desdes, 'yyyy-MM-dd'),value2:this.pipe.transform(this.hastas, 'yyyy-MM-dd')});
    
    let fq1 = new FilterQuery();
    fq1.fieldList = this.fieldsR;
    fq1.filterList=filterList;

    await this.repService.findByFilter(fq1).then((resp)=>{
      this.NoEventos=resp['data'].length;
    })
  }

  async analisisDesviacion(event :any){
    let filterList: Filter[] = [];
    filterList.push({ criteria: Criteria.CONTAINS, field: "id", value1: event });
    filterList.push({ criteria: Criteria.BETWEEN, field: "fechaElaboracion", value1: this.pipe.transform(this.desdes, 'yyyy-MM-dd'),value2:this.pipe.transform(this.hastas, 'yyyy-MM-dd')});
  
    let fq2 = new FilterQuery();
    fq2.fieldList=this.fieldsAD;  
    fq2.filterList = filterList;
    setTimeout(async () => {
     await this.analisisDesviacionService.findByFilter(fq2).then((resp)=>{
      console.log(resp)
      
        if(resp['data'][0]['incapacidades'])
        {
          if(JSON.parse(resp['data'][0]['incapacidades'])!=null){
            this.diasPerdidos=this.diasPerdidos+JSON.parse(resp['data'][0]['incapacidades']).length
          }
        }
      
    })
  }, 100);
  }

  async desviacion(){

    let filterQuery = new FilterQuery();
    filterQuery.fieldList=this.fieldsD;
    filterQuery.filterList=[{ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso }];
    

    await this.desviacionService.findByFilter(filterQuery).then(
      resp => {
        this.diasPerdidos=0;
        resp['data'].forEach(async element => {
            if(element['analisisId']){
              await this.analisisDesviacion(element['analisisId'])
            }
          }
        )       
      }
    )
  }

  async selecFromDate(date: Date) {
    this.desdes=new Date(date)
    // await this.desviacion()
    await this.reporte()

  //   let filterList: Filter[] = [];
  //   // filterList.push({ criteria: Criteria.CONTAINS, field: "id", value1: event });
  //   filterList.push({ criteria: Criteria.BETWEEN, field: "fechaElaboracion", value1: this.pipe.transform(this.desdes, 'yyyy-MM-dd'),value2:this.pipe.transform(this.hastas, 'yyyy-MM-dd')});
  
  //   let fq2 = new FilterQuery();
  //   fq2.fieldList=this.fieldsAD;  
  //   fq2.filterList=filterList;
  //   await this.analisisDesviacionService.findByFilter(fq2).then((resp)=>{
  //     console.log(resp)
  // })
    
}

  async selectToDate(date: Date) {
    this.hastas=new Date(date)
    // await this.desviacion()
    await this.reporte()
 
    
  //   let filterList: Filter[] = [];
  //   // filterList.push({ criteria: Criteria.CONTAINS, field: "id", value1: event });
  //   filterList.push({ criteria: Criteria.BETWEEN, field: "fechaElaboracion", value1: this.pipe.transform(this.desdes, 'yyyy-MM-dd'),value2:this.pipe.transform(this.hastas, 'yyyy-MM-dd')});
  
  //   let fq2 = new FilterQuery();
  //   fq2.fieldList=this.fieldsAD;  
  //   fq2.filterList=filterList;
  //   await this.analisisDesviacionService.findByFilter(fq2).then((resp)=>{
  //     console.log(resp)
  // })
  }
}
