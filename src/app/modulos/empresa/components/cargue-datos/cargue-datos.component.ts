import { timeout } from 'rxjs/operators';
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { Message } from "primeng/primeng";
import { Empleado } from "app/modulos/empresa/entities/empleado";
import * as XLSX from "xlsx";

import { ComunService } from "app/modulos/comun/services/comun.service";
import { CiudadService } from "../../../comun/services/ciudad.service";
import { CargoService } from "app/modulos/empresa/services/cargo.service";
import { PerfilService } from "app/modulos/admin/services/perfil.service";
import { AreaService } from "app/modulos/empresa/services/area.service";
import { EmpleadoService } from "app/modulos/empresa/services/empleado.service";
import * as FileSaver from "file-saver";

import {
    tipo_identificacion,
    tipo_vinculacion,
    genero,
    zona,
    locale_es,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";

import { Afp } from "app/modulos/comun/entities/afp";
import { Eps } from "app/modulos/comun/entities/eps";
import { Cargo } from "app/modulos/empresa/entities/cargo";
import { Perfil } from "app/modulos/empresa/entities/perfil";
import { Area } from "app/modulos/empresa/entities/area";
import { Ciudad } from "../../../comun/entities/ciudad";
import { Ccf } from "../../../comun/entities/ccf";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "../../../core/entities/filter";
import { Usuario } from "../../entities/usuario";
import { UsuarioEmpresa } from "../../entities/usuario-empresa";
import { ParametroNavegacionService } from "app/modulos/core/services/parametro-navegacion.service";
import { Table } from 'primeng/table';
import { timeStamp } from 'console';
import * as moment from "moment";
import { isNull } from '@angular/compiler/src/output/output_ast';
const EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Component({
    selector: "s-cargueDatos",
    templateUrl: "./cargue-datos.component.html",
    styleUrls: ["./cargue-datos.component.scss"],
    providers: [CiudadService],
})
export class CargueDatosComponent implements OnInit {
    @ViewChild('dt', { static: false }) table: Table;
    @ViewChild('fileInput', { static: false }) fileInput: any;

    initLoading = false;

    msgs: Message[];
    msgsCarga: Message[] = [];
    opcionSelect: string = "EMPLEADO";
    opciones: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Empleados", value: "EMPLEADO" },
        { label: "Cargos", value: "CARGO" },
        { label: "Areas", value: "AREA" },
    ];
    workbookExcel = [];
    dataFile: any[][];
    visible: boolean = false;
    mapping: string[];
    cabecera: string;
    optDragged: any;
    file: any;
    empleadosArray = [];
    fallidosArray = [];
    afpData = [];
    epsData = [];
    cargoData = [];
    perfilData = [];
    areaData = [];
    ciudadData = [];
    ccfData = [];

    afpOpc = [];
    epsOpc = [];
    cargoOpc = [];
    perfilOpc = [];
    areaOpc = [];
    ciudadOpc = [];
    ccfOpc = [];
   

    myFile:string;
    isCargado:boolean = false;
    porcentCarga=0;
    totalDeRegistros=0;
    editRowIndex: number;
    editColIndex: number;
    fechasValidas:boolean;
    empleadosList: Empleado[];
    defaultItem = <SelectItem[]>[{ label: "", value: "" }];
    modelo: any = {
        EMPLEADO: [
            { label: "AFP", nombre: "afp", data: "afpData" }, // 18
            { label: "Área", nombre: "area", data: "areaData" }, //15
            { label: "Cargo", nombre: "cargo", data: "cargoData" }, // 16
            { label: "CCF", nombre: "ccf", data: "ccfData" }, // 19
            { label: "Ciudad", nombre: "ciudad", data: "ciudadData" }, // 20
            { label: "Codigo", nombre: "codigo" },
            { label: "Corporativo Cel", nombre: "corporativePhone" }, // 20
            { label: "Dirección", nombre: "direccion" },
            { label: "Dirección Gerencia", nombre: "direccionGerencia" },
            { label: "E-Mail", nombre: "usuario.email" },
            { label: "Email de emergencia", nombre: "emailEmergencyContact" },
            { label: "Contacto de emergencia ", nombre: "emergencyContact" },
            { label: "EPS", nombre: "eps", data: "epsData" }, // 17
            { label: "Fecha ingreso", nombre: "fechaIngreso" },
            { label: "Fecha nacimiento", nombre: "fechaNacimiento" },
            {
                label: "Genero",
                nombre: "genero",
                opciones: this.defaultItem.concat(genero),
            },
            { label: "Número identificación", nombre: "numeroIdentificacion" },
            {
                label: "Perfil",
                nombre: "usuario.usuarioEmpresaList",
                data: "perfilData",
            }, // 22
            {
                label: "Numero de contacto emergencia",
                nombre: "phoneEmergencyContact",
            },
            { label: "Primer apellido", nombre: "primerApellido" },
            { label: "Primer nombre", nombre: "primerNombre" },
            { label: "Regional", nombre: "regional" },
            { label: "Segundo apellido", nombre: "segundoApellido" },
            { label: "Segundo nombre", nombre: "segundoNombre" },
            { label: "Teléfono 1", nombre: "telefono1" },
            { label: "Teléfono 2", nombre: "telefono2" },
            {
                label: "Tipo identificación",
                nombre: "tipoIdentificacion",
                opciones: this.defaultItem.concat(tipo_identificacion),
            },
            {
                label: "Tipo vinculación",
                nombre: "tipoVinculacion",
                opciones: this.defaultItem.concat(tipo_vinculacion),
            },
            {
                label: "Zona residencia",
                nombre: "zonaResidencia",
                opciones: this.defaultItem.concat(zona),
            },
        ],
        CARGO: [
            { label: "Nombre", nombre: "nombre" },
            { label: "Descripción", nombre: "descripcion" },
        ],
        AREA: [
            { label: "Nombre", nombre: "nombre" },
            { label: "Descripción", nombre: "descripcion" },
            { label: "Tipo de área", nombre: "descripcion" },
            { label: "Área padre", nombre: "descripcion" },
        ],
    };

    constructor(
        private empleadoService: EmpleadoService,
        private comunService: ComunService,
        private cargoService: CargoService,
        private perfilService: PerfilService,
        private areaService: AreaService,
        private ciudadService: CiudadService,
        private paramNav: ParametroNavegacionService,
    ) {
        let areafiltQuery = new FilterQuery();
        areafiltQuery.sortOrder = SortOrder.ASC;
        areafiltQuery.sortField = "nombre";
        areafiltQuery.fieldList = ["id", "nombre"];

        let ciudadfiltQuery = new FilterQuery();
        ciudadfiltQuery.sortOrder = SortOrder.ASC;
        ciudadfiltQuery.sortField = "nombre";
        ciudadfiltQuery.fieldList = ["id", "nombre"];

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
    }

    async ngOnInit() {
        let areafiltQuery = new FilterQuery();
        areafiltQuery.sortOrder = SortOrder.ASC;
        areafiltQuery.sortField = "nombre";
        areafiltQuery.fieldList = ["id", "nombre"];

        let ciudadfiltQuery = new FilterQuery();
        ciudadfiltQuery.sortOrder = SortOrder.ASC;
        ciudadfiltQuery.sortField = "nombre";
        ciudadfiltQuery.fieldList = ["id", "nombre"];

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        //Carga de datos para validar empleados

        //variable response para todas las respuestas solo se vacia
        let response: any = await this.areaService.findByFilter(areafiltQuery);
        this.areaData = response.data;

        response = await this.comunService.findAllAfp();
        this.afpData = response;

        response = await this.comunService.findAllEps();
        this.epsData = response;

        response = await this.ciudadService.findByFilter(ciudadfiltQuery);
        this.ciudadData = response.data;

        response = await this.comunService.findAllCcf();
        this.ccfData = response;
        // console.log(this.ccfData);
        response = await this.cargoService.findByFilter(cargofiltQuery);
        this.cargoData = response.data;

        response = await this.perfilService.findAll();
        this.perfilData = response.data;


        //Datos de prueba para la barra de progreso
        // this.porcentCarga = 0;
        // this.totalDeRegistros = 1000;
        // this.calcularProgreso(550);
    }

    async onArchivoSelect(ev) {
        this.initLoading = true;
        this.fallidosArray = [];
        setTimeout(() => {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: "binary" });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                
                initial = XLSX.utils.sheet_to_json(sheet);
                // console.log(file);
                return initial;
            }, {});

            // console.log("JSONDATA:",jsonData.length);
            for (let i = 0; i < jsonData.length; i++) {
                const fechaIngreso = this.validarFecha(jsonData[i].fechaIngreso);
                const fechaNacimiento = this.validarFecha(jsonData[i].fechaNacimiento);
                


                
                    jsonData[i].fechaIngreso = fechaIngreso;
                    jsonData[i].fechaNacimiento = fechaNacimiento;
                
            }

            this.workbookExcel = jsonData;
            // console.log(this.workbookExcel);
            this.createEmployeArray(jsonData);
            this.initLoading = false;
        };
        this.isCargado=true;        
        reader.readAsBinaryString(file);
        
    }, 2000);

        
    }

    validarFecha(date: Date) : Date{
        const fechaAux:any = date;
        const fechaMod:Date = new Date( (fechaAux - (25568)) * 86400 * 1000 ) ;
        let fecha:any;

        if(fechaMod.toString() == 'Invalid Date'){

            if( this.splitDate(fechaAux)[1] ){
                fecha = moment( this.splitDate(fechaAux)[0] ).utcOffset('GMT-05:00').format(); //Formatea lo que retorna splitDate
            }else{
                fecha = null;                
            }
        }else{
            //TRANSFORMAR
            fecha = moment(fechaMod).utcOffset('GMT-05:00').format();
        }
        
        return fecha;
        
    }
        

    splitDate(date): [Date,boolean] {
        let real = date.split("/");

        if(real.length != 3 || real[0]>31 || real[1]>12 || real[0] <1){
            return [new Date(), false]
        }
        let fechaValida:Date = new Date(real[2] + "-" + real[1] + "-" + real[0]);
        
        return [fechaValida, true];
    }
    createEmployeArray(arrayOfEmployees){
        this.porcentCarga = 1;
        this.empleadosArray = [];

        for (let i = 0; i < arrayOfEmployees.length; i++) {
            // this.calcularProgreso(i);
            let empleado = new Empleado();
            empleado.primerNombre = arrayOfEmployees[i].primerNombre;
            empleado.segundoNombre = arrayOfEmployees[i].segundoNombre;
            empleado.primerApellido = arrayOfEmployees[i].primerApellido;
            empleado.segundoApellido = arrayOfEmployees[i].segundoApellido;
            empleado.codigo = arrayOfEmployees[i].codigo;
            empleado.direccion = arrayOfEmployees[i].direccion;
            empleado.direccion = arrayOfEmployees[i].direccion;
            empleado.fechaIngreso = arrayOfEmployees[i].fechaIngreso;
            empleado.emergencyContact = arrayOfEmployees[i].emergencyContact;
            empleado.corporativePhone = arrayOfEmployees[i].corporativePhone;
            empleado.phoneEmergencyContact = arrayOfEmployees[i].phoneEmergencyContact;
            empleado.emailEmergencyContact = arrayOfEmployees[i].emailEmergencyContact;
            empleado.fechaNacimiento = arrayOfEmployees[i].fechaNacimiento;
            empleado.genero = arrayOfEmployees[i].genero;
            empleado.numeroIdentificacion = arrayOfEmployees[i].numeroIdentificacion;
            empleado.telefono1 = arrayOfEmployees[i].telefono1;
            empleado.telefono2 = arrayOfEmployees[i].telefono2;
            empleado.direccionGerencia = arrayOfEmployees[i].direccionGerencia;
            empleado.regional = arrayOfEmployees[i].regional;
            empleado.empresa = arrayOfEmployees[i].empresa;
            empleado.nit = arrayOfEmployees[i].nit;
            if (arrayOfEmployees[i].ciudad) {
                empleado.ciudad = new Ciudad();
                empleado.ciudad.nombre = arrayOfEmployees[i].ciudad;
            }

            if (arrayOfEmployees[i].afp != null) {
                empleado.afp = new Afp();
                empleado.afp.nombre = arrayOfEmployees[i].afp;
            }
            if (arrayOfEmployees[i].eps != null) {
                empleado.eps = new Eps();
                empleado.eps.nombre = arrayOfEmployees[i].eps || "";
            }
            if (arrayOfEmployees[i].ccf != null) {
                empleado.ccf = new Ccf();
                empleado.ccf.nombre = arrayOfEmployees[i].ccf;
            }
            empleado.tipoIdentificacion = arrayOfEmployees[i].tipoIdentificacion;
            empleado.tipoVinculacion = arrayOfEmployees[i].tipoVinculacion;
            empleado.zonaResidencia = arrayOfEmployees[i].zonaResidencia;
            empleado.area = new Area();
            empleado.cargo = new Cargo();
            empleado.usuario = new Usuario();
            empleado.area.nombre = arrayOfEmployees[i].area;
            empleado.cargo.nombre = arrayOfEmployees[i].cargo;
            empleado.usuario.email = arrayOfEmployees[i].email;
            empleado.usuario.ipPermitida = [];
            //empleado.usuario.id = this.empleadoSelect.usuario.id;
            // empleado.usuario.ipPermitida = arrayOfEmployees[i].ipPermitida;
            empleado.usuario.usuarioEmpresaList = [];
            let empleadoValidado = this.validateEmployeeCampos(
                empleado,
                arrayOfEmployees[i].perfil
            );
            if (empleadoValidado.error) {
                arrayOfEmployees[i].error = empleadoValidado.error;
                this.fallidosArray.push(arrayOfEmployees[i]);
                // return;
            }else{
                this.empleadosArray.push(empleadoValidado);
            }
            
        // });
            
        }
        this.porcentCarga = 0;
        // arrayOfEmployees.forEach((json) => {
        //     // const fechaIngreso = this.splitDate(json.fechaIngreso);
        //     // const fechaNacimiento = this.splitDate(json.fechaNacimiento);
        //     // this.fechasValidas= fechaIngreso[1] && fechaNacimiento[1];
        //     // this.calcularProgreso();
        //     let empleado = new Empleado();
        //     empleado.primerNombre = json.primerNombre;
        //     empleado.segundoNombre = json.segundoNombre;
        //     empleado.primerApellido = json.primerApellido;
        //     empleado.segundoApellido = json.segundoApellido;
        //     empleado.codigo = json.codigo;
        //     empleado.direccion = json.direccion;
        //     empleado.direccion = json.direccion;
        //     empleado.fechaIngreso = json.fechaIngreso;
        //     empleado.emergencyContact = json.emergencyContact;
        //     empleado.corporativePhone = json.corporativePhone;
        //     empleado.phoneEmergencyContact = json.phoneEmergencyContact;
        //     empleado.emailEmergencyContact = json.emailEmergencyContact;
        //     empleado.fechaNacimiento = json.fechaNacimiento;
        //     empleado.genero = json.genero;
        //     empleado.numeroIdentificacion = json.numeroIdentificacion;
        //     empleado.telefono1 = json.telefono1;
        //     empleado.telefono2 = json.telefono2;
        //     empleado.direccionGerencia = json.direccionGerencia;
        //     empleado.regional = json.regional;
        //     if (json.ciudad) {
        //         empleado.ciudad = new Ciudad();
        //         empleado.ciudad.nombre = json.ciudad;
        //     }

        //     if (json.afp != null) {
        //         empleado.afp = new Afp();
        //         empleado.afp.nombre = json.afp;
        //     }
        //     if (json.eps != null) {
        //         empleado.eps = new Eps();
        //         empleado.eps.nombre = json.eps || "";
        //     }
        //     if (json.ccf != null) {
        //         empleado.ccf = new Ccf();
        //         empleado.ccf.nombre = json.ccf;
        //     }
        //     empleado.tipoIdentificacion = json.tipoIdentificacion;
        //     empleado.tipoVinculacion = json.tipoVinculacion;
        //     empleado.zonaResidencia = json.zonaResidencia;
        //     empleado.area = new Area();
        //     empleado.cargo = new Cargo();
        //     empleado.usuario = new Usuario();
        //     empleado.area.nombre = json.area;
        //     empleado.cargo.nombre = json.cargo;
        //     empleado.usuario.email = json.email;
        //     empleado.usuario.ipPermitida = [];
        //     //empleado.usuario.id = this.empleadoSelect.usuario.id;
        //     // empleado.usuario.ipPermitida = json.ipPermitida;
        //     empleado.usuario.usuarioEmpresaList = [];
        //     let empleadoValidado = this.validateEmployeeCampos(
        //         empleado,
        //         json.perfil
        //     );
        //     if (empleadoValidado.error) {
        //         json.error = empleadoValidado.error;
        //         this.fallidosArray.push(json);
        //         return;
        //     }
        //     console.log("LLEGO ACÄ");
        //     this.empleadosArray.push(empleadoValidado);
        // });
        
    }

    dragStart(e: any, opt: any) {
        this.optDragged = opt;
    }

    validateEmployeeCampos(employe: Empleado, perfilName): any {
        let error;
        let eps = this.epsData.find((eps) => employe.eps.nombre == eps.nombre);
        let perfil = this.perfilData.find(
            (perfil) => perfilName == perfil.nombre
        );
        let afp = this.afpData.find((afp) => employe.afp.nombre == afp.nombre);
        let cargo = this.cargoData.find(
            (cargo) => employe.cargo.nombre == cargo.nombre
        );
        let area = this.areaData.find(
            (area) => employe.area.nombre == area.nombre
        );
        let ccf = this.ccfData.find((ccf) => employe.ccf.nombre == ccf.nombre);
        let ciudad = this.ciudadData.find(
            (ciudad) => employe.ciudad.nombre == ciudad.nombre
        );

        if (ciudad) {
            employe.ciudad = ciudad;
        } else {
            return { error: "El empleado no tiene ciudad asignada" };
        }

        if (eps) {
            employe.eps = eps;
        } else {
            return { error: "Eps no existe o nula", employe };
        }
        if (ccf) {
            employe.ccf = ccf;
        } else {
            return { error: "CCF no existe o nula", employe };
        }

        if (afp) {
            employe.afp = afp;
        } else {
            return { error: "afp no existe o nula", employe };
        }
        if (area) {
            employe.area = area;
        } else {
            return { error: "area no existe o nula", employe };
        }

        if (cargo) {
            employe.cargo = cargo;
        } else {
            return { error: "cargo no existe o nula", employe };
        }

        if (employe.fechaNacimiento !=null) {
            employe.fechaNacimiento = employe.fechaNacimiento;
        } else {
            return { error: "Fecha de nacimiento en formato incorrecto. Debe ser (dd/MM/yyyy) en formato fecha.", employe };
        }

        if (employe.fechaIngreso != null) {
            employe.fechaIngreso = employe.fechaIngreso;
        } else {
            return { error: "Fecha de ingreso en formato incorrecto. Debe ser (dd/MM/yyyy) en formato fecha.", employe };
        }

        if (perfil) {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfil.id;
            employe.usuario.usuarioEmpresaList.push(ue);
        } else {
            return { error: "Perfil no existe o nula", employe };
        }
        return employe;
    }

    drop(e: any, cell: any) {
        this.mapping.forEach((cellCab) => {
            if (
                cellCab["campo"] != null &&
                cellCab["campo"].label == this.optDragged.label
            ) {
                cellCab["campo"] = null;
            }
        });

        if (cell["campo"] != null) {
            cell["campo"].selected = false;
        }
        this.optDragged.selected = true;
        cell["campo"] = this.optDragged;
    }

    fragmentarArrayEmpleados(empleadosArray:any){
        console.log(empleadosArray);
        const tamanioPagina = 100; //
        const cantidadEmpleados:number = empleadosArray.length;
        let empleadosPaginados = [];


        const numeroDePaginas = Math.ceil(cantidadEmpleados / tamanioPagina);
        let desde = 0;
        let hasta = tamanioPagina;

        for (let i = 0; i < numeroDePaginas; i++) {
            this.porcentCarga+=10;
            empleadosPaginados.push( empleadosArray.slice(desde, hasta) );
                
            desde = hasta;
            hasta += tamanioPagina;
        }
        console.log("EMPLEADOS PAGINADOS: ", empleadosPaginados);

        return empleadosPaginados;
    }

    cargarDatos() {
        
                this.initLoading = true;
            
                // this.fragmentarArrayEmpleados(this.empleadosArray);
                this.empleadoService.loadAll(this.empleadosArray).then((resp) => {
                    if ((<Message[]>resp).length == 0) {
                        localStorage.setItem(
                            this.cabecera,
                            JSON.stringify(this.mapping)
                        );
                        console.log("CABECERA: ", this.cabecera);
                        console.log("MAPPING: ", this.mapping);
                        this.msgsCarga.push({
                            summary: "Datos cargados",
                            detail: "Todos los registros fueron cargados exitosamente",
                            severity: "success",
                        });
                        
                    } else {

                        (<any[]>resp).forEach((element) => {
                            this.msgsCarga.push({
                                summary: element.mensaje,
                                detail: element.detalle,
                                severity: element.tipoMensaje,
                            });
                        });
                    }

                    this.empleadosArray = [];
                    this.initLoading = false;
                });
    }

    descargarFallidos() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            this.fallidosArray
        );
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        this.saveAsExcelFile(excelBuffer, "Empleados con fallas");
    }
    generarObjetos() {
        let empleadosList = [];
        this.dataFile.forEach((row) => {
            let empleado = new Empleado();
            this.mapping.forEach((map) => {
                let value =
                    row[map["orden"]] == null ? null : row[map["orden"]].nombre;
                let dataValue =
                    map["campo"].data != null
                        ? this[map["campo"].data][value]
                        : value;
                // empleado[map['campo'].nombre] = dataValue;
                this.cargarValor(empleado, map["campo"].nombre, dataValue);
            });
            empleadosList.push(empleado);
        });
        return empleadosList;
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
    cargarValor(objeto: any, campo: string, valor: string) {
        let indice = campo.indexOf(".");
        if (indice >= 0) {
            let nombreCampo = campo.substring(0, indice);
            objeto[nombreCampo] =
                objeto[nombreCampo] == null ? {} : objeto[nombreCampo];
            this.cargarValor(
                objeto[nombreCampo],
                campo.substring(indice + 1, campo.length),
                valor
            );
        } else {
            objeto[campo] = valor;
        }
    }

    validarDatos() {
        for (let i = 0; i < this.modelo[this.opcionSelect].length; i++) {
            let element = this.modelo[this.opcionSelect][i];
            if (element["selected"] == false) {
                return false;
            }
        }
        return true;
    }

    toggle(row, col) {
        this.editRowIndex = row;
        this.editColIndex = col;
    }

    calcularProgreso(elementoActual:number){
        this.porcentCarga = (elementoActual/this.workbookExcel.length)*100;
    }

    limpiar(){
        this.porcentCarga = 0;
        this.workbookExcel.length = 0;
        this.msgsCarga.length = 0;
        this.myFile='';
        this.isCargado = false;
    }
}
