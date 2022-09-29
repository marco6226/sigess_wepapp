import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    OnDestroy,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Arl } from 'app/modulos/comun/entities/arl';
import { PerfilService } from "app/modulos/admin/services/perfil.service";
import { UsuarioService } from "app/modulos/admin/services/usuario.service";
import { Afp } from "app/modulos/comun/entities/afp";
import { Eps } from "app/modulos/comun/entities/eps";
import { Prepagadas } from "app/modulos/comun/entities/prepagadas";
import { ComunService } from "app/modulos/comun/services/comun.service";
import { EnumeracionesService } from "app/modulos/comun/services/enumeraciones.service";
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { FilterQuery } from "app/modulos/core/entities/filter-query";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { Cargo } from "app/modulos/empresa/entities/cargo";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import { Perfil } from "app/modulos/empresa/entities/perfil";
import { CargoService } from "app/modulos/empresa/services/cargo.service";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import {
    locale_es,
    tipo_identificacion,
    tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem, Message } from "primeng/api";
import { CasosMedicosService } from "../../services/casos-medicos.service";
import * as moment from "moment";
import { UsuarioEmpresa } from "app/modulos/empresa/entities/usuario-empresa";
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Area } from "app/modulos/empresa/entities/area";
import { Usuario } from "app/modulos/empresa/entities/usuario";
import { epsorarl } from "../../entities/eps-or-arl";
import { Subject } from "rxjs";
import { ConfirmationService } from "primeng/api";
import { ConfirmService } from "app/modulos/scm/components/formulario-scm/confirm.service";
import { ActivatedRoute } from "@angular/router";
import { Proveedor } from "app/modulos/comun/entities/proveedor";
import { Router } from '@angular/router';

import { SortOrder } from "app/modulos/core/entities/filter";

export interface TreeNode {
    data?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
}
@Component({
    selector: "app-formulario-scm",
    templateUrl: "./formulario-scm.component.html",
    styleUrls: ["./formulario-scm.component.scss"],
    providers: [DirectorioService, EmpresaService]
})
export class FormularioScmComponent implements OnInit, OnDestroy {
    

    listaPCL;
    itemInPCL:boolean=false;

    empresasList: Empresa[];
    styleMap: { [key: string]: string } = {};
    value;
    msgs: Message[];
    recoClick: boolean = false;
    edad;
    incapacidades = [];
    imagenesList = [];
    imgMap: any = {};
    casoSeleccionado;
    createCase;
    casosList: any[] = [];
    colsActionList: any[];
    numMaxImg = 3;
    loadingImg = false;
    modalRecomendatios = false;
    modalSeguimientos = false;
    modalDianostico = false;
    casoMedicoForm: FormGroup;
    bussinessParner: FormGroup;
    jefeInmediato: FormGroup;
    cedula = "";
    cargoDescripcion: string;
    actualizar: boolean;
    adicionar: boolean;
    empleado: Empleado;
    empresa: Empresa;
    tipoTratamientos: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { value: 0, label: "Otros" },
        { value: 1, label: "Terapias" },
        { value: 2, label: "Quirúrgico" },
        { value: 3, label: "Paraclínicos" },
        { value: 4, label: "Medicamentos" }];
    recomendationList: TreeNode[];
    seguimientosList: TreeNode[];
    logsList = []
    empleadosList: Empleado[];
    diagnosticoList = [];
    modifyDiag = false;
    seguimientos = [];
    tratamientos = [];
    products2 = [];
    statuses: SelectItem[];
    emitPclentity = [
        { label: "--Seleccione--", value: null },
        { label: "EPS", value: "EPS" },
        { label: "ARL", value: "ARL" },
        { label: "AFP", value: "AFP" },
        { label: "Junta Regional", value: "Junta Regional" },
        { label: "Junta Nacional", value: "Junta Nacional" }]

    conceptoRehabilitacion = [
        { label: "--Seleccione--", value: null },
        { label: "Favorable", value: "1" },
        { label: "Desfavorable", value: "2" },
        { label: "No Aplica", value: "3" },
    ]

    entityConceptoRehabilitacion = [
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "EPS" },

        ],
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "ARL" },
        ],
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "ARL" },
        ],

        [
            { label: "No Aplica", value: "No Aplica" },

        ],
    ]


    professionalAreaList = [
        { label: "--Seleccione--", value: null },
        { label: "Enfermeros", value: "Enfermeros" },
        { label: "Farmacéuticos", value: "Farmacéuticos" },
        { label: "Fisioterapeutas", value: "Fisioterapeutas" },
        { label: "Logopedas", value: "Logopedas" },
        { label: "Obstetricia", value: "Obstetricia" },
        { label: "Médicos", value: "Médicos" },
        { label: "Nutricionistas", value: "Nutricionistas" },
        { label: "Odontólogos", value: "Odontólogos" },
        { label: "Ópticos y optometristas", value: "Ópticos y optometristas" },
        { label: "Podólogos", value: "Podólogos" },
        { label: "Psicólogos", value: "Psicólogos" },
        { label: "Terapia ocupacional", value: "Terapia ocupacional" }

    ]
    
    @Input() empleadoSelect: Empleado;
    @Output() onEmpleadoUpdate = new EventEmitter();
    @Output() onCancel = new EventEmitter();
    @Input() caseSelect: any;
    @Input() isUpdate: boolean;
    @Input() show: boolean;
    @Input() consultar: boolean = false;
    @Input("disabled") disabled: boolean = false;
    @Input() editable: boolean;
    @ViewChild("autocomplete", { static: true }) autoC: ElementRef;
    rangoAntiguedad = [
        { label: "Entre 1 y 5 años", range: "1,2,3,4,5" },
        { label: "Entre 6 y 10 años", range: "6,7,8,9,10" },
        { label: "Entre 11 y 15 años", range: "11,12,13,14,15" },
        { label: "Entre 16 y 20 años", range: "16,17,18,19,20" },
        { label: "Mayor a 20", range: "21,22,23,24,25,26,27,28,29" },
    ]
    division:string=null;
    empleadoForm: FormGroup;
    empresaId = this.sesionService.getEmpresa().id;
    fechaActual = new Date();
    logSelected;
    status;
    recoSelect: any;
    diagSelect: any;
    seguiSelect: any;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    tipoIdentificacionList: SelectItem[];
    tipoVinculacionList: SelectItem[];
    epsList: SelectItem[];
    arlList: SelectItem[];
    afpList: SelectItem[];
    prepagadasList: SelectItem[];
    provsaludList: SelectItem[];
    sveOptionList: SelectItem[] = [];
    cargoList: SelectItem[];
    casocreado = false;
    caseStatus = [
        { label: "Abierto", value: "1" },
        { label: "Cerrado", value: "0" },
    ];
    perfilList: SelectItem[] = [];
    loaded: boolean;
    antiguedad;
    arl;
    range;
    jefeNames = " ";
    businessNames = "";
    nameAndLastName = "";
    solicitando: boolean = false;
    departamento;
    entity: epsorarl = { EPS: [], ARL: [], AFP: [], Medicina_Prepagada: [], Proveedor_de_salud: [] };
    tipoOptionList = [
        { label: "--Seleccione--", value: null },
        { label: "Medico", value: "Medico" },
        { label: "Juridico", value: "Juridico" },
        { label: "Otros", value: "Otros" },

    ]
    prioridadOptionList = [
        { label: "--Seleccione--", value: null },
        { label: "Alta", value: "Alta" },
        { label: "Media", value: "Media" },
        { label: "Baja", value: "Baja" },

    ]
    caseOptionList = [
        { label: "--Seleccione--", value: null },
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
        { label: "En Seguimiento", value: "2" },
        { label: "No Aplica", value: "3" },

    ]
    IntervencionOptionList = [
        { label: "--Seleccione--", value: null },
        { label: "Si", value: "1" },
        { label: "No", value: "0" },


    ]

    caseMotivoOptionListt = [
        [
            { label: "Fallecimiento", value: "Fallecimiento" },
            { label: "Reintegro", value: "Reintegro" },
            { label: "Pensíon", value: "Pensíon" },
            { label: "Desvinculacion", value: "Desvinculacion" },
        ],
        [
            { label: "Critico", value: "Critico" },
            { label: "Seguimiento", value: "Seguimiento" },
            { label: "Pre - Mesa", value: "Pre - Mesa" },
            { label: "Cerrado", value: "Cerrado" },

        ],

    ]


    pclOptionList = [
        { label: "--Seleccione--", value: null },
        { label: "En Calificación", value: "1" },
        { label: "En Firme", value: "2" },
        { label: "En Apelación", value: "0" }
    ]
    entityOptionList = [
        
        { label: "EPS", value: "EPS" },
        { label: "ARL", value: "ARL" },
        { label: "Medicina prepagada", value: "Medicina_prepagada" },
        { label: "Proveedor de salud", value: "Proveedor_de_salud" }
    ]

    pclCalificacionList = [
        { label: "--Seleccione--", value: null },
        { label: "En Proceso", value: "1" },
        { label: "En Firme", value: "2" },
        { label: "En Apelación", value: "0" }
    ]
    constructor(
        private empleadoService: EmpleadoService,
        fb: FormBuilder,
        private sesionService: SesionService,
        private comunService: ComunService,
        private cargoService: CargoService,
        private usuarioService: UsuarioService,
        private scmService: CasosMedicosService,
        private perfilService: PerfilService,
        private confirmService: ConfirmService,
        private route: ActivatedRoute,
        private router: Router,
    ) {

        this.empresa = this.sesionService.getEmpresa();

        let defaultItem = <SelectItem[]>[{ label: "--seleccione--", value: null }];
        this.tipoIdentificacionList = defaultItem.concat(
            <SelectItem[]>tipo_identificacion
        );

        this.tipoVinculacionList = defaultItem.concat(
            <SelectItem[]>tipo_vinculacion
        );

        //Instaciacion de datos de form
        this.bussinessParner = fb.group({
            id: ["", Validators.required],
            numeroIdentificacion: ["", Validators.required],
            primerNombre: [{ value: "", disabled: true }, Validators.required],
            segundoNombre: { value: "", disabled: true },
            email: { value: "", disabled: true },
            corporativePhone: [{ value: "", disabled: true }],
            cargoId: [{ value: "", disabled: true }, Validators.required],
            direccionGerencia: [{value: " ",  disabled: true}]

        });
        this.jefeInmediato = fb.group({
            id: ["", Validators.required],
            numeroIdentificacion: ["", Validators.required],
            primerNombre: [{ value: "", disabled: true }, Validators.required],
            segundoNombre: { value: "", disabled: true },
            email: { value: "", disabled: true },
            corporativePhone: [{ value: "", disabled: true }],
            cargoId: [{ value: "", disabled: true }, Validators.required],
            direccionGerencia: [{value: "",  disabled: true}]

        });
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
            'afp': [null],
            'emergencyContact': [null],
            "corporativePhone": [null],
            'phoneEmergencyContact': [null],
            'emailEmergencyContact': [null],
            'ccf': [null],
            'ciudad': [null],
            'eps': [null],
            'arl': [null],
            'tipoIdentificacion': [null, Validators.required],
            'tipoVinculacion': [null],
            'zonaResidencia': [null],
            'area': [null, Validators.required],
            'cargoId': [null, Validators.required],
            'perfilesId': [null, Validators.required],
            'email': [{ value: "", disabled: true }, Validators.required],
            direccionGerencia: [null],
            regional: [null],
            businessPartner: [null],
            jefeInmediato: [null],
            correoPersonal: [null],
            ciudadGerencia: [null],
            division:[null],
        });

        this.casoMedicoForm = fb.group({
            id: [null],
            documento: [null, Validators.required],
            codigoCie10: [null, /*Validators.required*/],
            razon: [{ value: null, disabled: this.disabled }, /*Validators.required*/],
            names: [null, /*Validators.required*/],
            observaciones: [null, /*Validators.required*/],
            //if(){}
            statusCaso: ["1", /*Validators.required*/],
            requiereIntervencion: [null, /*Validators.required*/],
            professionalArea: [null, /*Validators.required*/],
            porcentajePcl: [null, /*Validators.required*/],
            pcl: [null, /*Validators.required*/],
            region: [null],
            ciudad: [null],
            entidadEmitida: [null],
            entidadEmitidaTwo: [null],
            cargo: [null],
            descripcionCompletaCaso: [null, /*Validators.required*/],
            eliminado: [false, /*Validators.required*/],
            fechaCalificacion: [null, /*Validators.required*/],
            sve: [null, /*Validators.required*/],
            pkUser: [null, Validators.required],
            diagnostico: [null, /*Validators.required*/],
            origen: [null, /*Validators.required*/],
            fechaConceptRehabilitacion: [null, /*Validators.required*/],
            fechaConceptRehabilitacionTwo: [null, /*Validators.required*/],
            emisionPclFecha: [null, /*Validators.required*/],
            entidadEmiteConcepto: [null, /*Validators.required*/],
            entidadEmiteConceptoTwo: [null, /*Validators.required*/],
            justification: [null, /*Validators.required*/],
            statusDeCalificacion: [null, /*Validators.required*/],
            casoMedicoLaboral: [null, /*Validators.required*/],
            fechaFinal: [null, /*Validators.required*/], sistemaAfectado: [null, /*Validators.required*/],
            fechaCreacion: [null],
            entidadEmiteCalificacion: [null, /*Validators.required*/],
            pclEmitEntidad: [null, /*Validators.required*/],
            conceptRehabilitacion: [null, /*Validators.required*/],
            conceptRehabilitacionTwo: [null, /*Validators.required*/],
            tipoCaso: [null, /*Validators.required*/],
            prioridadCaso: [null, /*Validators.required*/],
            descripcionCargo: [null]
        });
        console.log(this.casoMedicoForm)
        this.status = this.caseStatus.find(sta => sta.value == this.casoMedicoForm.get("statusCaso").value).label

    }

    ngOnDestroy(): void {
        localStorage.removeItem('scmShowCase');
    }

    get pkUse() {
        return this.casoMedicoForm.get("pkUser") as FormControl
    }

    get disableRazon() {
        if (this.casoMedicoForm.value.casoMedicoLaboral === 2 || this.casoMedicoForm.value.casoMedicoLaboral === 3) {
            return true;
        }
        return false;
    }

    async ngOnInit() {
        this.colsActionList = [
            { field: 'status', header: 'Estado' },
            { field: 'recomendaciones', header: 'Nombre de la recomendacion' },
            { field: 'fechaExpiracion', header: 'Fecha Finalizacion' }
        ];

        this.consultar = (localStorage.getItem('scmShowCase') === 'true') ? true : false;

        //console.log(this.caseSelect.id, "wenas");

        try {
            console.log("entro");
           // 

           // if (this.caseSelect) {
                let res: any = await this.scmService.getSvelist();
                this.sveOptionList.push({ label: "--Seleccione--", value: null });
                res.forEach((sve) => {
                    this.sveOptionList.push({ label: sve.nombre, value: sve.id.toString() });
                });
                
                this.caseSelect = await this.scmService.getCase(this.route.snapshot.paramMap.get("id"));
                this.onLoadInit();
                this.modifyCase();
          //  }
        } catch (e) {
            console.log(e);
        }


        if (this.consultar) {
            this.onLoadInit();
            this.modifyCase();
            this.empleadoForm.disable();
            this.bussinessParner.disable();
            this.casoMedicoForm.disable();
            this.empleadoForm.disable();

        }

        await this.comunService.findAllAfp().then((data) => {
            this.afpList = [];
            this.afpList.push({ label: "--Seleccione--", value: null });
            (<Afp[]>data).forEach((afp) => {
                this.afpList.push({ label: afp.nombre, value: afp.id });
            });
            this.entity.AFP = this.afpList;

        });

        await this.comunService.findAllEps().then((data) => {
            this.epsList = [];
            this.epsList.push({ label: "--Seleccione--", value: null });
            (<Eps[]>data).forEach((eps) => {
                this.epsList.push({ label: eps.nombre, value: eps.id });

            });
            this.entity.EPS = this.epsList;
        });

        await this.comunService.findAllArl().then((data) => {
            this.arlList = [];
            this.arlList.push({ label: "--Seleccione--", value: null });
            (<Arl[]>data).forEach((arl) => {
                this.arlList.push({ label: arl.nombre, value: arl.id });
            });
            this.entity.ARL = this.arlList;
            console.log(this.arlList);
        });

        await this.comunService.findAllPrepagadas().then((data) => {
            this.prepagadasList = [];
            this.prepagadasList.push({ label: "--Seleccione--", value: null });
            (<Prepagadas[]>data).forEach((prepagadas) => {
                this.prepagadasList.push({ label: prepagadas.nombre, value: prepagadas.id });
            });
            this.entity.Medicina_Prepagada = this.prepagadasList;
            console.log(this.prepagadasList);
        });

        await this.comunService.findAllProvSalud().then((data) => {
            this.provsaludList = [];
            this.provsaludList.push({ label: "--Seleccione--", value: null });
            (<Proveedor[]>data).forEach((prov) => {
                this.provsaludList.push({ label: prov.nombre, value: prov.id });
            });
            console.log(this.provsaludList);
            this.entity.Proveedor_de_salud = this.provsaludList;
        });


        // console.log(this.entity);
        // await this.cargoService.findAll().then((resp) => {
        //     this.cargoList = [];
        //     this.cargoList.push({ label: "--Seleccione--", value: null });
        //     (<Cargo[]>resp["data"]).forEach((cargo) => {
        //         this.cargoList.push({ label: cargo.nombre, value: cargo.id });
        //     });

        // });

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
        });

        await this.perfilService.findAll().then((resp) => {
            (<Perfil[]>resp["data"]).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            console.log('perfilService')
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    
                    this.buildPerfilesIdList();
                }, 500);
        });

        
    }
    areaChange(event){
        this.division=event;
        this.empleadoForm.patchValue({division: this.division})
        console.log(event)
    }
    async perfilPermisos(){
        await this.perfilService.findAll().then((resp) => {
            (<Perfil[]>resp["data"]).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            console.log('perfilService')
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 500);
        });
    }
    onClick(){
        console.log(this.sesionService.getPermisosMap())
        console.log(this.sesionService.getPermisosMap()["SCM_DEL_CASE_DIAG"])

    }

    async aonRegisters() {
        try {
            let token: any = await this.scmService.getTokenAon();
            console.log(token.message.Authorization);
            let  fechafinal = new Date().toISOString().slice(0, 10);
            console.log(fechafinal);

            let res: any = await this.scmService.getRegistersAon(token.message.Authorization, this.empleadoSelect.numeroIdentificacion, "2010-01-01", fechafinal);
            this.incapacidades = res.message.data;
            

            this.incapacidades = this.incapacidades.sort((a, b) => {
                if (a.finicio > b.finicio ) {
                  return -1;
                }
                if (a.finicio < b.finicio) {
                  return 1;
                }
                return 0;
              });

            
        } catch (error) {
            console.log(error.message);
        }

    }

    closeForm() {
        this.caseSelect = null;
        this.empleadoSelect = null;

    }

    async onSubmit() {
        console.log("hi");
        
        this.msgs = [];
        if (!this.casoMedicoForm.valid) {
            this.msgs.push({
                severity: "error",
                summary: "Por favor revise todos los campos",

            });
            return this.markFormGroupTouched(this.casoMedicoForm);
        }

        this.casoMedicoForm.patchValue({
            region: this.empleadoForm.get("area").value.nombre || "",
            ciudad: this.empleadoForm.get("ciudad").value.nombre || "",
            names: ``,
            cargo: this.empleadoForm.value.cargoId,
            eliminado: false,


            pkUser: this.empleadoForm.get("id").value || null,
            codigoCie10: this.casoMedicoForm.value.id || null,
            empresaId: this.sesionService.getEmpresa().id,
        });



        let status;
        if (this.casocreado == true){
            this.createCase = false;
        }

        if (this.createCase) {
            this.casoMedicoForm.patchValue({ fechaCreacion: Date.now() });

            status = await this.scmService.create(this.casoMedicoForm.value);
        } else {

            this.casoMedicoForm.patchValue({ id: this.caseSelect.id });
            status = await this.scmService.edit(this.casoMedicoForm.value);
        }

        if (this.adicionar) {
            this.msgs.push({
                severity: "success",
                summary: "Mensaje del sistema",
                detail: `El caso médico fue creado exitosamente, su numero de caso es ${status}`,
            });
            this.actualizar = true;
            this.adicionar = false;
           
                    
            setTimeout((res) => {
                // this.closeForm();
                // this.router.navigate(["/app/scm/list"]);
                // this.router.navigateByUrl("/app/scm/list");
            }, 3000);
            this.caseSelect.id = status;
          this.casocreado = true;
        }
            

        else if (this.actualizar) {
            this.msgs.push({
                severity: 'success',
                summary: 'Mensaje del sistema',
                detail: `Se ha actualizado correctamente el caso medico  ${status}`
                

            });
            this.createCase = false;
        }
    }

    async buildPerfilesIdList() {

        let filterQuery = new FilterQuery();
        filterQuery.filterList = [
            {
                field: "usuarioEmpresaList.usuario.id",
                criteria: Criteria.EQUALS,
                value1: this.empleadoSelect.usuario.id,
                value2: null,
            },
        ];
        this.perfilService.update;
        await this.perfilService.findByFilter(filterQuery).then((resp) => {
            let perfilesId = [];
            resp["data"].forEach((ident) => perfilesId.push(ident.id));
            this.empleadoForm.patchValue({ perfilesId: perfilesId });
            console.log(resp["data"])
        });
        console.log(this.empleadoForm)
    }

    usuarioP:any;
    async usuarioPermisos() {
        this.usuarioP=[];
        // this.usuarioEmpresaList.usuario.id;
        let filterQuery = new FilterQuery();
        filterQuery.filterList = [
            {
                field: "usuarioEmpresaList.usuario.id",
                criteria: Criteria.EQUALS,
                value1: this.empleadoSelect.usuario.id,
            },
        ];
        //this.perfilService.update;
        await this.perfilService.findByFilter(filterQuery).then((resp) => {
            resp["data"].forEach((ident) => {this.usuarioP.push(ident.id);
            });
            
                console.log(this.usuarioP)
        });
    }

    // Component methods
    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    async onSelection(event) {
        this.value = event;
        // this.caseSelect = false;
        this.empleadoSelect = null;
        this.casoMedicoForm.reset();
        let emp = <Empleado>this.value;
        // console.log(emp.area['padreNombre'])


        this.casosList = await this.scmService.getCaseList(emp.id);

        this.empleadoSelect = emp;
        this.loaded = true;
        this.nameAndLastName = (this.empleadoSelect.primerApellido || "") + " " + (this.empleadoSelect.segundoApellido || "") + " " + (this.empleadoSelect.primerNombre || "") + " " + (this.empleadoSelect.segundoNombre || " ");
        let fecha = moment(this.empleadoSelect.fechaIngreso);
        let fechaNacimiento = moment(this.empleadoSelect.fechaNacimiento);
        let antigueMoment = fecha.diff(moment.now(), "years") * -1;
        this.antiguedad = ` ${antigueMoment} Años`;
        if (antigueMoment === 0) {
            this.range = 'Menor a 1 año'
        }

        for (let j = 0; j < this.rangoAntiguedad.length; j++) {
            let subArray = this.rangoAntiguedad[j].range.split(',')
            let a = subArray.find(range => range === antigueMoment.toString())

            if (a) {
                this.range = this.rangoAntiguedad[j].label;
            }

        }
        this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;
        this.arl = this.empresa.arl == null ? null : this.empresa.arl.nombre;
        this.casoMedicoForm.patchValue({
            documento: this.empleadoSelect.numeroIdentificacion,
        });
        this.casoMedicoForm.patchValue({ pkUser: this.empleadoSelect.id })
        this.departamento = this.empleadoSelect.area.id;


        if (this.empleadoSelect.businessPartner) {
            this.onSelectionBP(this.empleadoSelect.businessPartner)
        }
        if (this.empleadoSelect.jefeInmediato) {
            this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
        }
        await this.usuarioPermisos()
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
            'perfilesId': this.usuarioP,
            "corporativePhone": this.empleadoSelect.corporativePhone,
            "emergencyContact": this.empleadoSelect.emergencyContact,
            "phoneEmergencyContact": this.empleadoSelect.phoneEmergencyContact,
            "emailEmergencyContact": this.empleadoSelect.emailEmergencyContact,
            direccionGerencia: this.empleadoSelect.direccionGerencia,
            regional: this.empleadoSelect.regional,
            correoPersonal: this.empleadoSelect.correoPersonal,
            ciudadGerencia: this.empleadoSelect.ciudadGerencia,
            division: this.empleadoSelect.area['padreNombre'],

            'email': [this.empleadoSelect.usuario.email]
        });
    }


    async submitEmp() {
        // await this.usuarioPermisos();
        let empleado = new Empleado();

        empleado.id = this.empleadoForm.value.id;
        empleado.primerNombre = this.empleadoForm.value.primerNombre;
        empleado.segundoNombre = this.empleadoForm.value.segundoNombre;
        empleado.primerApellido = this.empleadoForm.value.primerApellido;
        empleado.segundoApellido = this.empleadoForm.value.segundoApellido;
        empleado.codigo = this.empleadoForm.value.codigo;
        empleado.direccion = this.empleadoForm.value.direccion;
        empleado.fechaIngreso = this.empleadoForm.value.fechaIngreso;
        empleado.emergencyContact = this.empleadoForm.value.emergencyContact;
        empleado.corporativePhone = this.empleadoForm.value.corporativePhone;
        empleado.phoneEmergencyContact = this.empleadoForm.value.phoneEmergencyContact;
        empleado.emailEmergencyContact = this.empleadoForm.value.emailEmergencyContact;
        empleado.fechaNacimiento = this.empleadoForm.value.fechaNacimiento;
        empleado.genero = this.empleadoForm.value.genero;
        empleado.numeroIdentificacion = this.empleadoForm.value.numeroIdentificacion;
        empleado.telefono1 = this.empleadoForm.value.telefono1;
        empleado.telefono2 = this.empleadoForm.value.telefono2;
        empleado.ciudad = this.empleadoForm.value.ciudad == null ? null : this.empleadoForm.value.ciudad.id;
        if (this.empleadoForm.value.afp != null) {
            empleado.afp = new Afp();
            empleado.afp.id = this.empleadoForm.value.afp;
        }
        if (this.empleadoForm.value.eps != null) {
            empleado.eps = new Eps();
            empleado.eps.id = this.empleadoForm.value.eps;
        }
        empleado.tipoIdentificacion = this.empleadoForm.value.tipoIdentificacion;
        empleado.tipoVinculacion = this.empleadoForm.value.tipoVinculacion;
        empleado.zonaResidencia = this.empleadoForm.value.zonaResidencia;
        empleado.area = new Area();
        empleado.cargo = new Cargo();
        empleado.usuario = new Usuario();
        empleado.area.id = this.empleadoForm.value.area.id;
        empleado.cargo.id = this.empleadoForm.value.cargoId;
        empleado.usuario.email = this.empleadoForm.value.email;
        empleado.ciudadGerencia = this.empleadoForm.value.ciudadGerencia;
        empleado.regional = this.empleadoForm.value.regional,
            empleado.correoPersonal = this.empleadoForm.value.correoPersonal;
        empleado.direccionGerencia = this.empleadoForm.value.correoPersonal;
        empleado.businessPartner = this.empleadoForm.value.businessPartner;
        empleado.jefeInmediato = this.empleadoForm.value.jefeInmediato;
        empleado.usuario.usuarioEmpresaList = [];
        this.msgs = [];
        this.empleadoForm.value.perfilesId.forEach(perfilId => {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfilId;
            empleado.usuario.usuarioEmpresaList.push(ue);
        });
        this.solicitando = true;
        empleado.usuario.id = this.empleadoSelect.usuario.id;
        empleado.usuario.ipPermitida=this.empleadoSelect.usuario.ipPermitida
        console.log(this.empleadoSelect.usuario)
        // let ipPermitida=this.usuarioService.find(empleado.id)
        // console.log(this.empleadoSelect.usuario.ipPermitida)

        this.usuarioService.update(empleado.usuario)
            .then(resp => {

                this.solicitando = false;
            })
            .catch(err => {
                this.solicitando = false;
            });
        this.empleadoService.update(empleado)
            .then(data => {
                //  this.manageUpdateResponse(<Empleado>data);
                this.msgs.push({
                    severity: "success",
                    summary: "Usuario actualizado",
                    detail: `Empleado con  identificación  ${empleado.numeroIdentificacion} fue actualizado`,
                });
                this.solicitando = false;
            })
            .catch(err => {
                this.solicitando = false;
            });
    }

    showModalDiagnostico() {
        this.modalDianostico = true;
        this.modifyDiag = true;
    }

    closeModalDiagnostico() {
        this.modalDianostico = false;
        this.diagSelect = null;
        this.modifyDiag = false;
    }


    async onCloseModalrecomendation() {
        this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
        this.modalRecomendatios = false;
        this.recoSelect = null;
        this.logsList = await this.scmService.getLogs(this.caseSelect.id);

    }

    async onCloseModalseguimiento() {       
        this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
        this.seguimientos = await this.scmService.getSeguimientos(this.caseSelect.id);
        
        this.modalSeguimientos = false;
        this.seguiSelect = null;
        this.logsList = await this.scmService.getLogs(this.caseSelect.id);

    }

    async onCloseModalDianostico() {
        this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
        this.modalDianostico = false;
        this.diagSelect = null;
        this.logsList = await this.scmService.getLogs(this.caseSelect.id);
    }
    onSelectionBP(event) {
        let empleado = <Empleado>event;
        this.businessNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
        this.empleadoForm.patchValue({ businessPartner: empleado.id })
        this.bussinessParner.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            direccionGerencia: empleado.direccionGerencia,
            email: [empleado.usuario.email],
        });
    }
    /** MÉTODOS JORNADA */
    onSelectionJefeInmediato(event) {

        let empleado = <Empleado>event;
        this.jefeNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
        this.empleadoForm.patchValue({ jefeInmediato: empleado.id })
        this.jefeInmediato.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            direccionGerencia: empleado.direccionGerencia,

            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            //'ipPermitida': empleado.usuario.ipPermitida,

            email: [empleado.usuario.email],
        });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    lazyLoad(event) {

    }

    async modifyCase() {
        this.consultar = false;
        this.actualizar = true;
        this.caseSelect = this.casoSeleccionado || this.caseSelect;
        let { fechaCalificacion, emisionPclFecha, fechaConceptRehabilitacion, fechaConceptRehabilitacionTwo, ...caseFiltered } = this.caseSelect

        this.casoMedicoForm.patchValue(caseFiltered);
        this.casoMedicoForm.patchValue({
            fechaConceptRehabilitacion: fechaConceptRehabilitacion == null ? null : new Date(fechaConceptRehabilitacion),
            fechaConceptRehabilitacionTwo: fechaConceptRehabilitacionTwo == null ? null : new Date(fechaConceptRehabilitacionTwo),

            fechaCalificacion: fechaCalificacion == null ? null : new Date(fechaCalificacion),
            emisionPclFecha: emisionPclFecha == null ? null : new Date(emisionPclFecha)
        })


        try {
            this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
            this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
            this.cargoDescripcion = this.caseSelect.descripcionCargo;
            this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
            this.fechaSeg()
            this.tratamientos = await this.scmService.getTratamientos(this.caseSelect.id)
            this.empresaId = this.sesionService.getEmpresa().id;
            this.aonRegisters();
            this.status = (this.casoMedicoForm.get("statusCaso").value !== null) ? this.caseStatus.find(sta => sta.value == this.casoMedicoForm.get("statusCaso").value).label : 'N/A'
            this.logsList = await this.scmService.getLogs(this.caseSelect.id);
        } catch (error) {
            console.log(error);
        }
    }

    async readCase() {
        console.log("aquu oiii");
        this.consultar = true;
        this.caseSelect = this.casoSeleccionado || this.caseSelect;
        let { fechaCalificacion, emisionPclFecha, fechaConceptRehabilitacion, ...caseFiltered } = this.caseSelect


        this.casoMedicoForm.patchValue(caseFiltered);
        this.casoMedicoForm.patchValue({
            fechaConceptRehabilitacion: fechaConceptRehabilitacion == null ? null : new Date(fechaConceptRehabilitacion),
            fechaCalificacion: fechaCalificacion == null ? null : new Date(fechaCalificacion),
            emisionPclFecha: emisionPclFecha == null ? null : new Date(emisionPclFecha)

        })


        try {
            this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
            this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
            this.cargoDescripcion = this.caseSelect.descripcionCargo;
            this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
            this.fechaSeg()
            this.aonRegisters();
            this.logsList = await this.scmService.getLogs(this.caseSelect.id);

        } catch (error) {
            console.log(error);
        }
        this.empleadoForm.disable();
        this.casoMedicoForm.disable();

    }


    async onLoadInit() {
        this.onSelection(this.caseSelect.pkUser);
    }

    createCaso() {
        this.adicionar = true;
        this.createCase = true;
    }

    onRowEditInit(product, type?) {


    }

    async confirm(product, index) {
        if (await this.confirmService.confirm())
            this.msgs = [
                { severity: "info", summary: "Confirmado", detail: "El tratamiento ha sido eliminado" }
            ], this.onRowDelete(product, index);
        else {
            this.msgs = [
                { severity: "info", summary: "Cancelado", detail: "usted cancelo la eliminación" }
            ];
        }
    }

    onRowDelete(product, index) {
        product.eliminado = true;
        console.log(product);
        this.tratamientos.slice(index, 1);
        this.onRowEditSave(product, "tratamiento");
    }

    async onRowCloneInit(pseg, type?) {
        this.msgs = [];
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;

        try {
            let resp = await this.scmService.createSeguimiento(product);
            this.msgs.push({
                severity: "success",
                summary: "Información",
                detail: `Se ha clonado exitosamente`,
            });

            this.fechaSeg();
        } catch (error) {
            console.log(error)
        }
    }

    async onRowEditSave(product, type?) {
        this.msgs = [];

        if (product.responsable) {
            product.responsable = product.responsable.id;
        }

        try {
            if (type == "tratamiento") {
                let resp = await this.scmService.updateTratamiento(product);
                this.msgs.push({
                    severity: "success",
                    summary: "Información",
                    detail: `Su numero de Tratamiento es ${product.id}`,
                });
                return this.fechaTrat()
            }

            let resp = await this.scmService.updateSeguimiento(product);
            this.msgs.push({
                severity: "success",
                summary: "Seguimiento",
                detail: `Su numero de seguimiento es ${product.id}`,
            });

            this.fechaSeg();
        } catch (error) {
            console.log(error)
        }
    }

    onRowEditCancel(product, index: number) {

    }

    async deleteDiagnostico(id) {
        
        console.log("diagnostico:",id)
        this.msgs = [];
        try {
            await this.validarPCL()
            if(!this.itemInPCL){               
            
                if (await this.confirmService.confirmDiagnostico()){
                    let resp = await this.scmService.deleteDiagnosticos(id);
                    if (resp) {
                        this.msgs.push({
                            severity: "error",
                            summary: "Diagnostico",
                            detail: `Su Diagnostico fue eliminado`,
                        });
                        this.onCloseModalDianostico();
                    }
                }            
                else {
                    this.msgs = [
                        { severity: "info", summary: "Cancelado", detail: "usted cancelo la eliminación" }
                    ];
                }
            }
            else{
                this.msgs = [
                    { severity: "info", summary: "Cancelado", detail: "El diagnostico contiene PCL asociada" }
                ];
            }

        } catch (error) {
            console.log(error)
        }
    }


    async deleteRecomendation(id) {
        this.msgs = [];
        try {
            if (await this.confirmService.confirmRecomendacion()){
                let resp = await this.scmService.deleteRecomendation(id);
                if (resp) {
                    this.msgs.push({
                        severity: "error",
                        summary: "Mensaje del sistema",
                        detail: `Su recomendación se eliminó exitosamente`,
                    });
                    this.onCloseModalrecomendation();
                }
            }
        else {
            this.msgs = [
                { severity: "info", summary: "Cancelado", detail: "usted cancelo la eliminación" }
            ];
        }
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteSeguimiento(id) {
        this.msgs = [];
        try {           
            if (await this.confirmService.confirmSeguimiento()){
                let resp = await this.scmService.deleteSeguimiento(id);
                if (resp) {
                    this.msgs.push({
                        severity: "error",
                        summary: "Mensaje del sistema",
                        detail: `Su seguimiento se eliminó exitosamente`,
                    });
                    this.fechaSeg()
                }
            }
        else {
            this.msgs = [
                { severity: "info", summary: "Cancelado", detail: "usted cancelo la eliminación" }
            ];
        }
            

        } catch (error) {
            console.log(error)
        }
    }


    async nuevoSeguimiento() {
        try {
            let seg = { pkCase: this.caseSelect.id }
            let resp = await this.scmService.createSeguimiento(seg);

            this.seguimientos.push(resp)
        } catch (error) {
            console.log(error)
        }
    }

    async nuevoTratamiento() {
        try {
            let seg = { pkCase: this.caseSelect.id }
            let resp = await this.scmService.createTratamiento(seg);

            if (resp) {
                this.tratamientos.push(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async fechaSeg() {
        this.seguimientos = await this.scmService.getSeguimientos(this.caseSelect.id);
        this.seguimientos.map((seg, idx) => {
            if (seg.fechaSeg) {
                this.seguimientos[idx].fechaSeg = moment(seg.fechaSeg).toDate()
            }
        })
    }

    async fechaTrat() {
        this.tratamientos = await this.scmService.getTratamientos(this.caseSelect.id);
        this.tratamientos.map((trat, idx) => {
            if (trat.fecha) {
                this.tratamientos[idx].fecha = moment(trat.fecha).toDate()
            }
        })
    }

    openModalRecomendantions() {
        this.recoSelect = false;
        this.modalRecomendatios = true;
    }

    openModalSeguimientos() {
        this.seguiSelect = false;
        this.modalSeguimientos = true;
    }

    
    recibirPCL(event){
        this.listaPCL=event
    }
    validarPCL(){
        this.itemInPCL=false;
        this.listaPCL.forEach(item => {
           if(item.diagnostic.label == this.diagSelect.diagnostico){
            this.itemInPCL=true;
           }
        }); 
    }    
    
}
