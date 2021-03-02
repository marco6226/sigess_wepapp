import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';

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
        'pkUser'

    ];
    estadosList: SelectItem[] = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' },
    ];

    constructor(private scmService: CasosMedicosService,
        private cargoService: CargoService,
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
        this.casosList = await this.scmService.getAll();
        this.casosList.forEach(element => {
            console.log(element);
            let cargo = this.cargoList.find(cargo => cargo.value == element.cargo)
            console.log(cargo);
            if (cargo.label && cargo.value != null) {
                element.cargo = cargo.label
            } else {
                element.cargo = "Sin definir";
            }

        });
    }


    onSubmit() { }

    openCase() {
        this.visibleForm = true;
        console.log(54, this.caseSelect);
    }

    openCaseConsultar() {
        this.consultar = true;
        this.visibleForm = true;

        console.log(54, this.caseSelect);
    }


    async onCancel() {
        this.visibleForm = false;
        await this.loadData();
        console.log("close form");
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
        console.log(filterQuery);
        try {
            let res: any = await this.scmService.findByFilter(filterQuery);
            this.casosList = res.data;
            this.totalRecords = res.count;

        } catch (error) {

        }


    }
}
