import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { Formulario } from 'app/modulos/comun/entities/formulario'
import { RespuestaCampo } from '../../entities/respuesta-campo';

@Component({
  selector: 's-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
    es: any;
  @Input("formularioModel") formulario: Formulario;
  form: FormGroup;
  selectorsMap: any = [];
  @Output("onValidChange") onValidChange = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    let group: any = {};
    this.es = {
        firstDayOfWeek: 0,
        dayNames: ["Domingp", "Lunes", "Martes", "Miercoles", "Jueves", "Vienes", "Sabado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        monthNames: [ "Enero","Febrero ","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
        monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dec" ],
        today: 'Today',
        clear: 'Clear',
        dateFormat: 'dd/MM/yyyy',
        weekHeader: 'Wk'
    };
    this.formulario.campoList.forEach(campo => {
      if (campo.tipo == 'multiple_select' || campo.tipo == 'single_select') {
        this.selectorsMap[campo.id] = (campo.tipo == 'single_select' ? [{ label: '--seleccione--', value: null }] : []);
        campo.opciones.forEach(opcion => {
          this.selectorsMap[campo.id].push({ label: opcion, value: opcion });
        });
      }
      if (campo.respuestaCampo != null) {
        switch (campo.tipo) {
          case 'timestamp':
          case 'date':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor == null ? null : new Date(campo.respuestaCampo.valor);
            break;
          case 'multiple_select':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor == null ? null : <string[]>(campo.respuestaCampo.valor.split(";"));
            break;
          case 'single_select':
          case 'text':
          case 'boolean':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor;
            break;
        }
      } else { 
        campo.respuestaCampo = new RespuestaCampo();
      }
      let formControl = campo.requerido ? new FormControl(campo.respuestaCampo.valor, Validators.required) : new FormControl(campo.respuestaCampo.valor);
      formControl.valueChanges.subscribe(
        data => {
          campo.respuestaCampo.valor = data;
          this.form.updateValueAndValidity();
          this.onValidChange.emit(this.form.valid);
        }
      );
      group[campo.nombre] = formControl;
    });
    this.form = new FormGroup(group);
    this.onValidChange.emit(this.form.valid);
  }

}
