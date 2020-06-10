import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Calificacion } from 'app/modulos/inspecciones/entities/calificacion'
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion'
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo';
import { TipoHallazgo } from '../../../entities/tipo-hallazgo';

@Component({
  selector: 's-elemento-inspeccion-node',
  templateUrl: './elemento-inspeccion-node.component.html',
  styleUrls: ['./elemento-inspeccion-node.component.scss']
})
export class ElementoInspeccionNodeComponent implements OnInit {

  @Output() onElementoClick = new EventEmitter<any>();
  @Input("value") value: ElementoInspeccion[];
  @Input("opciones") opciones: OpcionCalificacion[];
  @Input() editable: boolean;
  @Input("disabled") disabled: boolean;
  @Input("nivelRiesgoList") nivelRiesgoList: any;
  @Input("diligenciable") diligenciable: boolean;
  @Input("tiposHallazgo") tiposHallazgo:TipoHallazgo[];
  contadorElem: number = 0;

  constructor() { }

  // Interface implements

  ngOnInit() {
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
    elemPadre.elementoInspeccionList.push(elemento);
  }

  removeElemento(elementoList: ElementoInspeccion[], elemento: ElementoInspeccion) {
    for (let i = 0; i < elementoList.length; i++) {
      if (elementoList[i].numero == elemento.numero) {
        elementoList.splice(i, 1);
        break;
      }
    }
  }

  emitirEventoSelecElemento(elem: ElementoInspeccion) {
    this.onElementoClick.emit(elem);
  }
}
