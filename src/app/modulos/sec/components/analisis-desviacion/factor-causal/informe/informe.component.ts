import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {
  locale_es,
  tipo_identificacion,
  tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { listFactores, ValorCausas } from '../../../../entities/factor-causal';
// import { listFactores } from './../../../entities/factor-causal';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css','./informe.component.scss']
})
export class InformeComponent implements OnInit {
@Input() desviacionesList;
@Input() consultar;
@Input() observacion;
@Input() miembros;
@Input() selectedProducts;
// @Input() diagramaFlujo;
@Input() infoIn;
@Input() factores: listFactores[];
@Input() planAccionList;
@Input() contFotografia;
@Input() contDocumental;
@Input() contPoliticas;
@Input() contProcedimientos;
@Input() contMultimedias;

prueba:ValorCausas[]=[]
localeES: any = locale_es;

// contFotografia:number=0;
// contDocumental:number=0;
// contPoliticas:number=0;
// contProcedimientos:number=0;
// contMultimedias:number=0;


canvas = document.createElement('canvas');

  constructor() {   
   }

  ngOnInit() {
    this.numerarCausal()
    this.evidencias()
  }

  numerarCausal(){
    this.prueba=[]
    let variab:number=0;
    this.planAccionList.forEach(element => {
      element.causaRaiz.forEach(element2 =>{
        variab++;
        let variab2:ValorCausas={
          id:variab,
          NcausaRaiz:element.nombreFC,
          causaRaiz:element2.causaRaiz,
          accionCorrectiva:element2.especifico.accionCorrectiva,
          fechaVencimiento:element2.especifico.fechaVencimiento,
          responsableEmpresa : element2.especifico.responsableEmpresa == null ? null : element2.especifico.responsableEmpresa.primerNombre+" "+element2.especifico.responsableEmpresa.primerApellido,
          responsableExterno:element2.especifico.responsableExterno,
        }
        this.prueba.push(variab2)
      })
    });
    }

  evidencias(){
    // for(let i=0; i< this.Evidencias.length; i++){
    //   let value=this.Evidencias[i].proceso;
    //   switch (value) {
    //     case 'fotografica':
    //       this.contFotografia++;
    //       break;
    //     case 'documental':
    //       this.contDocumental++;
    //       break;
    //     case 'politicas':
    //       this.contPoliticas++;
    //       break;
    //     case 'procedimientos':
    //       this.contProcedimientos++;
    //       break;
    //     case 'multimedias':
    //       this.contMultimedias++;
    //       break;
    //     default:
    //       break;
    //   }
    // }
  }
  test(){
    // console.log(this.Evidencias)
  }
}
