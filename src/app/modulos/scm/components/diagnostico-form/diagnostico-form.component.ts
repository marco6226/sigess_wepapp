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
    sistemaAfectado = [];
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
    get codigo() { return this.diagnosticoForm.get('codigoCie10'); }
    get diagnostico() { return this.diagnosticoForm.get('diagnostico'); }
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


    async onSubmit() {
        this.msgs = [];
        console.log(this.diagnosticoForm);
        if (!this.diagnosticoForm.valid) {
            return this.markFormGroupTouched(this.diagnosticoForm);
        }
        let {
            codigoCie10,
            diagnostico,
            sistemaAfectado
        } = this.diagnosticoForm.value;

        let body = {
            codigoCie10,
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

    test(event) {
        console.log(event);
        this.diagnosticoForm.patchValue({ diagnostico: event.nombre, codigoCie10: event.codigo })
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
