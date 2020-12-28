import { Component, OnInit, Output, EventEmitter, Input, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { Area } from 'app/modulos/empresa/entities/area'
import { ConfiguracionJornada } from 'app/modulos/empresa/entities/configuracion-jornada'
import { Jornada } from 'app/modulos/empresa/entities/jornada'
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { UsuarioEmpresa } from 'app/modulos/empresa/entities/usuario-empresa'
import { Perfil } from 'app/modulos/empresa/entities/perfil'
import { SelectItem } from 'primeng/primeng'
import { tipo_identificacion, tipo_vinculacion, locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'

import { Enumeracion } from 'app/modulos/comun/entities/enumeracion'
import { Eps } from 'app/modulos/comun/entities/eps'
import { Afp } from 'app/modulos/comun/entities/afp'
import { Ccf } from 'app/modulos/comun/entities/ccf'


import { SesionService } from 'app/modulos/core/services/sesion.service'
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import { EnumeracionesService } from 'app/modulos/comun/services/enumeraciones.service'
import { ComunService } from 'app/modulos/comun/services/comun.service'
import { CargoService } from 'app/modulos/empresa/services/cargo.service'
import { PerfilService } from 'app/modulos/admin/services/perfil.service'
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { UsuarioService } from 'app/modulos/admin/services/usuario.service';

@Component({
    selector: 's-empleadoForm',
    templateUrl: './empleado-form.component.html',
    styleUrls: ['./empleado-form.component.scss'],
    providers: [UsuarioService]
})
export class EmpleadoFormComponent implements OnInit {


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
            'emergencyContact': [null],
            "corporativePhone": [null],
            'phoneEmergencyContact': [null],
            'emailEmergencyContact': [null],
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
            'email': [null, { disabled: true }, Validators.required]
        });
    }

    ngOnInit() {
        this.isUpdate ? this.form.controls['email'].disable() : ""; //this for disabled email in case of update
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
            let area: any;
            //console.log("new register");
            this.form.patchValue({ 'area': area });
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
                if (this.isUpdate === true || this.show === true) setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 500);

            }
        );

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
                this.form.patchValue({ perfilesId: perfilesId })
            })


    }

    onSubmit() {
        let empleado = new Empleado();
        empleado.id = this.form.value.id;
        empleado.primerNombre = this.form.value.primerNombre;
        empleado.segundoNombre = this.form.value.segundoNombre;
        empleado.primerApellido = this.form.value.primerApellido;
        empleado.segundoApellido = this.form.value.segundoApellido;
        empleado.codigo = this.form.value.codigo;
        empleado.direccion = this.form.value.direccion;
        empleado.fechaIngreso = this.form.value.fechaIngreso;
        empleado.emergencyContact = this.form.value.emergencyContact;
        empleado.corporativePhone = this.form.value.corporativePhone;
        empleado.phoneEmergencyContact = this.form.value.phoneEmergencyContact;
        empleado.emailEmergencyContact = this.form.value.emailEmergencyContact;
        empleado.fechaNacimiento = this.form.value.fechaNacimiento;
        empleado.genero = this.form.value.genero;
        empleado.numeroIdentificacion = this.form.value.numeroIdentificacion;
        empleado.telefono1 = this.form.value.telefono1;
        empleado.telefono2 = this.form.value.telefono2;
        empleado.ciudad = this.form.value.ciudad == null ? null : this.form.value.ciudad.id;
        if (this.form.value.afp != null) {
            empleado.afp = new Afp();
            empleado.afp.id = this.form.value.afp;
        }
        if (this.form.value.eps != null) {
            empleado.eps = new Eps();
            empleado.eps.id = this.form.value.eps;
        }
        empleado.tipoIdentificacion = this.form.value.tipoIdentificacion;
        empleado.tipoVinculacion = this.form.value.tipoVinculacion;
        empleado.zonaResidencia = this.form.value.zonaResidencia;
        empleado.area = new Area();
        empleado.cargo = new Cargo();
        empleado.usuario = new Usuario();
        empleado.area.id = this.form.value.area.id;
        empleado.cargo.id = this.form.value.cargoId;
        empleado.usuario.email = this.form.value.email;
  
        // //console.log(this.form.value.ipPermitida);
        // empleado.usuario.ipPermitida = this.form.value.ipPermitida;
        empleado.usuario.usuarioEmpresaList = [];

        this.form.value.perfilesId.forEach(perfilId => {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfilId;
            empleado.usuario.usuarioEmpresaList.push(ue);
        });
        this.solicitando = true;
        if (this.isUpdate) {
      empleado.usuario.id = this.empleadoSelect.usuario.id;
            console.log(empleado.usuario);
            this.usuarioService.update(empleado.usuario)
                .then(resp => {
                    console.log(resp);
                    this.solicitando = false;
                })
                .catch(err => {
                    this.solicitando = false;
                });;
            this.empleadoService.update(empleado)
                .then(data => {
                    this.manageUpdateResponse(<Empleado>data);
                    this.solicitando = false;
                })
                .catch(err => {
                    this.solicitando = false;
                });
        } else {
            this.empleadoService.create(empleado)
                .then(data => {
                    this.manageCreateResponse(<Empleado>data);
                    this.solicitando = false;
                })
                .catch(err => {
                    this.solicitando = false;
                });
        }
    }

    manageUpdateResponse(empleado: Empleado) {
        this.onEmpleadoUpdate.emit({ empleado });
    }

    manageCreateResponse(empleado: Empleado) {
        this.onEmpleadoCreate.emit({ empleado });
    }

    closeForm() {
        this.onCancel.emit();
    }

    /** MÉTODOS JORNADA */

}




