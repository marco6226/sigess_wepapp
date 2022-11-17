import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { EmpleadoBasic } from 'app/modulos/empresa/entities/empleado-basic';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Criteria, LogicOperation } from 'app/modulos/core/entities/filter';

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
  empleadosList: EmpleadoBasic[] = [];

  fields: string[] = [
    'id',
    'primerNombre',
    'primerApellido',
    'numeroIdentificacion', 
    'usuarioBasic'
  ];
  selectedField: any = 1;

  constructor(
    private empleadoService: EmpleadoService,
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
  async buscarEmpleado(event:any) {

    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    filterQuery.filterList.pop();
    if(this.selectedField != 4){
      filterQuery.filterList.push({ criteria: Criteria.LIKE, field: this.fields[this.selectedField], value1: '%'+event.query+'%'});
    }else{
      filterQuery.filterList.push({ criteria: Criteria.LIKE, field: 'usuarioBasic.email', value1: '%'+event.query+'%'});
    }
    await this.empleadoService.findByFilter(filterQuery).then(
      data => {
        let datos: any = data;
        this.empleadosList = datos.data;
      }
    );

  }
  //field: '', criteria: Criteria.EQUALS, value1: empleadoIdentificacion 
  // let filterQuery = new FilterQuery();
  // filterQuery.sortField = event.sortField;
  // filterQuery.sortOrder = event.sortOrder;
  // filterQuery.offset = event.first;
  // filterQuery.rows = event.rows;
  // filterQuery.count = true;

  // filterQuery.fieldList = this.fields;
  // filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

  // this.perfilService.findByFilter(filterQuery).then(
  //   resp => {
  //     this.totalRecords = resp['count'];
  //     this.loading = false;
  //     this.perfilList = [];
  //     (<any[]>resp['data']).forEach(dto => this.perfilList.push(FilterQuery.dtoToObject(dto)));
  //   }







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
