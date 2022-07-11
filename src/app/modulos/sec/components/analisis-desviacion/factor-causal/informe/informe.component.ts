import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {
  locale_es,
  tipo_identificacion,
  tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { listFactores } from '../../../../entities/factor-causal';
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

pieDePag: FormGroup;
localeES: any = locale_es;
img = new Image();

canvas = document.createElement('canvas');

  constructor() {   
   }

  ngOnInit() {
  }
  test(){
    // console.log('base64',this.diagramaFlujo)
    // console.log('normal',btoa(this.diagramaFlujo))
    // console.log(this.pieDePag)
    // console.log(this.infoIn)
    // console.log(this.factores)
    // this.img.onload = this.cutImageUp;
    this.img.src=this.diagramaFlujo;
    console.log(this.img);
  
    var c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
    var ctx = c.getContext("2d");
    var img = document.getElementById("scream") as HTMLCanvasElement | null;
    ctx.drawImage(img, 10, 10, 700, 700);

  }
  test2(){
    this.img.src;
    console.log(this.img.x,this.img.y)
    // console.log(this.img.height,this.img.width)
  }
}
