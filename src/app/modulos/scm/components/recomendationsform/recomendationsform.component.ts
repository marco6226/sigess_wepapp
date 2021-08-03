import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem, Message } from "primeng/api";
import { CasosMedicosService } from "../../services/casos-medicos.service";

@Component({
    selector: "app-recomendationsform",
    templateUrl: "./recomendationsform.component.html",
    styleUrls: ["./recomendationsform.component.scss"],
})
export class RecomendationsformComponent implements OnInit, OnChanges {
    epsList: SelectItem[];
    afpList: SelectItem[];
    msgs: Message[];
    responsableEmpresaNombre = "";
    empleado: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity: epsorarl;
    @Input() recoSelect: any;
    entit = [
        { label: 'Entidad  que emite', value: null },
        { label: 'EPS', value: 'EPS' },
        { label: 'ARL', value: 'ARL' },
        { label: 'Proveedor de salud', value: 'PROVSALUD' },
        { label: 'Medicina prepagada', value: 'PREPAGADAS' },

    ];

    fields: string[] = [
        'documento',
    ];
    typeList = [
        { label: 'Seleccione', value: null },
        { label: 'Vigente', value: 'Vigente' },
        { label: 'Cerrada', value: 'Cerrada' },
        { label: 'Suspendida', value: 'Suspendida' },
        { label: 'Modificada', value: 'Modificada' },

    ];

    statusList = [
        { name: 'Seleccione', code: '' },

        { name: 'Vigente', code: '1' },
        { name: 'Expirado', code: '0' },

    ];

    empleadosList = [];
    fechaActual = new Date();
    recomendation: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions = [];
    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService

    ) {
        this.recomendation = fb.group({

            entidadEmitRecomendaciones: [null, Validators.required],
            responsableEmpresaNombre: [""],
            tipo: [null, Validators.required],
            actionPlanList: [null],
            fechaInicio: [null, Validators.required],
            responsableExterno: [null],
            fechaExpiracion: [null, Validators.required],
            entidadEmitida: [null],
            status: [null],
            actividad: [null],
            descripcionAct: [null],
            fechaProyectada: [null],
            responsableEmpresa: [null],
            recomendaciones: [null, Validators.required],

        });

    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get tipo() { return this.recomendation.get('tipo'); }
    get fechaInicio() { return this.recomendation.get('fechaInicio'); }
    get entidadEmitRecomendaciones() { return this.recomendation.get('entidadEmitRecomendaciones'); }
    get status() { return this.recomendation.get('status'); }
    get responsableExterno() { return this.recomendation.get('responsableExterno'); }
    get actividad() { return this.recomendation.get('actividad'); }
    get descripcionAct() { return this.recomendation.get('descripcionAct'); }
    get fechaProyectada() { return this.recomendation.get('fechaProyectada'); }
    get recomendaciones() { return this.recomendation.get('recomendaciones'); }
    get fechaExpiracion() { return this.recomendation.get('fechaExpiracion'); }
    get responsableEmpresa() { return this.recomendation.get('responsableEmpresa'); }
    get actionPlanList() { return this.recomendation.get('actionPlanList'); }

    async ngOnInit() {
        if (this.recoSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }

    }


    clearInputs() {
        this.recomendation.reset()
        this.accions = [];
    }
    async onSubmit() {
        this.msgs = [];
        console.log(this.recomendation.value);
        if (!this.recomendation.valid) {
            return this.markFormGroupTouched(this.recomendation);
        }
        this.accions.map(act => {
            if (act.responsableEmpresa)
                act.responsableEmpresa = act.responsableEmpresa.id;
        })
        console.log(this.accions);
        let {

            entidadEmitRecomendaciones,
            tipo,
            fechaInicio,
            fechaExpiracion,
            recomendaciones,
            responsableEmpresa,
            actividad,
            descripcionAct,
            fechaProyectada,
            responsableExterno,
            entidadEmitida
        } = this.recomendation.value;

        if (this.accions.length > 0) {
            this.accions.map(act => {
                if (act.responsableEmpresa.trim() == '') {
                    act.responsableEmpresa = null;
                }
            })
        }

        let body = {
            id: this.recoSelect.id || "",
            entidadEmitRecomendaciones: entidadEmitRecomendaciones,

            tipo: tipo,
            entidadEmitida,
            fechaInicio,
            actionPlanList: this.accions,
            fechaExpiracion,
            recomendaciones,
            pkUser: this.id,
            pkCase: this.id,
            responsableEmpresa,
            responsableExterno,
            actividad,
            descripcionAct,
            fechaProyectada,

        }



        try {
            let res: any;
            if (this.recoSelect) {
                res = await this.scmService.updateRecomendation(body);

            } else {
                res = await this.scmService.createRecomendation(body);

            }

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: this.recoSelect ? "Recomendacion actualizada" : "Recomendacion Creada",
                    //detail: `Su numero de caso es ${status}`,
                });
                setTimeout(() => {
                    this.accions = [];
                    this.recomendation.reset();
                    this.eventClose.emit()
                }, 1000);
            }
        } catch (error) {

            this.msgs.push({
                severity: "error",
                summary: "Error",
                // detail: `de el usuario ${emp.numeroIdentificacion}`,
            });

        }


    }

    patchFormValues() {
        console.log(this.recoSelect);
        if (this.recoSelect) {
            this.accions = this.recoSelect.actionPlanList;
            this.accions.map(act => act.responsableEmpresa = this.onSelectionResponsable(act.responsableEmpresa))
            this.recomendation.patchValue({
                entidadEmitRecomendaciones: this.recoSelect.entidadEmitRecomendaciones,
                tipo: this.recoSelect.tipo,
                fechaInicio: this.recoSelect.fechaInicio == null ? null : new Date(this.recoSelect.fechaInicio),
                responsableExterno: this.recoSelect.responsableExterno,
                fechaExpiracion: this.recoSelect.fechaExpiracion == null ? null : new Date(this.recoSelect.fechaExpiracion),
                actionPlanList: this.recoSelect.actionPlanList,
                actividad: this.recoSelect.actividad,
                descripcionAct: this.recoSelect.descripcionAct,
                entidadEmitida: this.recoSelect.entidadEmitida,
                fechaProyectada: this.recoSelect.fechaProyectada == null ? null : new Date(this.recoSelect.fecha_proyectada),
                recomendaciones: this.recoSelect.recomendaciones,
            })
        } else {
            this.clearInputs();
        }
    }

    onSelectionResponsable(event) {
        console.log(event)
        if (!event) return;
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        return empleado;
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }


    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }


    onRowEditInit(product, type?) {
        console.log(this.accions);

    }
    async onRowCloneInit(pseg, type?) {
        this.msgs = [];
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;

        try {
            let resp = await this.scmService.createSeguimiento(product);
            this.msgs.push({
                severity: "success",
                summary: "Seguimiento",
                detail: `Se ha clonado exitosamente`,
            });

            //  this.fechaSeg();
        } catch (error) {

        }

    }

    async onRowEditSave(product, index) {
        console.log(product, index);
        this.accions[index] = product;
    }


    deleteFromArray(array, index) {

    }

    onRowDelete(index) {
        this.accions.splice(index, 1);

    }
    nuevaActividad() {
        let actv = { actividad: "", descripcionAct: "", responsableExterno: null, responsableEmpresa: null, fechaProyectada: new Date() }
        this.accions.push(actv)
    }

    onRowEditCancel(product, index: number) {

    }


}

import { Pipe, PipeTransform } from '@angular/core';
import { epsorarl } from "../../entities/eps-or-arl";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'recomendationstatus' })
export class RecomendationStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}