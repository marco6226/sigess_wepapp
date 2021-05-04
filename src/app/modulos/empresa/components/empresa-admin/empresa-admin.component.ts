import { Component, OnInit } from '@angular/core';

import { Empresa } from './../../entities/empresa'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { config } from 'app/config'
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Arl } from 'app/modulos/comun/entities/arl';
import { Ciiu } from 'app/modulos/comun/entities/ciiu';
import { EmpresaService } from './../../services/empresa.service'
import { ComunService } from 'app/modulos/comun/services/comun.service'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'

import { SelectItem, Message } from 'primeng/primeng'

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-empresa-admin',
    templateUrl: './empresa-admin.component.html',
    styleUrls: ['./empresa-admin.component.scss'],
})
export class EmpresaAdminComponent implements OnInit {

    msgs: Message[] = [];
    empresaSelect: Empresa;
    arlList: SelectItem[] = [];
    ciiuList: SelectItem[] = [];
    empresasList: Empresa[];
    visibleForm: boolean;
    form: FormGroup;
    isUpdate: boolean;

    loading: boolean;
    totalRecords: number;
    fields: string[] = [
        'id',
        'razonSocial',
        'nombreComercial',
        'nit',
        'direccion',
        'telefono',
        'numeroSedes',
        'email',
        'web',
        'arl_id',
        'arl_nombre',
        'ciiu_codigo',
        'ciiu_nombre',
        'ciiu_id',
    ];
    constructor(
        private empresaService: EmpresaService,
        private fb: FormBuilder,
        private comunService: ComunService,
        private sesionService: SesionService,
    ) {
        this.form = fb.group({
            'id': [null],
            'nombreComercial': [null, Validators.required],
            'razonSocial': [null, Validators.required],
            'nit': [null],
            'direccion': [null],
            'telefono': [null],
            'numero_sedes': [null],
            'email': [null],
            'web': [null],
            'arlId': [null],
            'ciiuId': [null]
        });
    }

    ngOnInit() {
        this.loading = true;
        this.arlList.push({ label: '--Seleccione--', value: null });
        this.ciiuList.push({ label: '--Seleccione--', value: null });
        this.comunService.findAllArl().then(
            data => {
                (<Arl[]>data).forEach(arl => {
                    this.arlList.push({ label: arl.nombre, value: arl.id });
                });
            }
        );
        this.comunService.findAllCiiu().then(
            data => {
                (<Ciiu[]>data).forEach(ciiu => {
                    this.ciiuList.push({ label: ciiu.codigo + ' - ' + ciiu.nombre, value: ciiu.id });
                });
            }
        );

    }

    lazyLoad(event: any) {
        this.loading = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        filterQuery.groupBy = "nit";
        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

        this.empresaService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecords = (<any[]>resp['data']).length;
                this.loading = false;
                this.empresasList = [];
                (<any[]>resp['data']).forEach(dto => this.empresasList.push(FilterQuery.dtoToObject(dto)));
            }
        );
    }


    showAddForm() {
        this.form.reset();
        this.visibleForm = true;
        this.isUpdate = false;
    }

    showUpdateForm() {
        this.visibleForm = true;
        this.isUpdate = true;
        this.form.patchValue({
            'id': this.empresaSelect.id,
            'nombreComercial': this.empresaSelect.nombreComercial,
            'razonSocial': this.empresaSelect.razonSocial,
            'nit': this.empresaSelect.nit,
            'direccion': this.empresaSelect.direccion,
            'telefono': this.empresaSelect.telefono,
            'numero_sedes': this.empresaSelect.numero_sedes,
            'email': this.empresaSelect.email,
            'web': this.empresaSelect.web,
            'arlId': this.empresaSelect.arl == null ? null : this.empresaSelect.arl.id,
            'ciiuId': this.empresaSelect.ciiu == null ? null : this.empresaSelect.ciiu.id
        });
    }

    closeForm() {
        this.visibleForm = false;
    }

    onSubmit() {
        let empresa = new Empresa();
        empresa.id = this.form.value.id;
        empresa.nombreComercial = this.form.value.nombreComercial;
        empresa.razonSocial = this.form.value.razonSocial;
        empresa.nit = this.form.value.nit;
        empresa.direccion = this.form.value.direccion;
        empresa.telefono = this.form.value.telefono;
        empresa.numero_sedes = this.form.value.numero_sedes;
        empresa.email = this.form.value.email;
        empresa.web = this.form.value.web;

        if (this.form.value.arlId != null) {
            empresa.arl = new Arl();
            empresa.arl.id = this.form.value.arlId;
        }
        if (this.form.value.ciiuId != null) {
            empresa.ciiu = new Ciiu();
            empresa.ciiu.id = this.form.value.ciiuId;
        }

        if (this.isUpdate) {
            this.empresaService.update(empresa).then(
                resp => this.manageResponse(<Empresa>resp)
            );
        } else {
            this.empresaService.create(empresa).then(
                resp => this.manageResponse(<Empresa>resp)
            );
        }
    }

    manageResponse(empresa: Empresa) {
        if (!this.isUpdate) {
            this.empresasList.push(empresa);
            this.empresasList = this.empresasList.slice();
        } else {
            for (let i = 0; i < this.empresasList.length; i++) {
                if (this.empresasList[i].id == empresa.id) {
                    this.empresasList[i].nit = empresa.nit;
                    this.empresasList[i].direccion = empresa.direccion;
                    this.empresasList[i].telefono = empresa.telefono;
                    this.empresasList[i].numero_sedes = empresa.numero_sedes;
                    this.empresasList[i].email = empresa.email;
                    this.empresasList[i].web = empresa.web;

                    this.empresasList[i].nombreComercial = empresa.nombreComercial;
                    this.empresasList[i].razonSocial = empresa.razonSocial;
                    this.empresasList[i].arl = empresa.arl;
                    this.empresasList[i].ciiu = empresa.ciiu;
                    break;
                }
            }
        }
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Empresa ' + (this.isUpdate ? 'actualizada' : 'creada'),
            detail: 'Se ha ' + (this.isUpdate ? 'actualizado' : 'creado') + ' correctamente la empresa ' + empresa.razonSocial
        });
        this.visibleForm = false;
        this.empresaSelect = null;
    }

    onDelete() {

    }
}
