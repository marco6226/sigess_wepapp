import { Message } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { PermisoService } from 'app/modulos/admin/services/permiso.service';
import { RecursoService } from 'app/modulos/admin/services/recurso.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Area } from 'app/modulos/empresa/entities/area';
import { Perfil } from 'app/modulos/empresa/entities/perfil';
import { Permiso } from 'app/modulos/empresa/entities/permiso';
import { Recurso } from 'app/modulos/empresa/entities/recurso';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { SelectItem } from 'primeng/primeng';
import { filter } from 'rxjs-compat/operator/filter';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';

@Component({
    selector: 'app-scmpermisos',
    templateUrl: './scmpermisos.component.html',
    styleUrls: ['./scmpermisos.component.scss']
})
export class ScmpermisosComponent implements OnInit {

    perfilesList: SelectItem[] = [];
    recursosList: Recurso[];
    perfilSelect: Perfil;
    permisosList: Permiso[];
    msgs: Message[] = [];
    rowGroupMetadata: any;
    areaList: SelectItem[] = [];

    constructor(
        private areaService: AreaService,
        private recursoService: RecursoService,
        private permisoService: PermisoService,
        private perfilService: PerfilService,
    ) { }

    ngOnInit() {
        let filterQuery = new FilterQuery();

        this.areaService.findAll().then(
            resp => (<Area[]>resp['data']).forEach(area => this.areaList.push({ label: area.nombre, value: area.id }))
        );

        this.perfilesList.push({ label: '--Seleccione--', value: null });
        filterQuery.filterList = [
            {
                field: "descripcion",
                criteria: Criteria.EQUALS,
                value1: "medic",
                value2: null
            }
        ];
        this.perfilService.findByFilter(filterQuery).then(
            data => (<Perfil[]>data['data']).forEach(element => this.perfilesList.push({ label: element.nombre, value: element }))
        );

        filterQuery.filterList = [
            {
                field: "modulo",
                criteria: Criteria.EQUALS,
                value1: "Seguimiento de casos medicos",
                value2: null
            }
        ];
        filterQuery.sortField = "modulo";
        filterQuery.sortOrder = -1;

        this.recursoService.findByFilter(filterQuery).then(
            data => {
                this.recursosList = <Recurso[]>data['data'];
                this.updateRowGroupMetaData();
            }
        );
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
        if (this.recursosList) {
            for (let i = 0; i < this.recursosList.length; i++) {
                let rowData = this.recursosList[i];
                let modulo = rowData.modulo;
                if (i == 0) {
                    this.rowGroupMetadata[modulo] = { index: 0, size: 1 };
                } else {
                    let previousRowData = this.recursosList[i - 1];
                    let previousRowGroup = previousRowData.modulo;
                    if (modulo === previousRowGroup)
                        this.rowGroupMetadata[modulo].size++;
                    else
                        this.rowGroupMetadata[modulo] = { index: i, size: 1 };
                }
            }
        }
    }

    cargarPermisos(perfil: Perfil) {
        if (perfil == null) {
            this.permisosList = null;
            return;
        }
        this.permisoService.findAllByPerfil(perfil.id).then(
            data => {
                this.permisosList = <Permiso[]>data;
                this.cruzarDatos();
            }
        );
    }

    cruzarDatos() {
        this.recursosList.forEach(recurso => {
            recurso.selected = false;
            recurso['areas'] = null;
            this.permisosList.forEach(permiso => {
                if (permiso.recurso.id == recurso.id) {
                    recurso.selected = permiso.valido;
                    if (recurso['validacionArea']) {
                        recurso['areas'] = permiso.areas == null ? null : permiso.areas.replace('{', '').replace('}', '').replace(' ', '').split(',');
                        if (recurso['areas']) {
                            recurso['areas'].forEach((value, index) => {

                                recurso["areas"][index] = parseInt(value);
                            });;
                        }

                    }
                }
            });

        });

    }

    actualizarListado(event: any) {
        this.perfilSelect = event.value;
        this.cargarPermisos(this.perfilSelect);
    }

    actualizarPermiso(recurso: Recurso) {
        let permiso = new Permiso();
        permiso.valido = recurso.selected;
        permiso.recurso = new Recurso();
        permiso.recurso.id = recurso.id;
        permiso.perfil = new Perfil();
        permiso.perfil.id = this.perfilSelect.id;
        if (recurso['validacionArea']) {
            permiso.areas = '{' + recurso['areas'].toString() + '}';
        }
        this.permisoService.update(permiso).then(
            resp => {
                this.msgs = [];
                this.msgs.push({ summary: 'PERMISO ACTUALIZADO', detail: 'El permiso se ha actualizado correctamente', severity: 'success' });
            }
        );
    }


}