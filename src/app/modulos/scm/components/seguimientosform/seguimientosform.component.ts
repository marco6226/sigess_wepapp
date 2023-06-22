import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem, Message } from "primeng/api";
import { CasosMedicosService } from "../../services/casos-medicos.service";

@Component({
    selector: "app-seguimientosform",
    templateUrl: "./seguimientosform.component.html",
    styleUrls: ["./seguimientosform.component.scss"],
})
export class SeguimientosformComponent implements OnInit, OnChanges {

    epsList: SelectItem[];
    afpList: SelectItem[];
    msgs: Message[];
    responsableEmpresaNombre = "";
    empleado: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity: epsorarl;
    @Input() recoSelect: any;
    @Input() seguiSelect: any;
    @Input('prioridad') 
    set prioridadIn(prioridad: any){
        switch (prioridad) {
            case 'Baja':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*365))//un año
                break;
            case 'Media':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*183))// un semestre
                break;
            case 'Alta':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*60))// un bimestre
                break;
            default:
                break;
        }
    }
  
    fechaProximaDate?:Date
    empleadosList = [];
    fechaActual = new Date();
    recomendation: FormGroup;
    seguimiento: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions = [];

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService

    ) {
        this.seguimiento = fb.group({

            seguimiento: [null],
            tarea: [""],
            resultado: [null],
            fechaSeg: [null],
            responsable: [null],            
            responsableExterno: [null],
            generico: [false],
            proxfechaSeg: [null]
           

        });

    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get resultado() { return this.seguimiento.get('resultado'); }



    async ngOnInit() {
        if (this.seguiSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }

    }

    clearInputs() {
        this.seguimiento.reset();
    }

    async onSubmit() {
        this.msgs = [];
        console.log(this.seguimiento.value);
        // if (!this.seguimiento.valid) {
        //     return this.markFormGroupTouched(this.seguimiento);
        // }
        
            if (this.seguimiento.value.responsable)
            this.seguimiento.value.responsable = this.seguimiento.value.responsable.id;
        
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
            proxfechaSeg
            
        } = this.seguimiento.value;

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
            generico:false,
            pkCase: this.id,
            proxfechaSeg
        }

        try {
            let res: any;
            if (this.seguiSelect) {
                res = await this.scmService.updateSeguimiento(body);
            } else {
                res = await this.scmService.createSeguimiento(body);
            }

            if (res) {
                this.msgs.push({
                    severity: "success",
                    summary: 'Mensaje del sistema',
                    detail: this.seguiSelect ? "El seguimiento fue actualizado exitosamente" : "El seguimiento fue creado exitosamente",
                    //detail: `Su numero de caso es ${status}`,
                });
                setTimeout(() => {
                    this.accions = [];
                    this.seguimiento.reset();
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
        console.log(this.seguiSelect);
         if (this.seguiSelect) {
        
             this.accions.map(act => act.responsable = this.onSelectionResponsable(act.responsableEmpresa))
             this.seguimiento.patchValue({
                fechaSeg: this.seguiSelect.fechaSeg == null ? null : new Date(this.seguiSelect.fechaSeg),
                responsableExterno: this.seguiSelect.responsableExterno,
                responsable: this.seguiSelect.responsable.id,
                resultado: this.seguiSelect.resultado,
                 tarea: this.seguiSelect.tarea,
                 seguimiento: this.seguiSelect.seguimiento,
                 //generico: this.seguiSelect.generico
             })
         } else {
            this.clearInputs();
        }
       console.log(this.seguiSelect);
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
            let resp = await this.scmService.createSeguimiento(product);
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
@Pipe({ name: 'seguimientostatus' })
export class SeguimientoStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}