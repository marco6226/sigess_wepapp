import { UsuarioEmpresa } from './../../../empresa/entities/usuario-empresa';
import { Perfil } from './../../../empresa/entities/perfil';
import { Usuario } from './../../../empresa/entities/usuario';
import { UsuarioService } from './../../../admin/services/usuario.service';
import { SesionService } from './../../../core/services/sesion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { EmpresaAlidada } from './../../../empresa/entities/empresa';
import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Router } from '@angular/router';
import { MessageService, Tree, TreeNode } from 'primeng/primeng';
import { _actividadesContratadasList, _divisionList, ActividadesContratadas, Localidades } from '../../entities/aliados';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';

@Component({
  selector: 'app-aliados',
  templateUrl: './aliados.component.html',
  styleUrls: ['./aliados.component.scss'],
  providers: [MessageService]

})
export class AliadosComponent implements OnInit {

  valueEmpresa: Empresa={
    id: '',
    nombreComercial: '',
    razonSocial: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    numeroSedes: undefined,
    arl: null,
    ciiu: null,
    logo: '',
    empresasContratistasList: [],
    tipo_persona: '',
  };

  @Input('valueEmpresa') 
  set valuesIn (value: Empresa){
    this.valueEmpresa = value
    this.loadActividadesContratadas()
    this.loadLocalidades()
    if (this.valueEmpresa.division) {
      this.valueEmpresa.division = JSON.parse( this.valueEmpresa.division)   
    }
    this.loadDataIn();
  }
  
  @Input() onEdit: string= null;
  
  
  @Input('calificacion') calificacion: number = 0;
  
  fecha_calificacion: Date;
  @Input('fechaCalificacion')
  set setFechaCalificacion(fecha: Date){
    if(fecha){
      this.fecha_calificacion = new Date(fecha);
    }
  }
  
  @Input() quienCalifica: string= '';

  @Output() dataCalificacion = new EventEmitter<number>();
  @Output() dataFechaCalificacion = new EventEmitter<Date>();
  @Output() dataQuienCalifica = new EventEmitter<string>();

  isCreate: boolean=true;

  nameAndLastName: string=''

  seleccion: string;
  onSeleccion: string;
  isSelected: boolean=false;

  formNatural: FormGroup
  formJuridica: FormGroup

  divisionList= _divisionList
  localeES: any = locale_es;

  // actividadesContratadasList = _actividadesContratadasList
  actividadesContratadasList: ActividadesContratadas[]=[]
  actividadesContratadasList2: any[]=[]
  localidades: any[]=[]
  // actividadesContratadasList2: TreeNode[]=[]

  

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private router: Router,
    private sesionService: SesionService,
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) {
    this.formNatural = fb.group({
      razonSocial:[null, Validators.required],
      tipo_persona:[null],
      identificacion:[null, Validators.required],
      email:[null, Validators.required],
      telefono:[null, Validators.required],
      actividadesContratadas:[null, Validators.required],
      localidad:[null, Validators.required],
      division:[null, Validators.required],
    })
    this.formJuridica = fb.group({
      razonSocial:[null, Validators.required],
      tipo_persona:[null],
      identificacion:[null, Validators.required],
      email:[null, [Validators.required, Validators.email]],
      nombreComercial:[null, Validators.required],
    })
   }
  

  ngOnInit() {
    this.loadActividadesContratadas();
    this.loadLocalidades();
  }

  continuar(){
    if(this.seleccion){
      this.onSeleccion = this.seleccion    
      this.isSelected = true;
    }

  }

  async saveAliado(){
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
        actividades_contratadas: JSON.stringify(this.formNatural.value.actividadesContratadas),
        localidad: JSON.stringify(this.formNatural.value.localidad),
        division: JSON.stringify(this.formNatural.value.division),
        estado:'Creado',
        calificacion:'',
        fechaCreacion: new Date(),
        activo: true,
        idEmpresaAliada: Number(await this.sesionService.getEmpresa().id),
        correoAliadoCreador: JSON.parse(localStorage.getItem('session')).usuario.email
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
        calificacion:'',
        fechaCreacion: new Date(),
        activo: true,
        idEmpresaAliada: Number(await this.sesionService.getEmpresa().id),
        correoAliadoCreador: JSON.parse(localStorage.getItem('session')).usuario.email
      }
    }

    this.empresaService.create(createEmpresa).then((ele:Empresa)=>{
      console.log(ele);      
      this.messageService.add({severity:'success', summary: 'Creación Alidado', detail: 'Se agrego un Aliado nuevo'});
      console.log(ele);
      
      if (this.formJuridica.valid) {

        let ue = new UsuarioEmpresa();
      
        ue.perfil = new Perfil();
        ue.perfil.id = '321';
  
        let user = new Usuario()
        user.id= null,
        user.email= this.formJuridica.value.email,
        user.estado= null,
        user.usuarioEmpresaList= [],
        user.ipPermitida= ['0.0.0.0/0'],
        user.numeroMovil= null,
        user.mfa= null
  
        user.usuarioEmpresaList.push(ue)
        this.usuarioService.createUsuarioAliado(user,ele.id);

      }
      setTimeout(() => {
        this.router.navigate(['/app/ctr/listadoAliados']);
      }, 500);
    }).catch(error=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el Aliado, intente de nuevo'});
    })
  }

  loadDataIn(){
    // debugger
    console.log(this.valueEmpresa)
    console.log(this.formNatural.value)
    this.onSeleccion = this.valueEmpresa.tipo_persona
    this.seleccion = this.valueEmpresa.tipo_persona
    this.isCreate = false;
  }

  async loadActividadesContratadas(){
    this.actividadesContratadasList = []
    this.actividadesContratadasList2 = []
    await this.empresaService.getActividadesContratadas().then((element: ActividadesContratadas[]) =>{


      element.forEach(elemen => {
        this.actividadesContratadasList.push(elemen)
        this.actividadesContratadasList2.push({label: elemen.actividad, value: elemen.actividad})
    });
   });

    if (this.valueEmpresa.actividades_contratadas) {
      this.valueEmpresa.actividades_contratadas = JSON.parse( this.valueEmpresa.actividades_contratadas)      
    }
    
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((element: Localidades[]) =>{

      element.forEach(elemen => {
          this.localidades.push({label: elemen.localidad, value: elemen.localidad})
      });
    });

    if (this.valueEmpresa.localidad) {
      this.valueEmpresa.localidad = JSON.parse( this.valueEmpresa.localidad)      
    }
    
  }

  onCalificacion(){
    this.dataCalificacion.emit(this.calificacion);
  }

  onFechaCalificacion(){
    this.dataFechaCalificacion.emit(this.fecha_calificacion);
  }

  onQuienCalifica(){
    this.dataQuienCalifica.emit(this.quienCalifica);
  }
}

