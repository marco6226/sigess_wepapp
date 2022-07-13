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
@Input() diagramaFlujo;
@Input() infoIn;
@Input() factores: listFactores[];
@Input() planAccionList;

cont: number=0;
id:number[]=[]
prueba:ValorCausas[]=[]
numero:number=0
i1:number=0;
j1:number=0;
// cont2: number=0;
flag: boolean=false;
pieDePag: FormGroup;
localeES: any = locale_es;
img = new Image();

canvas = document.createElement('canvas');

  constructor() {   
   }

  ngOnInit() {
    this.numerarCausal()
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
         
          // responsableEmpresa:element2.especifico.responsableEmpresa.primerNombre+" "+element2.especifico.responsableEmpresa.primerApellido,
          responsableExterno:element2.especifico.responsableExterno,
        }
        // variab2.id=1;
        // variab2.NcausaRaiz=element.nombreFC;
        // variab2.causaRaiz=element2.causaRaiz;
        // variab2.accionCorrectiva=element2.especifico.accionCorrectiva;
        // variab2.fechaVencimiento=element2.especifico.fechaVencimiento;
        // variab2.responsableEmpresa=element2.especifico.responsableEmpresa.primerNombre+" "+element2.especifico.responsableEmpresa.primerApellido;
        // variab2.responsableExterno=element2.especifico.responsableExterno;

        this.prueba.push(variab2)
        // console.log(this.prueba)
      })
    });
    }


    // for(let i=0;i<3;i++){


    // }
  
  test(){
    this.img.src;
    console.log(this.img.x,this.img.y)
    // console.log(this.img.height,this.img.width)
  }
}
