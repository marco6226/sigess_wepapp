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
    @Input() recoSelect: any;
    entit = [
        { label: 'Entidad  que emite', value: null },
        { label: 'EPS', value: 'EPS' },
        { label: 'ARL', value: 'ARL' },

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

        { name: 'Activo', code: '1' },
        { name: 'Cerrado', code: '0' },

    ];

    empleadosList = [];
    fechaActual = new Date();
    recomendation: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService

    ) {
        this.recomendation = fb.group({

            entidadEmitRecomendaciones: [null, Validators.required],
            responsableEmpresaNombre: [""],
            tipo: [null, Validators.required],

            fechaInicio: [null, Validators.required],
            responsableExterno: [null],
            fechaExpiracion: [null, Validators.required],

            status: [null],
            actionPlan: [null, Validators.required],
            actividad: [null],
            descripcion_act: [null],
            fecha_proyectada: [null],
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
    get descripcion_act() { return this.recomendation.get('descripcion_act'); }
    get fecha_proyectada() { return this.recomendation.get('fecha_proyectada'); }
    get recomendaciones() { return this.recomendation.get('recomendaciones'); }
    get fechaExpiracion() { return this.recomendation.get('fechaExpiracion'); }
    get responsableEmpresa() { return this.recomendation.get('responsableEmpresa'); }
    get actionPlan() { return this.recomendation.get('actionPlan'); }

    async ngOnInit() {
        if (this.recoSelect) {
            this.patchFormValues()
        }

    }

    async onSubmit() {
        this.msgs = [];
        console.log(this.recomendation.value);
        if (!this.recomendation.valid) {
            return this.markFormGroupTouched(this.recomendation);
        }
        console.log(this.recomendation.value);
        let {

            entidadEmitRecomendaciones,
            tipo,
            fechaInicio,
            fechaExpiracion,
            recomendaciones,
            responsableEmpresa,
            actionPlan,
            actividad,
            descripcion_act,
            fecha_proyectada,
            responsableExterno

        } = this.recomendation.value;

        let body = {
            id: this.recoSelect.id || "",
            entidadEmitRecomendaciones: entidadEmitRecomendaciones,

            tipo: tipo,

            fechaInicio,

            fechaExpiracion,
            recomendaciones,
            pkUser: this.id,
            pkCase: this.id,
            responsableEmpresa,
            responsableExterno,
            actividad,
            descripcion_act,
            fecha_proyectada,
            actionPlan: actionPlan

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
                    summary: this.recoSelect ? "Recomendacion creada" : "Recomendacion actualizada",
                    //detail: `Su numero de caso es ${status}`,
                });
                setTimeout(() => {
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
            this.recomendation.patchValue({
                entidadEmitRecomendaciones: this.recoSelect.entidadEmitRecomendaciones,
                tipo: this.recoSelect.tipo,
                fechaInicio: this.recoSelect.fechaInicio == null ? null : new Date(this.recoSelect.fechaInicio),
                responsableExterno: this.recoSelect.responsableExterno,
                fechaExpiracion: this.recoSelect.fechaExpiracion == null ? null : new Date(this.recoSelect.fechaExpiracion),
                actionPlan: this.recoSelect.actionPlan,
                actividad: this.recoSelect.actividad,
                descripcion_act: this.recoSelect.descripcion_act,
                fecha_proyectada: this.recoSelect.fecha_proyectada == null ? null : new Date(this.recoSelect.fecha_proyectada),
                recomendaciones: this.recoSelect.recomendaciones,
            })
            this.onSelectionResponsable(this.recoSelect.responsableEmpresa)
        }
    }

    onSelectionResponsable(event) {
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        this.recomendation.patchValue({ responsableEmpresa: empleado.id, responsableEmpresaNombre: this.responsableEmpresaNombre })
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

}

import { Pipe, PipeTransform } from '@angular/core';
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
        let status = new Date(value) >= new Date() ? 'Abierto' : 'Cerrado';
        return status;
    }
}