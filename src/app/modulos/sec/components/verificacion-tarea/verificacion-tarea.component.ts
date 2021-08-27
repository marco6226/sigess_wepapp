import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';

@Component({
    selector: 'app-verificacion-tarea',
    templateUrl: './verificacion-tarea.component.html',
    styleUrls: ['./verificacion-tarea.component.scss']
})
export class VerificacionTareaComponent implements OnInit {

    /* Variables */
    verificationForm: FormGroup;
    empleado: Empleado;
    empleadosList: Empleado[];
    fullName = '';

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
    ) {
        this.verificationForm = fb.group({
            id: ["", Validators.required],
            usuarioCierre: ["", Validators.required],
            fechaCierre: ["", Validators.required],
            descripcionCierre: ["", Validators.required],
            evidences: [[]],
        })
    }

    ngOnInit() {
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.verificationForm.patchValue({ usuarioCierre: { 'id': this.empleado.id } });
    }


}
