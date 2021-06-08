import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs';
import { epsorarl } from '../../entities/eps-or-arl';
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
    @Output() eventClose = new EventEmitter<any>()
    @Input() entity: epsorarl;

    pclCalificacionList = [
        { label: "--Seleccione--", value: null },
        { label: "En Proceso", value: "1" },
        { label: "En Firme", value: "2" },
        { label: "En Apelación", value: "0" }
    ]

    diagList: SelectItem[] = [{ label: "--Seleccione--", value: null }];
    localeES: any = locale_es;
    tipoTratamientos: SelectItem[] = [];
    pclList = [];

    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    msgs;
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
            entidadEmiteCalificacion: [null, /*Validators.required*/],
            statusDeCalificacion: [null, /*Validators.required*/],
            entidadEmitidaCalificacion: [null, /*Validators.required*/],
            fechaCalificacion: [null, /*Validators.required*/],
            entidadEmitida: [null, /*Validators.required*/],

        });

    }

    async ngOnInit() {
        this.diagnosticos.map(diag => {
            this.diagList.push({ value: diag.id.toString(), label: diag.diagnostico });
        })

        this.iniciarPcl();
    }

    onRowEditSave(pcl) {
        console.log("Deberia guardar");
        this.onSubmit(pcl);
    }

    onRowEditCancel() { }

    async iniciarPcl() {
        this.pclList = await this.scmService.getListPcl();
        this.pclList.map(pcl => {
            console.log(pcl);
            pcl.emisionPclFecha = pcl.emisionPclFecha == null ? null : new Date(pcl.emisionPclFecha);
            pcl.fechaCalificacion = pcl.fechaCalificacion == null ? null : new Date(pcl.fechaCalificacion);
            pcl.entidadEmitida = parseInt(pcl.entidadEmitida);
        })
    }
    async onRowDelete(pcl) {
        this.msgs = [];
        try {
            let res = await this.scmService.deletePcl(pcl);

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: "Pcl Eliminada",
                    //detail: `Su numero de caso es ${status}`,
                });
                setTimeout(() => {
                    this.eventClose.emit()
                }, 1000);
                setTimeout(() => {
                    this.resetDiags()
                }, 1500);
            }
        } catch (error) {
            this.msgs.push({
                severity: "error",
                summary: "Error",
                // detail: `de el usuario ${emp.numeroIdentificacion}`,
            });
        }
    }

    nuevoTratamiento() {
        this.modalDianostico = true;
    }

    async resetDiags() {
        this.diagList = [];
        this.diagnosticos.map(diag => {
            this.diagList.push({ value: diag.id.toString(), label: diag.diagnostico });
        }).every
        console.log(this.diagnosticos);
        this.iniciarPcl();


    }

    async onSubmit(upd?) {
        this.msgs = [];
        if (!this.pclForm.valid && !upd) {
            return this.markFormGroupTouched(this.pclForm);
        }
        try {
            let res: any;
            if (upd) {
                res = await this.scmService.updatePcl(upd);
            } else {
                res = await this.scmService.createPcl(this.pclForm.value);
            }
            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: upd ? "Pcl Actualizado" : 'Pcl Creado',
                    //detail: `Su numero de caso es ${status}`,
                });
                this.eventClose.emit()
                setTimeout(() => {
                    this.pclForm.reset();
                    this.modalDianostico = false;
                    this.resetDiags();
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
