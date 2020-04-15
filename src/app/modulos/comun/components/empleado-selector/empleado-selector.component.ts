import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'

@Component({
  selector: 's-empleadoSelector',
  templateUrl: './empleado-selector.component.html',
  styleUrls: ['./empleado-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmpleadoSelectorComponent),
    multi: true
  }]
})
export class EmpleadoSelectorComponent implements OnInit, ControlValueAccessor {


  @Input() _value: Empleado;
  @Input("readOnly") disabled: boolean;
  @Output("onSelect") onSelect = new EventEmitter<Empleado>();
  propagateChange = (_: any) => { };
  empleadosList: Empleado[];

  constructor(
    private empleadoService: EmpleadoService,
  ) { }

  ngOnInit() {
  }

  writeValue(value: Empleado) {
    this.value = value;
  }

  registerOnTouched() { }


  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.propagateChange(this._value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  // Component methods
  buscarEmpleado(event) {
    this.empleadoService.buscar(event.query).then(
      data => this.empleadosList = <Empleado[]>data
    );
  }

  onSelection(event) {
    this.value = event;
    this.onSelect.emit(this.value);
  }

  resetEmpleado() {
    if (!this.disabled) {
      this.value = null;
    }
  }
}
