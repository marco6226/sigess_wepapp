import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Calificacion } from 'app/modulos/inspecciones/entities/calificacion'
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion'
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo';
import { TipoHallazgo } from '../../../entities/tipo-hallazgo';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 's-elemento-inspeccion-node',
  templateUrl: './elemento-inspeccion-node.component.html',
  styleUrls: ['./elemento-inspeccion-node.component.scss']
})
export class ElementoInspeccionNodeComponent implements OnInit {
  files: TreeNode[]; 

  @Output() onElementoClick = new EventEmitter<any>();
  @Input("value") value: ElementoInspeccion[];
  @Input("opciones") opciones: OpcionCalificacion[];
  @Input() editable: boolean;
  @Input("disabled") disabled: boolean;
  @Input("nivelRiesgoList") nivelRiesgoList: any;
  @Input("diligenciable") diligenciable: boolean;
  @Input("tiposHallazgo") tiposHallazgo:TipoHallazgo[];
  contadorElem: number = 0;

  constructor() {
    this.files = this.json.data;
   }

  // Interface implements

   
  ngOnInit() {
    if (this.value != null) {
      this.inicializarCalificacion(this.value);
    }
  }
  elementos:TreeNode = {
    data: [
           {
            data: {
              codigo: "1",
              nombre : "alv",
              descripcion:"leonardo"
                  },children :[{ 
                   data:  {codigo: "1.1",
                    nombre : "alv",
                    descripcion:"leonardo"
                  }
                  
                  }
                ]
           }
      ]
  }
    
   json:TreeNode = {
    data:
    [
        {
            data:{
              codigo: "1",
              nombre : "alv",
              descripcion:"leonardo",
              
            },
            children:[
                {
                    data:{
                        name:"Work",
                        size:"55kb",
                        type:"Folder"
                    },
                    children:[
                        {
                            data:{
                                name:"Expenses.doc",
                                size:"30kb",
                                type:"Document"
                            }
                        },
                        {
                            data:{
                                name:"Resume.doc",
                                size:"25kb",
                                type:"Resume"
                            }
                        }
                    ]
                },
                {
                    data:{
                        name:"Home",
                        size:"20kb",
                        type:"Folder"
                    },
                    children:[
                        {
                            data:{
                                name:"Invoices",
                                size:"20kb",
                                type:"Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            data:{
                name:"Pictures",
                size:"150kb",
                type:"Folder"
            },
            children:[
                {
                    data:{
                        name:"barcelona.jpg",
                        size:"90kb",
                        type:"Picture"
                    }
                },
                {
                    data:{
                        name:"primeui.png",
                        size:"30kb",
                        type:"Picture"
                    }
                },
                {
                    data:{
                        name:"optimus.jpg",
                        size:"30kb",
                        type:"Picture"
                    }
                }
            ]
        }
    ]
}

      
  inicializarCalificacion(elemList: ElementoInspeccion[]) {

    elemList.forEach(element => {
      if (element.calificacion == null) {
        element.calificacion = new Calificacion();
        element.calificacion.opcionCalificacion = new OpcionCalificacion();
        element.calificacion.tipoHallazgo = new TipoHallazgo();
        element.calificacion.nivelRiesgo = new NivelRiesgo();
      } else if (element.calificacion.nivelRiesgo == null) {
        element.calificacion.nivelRiesgo = new NivelRiesgo();
      }
    });
  }

  // Component methods

  addElemento(elemPadre: ElementoInspeccion) {
    console.log(elemPadre);
    if (elemPadre.elementoInspeccionList == null) {
      elemPadre.elementoInspeccionList = [];
    }

    let code:Number = (parseFloat(elemPadre.codigo) + (elemPadre.elementoInspeccionList.length/10) + 0.1);
    console.log(code.toString().length);
    if(code.toString().length >= 4)  {
     // code = code.toFixed(2);

      }  
    
    let elemento = new ElementoInspeccion();
    elemento.numero = ++this.contadorElem;
    elemento.codigo =  code.toString();
    console.log(elemPadre);
    elemPadre.elementoInspeccionList.push(elemento);
  }

  removeElemento(elementoList: ElementoInspeccion[], elemento: ElementoInspeccion) {
  
    for (let i = 0; i < elementoList.length; i++) {
      if (elementoList[i].codigo == elemento.codigo) {
        elementoList.splice(i, 1);
        break;
      }
    }
  }

  emitirEventoSelecElemento(elem: ElementoInspeccion) {
    this.onElementoClick.emit(elem);
  }
}
