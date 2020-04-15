import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewChildren, QueryList, EventEmitter, Output } from '@angular/core';
import { Elemento } from 'app/modulos/sg/entities/elemento'
import { OpcionRespuesta } from 'app/modulos/sg/entities/opcion-respuesta'
import { CustomRadioButtonComponent } from 'app/modulos/comun/components/custom-radio-button/custom-radio-button.component';
import { Respuesta } from 'app/modulos/sg/entities/respuesta'
import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'
import { RespuestaService } from 'app/modulos/sg/services/respuesta.service'
import { Util } from 'app/modulos/comun/util'

@Component({
  selector: 'sigess-sgenodo',
  templateUrl: './sge-nodo.component.html',
  styleUrls: ['./sge-nodo.component.scss']
})
export class SgeNodoComponent implements OnInit, AfterViewInit {

  @Output() onElementDocumentSelect = new EventEmitter<Elemento>();
  @Output() onRadioSelectEvent = new EventEmitter<any>();
  @ViewChildren('radiobutton') radiobuttonList: QueryList<CustomRadioButtonComponent>;
  @ViewChild('childNode', { static: false }) childNode: SgeNodoComponent;
  @Input() elementoList: Elemento[] = [];
  @Input() opcionRespuestaList: OpcionRespuesta[] = [];
  @Input() editable: boolean;
  @Input() persistible: boolean = false;
  @Input() evaluacionId: string;
  @Input() respuestasList: Respuesta[];
  @Input() nivel: number;
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


  constructor(
    private respuestaService: RespuestaService,
  ) { }

  ngOnInit() {
    // if (this.nodeOpts == null || this.nivel == null) {
    //   this.nivel = 0;
    //   this.nodeOpts = {};
    //   this.nodeOpts[this.nivel] = { color: 'transparent' };
    //   this.nodeOpts[this.nivel++] = { color: Util.randomColor() };
    // }
    // if (this.nodeOpts[this.nivel] == null) {
    //   this.nodeOpts[this.nivel] = { color: Util.randomColor() };
    // }
    if(this.nivel == null){
      this.nivel = 0;
    }
    this.nivel += 1;
  }

  ngAfterViewInit() {
    setTimeout(_ => this.loadRespuestas());
  }

  loadRespuestas() {
    if (this.respuestasList != null && this.respuestasList.length > 0 && this.elementoList != null) {


      this.radiobuttonList.forEach(radioButton => {
        let i = 0;
        this.respuestasList.forEach(resp => {
          let elementoOprId = radioButton.id.split("_");
          let elementoId = elementoOprId[0];
          let oprId = elementoOprId[1];
          if (oprId == (resp.opcionRespuesta.id)) {
            radioButton.check();
            this.marcarIconoContestada(elementoId);
            this.respuestasList.splice(i, 1);
          }
          i++;
        });
      });


    }
  }

  addElemento(elemPadre: Elemento) {
    if (elemPadre.elementoList == null) {
      elemPadre.elementoList = [];
    }
    let elemento = new Elemento();
    elemento.codigo = elemPadre.codigo + "." + (elemPadre.elementoList.length + 1);
    elemPadre.elementoList.push(elemento);
  }

  addOpcionResp(elemento: Elemento) {
    elemento.opcionRespuestaList = this.opcionRespuestaList.slice(0);
  }

  removeElemento(elementoList: Elemento[], elemento: Elemento) {
    for (let i = 0; i < elementoList.length; i++) {
      if (elementoList[i].codigo == elemento.codigo) {
        elementoList.splice(i, 1);
        break;
      }
    }
  }

  onRadioSelect(elemento: Elemento, opcionRespuesta: OpcionRespuesta) {
    if (this.evaluacionId != null) {
      this.clearOldSelection(elemento, opcionRespuesta);
      let respuesta = new Respuesta();
      respuesta.evaluacion = new Evaluacion();
      respuesta.evaluacion.id = this.evaluacionId;
      respuesta.opcionRespuesta = opcionRespuesta;
      respuesta.opcionRespuesta.elemento = new Elemento();
      respuesta.opcionRespuesta.elemento.id = elemento.id;
      this.respuestaService.create(respuesta).then(
        data => this.manageResponse(<any>data)
      );
      this.marcarIconoContestada(elemento.id);
    }
  }

  marcarIconoContestada(elementoId: string) {
    let icono = document.getElementById("valid-icon_" + elementoId);
    icono.className = "fa fa-check-circle diligenciado";
  }

  /*
  marcarIconoNOContestada(elementoId: string) {
    let icono = document.getElementById("valid-icon_" + elementoId);
    icono.className = "fa fa-check-circle no-diligenciado";
  }
*/

  clearOldSelection(elemento: Elemento, opcionRespuesta: OpcionRespuesta) {
    for (let i = 0; i < elemento.opcionRespuestaList.length; i++) {
      elemento.opcionRespuestaList[i].classUI = '';
    }
  }
  manageResponse(ee: any) {
    this.onRadioSelectEvent.emit(ee);
  }

  /* Métodos para manejo de documentos */

  abrirDlgDocumento(elemento: Elemento) {
    this.onElementDocumentSelect.emit(elemento);
  }

  abrirDlgParametros(elemento: Elemento) {

  }
}
