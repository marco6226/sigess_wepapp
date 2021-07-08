import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

    tareaForm: FormGroup;
    routeSub;
    tarea: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    constructor(fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
    ) {
        this.tareaForm = fb.group({})
    }

    async ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.tarea = await this.tareaService.findByDetailId(id);
    }

    onSubmit() {

    }

}
