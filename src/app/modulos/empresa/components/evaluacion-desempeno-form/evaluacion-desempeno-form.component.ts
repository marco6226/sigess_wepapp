import { Component, OnInit } from '@angular/core';
import { Empleado } from '../../entities/empleado';
import { CargoService } from '../../services/cargo.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria } from '../../../core/entities/filter';
import { Cargo } from '../../entities/cargo';
import { TreeNode, Message } from 'primeng/api';
import { Competencia } from '../../entities/competencia';
import { EvaluacionDesempeno } from '../../entities/evaluacion-desempeno';
import { CalificacionDesempeno } from '../../entities/calificacion-desempeno';
import { EvaluacionDesempenoService } from '../../services/evaluacion-desempeno.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';

@Component({
  selector: 'app-evaluacion-desempeno-form',
  templateUrl: './evaluacion-desempeno-form.component.html',
  styleUrls: ['./evaluacion-desempeno-form.component.scss'],
  providers: [EvaluacionDesempenoService]
})
export class EvaluacionDesempenoFormComponent implements OnInit {

  cargo: Cargo;
  empleadoSelect: Empleado;
  calificacionDesempenoList: CalificacionDesempeno[];
  comentario: string;
  msgs: Message[];
  accion: string;
  evalId: string;

  constructor(
    private paramNavService: ParametroNavegacionService,
    private evalDesempService: EvaluacionDesempenoService,
    private cargoService: CargoService,
  ) { }

  ngOnInit() {
    this.accion = this.paramNavService.getAccion();
    if (this.accion == null || this.accion == 'POST') {
      this.accion = 'POST';
    } else {
      let evl = <EvaluacionDesempeno>this.paramNavService.getParametro();
      let fq = new FilterQuery();
      fq.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: evl.id }];
      this.evalDesempService.findByFilter(fq).then(
        resp => {
          evl = <EvaluacionDesempeno>(resp['data'])[0];
          this.empleadoSelect = evl.empleado;
          this.comentario = evl.comentario;
          this.calificacionDesempenoList = evl.calificacionDesempenoList;
          this.cargo = evl.cargo;
          this.evalId = evl.id;
        }
      );
    }
  }

  onSelect(empleado: Empleado) {
    this.empleadoSelect = empleado;
    let fq = new FilterQuery();
    fq.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: empleado.cargo.id }]
    this.cargoService.findByFilter(fq).then(
      resp => {
        this.cargo = <Cargo>FilterQuery.dtoToObject((resp['data'])[0]);
        this.calificacionDesempenoList = [];
        this.cargo.competenciasList.forEach(comp => {
          this.calificacionDesempenoList.push({
            competencia: comp,
            puntaje: null
          });
        });
      }
    );
  }

  recursiveBuildCompt(list: Competencia[], nodes: TreeNode[]) {
    list.forEach(comp => {
      let node: TreeNode = { data: comp };
      if (comp.competenciaList != null && comp.competenciaList.length > 0) {
        node.children = [];
        this.recursiveBuildCompt(comp.competenciaList, node.children);
      }
      nodes.push(node);
    });
  }

  verificarRespuestas(): boolean {
    let valido = true;
    this.calificacionDesempenoList.forEach(calf => {
      if (calf.puntaje == null) {
        this.msgs = [{
          summary: 'Calificación incompleta',
          detail: 'Debe calificar todas las competencias del listado',
          severity: 'warn'
        }];
        valido = false;
      }
    });
    return valido;
  }


  guardar() {
    if (!this.verificarRespuestas()) {
      return;
    }
    let evl = new EvaluacionDesempeno();
    evl.cargo = new Cargo();
    evl.cargo.id = this.cargo.id;
    evl.empleado = new Empleado();
    evl.empleado.id = this.empleadoSelect.id;
    evl.calificacionDesempenoList = this.calificacionDesempenoList;
    evl.comentario = this.comentario;

    if (this.accion == 'POST') {
      this.evalDesempService.create(evl).then(
        resp => {
          this.msgs = [{
            summary: 'Registro de evaluación realizado',
            detail: 'Se ha registrado correctamente la evaluación de desempeño',
            severity: 'success'
          }];
          this.empleadoSelect = null;
          this.comentario = null;
          this.calificacionDesempenoList = null;
        }
      );
    } else if (this.accion == 'PUT') {
      evl.id = this.evalId;
      this.evalDesempService.update(evl).then(
        resp => {
          this.msgs = [{
            summary: 'Registro de evaluación actualizado',
            detail: 'Se han guardado correctamente los cambios de la evaluación de desempeño',
            severity: 'success'
          }];
          this.empleadoSelect = null;
          this.comentario = null;
          this.calificacionDesempenoList = null;
          this.accion = 'POST';
        }
      );
    }


  }

}
