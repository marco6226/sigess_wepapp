import { Component, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { FilterQuery } from "../../../core/entities/filter-query";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";

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
  diasPerdidos;
  fieldsR: string[] = [
    'id'
  ];
  fieldsAD: string[] = [
    'incapacidades'
  ];
  

  constructor(
    public repService: ReporteService,
    public analisisDesviacionService: AnalisisDesviacionService,
  ) { }

  async ngOnInit() {
    await this.reporte()
    await this.analisisDesviacion()
  }
  async reporte(){
    let fq1 = new FilterQuery();
    fq1.fieldList = this.fieldsR;
    await this.repService.findByFilter(fq1).then((resp)=>{
      console.log(resp)
      this.NoEventos=resp['data'].length;
    })
  }

  async analisisDesviacion(){
    this.analisisDesviacionService.findAll().then((resp)=>{
      console.log(resp)
    })
    let fq2 = new FilterQuery();
    fq2.fieldList = this.fieldsAD;
    this.diasPerdidos=[];
    await this.analisisDesviacionService.findByFilter(fq2).then((resp)=>{
      console.log(resp)
      // 
      resp['data'].forEach(element => {
        // console.log(element)
        this.diasPerdidos.push(JSON.parse(resp["incapacidades"]));
      });
      
      // this.NoEventos=resp['data'].length;
    })
    console.log(this.diasPerdidos)
  }

}
