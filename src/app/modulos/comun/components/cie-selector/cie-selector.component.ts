import { Component, OnInit, Output, EventEmitter, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Cie } from 'app/modulos/comun/entities/cie'
import { ComunService } from 'app/modulos/comun/services/comun.service'

@Component({
  selector: 's-cieSelector',
  templateUrl: './cie-selector.component.html',
  styleUrls: ['./cie-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CieSelectorComponent),
    multi: true
  }]
})
export class CieSelectorComponent implements OnInit, ControlValueAccessor {

  @Input() _value: Cie;
  @Input("readOnly") disabled: boolean;
  propagateChange = (_: any) => { };
  cieList: Cie[];

  constructor(
    private comunService: ComunService,
  ) { }

  ngOnInit() {
  }

  writeValue(value: Cie) {
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
  buscarCie(event) {
    this.comunService.buscarCie(event.query).then(
      data => this.cieList = <Cie[]>data
    );
  }

  onSelect(event) {
    this.value = event;
  }

  resetCie() {
    if (!this.disabled) {
      this._value = null;
    }
  }

}
