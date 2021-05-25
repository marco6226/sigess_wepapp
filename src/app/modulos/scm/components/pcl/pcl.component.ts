import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { SelectItem } from 'primeng/primeng';
import { CasosMedicosService } from '../../services/casos-medicos.service';

@Component({
    selector: 'app-pcl',
    templateUrl: './pcl.component.html',
    styleUrls: ['./pcl.component.scss']
})
export class PclComponent implements OnInit {

    @Input() diagnosticos: any[];
    @Input() pclOptionList: any[];
    @Input() emitPclentity: any[];

    diagList: SelectItem[] = [{ label: "--Seleccione--", value: null }];
    localeES: any = locale_es;
    tipoTratamientos: SelectItem[] = [];
    pclList = [];
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();

    modalDianostico: boolean = false;
    pclForm: FormGroup;
    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
    ) {
        this.pclForm = fb.group({
            diag: [null, Validators.required],
            porcentajePcl: [null, /*Validators.required*/],
            pcl: [null, /*Validators.required*/],
            emisionPclFecha: [null, /*Validators.required*/],
            entidadEmitePcl: [null, /*Validators.required*/],

        });
    }

    ngOnInit() {
        console.log(this.diagnosticos);
        this.diagnosticos.map(diag => {
            this.diagList.push({ value: diag.id, label: diag.detalle })
        })
    }

    onRowEditSave() {

    }
    onRowEditCancel() { }


    nuevoTratamiento() {
        this.modalDianostico = true;
    }

    async onSubmit() {
        console.log(await this.scmService.createPcl(this.pclForm.value))
    }
}
