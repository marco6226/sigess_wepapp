import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReintegroCreate } from './../../../entities/reintegro.interface';
import { CasosMedicosService } from './../../../services/casos-medicos.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Reintegro } from 'app/modulos/scm/entities/reintegro.interface';

@Component({
  selector: 'app-reintegro',
  templateUrl: './reintegro.component.html',
  styleUrls: ['./reintegro.component.scss']
})
export class ReintegroComponent implements OnInit {

  idCase=null;
  @Input('idCase')
  set reintegroIdSet(idCasoMed){
    this.idCase=idCasoMed
  }
  @Input() onEdit: boolean=false;
  isEdit: Reintegro={
    id: 0,
    tipo_retorno: '',
    descripcion: '',
    permanencia: '',
    periodo_seguimiento: '',
    reintegro_exitoso: '',
    fecha_cierre: undefined,
    observacion: '',
    pk_case: ''
  };
  @Input('isEdit')
  set onEditRetorno(isEdit: Reintegro){
console.log("---------<<<",isEdit);

    if(isEdit.id!=0){

      this.form.value.descripcion = this.isEdit.descripcion = isEdit.descripcion
      this.form.value.fecha_cierre = this.isEdit.fecha_cierre = (isEdit.fecha_cierre==null)?null:new Date(isEdit.fecha_cierre);
      this.isEdit.id = isEdit.id
      this.form.value.observacion = this.isEdit.observacion = isEdit.observacion
      this.form.value.periodo_seguimiento = this.isEdit.periodo_seguimiento = isEdit.periodo_seguimiento
      this.form.value.permanencia = this.isEdit.permanencia = isEdit.permanencia
      this.isEdit.pk_case = isEdit.pk_case
      this.form.value.reintegro_exitoso = this.isEdit.reintegro_exitoso = isEdit.reintegro_exitoso
      this.form.value.tipo_retorno = this.isEdit.tipo_retorno = isEdit.tipo_retorno
      
    }else{
      this.form.reset()
    }

    // this.isEdit.descripcion = isEdit.descripcion
    // this.isEdit.fecha_cierre = isEdit.fecha_cierre
    // this.isEdit.id = isEdit.id
    // this.isEdit.observacion = isEdit.observacion
    // this.isEdit.periodo_seguimiento = isEdit.periodo_seguimiento
    // this.isEdit.permanencia = isEdit.permanencia
    // this.isEdit.pk_case = isEdit.pk_case
    // this.isEdit.reintegro_exitoso = isEdit.reintegro_exitoso
    // this.isEdit.tipo_retorno = isEdit.tipo_retorno
    
  }

  @Output() isCreate = new EventEmitter<any>()



  form: FormGroup;

  reintegroTipos=[
    {label: 'Reintegro', value:'Reintegro'},
    {label: 'Reubicación', value:'Reubicación'},
    {label: 'Reconversión', value:'Reconversión'},
  ]
  reintegroTipo:string=''

  temporals=[
    {label: 'Temporal', value:'Temporal'},
    {label: 'Permanente', value:'Permanente'},
  ]
  temporal

  periocidadesTemp=[
    {label: 'Mensual', value:'Mensual'},
    {label: 'Bimestral', value:'Bimestral'},
    {label: 'Trimestral', value:'Trimestral'},
    {label: 'Semestral', value:'Semestral'},
    {label: 'Anual', value:'Anual'},

  ]

  periocidadesPerm=[
    {label: 'Semestral', value:'Semestral'},
    {label: 'Anual', value:'Anual'},

  ]

  constructor(
    private casosMedicosService: CasosMedicosService,
    public fb: FormBuilder,
  ) {
    console.log("---------------------------");
    
    this.form = fb.group({
      tipo_retorno: [null, /*Validators.required*/],
      descripcion: [null, /*Validators.required*/],
      permanencia: [null],
      periodo_seguimiento: [null, /*Validators.required*/],
      reintegro_exitoso: [null],
      fecha_cierre: [new Date(), /*Validators.required*/],
      observacion: [null, /*Validators.required*/ ],
      pk_case: [null]
    })
   }

  ngOnInit() {
   
  }

  async saveReintegro(){
    this.form.value.pk_case=this.idCase

    if(!this.form.value.permanencia){
      this.form.value.permanencia='Permanente'
    }

    console.log("hola");
    let reintegro: ReintegroCreate={
      pk_case: this.form.value.pk_case,
      tipo_retorno: this.form.value.tipo_retorno,
      descripcion: this.form.value.descripcion,
      permanencia: this.form.value.permanencia,
      periodo_seguimiento: this.form.value.periodo_seguimiento,
      reintegro_exitoso: this.form.value.reintegro_exitoso,
      fecha_cierre: this.form.value.fecha_cierre,
      observacion: this.form.value.observacion
    }
    await this.casosMedicosService.createReintegro(reintegro)
    // this.isCreate.emit()
    this.LimpiarDatos()
  }

  async editReintegro(){
    console.log('Primero');
    
    await this.casosMedicosService.editReintegro(this.isEdit).subscribe(element=>{
      console.log(element)
      console.log('segundo');
      this.LimpiarDatos()
    })
    console.log('tercero');

  }

  LimpiarDatos(){

    this.isEdit={
      id: 0,
      tipo_retorno: '',
      descripcion: '',
      permanencia: '',
      periodo_seguimiento: '',
      reintegro_exitoso: '',
      fecha_cierre: undefined,
      observacion: '',
      pk_case: ''
    }
    this.form.reset();
    this.isCreate.emit()
    console.log(this.form.value);
    
  }
  

}

export interface drop{
  label: string,
  value: number
}