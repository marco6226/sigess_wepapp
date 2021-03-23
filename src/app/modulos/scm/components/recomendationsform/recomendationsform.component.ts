import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
export class RecomendationsformComponent implements OnInit {
    epsList: SelectItem[];
    afpList: SelectItem[];
    msgs: Message[];
    responsableEmpresaNombre = "";
    empleado: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    entit = [
        { name: '', code: '' },

        { name: 'EPS', code: 'EPS' },
        { name: 'ARL', code: 'ARL' },
        { name: 'Entidad  que emite', code: null }

    ];

    fields: string[] = [
        'documento',
    ];
    typeList = [
        { name: 'Seleccione', code: null },

        { name: 'Cerrada', code: 'Cerrada' },
        { name: 'Suspendida', code: 'Suspendida' },
        { name: 'Modificada', code: 'Modificada' },

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
            responsableExterno: [null, Validators.required],
            fechaExpiracion: [null, Validators.required],

            status: [null],
            actionPlan: [null, Validators.required],
            responsableEmpresa: [null, Validators.required],
            recomendaciones: [null, Validators.required],

        });
    }
    //Aqui estan los get para las validaciones
    get tipo() { return this.recomendation.get('tipo'); }
    get fechaInicio() { return this.recomendation.get('fechaInicio'); }
    get entidadEmitRecomendaciones() { return this.recomendation.get('entidadEmitRecomendaciones'); }
    get status() { return this.recomendation.get('status'); }
    get responsableExterno() { return this.recomendation.get('responsableExterno'); }

    get recomendaciones() { return this.recomendation.get('tipo'); }
    get fechaExpiracion() { return this.recomendation.get('fechaExpiracion'); }
    get responsableEmpresa() { return this.recomendation.get('responsableEmpresa'); }
    get actionPlan() { return this.recomendation.get('actionPlan'); }

    async ngOnInit() {

    }

    async onSubmit() {
        this.msgs = [];

        if (!this.recomendation.valid) {
            return this.markFormGroupTouched(this.recomendation);
        }
        console.log(this.recomendation.value);
        let {

            entidadEmitRecomendaciones,

            tipo,

            fechaInicio,

            fechaExpiracion,

            status,
            recomendaciones,

            responsableEmpresa,

            actionPlan
        } = this.recomendation.value;

        let body = {

            entidadEmitRecomendaciones: entidadEmitRecomendaciones.code,

            tipo: tipo.code,

            fechaInicio,

            fechaExpiracion,
            recomendaciones,
            pkUser: this.id,
            pkCase: this.id,
            responsableEmpresa,

            actionPlan: actionPlan.code
        }

        try {

            let res = await this.scmService.createRecomendation(body);

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: "Recomendacion creada",
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