import { Component, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { SelectItem, Message } from 'primeng/primeng'
import { ReporteAusentismoService } from 'app/modulos/aus/services/reporte-ausentismo.service'
import { CausaAusentismoService } from 'app/modulos/aus/services/causa-ausentismo.service'
import { CausaAusentismo } from 'app/modulos/aus/entities/causa-ausentismo'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { ReporteAusentismo } from 'app/modulos/aus/entities/reporte-ausentismo'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria } from '../../../core/entities/filter';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reporte-ausentismo',
    templateUrl: './reporte-ausentismo.component.html',
    styleUrls: ['./reporte-ausentismo.component.scss'],
    providers: [CausaAusentismoService, ReporteAusentismoService]
})
export class ReporteAusentismoComponent implements OnInit {

    msgs: Message[];
    localeES: any = locale_es;
    causasAusentismoList: SelectItem[];
    form: FormGroup;
    actualizar: boolean;
    adicionar: boolean;
    backToScm = false;
    constructor(
        private causaAusentismoService: CausaAusentismoService,
        private reporteAusentismoService: ReporteAusentismoService,
        private paramNavService: ParametroNavegacionService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            id: [null],
            fechaRadicacion: [null, Validators.required],
            entidadOtorga: [null, Validators.required],
            fechaDesde: [null, Validators.required],
            fechaHasta: [null, Validators.required],
            diasAusencia: [null],
            empleado: [null, Validators.required],
            ciudad: [null, Validators.required],
            cie: null,
            causaAusentismoId: [null, Validators.required]
        });

        let reporteAus = this.paramNavService.getParametro<ReporteAusentismo>();
        if (reporteAus == null) {
            this.adicionar = true;
        } else {
            let filter = new FilterQuery();
            filter.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: reporteAus.id }];
            this.reporteAusentismoService.findByFilter(filter).then(
                resp => {
                    reporteAus = (resp['data'])[0];
                    this.form.patchValue({
                        id: reporteAus.id,
                        fechaRadicacion: reporteAus.fechaRadicacion == null ? null : new Date(reporteAus.fechaRadicacion),
                        entidadOtorga: reporteAus.entidadOtorga,
                        fechaDesde: reporteAus.fechaDesde == null ? null : new Date(reporteAus.fechaDesde),
                        fechaHasta: reporteAus.fechaHasta == null ? null : new Date(reporteAus.fechaHasta),
                        horasAusencia: reporteAus.horasAusencia,
                        diasAusencia: reporteAus.diasAusencia,
                        ciudad: reporteAus.ciudad,
                        empleado: reporteAus.empleado,
                        cie: reporteAus.cie,
                        causaAusentismoId: reporteAus.causaAusentismo.id
                    });
                }
            );
            this.form.valueChanges.subscribe(res => {
                
            })
        }

        let accion = this.paramNavService.getAccion<string>();
        this.actualizar = (accion == 'PUT');

        this.paramNavService.reset();
    }

    get daysCount() {
        let fecha1 = moment(new Date(this.form.get('fechaDesde').value))

        let fecha2 = moment(new Date(this.form.get('fechaHasta').value))

        return Math.abs(fecha1.diff(fecha2, "days"))

    }
    test() {
        console.log(moment(new Date(this.form.get('fechaDesde').value)), moment(new Date(this.form.get('fechaHasta').value)));
        console.log(this.form.get('fechaDesde').value, this.form.get('fechaHasta').value)



        console.log(

        )
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(async params => {
            if (params.case) {
                this.backToScm = true;
            }
        })

        this.causasAusentismoList = [];
        this.causasAusentismoList.push({ label: '--seleccione--', value: null });
        this.causaAusentismoService.findAll().then(
            data => {
                (<CausaAusentismo[]>data).forEach(element => {
                    this.causasAusentismoList.push({ label: element.nombre, value: element.id })
                });
                this.causasAusentismoList = this.causasAusentismoList.slice();
            }
        );
    }

    onSubmit() {
        let reporteAus = new ReporteAusentismo();
        reporteAus.causaAusentismo = new CausaAusentismo();
        reporteAus.causaAusentismo.id = this.form.value.causaAusentismoId;
        reporteAus.cie = this.form.value.cie;
        reporteAus.empleado = new Empleado();
        reporteAus.empleado.id = this.form.value.empleado.id;
        reporteAus.entidadOtorga = this.form.value.entidadOtorga;
        reporteAus.fechaDesde = this.form.value.fechaDesde;
        reporteAus.fechaHasta = this.form.value.fechaHasta;
        reporteAus.fechaRadicacion = this.form.value.fechaRadicacion;
        reporteAus.diasAusencia = this.daysCount;
        reporteAus.ciudad = this.form.value.ciudad;
        if (this.adicionar) {
            this.reporteAusentismoService.create(reporteAus).then(
                data => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Reporte realizado', detail: 'Se ha generado correctamente el reporte de ausentismo' });
                    this.form.reset();
                }
            );
        } else if (this.actualizar) {
            reporteAus.id = this.form.value.id;

            this.reporteAusentismoService.update(reporteAus).then(
                data => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Reporte actualizado', detail: 'Se ha actualizado correctamente el reporte de ausentismo' });
                    this.form.reset();
                }
            );
        }
    }
}
