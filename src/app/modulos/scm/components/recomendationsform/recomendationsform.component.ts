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

        { name: 'EPS', code: 'EPS' },
        { name: 'ARL', code: 'ARL' },
        { name: 'Entidad  que emite', code: null }

    ];

    fields: string[] = [
        'documento',
    ];
    typeList = [
        { name: '', code: '' },

        { name: 'Activo', code: '1' },
        { name: 'Cerrado', code: '0' },

    ];

    statusList = [
        { name: '', code: '' },

        { name: 'Activo', code: '1' },
        { name: 'Cerrado', code: '0' },

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
            
            entidadEmitRecomendaciones: entidadEmitRecomendaciones.code,

            tipo: tipo.code,

            fechaInicio,

            fechaExpiracion,

            status: status.code,
            recomendaciones,
            pkUser: this.id,
            pkCase: this.id,
            actionPlanResponsable,

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

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}

