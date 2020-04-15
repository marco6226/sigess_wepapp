import { Component, OnInit, Input, ContentChild, ViewChild, Output, EventEmitter } from '@angular/core';
import { Elemento } from 'app/modulos/sg/entities/elemento'
import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'
import { OpcionRespuesta } from 'app/modulos/sg/entities/opcion-respuesta'
import { Respuesta } from 'app/modulos/sg/entities/respuesta'
import { SgeNodoComponent } from './../sge-nodo/sge-nodo.component'
import { RespuestaService } from 'app/modulos/sg/services/respuesta.service'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service'
import { MensajeUsuario } from 'app/modulos/comun/entities/mensaje-usuario'

@Component({
  selector: 's-sgecompositor',
  templateUrl: './sge-compositor.component.html',
  styleUrls: ['./sge-compositor.component.scss']
})
export class SgeCompositorComponent implements OnInit {

  OPC_RESP_KEY = 'OPC_RESP_KEY';
  @Output("onElementDocumentSelect") onElementDocumentSelect = new EventEmitter<Elemento>();
  @Output() onRadioSelectEvent = new EventEmitter<any>();
  @ViewChild('sgeNodo', { static: false }) sgeNodo: SgeNodoComponent;
  @Input() elementoList: Elemento[] = [];
  @Input() editable: boolean;
  @Input() persistible: boolean = false;
  @Input() evaluacion: Evaluacion;
  estadoEvaluacion: any = new Object();

  visibleDlgOpResp: boolean = false;
  opcionRespuestaList: OpcionRespuesta[];
  selectedOpResp: OpcionRespuesta[] = [];
  respuestasList: Respuesta[];

  constructor(
    private respuestaService: RespuestaService,
    private mensajeUsuarioService: MensajeUsuarioService
  ) { }

  ngOnInit() {
    //this.opcionRespuestaList = <OpcionRespuesta[]>JSON.parse(localStorage.getItem(this.OPC_RESP_KEY));
    if (this.opcionRespuestaList == null) {
      this.opcionRespuestaList = [];
    }
    if (this.evaluacion != null) {
      this.cargarRespuestas(this.evaluacion.id);
      this.estadoEvaluacion.numeroPreguntas = this.evaluacion.numeroPreguntas;
      this.estadoEvaluacion.numeroRespuestas = this.evaluacion.numeroRespuestas;
    }
  }

  cargarRespuestas(evaluacionId: string) {
    this.respuestaService.findAllByEvaluacion(evaluacionId).then(
      data => this.respuestasList = <Respuesta[]>data
    );
  }

  addOpResp() {
    let or = new OpcionRespuesta();
    or.nombre = "Opcion " + (this.opcionRespuestaList.length + 1);
    or.valor = this.opcionRespuestaList.length + 1;
    or.despreciable = false;
    this.opcionRespuestaList.push(or);
    this.opcionRespuestaList = this.opcionRespuestaList.slice();
  }
  saveOpResp() {
    //localStorage.setItem(this.OPC_RESP_KEY, JSON.stringify(this.opcionRespuestaList));
  }

  removeOpResp() {
    //localStorage.removeItem(this.OPC_RESP_KEY);
  }

  addElementoMain() {
    if (this.elementoList == null) {
      this.elementoList = [];
    }
    let gp = new Elemento();
    gp.codigo = "" + (this.elementoList.length + 1);
    this.elementoList.push(gp);
  }

  buscarPregunta() {
    this.comprobarPreguntas(this.sgeNodo.elementoList);
  }

  comprobarPreguntas(elementoList: Elemento[]) {
    for (let i = 0; i < elementoList.length; i++) {
      let element = elementoList[i];
      let radioGroupName = element.codigo + element.nombre;
      let radioGroup = document.getElementsByName(radioGroupName);
      if (radioGroup == null || radioGroup.length == 0) {
        if (this.comprobarPreguntas(element.elementoList)) {
          return true;
        }
      } else {
        let valido = this.validarRadioGroup(<NodeListOf<HTMLElement>>radioGroup);
        if (!valido) {
          this.navegarAPregunta('tr_' + element.id);
          return true;
        }
      }
    }
    return false;
  }

  validarRadioGroup(radioGroup: NodeListOf<HTMLElement>) {
    let isValid = false;
    for (let j = 0; j < radioGroup.length; j++) {
      if ((<HTMLInputElement>radioGroup[j]).checked) {
        return true;
      }
    }
    return false;
  }

  navegarAPregunta(idTR: string) {
    let tableRow = <HTMLTableRowElement>document.getElementById(idTR);
    window.scrollTo(0, this.findPos(tableRow) - (window.innerHeight / 2) + 50);
  }

  findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return curtop;
    }
  }

  irSiguientePregunta() {

  }

  onRadioSelect(ee: any) {
    this.estadoEvaluacion = ee;
    this.onRadioSelectEvent.emit(ee);
    if (ee.numeroRespuestas >= ee.numeroPreguntas) {
      this.mensajeUsuarioService.showMessage({
        mensaje: 'Evaluación finalizada',
        detalle: 'Ha finalizado con la totalidad de las preguntas de la evaluación. Ahora puede generar el reporte',
        tipoMensaje: 'success'
      });
    }
  }

  abrirDlgDocumento(elemento: Elemento) {
    this.onElementDocumentSelect.emit(elemento);
  }
}
