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
  nivel;
  contadorElem: number = 0;
  @Input() nodeOpts: any = {
    0: { color: 'transparent', contraste: '' },
    1: { color: '#00BFFF', contraste: '' },
    2: { color: '#7B68EE', contraste: '' },
    3: { color: '#20B2AA', contraste: '' },
    4: { color: '#9370DB', contraste: '' },
    5: { color: '#87CEEB', contraste: '' },
    6: { color: '#265C5C', contraste: '' },
    7: { color: '#4169E1', contraste: '' },
    8: { color: '#7B68EE', contraste: '' },
  };
  constructor() {
   }

  // Interface implements

   
  ngOnInit() {
    if(this.nivel == null){
      this.nivel = 0;
    }
    this.nivel += 1;
    if (this.value != null) {
      this.inicializarCalificacion(this.value);
    }
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
  width(size){
    let width = 100-(size*5)
    return `${width}%`;
  }
  addElemento(elemPadre: ElementoInspeccion) {
    if (elemPadre.elementoInspeccionList == null) {
      elemPadre.elementoInspeccionList = [];
    }
    
    let elemento = new ElementoInspeccion();
    elemento.numero = ++this.contadorElem;
    elemento.codigo = elemPadre.codigo + "." + (elemPadre.elementoInspeccionList.length + 1);
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
