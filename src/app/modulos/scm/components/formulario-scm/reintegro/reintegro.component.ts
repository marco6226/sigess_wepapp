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
    this.form = fb.group({
      tipo_retorno: [null, Validators.required],
      descripcion: [null, Validators.required],
      permanencia: [null, Validators.required],
      periodo_seguimiento: [null, Validators.required],
      reintegro_exitoso: [null],
      fecha_cierre: [new Date(), Validators.required],
      observacion: [null, Validators.required],
      pk_case: [null]
    })
   }

  ngOnInit() {
   
  }

  test(){
    console.log(this.reintegroTipo);
    
  }
  async saveReintegro(){
    this.form.value.pk_case=this.idCase
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
    this.isCreate.emit()
  }

  GuardarRetorno(){
    console.log("hola",this.reintegroTipo);
    console.log(this.form.value);

    console.log(this.form);
    
    
    
  }

}

export interface drop{
  label: string,
  value: number
}