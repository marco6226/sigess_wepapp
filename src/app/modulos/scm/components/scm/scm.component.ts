import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';

@Component({
    selector: 'app-scm',
    templateUrl: './scm.component.html',
    styleUrls: ['./scm.component.scss'],
})

export class ScmComponent implements OnInit {
    empresaId: string;
    casosList: any;
    usuarioSelect: Usuario;
    perfilList: SelectItem[] = [];
    visibleDlg: boolean;
    caseSelect: any;
    cargoList = [];
    msgs: Message[] = [];
    consultar = false;
    isUpdate: boolean;
    form: FormGroup;
    visibleForm: boolean;
    solicitando: boolean = false;
    loading: boolean = false;;
    totalRecords: number;
    fields: string[] = [
        'id',
        'fechaCreacion',
        'region',
        'ciudad',
        'names',
        'documento',
        'cargo',
        'statusCaso',
        'casoMedicoLaboral',
        'razon',
        'pkUser',
        'sve',

    ];
    estadosList: SelectItem[] = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' },
    ];

    constructor(private scmService: CasosMedicosService,
        private cargoService: CargoService,
        private paramNav: ParametroNavegacionService,
    ) { }

    async ngOnInit() {

        await this.cargoService.findAll().then(
            resp => {
                this.cargoList = [];
                this.cargoList.push({ label: '--Seleccione--', value: null });
                (<Cargo[]>resp['data']).forEach(cargo => {
                    this.cargoList.push({ label: cargo.nombre, value: cargo.id });
                });
                //this.cargoList = this.cargoList.slice();
            }
        );

        await this.loadData();
    }

    async loadData() {

    }


    onSubmit() { }

    openCase() {
        this.consultar = false;
        this.visibleForm = true;
        this.paramNav.redirect('/app/scm/list/');
        // + this.caseSelect.id);

    }

    


    openCaseConsultar() {
        this.consultar = true;
        this.visibleForm = true;

    }


    async onCancel() {
        this.visibleForm = false;
        await this.loadData();
    }

    eliminar() { }

    async lazyLoad(event: any) {
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;

        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        try {
            let res: any = await this.scmService.findByFilter(filterQuery);
            this.casosList = res.data;
            this.totalRecords = res.count;

        } catch (error) {

        }


    }
}
