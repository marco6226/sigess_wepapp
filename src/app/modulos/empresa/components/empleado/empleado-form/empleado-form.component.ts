import { Component, OnInit, Output, EventEmitter, Input, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { Area } from 'app/modulos/empresa/entities/area';
import { ConfiguracionJornada } from 'app/modulos/empresa/entities/configuracion-jornada';
import { Jornada } from 'app/modulos/empresa/entities/jornada';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { UsuarioEmpresa } from 'app/modulos/empresa/entities/usuario-empresa';
import { Perfil } from 'app/modulos/empresa/entities/perfil';
import { Message, SelectItem } from 'primeng/primeng';
import { tipo_identificacion, tipo_vinculacion, locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';

import { Enumeracion } from 'app/modulos/comun/entities/enumeracion';
import { Eps } from 'app/modulos/comun/entities/eps';
import { Afp } from 'app/modulos/comun/entities/afp';
import { Ccf } from 'app/modulos/comun/entities/ccf';

import { SesionService } from 'app/modulos/core/services/sesion.service';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { EnumeracionesService } from 'app/modulos/comun/services/enumeraciones.service';
import { ComunService } from 'app/modulos/comun/services/comun.service';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { UsuarioService } from 'app/modulos/admin/services/usuario.service';

import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { FileUploaderComponent } from 'app/modulos/core/components/file-uploader/file-uploader.component';

import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion';
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion';
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion';
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Formulario } from 'app/modulos/comun/entities/formulario';
import { FormularioConstructorComponent } from 'app/modulos/comun/components/formulario-constructor/formulario-constructor.component';

import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service';

import { TareaService } from 'app/modulos/sec/services/tarea.service';
import { SeguimientosService } from 'app/modulos/sec/services/seguimientos.service';


@Component({
    selector: 's-empleadoForm',
    templateUrl: './empleado-form.component.html',
    styleUrls: ['./empleado-form.component.scss'],
    providers: [UsuarioService],
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
    jefeForm: FormGroup;
    businessForm: FormGroup;
    empleadosList = [];
    empresaId = this.sesionService.getEmpresa().id;
    fechaActual = new Date();
    jefeInmediatoForm: FormGroup;
    yearRange: string = '1900:' + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    tipoIdentificacionList: SelectItem[];
    tipoVinculacionList: SelectItem[];
    epsList: SelectItem[];
    afpList: SelectItem[];
    cargoList: SelectItem[];
    perfilList: SelectItem[] = [];
    loaded: boolean;
    empleado;
    solicitando: boolean = false;

    msgs: Message[];
    imagenesList: any[];
    imagenesPath: any;
    numMaxImg = 1;
    avatar: any;
    listaEvidence = [];


    constructor(
        private empleadoService: EmpleadoService,
        private fb: FormBuilder,
        private sesionService: SesionService,
        private enumeracionesService: EnumeracionesService,
        private comunService: ComunService,
        private cargoService: CargoService,
        private usuarioService: UsuarioService,

        private perfilService: PerfilService,
        private domSanitizer: DomSanitizer,

        private directorioService: DirectorioService,
        //private fileUploaderComponent: FileUploaderComponent,
        private _sanitizer: DomSanitizer
    ) {
        let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
        this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
        this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);

        this.businessForm = fb.group({
            id: ['', Validators.required],
            numeroIdentificacion: ['', Validators.required],
            primerNombre: [{ value: '', disabled: true }, Validators.required],
            primerApellido: { value: '', disabled: true },
            email: { value: '', disabled: true },
            direccionGerencia: { value: '', disabled: true },
            correoPersonal: { value: '', disabled: true },
            cargoId: [{ value: '', disabled: true }, Validators.required],
        });

        this.jefeInmediatoForm = fb.group({
            id: ['', Validators.required],
            numeroIdentificacion: ['', Validators.required],
            primerNombre: [{ value: '', disabled: true }, Validators.required],
            primerApellido: { value: '', disabled: true },
            email: { value: '', disabled: true },
            direccionGerencia: { value: '', disabled: true },
            correoPersonal: { value: '', disabled: true },
            cargoId: [{ value: '', disabled: true }, Validators.required],
        });
        this.form = fb.group({
            id: [null],
            primerNombre: [null, Validators.required],
            segundoNombre: null,
            primerApellido: [null, Validators.required],
            segundoApellido: null,
            codigo: [null],
            direccion: [null],
            fechaIngreso: [null, Validators.required],
            fechaNacimiento: [null],
            genero: [null],
            numeroIdentificacion: [null, Validators.required],
            telefono1: [null],
            telefono2: [null],
            afp: [null],
            emergencyContact: [null],
            corporativePhone: [null],
            phoneEmergencyContact: [null],
            emailEmergencyContact: [null],
            ccf: [null],
            ciudad: [null],
            eps: [null],
            tipoIdentificacion: [null, Validators.required],
            tipoVinculacion: [null],
            zonaResidencia: [null],
            area: [null, Validators.required],
            cargoId: [null, Validators.required],
            perfilesId: [null, Validators.required],
            ipPermitida: [],
            email: [null, { disabled: true }, Validators.required],
            direccionGerencia: [null],
            regional: [null],
            businessPartner: [''],
            jefeInmediato: [''],
            correoPersonal: [null],
            ciudadGerencia: [null],
        });
    }

    ngOnInit() {
        this.isUpdate ? this.form.controls['email'].disable() : ''; //this for disabled email in case of update
        if (this.empleadoSelect != null) {
            let fq = new FilterQuery();
            fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.empleadoSelect.id, value2: null }];
            //console.log(fq,this.empleadoSelect.id);
            this.empleadoService.findByFilter(fq).then((resp) => {
                this.empleadoSelect = <Empleado>resp['data'][0];
                this.loaded = true;
                console.log(this.empleadoSelect);
                if (this.empleadoSelect.businessPartner) {
                    this.onSelectionBP(this.empleadoSelect.businessPartner);
                }
                if (this.empleadoSelect.jefeInmediato) {
                    this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
                }
                this.form.patchValue({
                    id: this.empleadoSelect.id,
                    primerNombre: this.empleadoSelect.primerNombre,
                    segundoNombre: this.empleadoSelect.segundoNombre,
                    primerApellido: this.empleadoSelect.primerApellido,
                    segundoApellido: this.empleadoSelect.segundoApellido,
                    codigo: this.empleadoSelect.codigo,
                    direccion: this.empleadoSelect.direccion,
                    fechaIngreso: this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
                    fechaNacimiento: this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
                    genero: this.empleadoSelect.genero,
                    numeroIdentificacion: this.empleadoSelect.numeroIdentificacion,
                    telefono1: this.empleadoSelect.telefono1,
                    telefono2: this.empleadoSelect.telefono2,
                    afp: this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
                    ciudad: this.empleadoSelect.ciudad,
                    eps: this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
                    tipoIdentificacion: this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
                    tipoVinculacion: this.empleadoSelect.tipoVinculacion,
                    zonaResidencia: this.empleadoSelect.zonaResidencia,
                    area: this.empleadoSelect.area,
                    cargoId: this.empleadoSelect.cargo.id,
                    perfilesId: [4],
                    corporativePhone: this.empleadoSelect.corporativePhone,
                    emergencyContact: this.empleadoSelect.emergencyContact,
                    phoneEmergencyContact: this.empleadoSelect.phoneEmergencyContact,
                    emailEmergencyContact: this.empleadoSelect.emailEmergencyContact,
                    direccionGerencia: this.empleadoSelect.direccionGerencia,
                    regional: this.empleadoSelect.regional,
                    correoPersonal: this.empleadoSelect.correoPersonal,
                    ciudadGerencia: this.empleadoSelect.ciudadGerencia,
                    jefeInmediato: this.empleadoSelect.jefeInmediato,
                    'ipPermitida': this.empleadoSelect.usuario.ipPermitida,
                    businessPartner: this.empleadoSelect.businessPartner,
                    email: [this.empleadoSelect.usuario.email],
                });
            });
            //cargar imagen
        } else {
            this.loaded = true;
            let area: any;
            //console.log("new register");
            this.form.patchValue({ area: area });
            this.editable = true;
        }
        this.comunService.findAllAfp().then((data) => {
            this.afpList = [];
            this.afpList.push({ label: '--Seleccione--', value: null });
            (<Afp[]>data).forEach((afp) => {
                this.afpList.push({ label: afp.nombre, value: afp.id });
            });
        });
        this.comunService.findAllEps().then((data) => {
            this.epsList = [];
            this.epsList.push({ label: '--Seleccione--', value: null });
            (<Eps[]>data).forEach((eps) => {
                this.epsList.push({ label: eps.nombre, value: eps.id });
            });
        });

        this.cargoService.findAll().then((resp) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
            //this.cargoList = this.cargoList.slice();
        });
        this.perfilService.findAll().then((resp) => {
            (<Perfil[]>resp['data']).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 500);
        });
        this.getTareaEvidences();
    }

    async buildPerfilesIdList() {
        ////console.log(this.empleadoSelect.id, "181");
        let filterQuery = new FilterQuery();
        filterQuery.filterList = [
            {
                field: 'usuarioEmpresaList.usuario.id',
                criteria: Criteria.EQUALS,
                value1: this.empleadoSelect.usuario.id,
                value2: null,
            },
        ];
        this.perfilService.update;
        await this.perfilService.findByFilter(filterQuery).then((resp) => {
            let perfilesId = [];
            resp['data'].forEach((ident) => perfilesId.push(ident.id));

            console.log(resp['data']);
            this.form.patchValue({ perfilesId: perfilesId });
        });
    }

    onSubmit() {
        let empleado = new Empleado();
        console.log(this.form.value, 'asdlasdñad');
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
        empleado.ciudadGerencia = this.form.value.ciudadGerencia;
        (empleado.regional = this.form.value.regional), (empleado.correoPersonal = this.form.value.correoPersonal);

        if (this.form.value.businessPartner) {
            empleado.businessPartner = this.form.value.businessPartner.id;
        }
        if (this.form.value.jefeInmediato) {
            console.log('empleado existe');
            empleado.jefeInmediato = this.form.value.jefeInmediato.id;
        }
        empleado.direccionGerencia = this.form.value.direccionGerencia;
        console.log(this.form.value.jefeInmediato);

        // //console.log(this.form.value.ipPermitida);
        empleado.usuario.ipPermitida = [];
        empleado.usuario.usuarioEmpresaList = [];

        this.form.value.perfilesId.forEach((perfilId) => {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfilId;
            empleado.usuario.usuarioEmpresaList.push(ue);
        });
        this.solicitando = true;
        if (this.isUpdate) {
            empleado.usuario.id = this.empleadoSelect.usuario.id;
            console.log(empleado.usuario);
            this.usuarioService
                .update(empleado.usuario)
                .then((resp) => {
                    console.log(resp);
                    this.solicitando = false;
                })
                .catch((err) => {
                    this.solicitando = false;
                });
            this.empleadoService
                .update(empleado)
                .then((data) => {
                    this.manageUpdateResponse(<Empleado>data);
                    this.solicitando = false;
                    //agregar firma
                    if (this.imagenesList != null) {
                        this.imagenesList.forEach(async (imgObj) => {
                            let resp = await this.directorioService.uploadv5(imgObj.file, null, 'EMP', this.empleadoSelect.id, null, 'PUBLICO');
                            let respid = Object.values(resp);

                            this.directorioService.uploadv3(respid[0], this.empleadoSelect.id, 'EMP');
                        });
                    }
                })
                .catch((err) => {
                    this.solicitando = false;
                });
        } else {
            this.empleadoService
                .create(empleado)
                .then((data) => {
                    this.manageCreateResponse(<Empleado>data);
                    this.solicitando = false;
                    //agregar firma
                    if (this.imagenesList != null) {
                        this.imagenesList.forEach(async (imgObj) => {
                            let resp = await this.directorioService.uploadv5(imgObj.file, null, 'EMP', this.empleadoSelect.id, null, 'PUBLICO');
                            let respid = Object.values(resp);

                            this.directorioService.uploadv3(respid[0], this.empleadoSelect.id, 'EMP');
                        });
                    }
                })
                .catch((err) => {
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

    // Component methods
    buscarEmpleado(event) {
        this.empleadoService.buscar(event.query).then((data) => (this.empleadosList = <Empleado[]>data));
    }
    onSelectionBP(event) {
        let empleado = <Empleado>event;
        this.form.patchValue({ businessPartner: empleado });
        this.businessForm.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            ipPermitida: empleado.usuario.ipPermitida,
            direccionGerencia: empleado.direccionGerencia,

            email: [empleado.usuario.email],
        });
    }
    /** MÉTODOS JORNADA */
    onSelectionJefeInmediato(event) {
        let empleado = <Empleado>event;
        this.form.patchValue({ jefeInmediato: empleado });
        console.log(this.form.value);
        this.jefeInmediatoForm.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            direccionGerencia: empleado.direccionGerencia,

            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            ipPermitida: empleado.usuario.ipPermitida,
            email: [empleado.usuario.email],
        });
    }

    onArchivoSelect(event) {
        let file = event.target.files[0];
        this.msgs = [];
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
            this.msgs.push({ severity: 'error', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg' });
            return;
        }
        if (file.size > 3_500_000) {
            this.msgs.push({ severity: 'error', summary: 'Tamaño máximo superado 3.5 MB', detail: 'La imágen supera el tamaño máximo permitido' });
            return;
        }
        if (this.imagenesList == null) this.imagenesList = [];

        if (this.imagenesList.length >= this.numMaxImg) {
            this.msgs.push({
                severity: 'warn',
                summary: 'Número maximo de fotografias alcanzado',
                detail: 'Ha alcanzado el número máximo de fotografias (' + this.numMaxImg + ') que puede adjuntar',
            });
            return;
        }
        let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.imagenesList.push({ source: urlData, file: file });
        this.imagenesList = this.imagenesList.slice();
        console.log(this.imagenesList);
    }

    async getTareaEvidences() {
        try {
            let res: any = await this.empleadoService.getFirma(this.empleadoSelect.id);
            console.log(res);
            if (res) {
                res.files.forEach(async (evidence) => {
                    let ev: any = await this.directorioService.download(evidence);
                    console.log(ev);
                    console.log("evidence",evidence);
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                   
                    reader.onloadend = () => {
                        if (ev) {
                            console.log(reader.result);
                            this.avatar=reader.result;
                            console.log("avatar",this.avatar);
                            this.listaEvidence.push(reader.result);


                            if (this.imagenesList == null) this.imagenesList = [];
                           // this.imagenesList.push(reader.result);
                         //   this.imagenesList.push({
                          //      source: 'data:application/octet-stream;base64,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',
                          //  });
                            this.imagenesList = this.imagenesList.slice();
                            this.imagenesPath = this._sanitizer.bypassSecurityTrustResourceUrl(this.avatar);
                            console.log("limpia",this.imagenesPath);


                            //this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + toReturnImage.base64string);
                        } else {
                            throw new Error('Ocurrió un problema al consultar la firma del empleado');
                        }
                        console.log(this.imagenesList);
                    };
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
