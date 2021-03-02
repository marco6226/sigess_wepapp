import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { Area } from 'app/modulos/empresa/entities/area'
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { Empresa } from 'app/modulos/empresa/entities/empresa'

import { Message } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ConfirmationService } from 'primeng/primeng';

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
    selector: 'app-empleado',
    templateUrl: './empleado.component.html',
    styleUrls: ['./empleado.component.scss'],
})
export class EmpleadoComponent implements OnInit {

    msgs: Message[] = [];
    empleadosList: Empleado[];
    empleadoSelect: Empleado;
    empresaId = this.sesionService.getEmpresa().id;
    visibleForm: boolean;
    show: boolean;

    isUpdate: boolean;
    isEditable: boolean;
    loading: boolean;
    totalRecords: number;
    fields: string[] = [
        'id',
        'primerNombre',
        'segundoNombre',
        'primerApellido',
        'segundoApellido',
        'numeroIdentificacion',
        'cargo_nombre',
        'usuario_email',
        'usuario_icon',
        'area_nombre',
        'estado',
    ];

    constructor(
        private empleadoService: EmpleadoService,
        private sesionService: SesionService,
        private confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.loading = true;
    }

    lazyLoad(event: any) {
        this.loading = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;

        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

        this.empleadoService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecords = resp['count'];
                this.loading = false;
                this.empleadosList = [];
                (<any[]>resp['data']).forEach(dto => this.empleadosList.push(FilterQuery.dtoToObject(dto)));
            }
        );
    }

    showAddForm() {
        this.visibleForm = true;
        this.isUpdate = false;
        this.empleadoSelect = null;
    }

    showUpdateForm() {
        if (this.empleadoSelect != null) {
            this.isUpdate = true;
            //console.log("FIX");
            this.visibleForm = true;
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar" });
        }
    }

    showForm() {
        if (this.empleadoSelect != null) {
            this.isUpdate = false;
            this.isEditable = false;
            this.show = true;
            //console.log("FIX");
            this.visibleForm = true;
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar" });
        }
    }


    onEmpleadoCreate(event: any) {
        this.manageCreateResponse(event.empleado);
        this.visibleForm = false;
    }

    onEmpleadoUpdate(event: any) {
        this.manageUpdateResponse(event.empleado);
        this.visibleForm = false;
    }

    onEmpleadoDelete() {
        if (this.empleadoSelect != null) {
            this.confirmationService.confirm({
                header: 'Eliminar empleado "' + this.empleadoSelect.numeroIdentificacion + '"',
                message: '¿Esta seguro de borrar este empleado?',
                accept: () => this.deleteEmpleado()
            });
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para eliminarlo" });
        }
    }

    deleteEmpleado() {
        this.empleadoService.delete(this.empleadoSelect.id)
            .then(data => {
                this.msgs = [];
                this.msgs.push({
                    severity: 'success',
                    summary: "Empleado eliminado",
                    detail: "Ha sido eliminado el empleado " + this.empleadoSelect.numeroIdentificacion
                });
                this.empleadoSelect.estado = 'ELIMINADO';
            });
    }

    onCancel() {
        this.visibleForm = false;
    }

    manageUpdateResponse(empleado: Empleado) {
        for (let i = 0; i < this.empleadosList.length; i++) {
            if (this.empleadosList[i].id = empleado.id) {
                this.empleadosList[i] = empleado;
                break;
            }
        }
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Empleado actualizado', detail: 'Se ha actualizado el empleado ' + empleado.numeroIdentificacion });
    }

    manageCreateResponse(empleado: Empleado) {
        this.empleadosList.push(empleado);
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Nuevo empleado creado', detail: "Se ha creado el empleado " + empleado.numeroIdentificacion });
    }

}
