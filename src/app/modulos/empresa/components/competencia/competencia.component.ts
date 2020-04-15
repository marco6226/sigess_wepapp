import { Component, OnInit, Input } from '@angular/core';
import { Competencia } from '../../entities/competencia';
import { CompetenciaService } from 'app/modulos/empresa/services/competencia.service'
import { TreeNode, Message } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 's-competencia',
  templateUrl: './competencia.component.html',
  styleUrls: ['./competencia.component.scss'],
  providers: [CompetenciaService, MessageService]
})
export class CompetenciaComponent implements OnInit {

  nombre: string;
  descripcion: string;
  nodeSelect: TreeNode;
  @Input('value') _value: Competencia[];
  modelo: TreeNode[];
  msgs: Message[] = [];

  constructor(
    private competenciaService: CompetenciaService
  ) { }

  ngOnInit() {
    if (this._value == null) {
      this.competenciaService.findAll().then(
        resp => this.construirArbol(<Competencia[]>resp['data'])
      );
    } else {
      this.construirArbol(this._value);
    }
  }

  construirArbol(list: Competencia[]) {
    this.modelo = [];
    this.recursiveBuild(list, this.modelo);
    this.modelo = this.modelo.slice();
    console.log(this.modelo);
  }

  recursiveBuild(list: Competencia[], nodes: TreeNode[]) {
    list.forEach(comp => {
      let node: TreeNode = { data: comp };
      if (comp.competenciaList != null && comp.competenciaList.length > 0) {
        node.children = [];
        this.recursiveBuild(comp.competenciaList, node.children);
      }
      nodes.push(node);
    });
  }

  set value(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }

  addCompetencia() {
    let comp = new Competencia();
    comp.nombre = this.nombre;
    comp.descripcion = this.descripcion;
    if (this.nodeSelect != null) {
      comp.competencia = this.nodeSelect.data;
    }


    this.competenciaService.create(comp).then(
      resp => {
        comp = <Competencia>resp;
        let node: TreeNode = { data: comp };
        if (this.nodeSelect != null && this.nodeSelect.children != null) {
          this.nodeSelect.children.push(node);
        } else if (this.nodeSelect != null && this.nodeSelect.children == null) {
          this.nodeSelect.children = [node];
        } else {
          this.modelo.push(node);
        }
        this.nombre = null;
        this.descripcion = null;
        this.modelo = this.modelo.slice();
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Competencia creada',
          detail: 'Se ha adicionado correctamente la nueva competencia'
        });
      }
    );
  }

  nodeSelectAction(event: any) {
    this.nombre = event.node.data.nombre;
    this.descripcion = event.node.data.descripcion;
  }

  actualizarCompetencia() {
    let comp = <Competencia>this.nodeSelect.data;
    comp.nombre = this.nombre;
    comp.descripcion = this.descripcion;

    this.competenciaService.update(comp).then(
      resp => {
        comp = <Competencia>resp;
        this.nombre = null;
        this.descripcion = null;
        this.modelo = this.modelo.slice();
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Competencia actualizada',
          detail: 'Se ha actualizado correctamente la competencia seleccionada'
        });
      }
    );
  }

  removerCompetencia() {
    let comp = <Competencia>this.nodeSelect.data;
    console.log(this.nodeSelect);
    this.competenciaService.delete(comp.id).then(
      resp => {
        comp = <Competencia>resp;
        let brothers = this.nodeSelect.parent == null ? this.modelo : this.nodeSelect.parent.children;
        let i = 0;
        brothers.forEach(child => {
          if (child.data.id == comp.id) {
            brothers.splice(i, 1);
          }
          i++;
        });
        this.nodeSelect = null;
        this.modelo = this.modelo.slice();
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Competencia eliminada',
          detail: 'Se ha eliminado correctamente la competencia seleccionada'
        });
      }
    );
  }

}
