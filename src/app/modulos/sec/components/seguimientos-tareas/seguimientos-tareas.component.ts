import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';

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
    fullName = '';
    empleado: Empleado;
    empleadosList: Empleado[];

    constructor(
        private empleadoService: EmpleadoService,
        fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.trackingForm = fb.group({
            tareaId: ["", Validators.required],
            userId: ["", Validators.required],
            fechaSeguimiento: ["", Validators.required],
            descripcion: ["", Validators.required],
            evidencias: [[]],
        });

        this.trackingForm.patchValue({ tareaId: parseInt(this.route.snapshot.paramMap.get('id')) })
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
            },
            {
                user: 'harrysongil@lerprevencion.com',
                description: 'Se realiza consecución de presupuesto en comité ejecutivo y se encuentra pendiente la aprobación.',
                date: '2021-03-15T14:51:06.157Z',
                evidences: [
                    'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1128&q=80',
                    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    '../../../../../assets/images/file.png'
                ],
            },
            {
                user: 'harrysongil@lerprevencion.com',
                description: 'Se realiza consecución de presupuesto en comité ejecutivo y se encuentra pendiente la aprobación.',
                date: '2021-03-15T14:51:06.157Z',
                evidences: [
                    'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1128&q=80',
                    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    '../../../../../assets/images/file.png'
                ],
            },
        ]
    }

    get f() {
        return this.trackingForm.controls;
    }

    addImage(file) {
        let evidences = this.trackingForm.get('evidencias').value;
        let obj = {
            ruta: file,

        }
        evidences.push(obj);
        this.trackingForm.patchValue({ evidencias: evidences });
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    onSubmit() {
        this.submitted = true;
        this.cargando = true;

        setTimeout(() => {
            if (!this.trackingForm.valid) {
                this.cargando = false;
                console.log('Data: ', this.trackingForm.value);
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

    closeCreate() {
        this.empleado = null;
        this.fullName = null;
        this.trackingForm.reset();
        this.displayModal = false;
    }

    async onSelection(event) {
        console.log(event);
        // this.caseSelect = false;
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = this.empleado.primerNombre + ' ' + this.empleado.primerApellido;
        this.trackingForm.patchValue({userId: this.empleado.id});
    }

}
