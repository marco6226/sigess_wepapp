import { Component, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { FilterQuery } from "../../../core/entities/filter-query";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";
import {DesviacionService } from "app/modulos/sec/services/desviacion.service";
import { Criteria } from '../../../core/entities/filter';
import { SesionService } from '../../../core/services/sesion.service';

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
  fieldsR: string[] = [
    'id'
  ];
  fieldsAD: string[] = [
    'incapacidades'
  ];
  fieldsD: string[] = [
    'analisisId'
  ];
  

  constructor(
    private sesionService: SesionService,
    public repService: ReporteService,
    public analisisDesviacionService: AnalisisDesviacionService,
    public desviacionService: DesviacionService,
  ) { }

  async ngOnInit() {
    this.areasPermiso = await this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    await this.reporte()
    await this.desviacion()
  }
  async reporte(){
    let fq1 = new FilterQuery();
    fq1.fieldList = this.fieldsR;
    await this.repService.findByFilter(fq1).then((resp)=>{
      this.NoEventos=resp['data'].length;
    })
  }

  async analisisDesviacion(event :any){
    let fq2 = new FilterQuery();
    fq2.fieldList=this.fieldsAD;  
    fq2.filterList=[{ criteria: Criteria.CONTAINS, field: "id", value1: event }];
    await this.analisisDesviacionService.findByFilter(fq2).then((resp)=>{
      if(resp['data'][0]['incapacidades'])
      {
        if(JSON.parse(resp['data'][0]['incapacidades'])!=null){
          this.diasPerdidos=this.diasPerdidos+JSON.parse(resp['data'][0]['incapacidades']).length
        }
      }
    })
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
}
