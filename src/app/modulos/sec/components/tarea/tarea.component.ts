import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    tareaForm: FormGroup;
    routeSub;

    constructor(fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
    ) {
        this.tareaForm = fb.group({})
    }

    async ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        console.log(await this.tareaService.find(id));
    }

    onSubmit() {

    }

}
