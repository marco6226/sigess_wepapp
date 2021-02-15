import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';

@Component({
    selector: 'app-diagnostico-form',
    templateUrl: './diagnostico-form.component.html',
    styleUrls: ['./diagnostico-form.component.scss']
})
export class DiagnosticoFormComponent implements OnInit {
    diagnosticoForm: FormGroup;
    msgs: Message[];
    @Input() caseId: string;
    @Input() id: string;

    @Output() eventClose = new EventEmitter<any>()


    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
    ) {
        this.diagnosticoForm = fb.group({
            codigoCie10: [null, Validators.required],
            diagnostico: [null, Validators.required],
            sistemaAfectado: [null, Validators.required],
            origen: [null, Validators.required],


        });
    }

    async ngOnInit() {

    }


    async onSubmit() {
        this.msgs = [];

        if (!this.diagnosticoForm.valid) {
            return this.markFormGroupTouched(this.diagnosticoForm);
        }
        let {
            codigoCie10,
            diagnostico,
            sistemaAfectado
        } = this.diagnosticoForm.value;

        let body = {
            codigoCie10: codigoCie10.id,
            diagnostico,
            sistemaAfectado,
            pkCase: this.caseId,
            pkUser: this.id,

        }

        try {

            let res = await this.scmService.createDiagnosticos(body);

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: "Diagnostico creado",
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
