import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'

import { ComunService } from 'app/modulos/comun/services/comun.service'

import { SelectItem } from 'primeng/primeng'

import { Departamento } from 'app/modulos/comun/entities/departamento'
import { Ciudad } from 'app/modulos/comun/entities/ciudad'

@Component({
    selector: 's-ciudadSelector',
    templateUrl: './ciudad-selector.component.html',
    styleUrls: ['./ciudad-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CiudadSelectorComponent),
            multi: true
        }
    ]
})
export class CiudadSelectorComponent implements OnInit, ControlValueAccessor {

    @Input("id") id: string;
    @Input() _value: Ciudad;
    departamentoSelectId: string;

    departamentosItems: SelectItem[] = [];
    ciudadesItems: SelectItem[] = [];

    propagateChange = (_: any) => { };

    constructor(
        private comunService: ComunService
    ) {

    }

    // Interface implements

    ngOnInit() {
        this.ciudadesItems.push({ label: '--Ciudad--', value: null });
        this.departamentosItems.push({ label: '--Departamento--', value: null });
        this.comunService.findDepartamentoByPais("1").then(
            data => this.loadDepartamentosItems(<Departamento[]>data)
        );
    }

    writeValue(value: Ciudad) {
        this.value = value;
    }

    registerOnTouched() { }


    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.propagateChange(this._value);
        this.updateUI();
    }


    // Component methods

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    loadDepartamentosItems(departamentos: Departamento[]) {
        this.departamentosItems.splice(1, this.ciudadesItems.length);
        departamentos.forEach(depto => {
      this.departamentosItems.push({ label: depto.nombre, value: depto.id });
        });
    }

    onDepartamentoChange(event: any) {
        console.log("paso por aca");
        this.value = null;
        this.loadCiudades(event.value);
    }

    loadCiudades(departamentoId: string) {
        this.comunService.findCiudadByDepartamento(departamentoId).then(
            data => this.loadCiudadesItems(<Ciudad[]>data)
        );
    }

    loadCiudadesItems(ciudades: Ciudad[]) {
        this.ciudadesItems.splice(1, this.ciudadesItems.length);
        ciudades.forEach(ciudad => {
            if (this.value != null && ciudad.id == this.value.id) {
                this._value = ciudad;
            }
            this.ciudadesItems.push({ label: ciudad.nombre, value: ciudad });
        });
    }

    updateUI() {
        if (this.value != null) {


            this.departamentoSelectId = this.value.departamento.id;
            console.log(this.departamentoSelectId, this.departamentosItems, "Dept");
            this.loadCiudades(this.departamentoSelectId);
        } else {
            console.log(this.value, "cut");

            this.departamentoSelectId = null;
            this.ciudadesItems.splice(1, this.ciudadesItems.length);
        }

    }
}
