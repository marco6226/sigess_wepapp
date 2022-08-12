import { FormBuilder, FormGroup } from '@angular/forms';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { EmpresaAlidada } from './../../../empresa/entities/empresa';
import { Component, OnInit } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa';

@Component({
  selector: 'app-aliados',
  templateUrl: './aliados.component.html',
  styleUrls: ['./aliados.component.scss']
})
export class AliadosComponent implements OnInit {

  nameAndLastName: string=''

  seleccion: string;
  onSeleccion: string;
  isSelected: boolean=false;

  form: FormGroup

  a:Empresa={
    razonSocial: 'prueba',
    nit: '1',
    telefono: '2',
    email: '3123@fasdf.com',
    id: '',
    nombreComercial: '',
    direccion: '',
    web: '',
    numeroSedes: undefined,
    arl: null,
    ciiu: null,
    logo: '',
    empresasContratistasList: []
  }

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      'razonSocial':[null],
      'tipo':[null],
      'identificación':[null],
      'email':[null],
      'telefono':[null],
      'actividadesContratadas':[null],
      'localidad':[null],
      'division':[null],
    })
   }

  ngOnInit() {
  }

  continuar(){
    this.onSeleccion = this.seleccion    
    this.isSelected = true;
  }

  onSelection(a){
    console.log(a);
    
  }

  buscarEmpleado(a){
    console.log(a);
    
  }

  test(){
    // this.empresaService.create(this.a).then(ele=>{
    //   console.log(ele);
      
    // })
    console.log(this.form.value);
    
  }
}
