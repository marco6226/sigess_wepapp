import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/primeng';
import { RecursoService } from 'app/modulos/admin/services/recurso.service'
import { PerfilService } from 'app/modulos/admin/services/perfil.service'
import { PermisoService } from 'app/modulos/admin/services/permiso.service'
import { Recurso } from 'app/modulos/empresa/entities/recurso'
import { Permiso } from 'app/modulos/empresa/entities/permiso'
import { Perfil } from 'app/modulos/empresa/entities/perfil'
import { SelectItem } from 'primeng/primeng'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { AreaService } from '../../../empresa/services/area.service';
import { Area } from '../../../empresa/entities/area';
import { Filter } from 'app/modulos/core/entities/filter';

@Component({
    selector: 's-permisos',
    templateUrl: './permisos.component.html',
    styleUrls: ['./permisos.component.scss'],
    providers: [RecursoService, PermisoService],
})
export class PermisosComponent implements OnInit {

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
        this.areaService.findAll().then(
            // resp => (<Area[]>resp['data']).forEach(area => this.areaList.push({ label: area.nombre, value: area.id ,title: area.areaPadre.nombre }))
            resp => (<Area[]>resp['data']).forEach(area=>{
                if(area.areaPadre.nombre == undefined || area.areaPadre.nombre == null){
                    this.areaList.push({label: area.nombre +" - "+ area.areaPadre.toString(),value : area.id})
                }else{
                    this.areaList.push({label: area.nombre  +" - "+ area.areaPadre.nombre,value: area.id})
                }
            })
        );
        console.log(this.areaList);


        this.perfilesList.push({ label: '--Seleccione--', value: null });
        this.perfilService.findAll().then(
            data => (<Perfil[]>data['data']).forEach(element => this.perfilesList.push({ label: element.nombre, value: element }))
        );

        let filterQuery = new FilterQuery();
        filterQuery.sortField = "modulo";
        filterQuery.sortOrder = -1;
        this.recursoService.findByFilter(filterQuery).then(
            data => {

                let scm = [];
                let tmpArray = <Recurso[]>data['data'];
                for (let idx = 0; idx < tmpArray.length; idx++) {
                    if (tmpArray[idx].modulo == "Seguimiento de casos medicos" && tmpArray[idx].codigo == "SCM_PERF_SCM") {
                        scm.push(tmpArray[idx]);
                    }
                }
                tmpArray = tmpArray.filter(rcs => rcs.modulo != "Seguimiento de casos medicos");
                this.recursosList = [...tmpArray, ...scm];
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
