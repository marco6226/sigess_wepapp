import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { Afp } from 'app/modulos/comun/entities/afp';
import { Eps } from 'app/modulos/comun/entities/eps';
import { ComunService } from 'app/modulos/comun/services/comun.service';
import { EnumeracionesService } from 'app/modulos/comun/services/enumeraciones.service';
import { Criteria } from 'app/modulos/core/entities/filter';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { Perfil } from 'app/modulos/empresa/entities/perfil';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';
import * as moment from 'moment';

@Component({
  selector: 'app-formulario-scm',
  templateUrl: './formulario-scm.component.html',
  styleUrls: ['./formulario-scm.component.scss']
})
export class FormularioScmComponent implements OnInit {
    value;
    casoMedicoForm:FormGroup;
    bussinessParner:FormGroup;
    jefeInmediato:FormGroup;
    cedula = "TANGAMANDAPIO";
    cargoDescripcion:string;
    empleado : Empleado;
    empleadosList: Empleado[];
    @Output() onEmpleadoCreate = new EventEmitter();
    @Output() onEmpleadoUpdate = new EventEmitter();
    @Output() onCancel = new EventEmitter();
     empleadoSelect: Empleado;
    @Input() isUpdate: boolean;
    @Input() show: boolean;
    @Input() editable: boolean;
    empleadoForm: FormGroup;
    empresaId = this.sesionService.getEmpresa().id;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es; 
    tipoIdentificacionList: SelectItem[];
    tipoVinculacionList: SelectItem[];
    epsList: SelectItem[];
    afpList: SelectItem[];
    cargoList: SelectItem[];
    perfilList: SelectItem[] = [];
    loaded: boolean;
    antiguedad;
    solicitando: boolean = false;
  
    constructor(
      private empleadoService: EmpleadoService,
      private fb: FormBuilder,
      private sesionService: SesionService,
      private enumeracionesService: EnumeracionesService,
      private comunService: ComunService,
      private cargoService: CargoService,
      private usuarioService: UsuarioService,
      private scmService: CasosMedicosService,
  
      private perfilService: PerfilService,
  
    ) {
      let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
      this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
      this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);
      //Instaciacion de datos de form
        this.bussinessParner = fb.group({
            'numeroIdentificacion': [null, Validators.required],
            'primerNombre': [null, Validators.required],
            'segundoNombre': null,
            'email': null,
            'corporativePhone':[null],
            'cargoId': [null, Validators.required],

    })
        this.jefeInmediato = fb.group({
            'numeroIdentificacion': [null, Validators.required],
            'primerNombre': [null, Validators.required],
            'segundoNombre': null,
            'email': null,
            'corporativePhone':[null],
            'cargoId': [null, Validators.required],
        })
      this.empleadoForm = fb.group({
        'id': [null],
        'primerNombre': [null, Validators.required],
        'segundoNombre': null,
        'primerApellido': [null, Validators.required],
        'segundoApellido': null,
        'codigo': [null],
        'direccion': [null],
        'fechaIngreso': [null, Validators.required],
        'fechaNacimiento': [null],
        'genero': [null],
        'numeroIdentificacion': [null, Validators.required],
        'telefono1': [null],
        'telefono2': [null],
    
        'corporativePhone':[null],
        'emergencyContact' :[null],
        'phoneEmergencyContact' :[null],
        'emailEmergencyContact' :[null],
        'afp': [null],
        'ccf': [null],
        'ciudad': [null],
        'eps': [null],
        'tipoIdentificacion': [null, Validators.required],
        'tipoVinculacion': [null],
        'zonaResidencia': [null],
        'area': [null, Validators.required],
        'cargoId': [null, Validators.required],
        'perfilesId': [null, Validators.required],
        //'ipPermitida': [null],
        'email': [null,{disabled:true}, Validators.required]
      });
  
      this.casoMedicoForm = fb.group({
        "codigoCie10": [null, Validators.required],
        "razon": [null, Validators.required],
        "observaciones": [null, Validators.required],
        "statusCaso": [null, Validators.required],
        "requiereIntervencion": [null, Validators.required],
        "professionalArea": [null, Validators.required],
        "pkJefe": [null, Validators.required],
        "porcentajePcl": [null, Validators.required],
        "pcl": [null, Validators.required],
        'region':[null],
        'ciudad':[null],
        'cargo':[null],
        "descripcionCompletaCaso": [null, Validators.required],
        "fechaCalificacion": [null, Validators.required],
        "sve": [null, Validators.required],
        "pkUser": [null, Validators.required],
        "diagnostico": [null, Validators.required],
        "origen": [null, Validators.required],
        "fechaConceptRehabilitacion": [null, Validators.required],
        "entidadEmiteConcepto": [null, Validators.required],
        "justification": [null, Validators.required],
        "statusDeCalificacion": [null, Validators.required],
        "casoMedicoLaboral": [null, Validators.required],
        "fechaFinal": [null, Validators.required],
        "emisionPclFecha": [null, Validators.required],
        "sistemaAfectado": [null, Validators.required],
        "entidadEmiteCalificacion": [null, Validators.required],
        "pkBusinessPartner": [null, Validators.required],
        "pclEmitEntidad": [null, Validators.required],
        "conceptRehabilitacion": [null, Validators.required]
      })
    }
  
    ngOnInit() {

      

        this.casoMedicoForm.patchValue({
        casoMedicoLaboral: "asdasda",
        codigoCie10: "asdasdasd",
        conceptRehabilitacion: "asdasdasdadasd",
        descripcionCompletaCaso: "asdasdasdasd",
        diagnostico: "asdasdasdasd",
        emisionPclFecha: null,
        entidadEmiteCalificacion: 48,
        entidadEmiteConcepto: 48,
        fechaCalificacion: null,
        fechaConceptRehabilitacion: null,
        fechaFinal: "",
        justification: null,
        observaciones: "asdasdadasd",
        origen: "asdasdad",
        pcl: "asdasd",
        pclEmitEntidad: 49,
        pkBusinessPartner: null,
        pkJefe: null,
        pkUser: null,
        porcentajePcl: "asdasdad",
        professionalArea: 50,
        razon: "asdasda",
        requiereIntervencion: 50,
        sistemaAfectado: 49,
        statusCaso: 48,
        statusDeCalificacion: 47,
        sve: "asdasdad"})
        
      this.isUpdate ? this.empleadoForm.controls['email'].disable() : "" ; //this for disabled email in case of update
      if (this.empleadoSelect != null) {
        let fq = new FilterQuery();
        fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.empleadoSelect.id, value2: null }];
       // //console.log(fq);
        this.empleadoService.findByFilter(fq).then(
          resp => {
            this.empleadoSelect = <Empleado>(resp['data'][0]);
            this.loaded = true;
            console.log(this.empleadoSelect);
            this.empleadoForm.patchValue({
              'id': this.empleadoSelect.id,
              'primerNombre': this.empleadoSelect.primerNombre,
              'segundoNombre': this.empleadoSelect.segundoNombre,
              'primerApellido': this.empleadoSelect.primerApellido,
              'segundoApellido': this.empleadoSelect.segundoApellido,
              'codigo': this.empleadoSelect.codigo,
              'direccion': this.empleadoSelect.direccion,
              'fechaIngreso': this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
              'fechaNacimiento': this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
              'genero': this.empleadoSelect.genero,
              'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
              'telefono1': this.empleadoSelect.telefono1,
              'telefono2': this.empleadoSelect.telefono2,
              'afp': this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
              'ciudad': this.empleadoSelect.ciudad,
              'eps': this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
              'tipoIdentificacion': this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
              'tipoVinculacion': this.empleadoSelect.tipoVinculacion,
              'zonaResidencia': this.empleadoSelect.zonaResidencia,
              'area': this.empleadoSelect.area,
              'cargoId': this.empleadoSelect.cargo.id,
              'perfilesId': [4],    
              //'ipPermitida': this.empleadoSelect.usuario.ipPermitida,
  
              'email': [this.empleadoSelect.usuario.email]
            });
          }
        );
      } else {
        this.loaded = true;
        let area:any;
        //console.log("new register");
        this.empleadoForm.patchValue({'area': area});
        this.editable = true;
      }
      this.comunService.findAllAfp().then(
        data => {
          this.afpList = []
          this.afpList.push({ label: '--Seleccione--', value: null });
          (<Afp[]>data).forEach(afp => {
            this.afpList.push({ label: afp.nombre, value: afp.id });
          });
        }
      );
      this.comunService.findAllEps().then(
        data => {
          this.epsList = [];
          this.epsList.push({ label: '--Seleccione--', value: null });
          (<Eps[]>data).forEach(eps => {
            this.epsList.push({ label: eps.nombre, value: eps.id });
          });
        }
      );
  
      this.cargoService.findAll().then(
        resp => {
          this.cargoList = [];
          this.cargoList.push({ label: '--Seleccione--', value: null });
          (<Cargo[]>resp['data']).forEach(cargo => {
            this.cargoList.push({ label: cargo.nombre, value: cargo.id });
          });
          //this.cargoList = this.cargoList.slice();
        }
      );
      this.perfilService.findAll().then(
        resp => {
          (<Perfil[]>resp['data']).forEach(perfil => {
            this.perfilList.push({ label: perfil.nombre, value: perfil.id });
  
           
          });
          if ( this.isUpdate === true || this.show === true )setTimeout(() => {
            this.buildPerfilesIdList();
          }, 500); 
  
        }
      );
  
    } 
    closeForm(){}
      
  async  onSubmit(){
            console.log(this.cargoList);
            this.casoMedicoForm.patchValue({
                region: this.empleadoForm.get('area').value.nombre,
                ciudad: this.empleadoForm.get('ciudad').value.nombre,
               // cargo:  this.cargoList.find(cargos => cargos.value =this.empleadoForm.get('cargoId').value),
                pkJefe: this.jefeInmediato.get('numeroIdentificacion').value,
                pkUser:  this.bussinessParner.get('numeroIdentificacion').value,
               
            })
            console.log(this.casoMedicoForm.value)
        console.log(await this.scmService.create(this.casoMedicoForm.value));
    }
  
    async buildPerfilesIdList() {
      ////console.log(this.empleadoSelect.id, "181");
      let filterQuery = new FilterQuery();
      filterQuery.filterList = [{
        field: 'usuarioEmpresaList.usuario.id',
        criteria: Criteria.EQUALS,
        value1: this.empleadoSelect.usuario.id,
        value2: null
      }];
      this.perfilService.update
       await this.perfilService.findByFilter(filterQuery).then(
        resp => {
          let perfilesId = [];
           resp['data'].forEach(ident => perfilesId.push(ident.id));
        
            console.log(resp['data']);
          this.empleadoForm.patchValue({perfilesId: perfilesId})
          })
       
     
    }


     // Component methods
  buscarEmpleado(event) {
    this.empleadoService.buscar(event.query).then(
      data => this.empleadosList = <Empleado[]>data
    );
  }

  onSelection(event) {
    this.value = event;
    this.value = event;
    this.empleadoSelect = <Empleado>this.value;    this.loaded = true;
    console.log(this.empleadoSelect);
    let fecha = moment(this.empleadoSelect.fechaIngreso)
    this.antiguedad =   `${fecha.diff(moment.now(),'months')*-1} Meses`
    console.log(this.antiguedad);
    this.cargoDescripcion = this.empleadoSelect.cargo.descripcion;
    this.empleadoForm.patchValue({
      'id': this.empleadoSelect.id,
      'primerNombre': this.empleadoSelect.primerNombre,
      'segundoNombre': this.empleadoSelect.segundoNombre,
      'primerApellido': this.empleadoSelect.primerApellido,
      'segundoApellido': this.empleadoSelect.segundoApellido,
      'codigo': this.empleadoSelect.codigo,
      'direccion': this.empleadoSelect.direccion,
      'fechaIngreso': this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
      'fechaNacimiento': this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
      'genero': this.empleadoSelect.genero,
      'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
      'telefono1': this.empleadoSelect.telefono1,
      'telefono2': this.empleadoSelect.telefono2,
      'corporativePhone': this.empleadoSelect.corporativePhone,
      'afp': this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
      'ciudad': this.empleadoSelect.ciudad,
      'eps': this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
      'tipoIdentificacion': this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
      'tipoVinculacion': this.empleadoSelect.tipoVinculacion,
      'zonaResidencia': this.empleadoSelect.zonaResidencia,
      'area': this.empleadoSelect.area,
      'cargoId': this.empleadoSelect.cargo.id,
      'perfilesId': [4],    
      //'ipPermitida': this.empleadoSelect.usuario.ipPermitida,

      'email': [this.empleadoSelect.usuario.email]
    });
  }

  onSelectionBP(event) {

    this.empleadoSelect = <Empleado>event;
    this.bussinessParner.patchValue({ 'id': this.empleadoSelect.id,
    'primerNombre': this.empleadoSelect.primerNombre,
    'segundoNombre': this.empleadoSelect.segundoNombre,
    'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
    'corporativePhone': this.empleadoSelect.corporativePhone,
    'area': this.empleadoSelect.area,
    'cargoId': this.empleadoSelect.cargo.id,  
    //'ipPermitida': this.empleadoSelect.usuario.ipPermitida,

    'email': [this.empleadoSelect.usuario.email]})

  }


  onSelectionJI(event){
    this.empleadoSelect = <Empleado>event;
    this.jefeInmediato.patchValue({ 'id': this.empleadoSelect.id,
    'primerNombre': this.empleadoSelect.primerNombre,
    'segundoNombre': this.empleadoSelect.segundoNombre,
    'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
    'corporativePhone': this.empleadoSelect.corporativePhone,
    'area': this.empleadoSelect.area,
    'cargoId': this.empleadoSelect.cargo.id,  
    //'ipPermitida': this.empleadoSelect.usuario.ipPermitida,

    'email': [this.empleadoSelect.usuario.email]})

  }
}
