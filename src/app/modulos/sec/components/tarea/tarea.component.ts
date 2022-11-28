import { Modulo } from "./../../../core/enums/enumeraciones";
import { Component, Inject, OnInit, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TareaService } from "../../services/tarea.service";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import * as moment from "moment";
import { SeguimientosService } from "../../services/seguimientos.service";
import { Message } from "primeng/api";
import { FilterQuery } from "app/modulos/core/entities/filter-query";
import { Criteria } from "app/modulos/core/entities/filter";
import { formatDate } from "@angular/common";
import { CapitalizePipe } from "../../utils/pipes/capitalize.pipe";
import { DirectorioService } from "app/modulos/ado/services/directorio.service";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { Empresa } from 'app/modulos/empresa/entities/empresa'

@Component({
    selector: "app-tarea",
    templateUrl: "./tarea.component.html",
    styleUrls: ["./tarea.component.scss"],
})
export class TareaComponent implements OnInit {
    /* Variables */
    estadoList = [];
    evidences: any = [];
    msgs: Message[] = [];
    tareaClose: boolean = false;
    tareaVerify: boolean = false;
    tareaId;
    cargando = false;
    tareaForm: FormGroup;
    routeSub;
    tarea: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    submitted = false;
    loading: boolean;
    fullName = "";
    empleado: Empleado;
    empresaSelect: Empresa;
    empleadosList: Empleado[];
    status = 0;
    statuses;
    tareaEvidences = [];
    fechavisible = false;
    idEmpresa: string;
    flagEvidencias: boolean=false;

    constructor(
        fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
        private empleadoService: EmpleadoService,
        private seguimientoService: SeguimientosService,
        private directorioService: DirectorioService,
        private sesionService: SesionService,
        @Inject(LOCALE_ID) private locale: string,
        private capitalizePipe: CapitalizePipe
    ) {
        this.tareaForm = fb.group({
            id: ["", Validators.required],
            usuarioCierre: ["", Validators.required],
            email: ["", null],
            fechaCierre: ["", Validators.required],
            descripcionCierre: ["", Validators.required],
            evidences: [[]],
        });
    }

    ngOnInit() {
        this.idEmpresa = this.sesionService.getEmpresa().id;
        this.tareaId = this.route.snapshot.paramMap.get("id");
        this.getTarea();

        /* Preload data */
        this.estadoList = [
            { label: "Abierto", value: "abierto" },
            { label: "Cerrado en el tiempo", value: "ct" },
            { label: "Cerrado fuera de tiempo", value: "cft" },
            { label: "Vencido", value: "vencido" },
        ];

        this.statuses = {
            0: "N/A",
            1: "En seguimiento",
            2: "Abierta",
            3: "Cerrada en el tiempo",
            4: "Cerrada fuera de tiempo",
            5: "Vencida",
        };

        // console.log(this.statuses[this.status])

    }
    test(){
        console.log(this.tarea)
    }
    async getTarea(event?) {
        this.tareaForm.patchValue({ id: parseInt(this.tareaId) });
        this.tarea = await this.tareaService.findByDetailId(this.tareaId);

        if (this.tarea) {
            this.status = this.verifyStatus();
            let fecha_cierre = moment(this.tarea.fecha_cierre);

            let permiso =
                await this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
            if (permiso != null && permiso.valido == true) {
                this.fechavisible = true;
            } else {
                fecha_cierre = moment(this.fechaActual);
            }

            console.log(permiso);

            let fecha_verificacion = moment(this.tarea.fecha_verificacion);

            this.tarea.fecha_reporte = formatDate(
                this.tarea.fecha_reporte,
                "yyyy-MM-dd",
                this.locale
            );

            this.tareaVerify =
                fecha_cierre.isValid() && fecha_verificacion.isValid()
                    ? true
                    : false;

            await this.getTareaEvidences();

            console.log(this.tarea);

            if (this.tarea.empResponsable) {
                let fq = new FilterQuery();
                fq.filterList = [
                    {
                        criteria: Criteria.EQUALS,
                        field: "id",
                        value1: this.tarea.empResponsable.id,
                        value2: null,
                    },
                ];
                await this.empleadoService.findByFilter(fq).then(async (resp) => {
                    console.log(resp);
                    if (resp["data"].length > 0) {
                        let empleado = resp["data"][0];
                        this.tarea.email = empleado.usuario.email || "";
                        let nombre = this.capitalizePipe.transform(
                            empleado.primerNombre
                        );
                        let apellido = this.capitalizePipe.transform(
                            empleado.primerApellido
                        );
                        this.tarea.responsable =
                            (nombre || "") + " " + (apellido || "");
                    }
                });
                // this.tarea.responsable=this.tarea.empResponsable.primer_nombre+" "+this.tarea.empResponsable.primer_apellido
            }

            if (this.status === 3 || this.status === 4) {
                this.tareaClose = true;
                let fq = new FilterQuery();
                fq.filterList = [
                    {
                        criteria: Criteria.EQUALS,
                        field: "id",
                        value1: this.tarea.fk_usuario_cierre,
                        value2: null,
                    },
                ];
                this.empleadoService.findByFilter(fq).then(async (resp) => {
                    console.log(resp);
                    let empleado = resp["data"][0];
                    this.onSelection(empleado);
                    console.log("antes de traer evidencias")
                    await this.getEvidences(this.tarea.id);
                    this.tareaForm.patchValue({
                        usuarioCierre: this.tarea.fk_usuario_cierre,
                        fechaCierre: new Date(this.tarea.fecha_cierre),
                        descripcionCierre: this.tarea.descripcion_cierre,
                    });
                });
            }else{this.flagEvidencias=true}
        }
    }

    async getTareaEvidences() {
        try {
            this.tareaForm.patchValue({ id: parseInt(this.tareaId) });

            this.tarea = await this.tareaService.findByDetailId(this.tareaId);
            console.log(this.tarea.hash_id.slice(0, 3));
            let res: any = await this.tareaService.getTareaEvidencesModulos(
                this.tareaId,
                this.tarea.hash_id.slice(0, 3)
            );

            if (res) {
                res.files.forEach(async (evidence) => {
                    let ev: any = await this.directorioService.download(
                        evidence
                    );
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        if (ev) {
                            this.tareaEvidences.push(reader.result);
                        } else {
                            throw new Error(
                                "Ocurrió un problema al consultar las evidencias de la tarea"
                            );
                        }
                    };
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
 cont :number=0;
    verifyStatus(isFollowsExist = false) {
        this.cont++;
        console.log('cont:',this.cont)
        
        // this.statuses = {
        //     0: "N/A",
        //     1: "En seguimiento",
        //     2: "Abierta",
        //     3: "Cerrada en el tiempo",
        //     4: "Cerrada fuera de tiempo",
        //     5: "Vencida",
        // };
        console.log("Existe seguimiento? ", isFollowsExist);

        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(this.tarea.fecha_cierre);
        let fecha_proyectada = moment(this.tarea.fecha_proyectada);

        if (!fecha_cierre.isValid() && isFollowsExist) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day')){ return 2;}
        if (fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day')) { return 3;}
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day')) {return 4;}
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day')) {return 5;}
        // this.getTarea()
        return 0;
    }

    get f() {
        return this.tareaForm.controls;
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    addImage(file) {
        let evidences = this.tareaForm.get("evidences").value;
        let obj = {
            ruta: file,
        };
        this.evidences.push(obj);
        evidences.push(obj);
        this.tareaForm.patchValue({ evidences: evidences });
        console.log(this.evidences);
    }

    removeImage(index) {
        let evidences = this.tareaForm.get("evidences").value;
        if (index > -1) evidences.splice(index, 1);
    }

    isFollows(data) {
        this.status = 0;
        console.log("Funciona el emit");
        setTimeout(() => {
            //this.getTarea()
            this.status = this.verifyStatus(data);
            console.log('hola')
        }, 300);
    }

    async onSubmit() {
        this.submitted = true;
        this.cargando = true;
        this.msgs = [];

        if (!this.tareaForm.valid) {
            console.log("Data: ", this.tareaForm.value);
            this.cargando = false;
            this.msgs.push({
                severity: "info",
                summary: "Mensaje del sistema",
                detail: "Debe completar todos los campos",
            });
            return;
        }

        try {
            let res = await this.seguimientoService.closeTarea(
                this.tareaForm.value
            );

            if (res) {
                this.tareaForm.reset();
                this.submitted = false;
                this.cargando = false;
                this.getTarea();
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha cerrado exitosamente esta tarea!",
                });
            }
        } catch (e) {
            console.log(e);
            this.submitted = false;
            this.cargando = false;
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un inconveniente al cerrar la tarea",
            });
        }
    }

    async getEvidences(id) {
        try {
            this.evidences =
                ((await this.seguimientoService.getEvidences(
                    id,
                    "fkTareaCierre"
                )) as any) || [];
                console.log(true)
                this.flagEvidencias=true
        } catch (e) {
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ha ocurrido un error al obtener las evidencias de esta tarea",
            });
            console.log(e);
        }
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;

        this.empleado = emp;
        this.fullName =
            (this.empleado.primerNombre || "") +
            " " +
            (this.empleado.primerApellido || "");
        this.tareaForm.patchValue({
            usuarioCierre: { id: this.empleado.id },
            email: this.empleado.usuario.email,
        });
    }
}
