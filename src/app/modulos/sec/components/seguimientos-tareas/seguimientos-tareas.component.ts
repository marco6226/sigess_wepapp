import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-seguimientos-tareas',
    templateUrl: './seguimientos-tareas.component.html',
    styleUrls: ['./seguimientos-tareas.component.scss']
})
export class SeguimientosTareasComponent implements OnInit {

    /* Variables */
    cargando = false;
    trackings = [];
    displayModal: boolean;
    displayEvidences: boolean;
    trackingForm: FormGroup;
    submitted = false;
    evidences = [];

    constructor(
        fb: FormBuilder,
    ) {
        this.trackingForm = fb.group({
            usuarioSeguimiento: ["", Validators.required],
            fechaSeguimiento: ["", Validators.required],
            descripcion: ["", Validators.required],
            evidencias: [[]],
        })
    }

    ngOnInit() {
        this.trackings = [
            {
                user: 'harrysongil@lerprevencion.com',
                description: 'Se realiza consecución de presupuesto en comité ejecutivo y se encuentra pendiente la aprobación.',
                date: '2021-03-15T14:51:06.157Z',
                evidences: [
                    '1233432',
                    '544324234',
                    '6324832848324'
                ],
            }
        ]
    }

    get f() {
        return this.trackingForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        this.cargando = true;

        setTimeout(() => {
            if (!this.trackingForm.valid) {
                this.cargando = false;
                return;
            }
    
            console.log('Data: ', this.trackingForm.value);
        }, 3000);

    }

    showModalDialog(type, data?) {
        switch (type) {
            case 'create':
                this.displayModal = true;
                break;
            case 'evidence':
                this.displayEvidences = true;
                this.evidences = data.evidences;
                break;
        }
    }

    closeEvidences() {
        this.evidences = [];
        this.displayEvidences = false;
    }

}
