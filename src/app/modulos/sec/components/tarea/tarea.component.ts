import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import {
    locale_es,
    tipo_identificacion,
    tipo_vinculacion,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    /* Variables */
    estadoList = [];
    cargando = false;
    tareaForm: FormGroup;
    routeSub;
    tarea: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    submitted = false;

    constructor(fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
    ) {
        this.tareaForm = fb.group({
            usuarioSeguimiento: ["", Validators.required],
            usuarioGestion: ["", Validators.required],
            estado: ["", Validators.required],
            fechaSeguimiento: ["", Validators.required],
            fechaProyectadaCierre: ["", Validators.required],
            fechaCierre: ["", Validators.required],
            descripcion: ["", Validators.required],
            evidencias: [[]],
        })
    }

    async ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.tarea = await this.tareaService.findByDetailId(id);

        /* Preload data */
        this.estadoList = [
            { label: 'Abierto', value: 'abierto' },
            { label: 'Cerrado en el tiempo', value: 'ct' },
            { label: 'Cerrado fuera de tiempo', value: 'cft' },
            { label: 'Vencido', value: 'vencido' },
        ];
    }

    get f() {
        return this.tareaForm.controls;
    }

    addImage(file) {
        let evidences = this.tareaForm.get('evidencias').value;
        evidences.push(file);
        this.tareaForm.patchValue({ evidencias: evidences });
    }

    onSubmit() {
        this.submitted = true;
        this.cargando = true;

        // if (!this.tareaForm.valid) {
        //     this.cargando = false;
        //     return;
        // }

        console.log('Data: ', this.tareaForm.value);
    }

}
