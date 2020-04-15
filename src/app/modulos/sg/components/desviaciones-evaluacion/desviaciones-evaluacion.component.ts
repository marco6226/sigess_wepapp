import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EvaluacionService } from 'app/modulos/sg/services/evaluacion.service';
import { Respuesta } from 'app/modulos/sg/entities/respuesta'
import { RespuestaService } from 'app/modulos/sg/services/respuesta.service'

@Component({
  selector: 's-desv-eval',
  templateUrl: './desviaciones-evaluacion.component.html',
  styleUrls: ['./desviaciones-evaluacion.component.scss']
})
export class DesviacionesEvaluacionComponent implements OnInit {

  desviacionesList: any;

  @Input("evaluacionId") evaluacionId: string;
  @Input("readOnly") readOnly: boolean;
  @Output("onUpdate") onUpdate = new EventEmitter<Respuesta>();

  constructor(
    private evaluacionService: EvaluacionService,
    private respuestaService: RespuestaService
  ) { }

  ngOnInit() {
    this.evaluacionService.findDesviaciones(this.evaluacionId).then(
      data => this.desviacionesList = <any>data
    );
  }

  modificarRespuesta(desvSGE: any) {
    let respuesta = new Respuesta();
    respuesta.id = desvSGE.respuestaId;
    respuesta.actividad = desvSGE.actividad;
    respuesta.responsable = desvSGE.responsable;
    respuesta.recursos = desvSGE.recursos;
    respuesta.meta = desvSGE.meta;
    this.respuestaService.update(respuesta).then(
      data => this.onUpdate.emit(<Respuesta>data)
    );
  }

}
