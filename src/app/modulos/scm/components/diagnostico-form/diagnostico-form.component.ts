import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { Usuario } from '../../../empresa/entities/usuario';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ComunService } from 'app/modulos/comun/services/comun.service';
import { Cie } from 'app/modulos/comun/entities/cie';


@Component({
    selector: 'app-diagnostico-form',
    templateUrl: './diagnostico-form.component.html',
    styleUrls: ['./diagnostico-form.component.scss']
})
export class DiagnosticoFormComponent implements OnInit, OnChanges {
    diagnosticoForm: FormGroup;
    sistemaAfectado = [];
    msgs: Message[];
    @Input() caseId: string;
    @Input() id: string;
    @Output() eventClose = new EventEmitter<any>()
    @Output() closeModal = new EventEmitter<any>()
    @Input() diagSelect: any;

    origenList = [
        { label: 'Seleccione', value: null },
        { label: 'Común', value: 'Común' },
        { label: 'Accidente de trabajo', value: 'Accidente Laboral' },
        { label: 'Mixto', value: 'Mixto' },
        { label: 'Enfermedad laboral', value: 'Enfermedad Laboral' },

    ];
    localeES: any = locale_es;
    es: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    usuario: Usuario;
    cieTipo: String = "";
    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private sesionService: SesionService,
        private comunService: ComunService,
    ) {
        this.usuario = this.sesionService.getUsuario();
        this.diagnosticoForm = fb.group({
            codigoCie10: [null, Validators.required],
            diagnostico: [null, Validators.required],
            fechaDiagnostico: [null, Validators.required],
            sistemaAfectado: [null],
            origen: [null, Validators.required],
            detalle: [null, Validators.required],

        });
    }
    get codigo() { return this.diagnosticoForm.get('codigoCie10'); }
    get diagnostico() { return this.diagnosticoForm.get('diagnostico'); }
    get detalle() { return this.diagnosticoForm.get('detalle'); }
    get fechaDiagnostico() { return this.diagnosticoForm.get('fechaDiagnostico'); }

    get sistemaAfec() { return this.diagnosticoForm.get('sistemaAfectado'); }
    get origen() { return this.diagnosticoForm.get('origen'); }

    async ngOnInit() {
        let resp: any = await this.scmService.getSistemasAFectados();


        this.sistemaAfectado.push({ label: '--Seleccione--', value: null });
        resp.forEach((sistema, index) => {
            this.sistemaAfectado.push({ label: sistema.name, value: sistema.id })
        });
        console.log(this.sistemaAfectado);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    async patchFormValues() {
        console.log(this.diagSelect);
        if (this.diagSelect) {
            this.diagnosticoForm.patchValue({
                codigoCie10: this.diagSelect.codigoCie10,
                diagnostico: this.diagSelect.diagnostico,
                fechaDiagnostico: this.diagSelect.fechaDiagnostico == null ? null : new Date(this.diagSelect.fechaDiagnostico),
                sistemaAfectado: this.diagSelect.sistemaAfectado,
                origen: this.diagSelect.origen,
                detalle: this.diagSelect.detalle

            })
            this.comunService.buscarCie(this.diagSelect.codigoCie10).then(
                data => this.cieTipo = data[0].tipo
            );
        } else {
            this.clearInputs();
            console.log(this.diagnosticoForm.value);
        }

    }

    async onSubmit() {
        this.msgs = [];
        console.log(this.diagnosticoForm);
        console.log(this.usuario);
        if (!this.diagnosticoForm.valid) {
            return this.markFormGroupTouched(this.diagnosticoForm);
        }
        let {
            codigoCie10,
            diagnostico,
            fechaDiagnostico,
            detalle,
            origen

        } = this.diagnosticoForm.value;


        let body = {
            id: "",

            codigoCie10,
            fechaDiagnostico,
            origen,
            diagnostico,
            detalle,
            sistemaAfectado: this.cieTipo,
            pkCase: this.caseId,
            pkUser: this.id,
            creadoPor: this.usuario.email,

        }

        try {

            let res: any;
            if (this.diagSelect) {
                body.id = this.diagSelect.id;
                res = await this.scmService.updateDiagnosticos(body);

            } else {
                res = await this.scmService.createDiagnosticos(body);

            }

            if (res) {
                
                this.clearInputs();
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: this.diagSelect ? "El diagnóstico fue actualizado exitosamente" : 'El diagnóstico fue creado exitosamente',
                    //detail: `Su numero de caso es ${status}`,
                });
                
                setTimeout(() => {
                    this.eventClose.emit();
                }, 1500);
            }
        } catch (error) {

            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un problema con el diagnóstico"
                // detail: `de el usuario ${emp.numeroIdentificacion}`,
            });
        }
    }

    close() {
        this.closeModal.emit();
    }

    clearInputs() {
        this.diagnosticoForm.reset()
        this.cieTipo = "";
    }

    test(event) {
        console.log(event);
        this.diagnosticoForm.patchValue({ diagnostico: event.nombre, codigoCie10: event.codigo })
        this.cieTipo = event.tipo;
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
