import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem, Message } from "primeng/api";
import { CasosMedicosService } from "../../services/casos-medicos.service";

@Component({
    selector: "app-seguimientosgenericoform",
    templateUrl: "./seguimientosgenericoform.component.html",
    styleUrls: ["./seguimientosgenericoform.component.scss"],
})
export class SeguimientosgenericoformComponent implements OnInit, OnChanges {

    epsList: SelectItem[];
    afpList: SelectItem[];
    msgs: Message[];
    responsableEmpresaNombre = "";
    empleado: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity: epsorarl;
    @Input() recoSelect: any;
    @Input() seguigenericoSelect: any;
  

    empleadosList = [];
    fechaActual = new Date();
    recomendation: FormGroup;
    seguimientogenerico: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions = [];

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService

    ) {
        this.seguimientogenerico = fb.group({

            seguimiento: [null, Validators.required],
            tarea: [""],
            resultado: [null, Validators.required],
            fechaSeg: [null, Validators.required],
            responsable: [null],            
            responsableExterno: [null],
            generico: [true]
           

        });

    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get resultado() { return this.seguimientogenerico.get('resultado'); }



    async ngOnInit() {
        if (this.seguigenericoSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }

    }

    clearInputs() {
        this.seguimientogenerico.reset();
    }

    async onSubmit() {
        this.msgs = [];
        console.log(this.seguimientogenerico.value);
        // if (!this.seguimiento.valid) {
        //     return this.markFormGroupTouched(this.seguimiento);
        // }
        
            if (this.seguimientogenerico.value.responsable)
            this.seguimientogenerico.value.responsable = this.seguimientogenerico.value.responsable.id;
        
        console.log(this.accions);
        console.log(this.accions);
        let {

            tarea,
            seguimiento,
            fechaSeg,
            resultado,            
            responsable,
            responsableExterno,
            generico,
            
            
        } = this.seguimientogenerico.value;

        if (this.accions.length > 0) {
            this.accions.forEach(act => {
                if (typeof act.responsable != 'number') {
                    console.log("Aqui entro");
                    act.responsable = null;
                }
            })
        }

        let body = {            
            fechaSeg,            
            seguimiento,
            tarea,
            resultado,
            responsable,
            responsableExterno,
            generico:true,            
            pkCase: this.id,
        }

        try {
            let res: any;
            if (this.seguigenericoSelect) {
                res = await this.scmService.updateSeguimientogenerico(body);
            } else {
                res = await this.scmService.createSeguimientogenerico(body);
            }

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: 'Mensaje del sistema',
                    detail: this.seguigenericoSelect ? "El seguimiento fue actualizado exitosamente" : "El seguimiento fue creado exitosamente",
                    //detail: `Su numero de caso es ${status}`,
                });
                setTimeout(() => {
                    this.accions = [];
                    this.seguimientogenerico.reset();
                    this.eventClose.emit()
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

    patchFormValues() {
        console.log(this.seguigenericoSelect);
         if (this.seguigenericoSelect) {
        
             this.accions.map(act => act.responsable = this.onSelectionResponsable(act.responsableEmpresa))
             this.seguimientogenerico.patchValue({
                fechaSeg: this.seguigenericoSelect.fechaSeg == null ? null : new Date(this.seguigenericoSelect.fechaSeg),
                responsableExterno: this.seguigenericoSelect.responsableExterno,
                responsable: this.seguigenericoSelect.responsable.id,
                resultado: this.seguigenericoSelect.resultado,
                 tarea: this.seguigenericoSelect.tarea,
                 seguimientogenerico: this.seguigenericoSelect.seguimiento,
                 //generico: this.seguigenericoSelect.generico
             })
         } else {
            this.clearInputs();
        }
       console.log(this.seguigenericoSelect);
    }

    onSelectionResponsable(event) {
        console.log(event)
        if (!event) return;
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        return empleado;
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }


    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }


    onRowEditInit(product, type?) {
        console.log(this.accions);

    }

    async onRowCloneInit(pseg, type?) {
        this.msgs = [];
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;

        try {
            let resp = await this.scmService.createSeguimientogenerico(product);
            this.msgs.push({
                severity: "success",
                summary: "Mensaje del sistema",
                detail: `Se ha clonado exitosamente`,
            });

            //  this.fechaSeg();
        } catch (error) {
            console.log(error);
            this.msgs.push({
                severity: "danger",
                summary: "Mensaje del sistema",
                detail: `Ocurrió un inconveniente al clonar`,
            });
        }

    }

    async onRowEditSave(product, index) {
        console.log(product, index);
        this.accions[index] = product;
    }


    deleteFromArray(array, index) {

    }

    onRowDelete(index) {
        this.accions.splice(index, 1);

    }
    nuevaActividad() {
        let actv = { actividad: "", descripcionAct: "", responsableExterno: null, responsableEmpresa: null, fechaProyectada: new Date() }
        this.accions.push(actv)
    }

    onRowEditCancel(product, index: number) {

    }


}

import { Pipe, PipeTransform } from '@angular/core';
import { epsorarl } from "../../entities/eps-or-arl";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'seguimientogenericostatus' })
export class SeguimientogenericoStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}