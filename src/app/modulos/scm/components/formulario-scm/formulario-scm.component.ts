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

@Component({
  selector: 'app-formulario-scm',
  templateUrl: './formulario-scm.component.html',
  styleUrls: ['./formulario-scm.component.scss']
})
export class FormularioScmComponent implements OnInit {
    value;
    cedula = "TANGAMANDAPIO";
    empleado : Empleado;
    empleadosList: Empleado[];
    @Output() onEmpleadoCreate = new EventEmitter();
    @Output() onEmpleadoUpdate = new EventEmitter();
    @Output() onCancel = new EventEmitter();
    @Input() empleadoSelect: Empleado;
    @Input() isUpdate: boolean;
    @Input() show: boolean;
    @Input() editable: boolean;
    form: FormGroup;
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
  
    solicitando: boolean = false;
  
    constructor(
      private empleadoService: EmpleadoService,
      private fb: FormBuilder,
      private sesionService: SesionService,
      private enumeracionesService: EnumeracionesService,
      private comunService: ComunService,
      private cargoService: CargoService,
      private usuarioService: UsuarioService,
  
      private perfilService: PerfilService,
  
    ) {
      let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
      this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
      this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);
  
      this.form = fb.group({
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
    }
  
    ngOnInit() {
      this.isUpdate ? this.form.controls['email'].disable() : "" ; //this for disabled email in case of update
      if (this.empleadoSelect != null) {
        let fq = new FilterQuery();
        fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.empleadoSelect.id, value2: null }];
       // //console.log(fq);
        this.empleadoService.findByFilter(fq).then(
          resp => {
            this.empleadoSelect = <Empleado>(resp['data'][0]);
            this.loaded = true;
            console.log(this.empleadoSelect);
            this.form.patchValue({
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
        this.form.patchValue({'area': area});
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
      
    onSubmit(){}
  
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
          this.form.patchValue({perfilesId: perfilesId})
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
    this.form.patchValue({'numeroIdentificacion': this.value.numeroIdentificacion})
    console.log(this.value);
  }
}
