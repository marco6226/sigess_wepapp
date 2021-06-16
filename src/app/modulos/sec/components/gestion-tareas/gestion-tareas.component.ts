import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Area } from 'app/modulos/empresa/entities/area'
import { Tarea } from 'app/modulos/sec/entities/tarea'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ConfirmationService } from 'primeng/api';
import { Desviacion } from 'app/modulos/sec/entities/desviacion';
import { Empleado } from 'app/modulos/empresa/entities/empleado';

@Component({
    selector: 's-gestionTareas',
    templateUrl: './gestion-tareas.component.html',
    styleUrls: ['./gestion-tareas.component.scss']
})
export class GestionTareasComponent implements OnInit {

    @Output("onEvent") onEvent = new EventEmitter();

    @Input('tareasList') tareasList: Tarea[];
    @Input('readOnly') readOnly: boolean;

    modificar: boolean;
    adicionar: boolean;
    form: FormGroup;
    es: any;
    fechaActual = new Date();
    yearRange: string = this.fechaActual.getFullYear() + ":" + (this.fechaActual.getFullYear() + 1);

    constructor(
        private confirmationService: ConfirmationService,
        public fb: FormBuilder,
    ) {
        this.form = fb.group({
            'id': [null],
            'nombre': [null, Validators.required],
            'descripcion': [null, Validators.required],
            'tipoAccion': [null, Validators.required],
            'jerarquia': [null, Validators.required],
            'fechaProyectada': [null, Validators.required],
            'areaResponsable': [null],
            'empResponsable': [null, Validators.required],
            'modulo': [null],
        });
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        };
    }

    ngOnInit() {
        this.adicionar = !this.readOnly;
        this.modificar = false;
    }

    onSubmit() {
        let tarea = new Tarea();
        tarea.nombre = this.form.value.nombre;
        tarea.descripcion = this.form.value.descripcion;
        tarea.tipoAccion = this.form.value.tipoAccion;
        tarea.jerarquia = this.form.value.jerarquia;
        tarea.fechaProyectada = this.form.value.fechaProyectada;
        tarea.estado = this.form.value.estado;
        console.log(this.form.value);
        if (this.form.value.areaResponsable != null) {
            tarea.areaResponsable = new Area();
            tarea.areaResponsable.id = this.form.value.areaResponsable.id;
            tarea.areaResponsable.nombre = this.form.value.areaResponsable.nombre;
        }
        if (this.form.value.empResponsable != null) {
            tarea.empResponsable = new Empleado();
            tarea.empResponsable.id = this.form.value.empResponsable.id;
            tarea.empResponsable.primerNombre = this.form.value.empResponsable.primerNombre;
        }

        if (this.modificar) {
            tarea.id = this.form.value.id;
        } else if (this.adicionar) {
        }
        this.manageResponse(tarea);
    }

    cargarTarea(tarea: Tarea) {
        this.form.patchValue({
            id: tarea.id,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            tipoAccion: tarea.tipoAccion,
            jerarquia: tarea.jerarquia,
            modulo: tarea.modulo,
            fechaProyectada: new Date(tarea.fechaProyectada),
            areaResponsable: tarea.areaResponsable,
            empResponsable: tarea.empResponsable
        });
        this.modificar = true;
        this.adicionar = false;
    }

    resetModificar() {
        this.form.reset();
        this.modificar = false;
        this.adicionar = true;
    }

    removeTarea(tarea: Tarea) {
        this.confirmationService.confirm({
            header: 'Eliminar tarea \"' + tarea.nombre + '\"',
            message: 'La tarea será removida del plan de trabajo, los cambios realizados se harán efectivos al momento de guardar. ¿Desea continuar?',
            accept: () => {
                this.tareasList.splice(this.tareasList.indexOf(tarea), 1);
                this.tareasList = this.tareasList.slice();
                this.onEvent.emit({ type: 'onRemove', data: this.tareasList });
            }
        });

    }

    manageResponse(tarea: Tarea) {
        if (this.tareasList == null) {
            this.tareasList = [];
        }
        tarea.estado = 'NUEVO';
        if (this.adicionar) {
            this.tareasList = this.tareasList.concat(tarea);
            this.onEvent.emit({ type: 'onCreate', data: this.tareasList });
        } else if (this.modificar) {
            for (let i = 0; i < this.tareasList.length; i++) {
                if (this.tareasList[i].id === tarea.id) {
                    this.tareasList[i] = tarea;
                    break;
                }
            }
            this.tareasList = this.tareasList.slice();
            this.onEvent.emit({ type: 'onUpdate', data: this.tareasList });
            this.modificar = false;
            this.adicionar = true;
        }
        this.form.reset();
    }
}
