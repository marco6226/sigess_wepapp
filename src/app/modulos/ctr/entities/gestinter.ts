import { Empleado } from "app/modulos/empresa/entities/empleado";
import { EmpleadoBasic } from 'app/modulos/empresa/entities/empleado-basic';
export interface geinterventor {
    gestor?:EmpleadoBasic;
    email?:string;
    telefono?:string;
}