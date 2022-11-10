import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { EmpleadoBasic } from 'app/modulos/empresa/entities/empleado-basic';
import { EmpleadoBasicService } from 'app/modulos/empresa/services/empleado-basic.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'

@Component({
  selector: 's-empleadoBasicSelector',
  templateUrl: './empleado-basic-selector.component.html',
  styleUrls: ['./empleado-basic-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmpleadoBasicSelectorComponent),
    multi: true
  }]
})
export class EmpleadoBasicSelectorComponent implements OnInit, ControlValueAccessor {


  @Input() _value: EmpleadoBasic;
  @Input("readOnly") disabled: boolean;
  @Output("onSelect") onSelect = new EventEmitter<EmpleadoBasic>();
  propagateChange = (_: any) => { };
  empleadosList: EmpleadoBasic[];

  constructor(
    private empleadoService: EmpleadoBasicService,
  ) { }

  ngOnInit() {
  }

  writeValue(value: EmpleadoBasic) {
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
      data => this.empleadosList = <EmpleadoBasic[]>data
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
