import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Subcontratista } from '../../../entities/aliados';

@Component({
  selector: 'app-form-subcontratista',
  templateUrl: './form-subcontratista.component.html',
  styleUrls: ['./form-subcontratista.component.scss']
})
export class FormSubcontratistaComponent implements OnInit {

  formSubcontratista: FormGroup;

  subcontratistaData: Subcontratista;
  isSaveOrUpdate: string = 'save';
  documentos: Documento[];
  directorios: Directorio[];

  @Output() cancelarFormulario = new EventEmitter<boolean>();

  @Input() aliadoId: number = null;
  @Input('loadSubcontratista')
  set subcontratistaIn(subcontratista: Subcontratista){
    if(subcontratista){
      this.subcontratistaData = subcontratista;
      this.isSaveOrUpdate = 'update';

      this.formSubcontratista.controls['nit'].setValue(subcontratista.nit);
      this.formSubcontratista.controls['nombre'].setValue(subcontratista.nombre);
      this.formSubcontratista.controls['actividades_riesgo'].setValue(JSON.parse(subcontratista.actividades_riesgo));
      this.formSubcontratista.controls['porcentaje_certificacion'].setValue(subcontratista.porcentaje_arl);
      this.formSubcontratista.controls['estado'].setValue(JSON.parse(subcontratista.estado));
      this.formSubcontratista.controls['carta_autorizacion'].setValue(subcontratista.carta_autorizacion)
    }
  }

  actividadesRiesgoList: Array<object> = [
    {name: 'No aplica', value: 'No aplica'},
    {name: 'Trabajo en alturas', value: 'Trabajo en alturas'},
    {name: 'Trabajo en espacios confinados', value: 'Trabajo en espacios confinados'},
    {name: 'Trabajo con energías peligrosas', value: 'Trabajo con energías peligrosas'},
    {name: 'Izaje de cargas', value: 'Izaje de cargas'},
    {name: 'Trabajos en caliente', value: 'Trabajos en caliente'}
  ];

  estadosList: Array<object> = [
    {name: 'Activo', value: 'Activo'},
    {name: 'Suspendido', value: 'Suspendido'},
    {name: 'Inactivo', value: 'Inactivo'},
  ]

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private directorioService: DirectorioService
  ) {
    this.formSubcontratista = this.fb.group({
      nit:[null, Validators.required],
      nombre:[null, Validators.required],
      actividades_riesgo:[null, Validators.required],
      porcentaje_certificacion:[null, Validators.required],
      estado:[null, Validators.required],
      carta_autorizacion:[null]
    });
  }

  ngOnInit() {
  }

  guardarSubcontratista(){
    if(this.formSubcontratista.valid){
      if(this.isSaveOrUpdate === 'save'){
        // console.log('saveSubcontratista');
        this.subcontratistaData = {
          nit: this.formSubcontratista.value.nit,
          nombre: this.formSubcontratista.value.nombre,
          actividades_riesgo: JSON.stringify(this.formSubcontratista.value.actividades_riesgo),
          porcentaje_arl: this.formSubcontratista.value.porcentaje_certificacion,
          estado: JSON.stringify(this.formSubcontratista.value.estado),
          carta_autorizacion: null,
          id_aliado_creador: this.aliadoId
        }
        
        this.empresaService.saveSubcontratista(this.subcontratistaData)
          .then(
            (res: Subcontratista) => {
              this.cancelarSubcontratista(false);
            }
          );
      }else{
        // console.log('updateSubcontratista');
        this.subcontratistaData = {
          id: this.subcontratistaData.id,
          nit: this.formSubcontratista.value.nit,
          nombre: this.formSubcontratista.value.nombre,
          actividades_riesgo: JSON.stringify(this.formSubcontratista.value.actividades_riesgo),
          porcentaje_arl: this.formSubcontratista.value.porcentaje_certificacion,
          estado: JSON.stringify(this.formSubcontratista.value.estado),
          carta_autorizacion: this.formSubcontratista.value.carta_autorizacion,
          id_aliado_creador: this.aliadoId
        }
        
        this.empresaService.updateSubcontratista(this.subcontratistaData)
          .then(
            (res: Subcontratista) => {  
              this.cancelarSubcontratista(false);
            }
          );
        this.isSaveOrUpdate = 'save';
      }
    }
  }

  cancelarSubcontratista(onCancelar: boolean){
    if(onCancelar){
      this.formSubcontratista.reset();
      this.cancelarFormulario.emit(onCancelar);
    }else{
      this.formSubcontratista.reset();
      this.cancelarFormulario.emit(false);
    }
  }
}