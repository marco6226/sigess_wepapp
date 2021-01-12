import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    entit = [
        { name: '', code: '' },

        { name: 'EPS', code: 'NY' },
        { name: 'ARL', code: 'RM' },
        { name: 'Entidad  que emite', code: 'RM' }

    ];

    fields: string[] = [
        'documento',
    ];
    typeList = [
        { name: '', code: '' },

        { name: 'Activo', code: 'NY' },
        { name: 'Cerrado', code: 'NY' },

    ];

    statusList = [
        { name: '', code: '' },

        { name: 'Activo', code: 'NY' },
        { name: 'Cerrado', code: 'NY' },

    ];


    fechaActual = new Date();
    recomendation: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
    ) {
        this.recomendation = fb.group({
            generateRecomendaciones: [null, Validators.required],
            entidadEmitRecomendaciones: [null, Validators.required],

            tipo: [null, Validators.required],

            fechaInicio: [null, Validators.required],

            fechaExpiracion: [null, Validators.required],

            status: [null, Validators.required],
            actionPlan: [null, Validators.required],
            actionPlanResponsable: [null, Validators.required],
            recomendaciones: [null, Validators.required],

        });
    }
    //Aqui estan los get para las validaciones
    get tipo() { return this.recomendation.get('tipo'); }
    get fechaInicio() { return this.recomendation.get('fechaInicio'); }
    get entidadEmitRecomendaciones() { return this.recomendation.get('entidadEmitRecomendaciones'); }
    get status() { return this.recomendation.get('status'); }
    get generateRecomendaciones() { return this.recomendation.get('generateRecomendaciones'); }
    get recomendaciones() { return this.recomendation.get('tipo'); }
    get fechaExpiracion() { return this.recomendation.get('fechaExpiracion'); }
    get actionPlanResponsable() { return this.recomendation.get('actionPlanResponsable'); }
    get actionPlan() { return this.recomendation.get('actionPlan'); }

    async ngOnInit() {

    }

    async onSubmit() {
        this.msgs = [];

        if (!this.recomendation.valid) {
            return this.markFormGroupTouched(this.recomendation);
        }
        let {
            generateRecomendaciones,

            entidadEmitRecomendaciones,

            tipo,

            fechaInicio,

            fechaExpiracion,

            status,
            recomendaciones,

            actionPlanResponsable,

            actionPlan
        } = this.recomendation.value;

        let body = {
            generateRecomendaciones: generateRecomendaciones,
            entidadEmitRecomendaciones: entidadEmitRecomendaciones.code,

            tipo: tipo.code,

            fechaInicio,

            fechaExpiracion,

            status: status.code,
            recomendaciones,
            pkUser: this.id,
            actionPlanResponsable,

            actionPlan
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

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}

