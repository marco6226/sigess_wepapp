import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { EmpresaAlidada } from './../../../empresa/entities/empresa';
import { Component, OnInit } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-aliados',
  templateUrl: './aliados.component.html',
  styleUrls: ['./aliados.component.scss'],
  providers: [MessageService]

})
export class AliadosComponent implements OnInit {

  nameAndLastName: string=''

  seleccion: string;
  onSeleccion: string;
  isSelected: boolean=false;

  formNatural: FormGroup
  formJuridica: FormGroup

  divisionList= [
    { label: "Almacenes Corona", value: "Almacenes Corona" },
    { label: "Bathrooms and Kitchen", value: "Bathrooms and Kitchen" },
    { label: "Comercial Corona Colombia", value: "Comercial Corona Colombia" },
    { label: "Funciones Transversales", value: "Funciones Transversales" },
    { label: "Insumos Industriales y Energias", value: "Insumos Industriales y Energias" },
    { label: "Mesa Servida", value: "Mesa Servida" },
    { label: "Superficies, materiales y pinturas", value: "Superficies, materiales y pinturas" },
  ]

  actividadesContratadasList = [
    { label: "--Seleccione--", value: null },
    {label: "actividad 1", value: "actividad1"},
    {label: "actividad 2", value: "actividad2"},
    {label: "actividad 3", value: "actividad3"},
    {label: "actividad 4", value: "actividad4"},
  ]

  

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.formNatural = fb.group({
      'razonSocial':[null, Validators.required],
      'tipo_persona':[null],
      'identificacion':[null, Validators.required],
      'email':[null, Validators.required],
      'telefono':[null, Validators.required],
      'actividadesContratadas':[null, Validators.required],
      'localidad':[null, Validators.required],
      'division':[null, Validators.required],
    })
    this.formJuridica = fb.group({
      'razonSocial':[null, Validators.required],
      'tipo_persona':[null],
      'identificacion':[null, Validators.required],
      'email':[null, Validators.required],
      'nombreComercial':[null, Validators.required]
    })
   }

  ngOnInit() {
  }

  continuar(){
    if(this.seleccion){
      this.onSeleccion = this.seleccion    
      this.isSelected = true;
    }

  }

  saveAliado(){
    this.formJuridica.value.tipo_persona = this.formNatural.value.tipo_persona = this.seleccion
    console.log(this.formNatural.value);

    console.log(this.formJuridica.value);

    let createEmpresa: Empresa

    if (this.formNatural.valid) {

      createEmpresa = {
        id: null,
        nombreComercial: this.formNatural.value.razonSocial,
        razonSocial: this.formNatural.value.razonSocial,
        nit: this.formNatural.value.identificacion,
        direccion: null,
        telefono: null,
        email: this.formNatural.value.email,
        web: null,
        numeroSedes: undefined,
        arl: undefined,
        ciiu: undefined,
        logo: null,
        empresasContratistasList: [],
        tipo_persona: this.formNatural.value.tipo_persona,
        actividades_contratadas: this.formNatural.value.actividadesContratadas,
        localidad: this.formNatural.value.localidad,
        division: JSON.stringify(this.formNatural.value.division),
        estado:'Creado',
        calificacion:'Bajo',
        fechaCreacion: new Date()
      }
      
    } else if (this.formJuridica.valid){
      createEmpresa = {
        id: null,
        nombreComercial: this.formJuridica.value.nombreComercial,
        razonSocial: this.formJuridica.value.razonSocial,
        nit: this.formJuridica.value.identificacion,
        direccion: null,
        telefono: null,
        email: this.formJuridica.value.email,
        web: null,
        numeroSedes: undefined,
        arl: undefined,
        ciiu: undefined,
        logo: null,
        empresasContratistasList: [],
        tipo_persona: this.formJuridica.value.tipo_persona,
        estado:'Creado',
        calificacion:'Bajo',
        fechaCreacion: new Date()
      }
    }

    this.empresaService.create(createEmpresa).then(ele=>{
      console.log(ele);      
      this.messageService.add({severity:'success', summary: 'Creación Alidado', detail: 'Se agrego un Aliado nuevo'});
      setTimeout(() => {
        this.router.navigate(['/app/ctr/listadoAliados']);
      }, 500);
    }).catch(error=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el Aliado, intente de nuevo'});
    })
  }

}
