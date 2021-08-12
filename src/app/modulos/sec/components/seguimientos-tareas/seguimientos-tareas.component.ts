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
                    'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1128&q=80',
                    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    '../../../../../assets/images/file.png'
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
