import { Component, OnInit, Input } from '@angular/core';

import { Campo } from 'app/modulos/comun/entities/campo';
import { Formulario } from 'app/modulos/comun/entities/formulario';

import { SelectItem } from 'primeng/api';


@Component({
  selector: 's-formularioConstructor',
  templateUrl: './formulario-constructor.component.html',
  styleUrls: ['./formulario-constructor.component.scss']
})
export class FormularioConstructorComponent implements OnInit {

  @Input("formulario") formulario: Formulario;
  consultar: boolean = false;
  tiposDatos: SelectItem[] = [
    { label: '--seleccione--', value: null },
    { label: 'Texto', value: 'text' },
    { label: 'Fecha', value: 'date' },
    { label: 'Fecha y hora', value: 'timestamp' },
    { label: 'Binario', value: 'boolean' },
    { label: 'Selección múltiple', value: 'multiple_select' },
    { label: 'Selección única', value: 'single_select' }
  ];;

  constructor() { }

  ngOnInit() {
    if (this.formulario == null) {
      this.formulario = new Formulario();
    }
  }

  adicionarCampo() {
    if (this.formulario.campoList == null) {
      this.formulario.campoList = [];
    }
    let campo = new Campo();
    this.formulario.campoList.push(campo);
    this.formulario.campoList = this.formulario.campoList.slice();

  }

  removerCampo(indice: number) {
    this.formulario.campoList.splice(indice, 1);
    this.formulario.campoList = this.formulario.campoList.slice();

  }

}
