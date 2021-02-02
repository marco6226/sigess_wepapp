import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/primeng'
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import * as XLSX from 'xlsx';


import { ComunService } from 'app/modulos/comun/services/comun.service'
import { CiudadService } from '../../../comun/services/ciudad.service'
import { CargoService } from 'app/modulos/empresa/services/cargo.service'
import { PerfilService } from 'app/modulos/admin/services/perfil.service'
import { AreaService } from 'app/modulos/empresa/services/area.service'
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import * as FileSaver from 'file-saver';

import { tipo_identificacion, tipo_vinculacion, genero, zona, locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'

import { Afp } from 'app/modulos/comun/entities/afp';
import { Eps } from 'app/modulos/comun/entities/eps';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Perfil } from 'app/modulos/empresa/entities/perfil';
import { Area } from 'app/modulos/empresa/entities/area';
import { Ciudad } from '../../../comun/entities/ciudad';
import { Ccf } from '../../../comun/entities/ccf';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SortOrder } from '../../../core/entities/filter';
import { Usuario } from '../../entities/usuario';
import { UsuarioEmpresa } from '../../entities/usuario-empresa';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
@Component({
    selector: 's-cargueDatos',
    templateUrl: './cargue-datos.component.html',
    styleUrls: ['./cargue-datos.component.scss'],
    providers: [CiudadService]
})
export class CargueDatosComponent implements OnInit {

    msgs: Message[];
    msgsCarga: Message[] = [];
    opcionSelect: string = 'EMPLEADO';
    opciones: SelectItem[] = [
        { label: '--Seleccione--', value: null },
        { label: 'Empleados', value: 'EMPLEADO' },
        { label: 'Cargos', value: 'CARGO' },
        { label: 'Areas', value: 'AREA' }
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

    editRowIndex: number;
    editColIndex: number;
    empleadosList: Empleado[];
    defaultItem = <SelectItem[]>[{ label: '', value: '' }];
    modelo: any = {
        EMPLEADO: [
            { label: 'Ciudad', nombre: 'ciudad', data: 'ciudadData' }, // 20
            { label: 'AFP', nombre: 'afp', data: 'afpData' },// 18
            { label: 'Área', nombre: 'area', data: 'areaData' }, //15
            { label: 'Cargo', nombre: 'cargo', data: 'cargoData' },// 16
            { label: 'CCF', nombre: 'ccf', data: 'ccfData' }, // 19
            { label: 'Codigo', nombre: 'codigo' },
            { label: 'Cel corporativo ', nombre: 'corporativePhone' }, // 20
            { label: 'Dirección', nombre: 'direccion' },
            { label: 'E-Mail', nombre: 'usuario.email' },
            { label: 'Email de emergencia', nombre: 'emailEmergencyContact' },
            { label: 'Contacto de emergencia ', nombre: 'emergencyContact' },
            { label: 'EPS', nombre: 'eps', data: 'epsData' },// 17
            { label: 'Fecha ingreso', nombre: 'fechaIngreso' },
            { label: 'Fecha nacimiento', nombre: 'fechaNacimiento' },
            { label: 'Genero', nombre: 'genero', opciones: this.defaultItem.concat(genero) },
            { label: 'Número identificación', nombre: 'numeroIdentificacion' },
            { label: 'Perfil', nombre: 'usuario.usuarioEmpresaList', data: 'perfilData' }, // 22
            { label: 'Numero de contacto emergencia', nombre: 'phoneEmergencyContact' },

            { label: 'Primer apellido', nombre: 'primerApellido' },
            { label: 'Primer nombre', nombre: 'primerNombre' },
            { label: 'Segundo apellido', nombre: 'segundoApellido' },
            { label: 'Segundo nombre', nombre: 'segundoNombre' },
            { label: 'Teléfono 1', nombre: 'telefono1' },
            { label: 'Teléfono 2', nombre: 'telefono2' },
            { label: 'Tipo identificación', nombre: 'tipoIdentificacion', opciones: this.defaultItem.concat(tipo_identificacion) },

            { label: 'Tipo vinculación', nombre: 'tipoVinculacion', opciones: this.defaultItem.concat(tipo_vinculacion) },
            { label: 'Zona residencia', nombre: 'zonaResidencia', opciones: this.defaultItem.concat(zona) },
        ],
        CARGO: [
            { label: 'Nombre', nombre: 'nombre' },
            { label: 'Descripción', nombre: 'descripcion' }
        ],
        AREA: [
            { label: 'Nombre', nombre: 'nombre' },
            { label: 'Descripción', nombre: 'descripcion' },
            { label: 'Tipo de área', nombre: 'descripcion' },
            { label: 'Área padre', nombre: 'descripcion' }
        ],
    }


    constructor(
        private empleadoService: EmpleadoService,
        private comunService: ComunService,
        private cargoService: CargoService,
        private perfilService: PerfilService,
        private areaService: AreaService,
        private ciudadService: CiudadService,
    ) {
        let areafiltQuery = new FilterQuery();
        areafiltQuery.sortOrder = SortOrder.ASC;
        areafiltQuery.sortField = 'nombre';
        areafiltQuery.fieldList = ['id', 'nombre'];

        let ciudadfiltQuery = new FilterQuery();
        ciudadfiltQuery.sortOrder = SortOrder.ASC;
        ciudadfiltQuery.sortField = 'nombre';
        ciudadfiltQuery.fieldList = ['id', 'nombre'];

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = 'nombre';
        cargofiltQuery.fieldList = ['id', 'nombre'];


    }

    async ngOnInit() {
        let areafiltQuery = new FilterQuery();
        areafiltQuery.sortOrder = SortOrder.ASC;
        areafiltQuery.sortField = 'nombre';
        areafiltQuery.fieldList = ['id', 'nombre'];

        let ciudadfiltQuery = new FilterQuery();
        ciudadfiltQuery.sortOrder = SortOrder.ASC;
        ciudadfiltQuery.sortField = 'nombre';
        ciudadfiltQuery.fieldList = ['id', 'nombre'];

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = 'nombre';
        cargofiltQuery.fieldList = ['id', 'nombre'];
        //Carga de datos para validar empleados

        //variable response para todas las respuestas solo se vacia
        let response: any = await this.areaService.findByFilter(areafiltQuery);
        this.areaData = response.data;

        response = await this.comunService.findAllAfp();
         this.afpData = response;

        response  = await this.comunService.findAllEps();
        this.epsData  = response;

        response = await this.ciudadService.findByFilter(ciudadfiltQuery);
        this.ciudadData = response.data;

        response = await this.comunService.findAllCcf();
        this.ccfData = response;

        response = await this.cargoService.findByFilter(cargofiltQuery);
        this.cargoData = response.data;

        response = await this.perfilService.findAll();
        this.perfilData = response.data;

        console.log(this.afpData,
            this.epsData,
            this.cargoData,
            this.perfilData,
            this.areaData,
            this.ciudadData,
            this.ccfData);
    }

    onArchivoSelect(ev) {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (event) => {
            console.log(event);
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            this.workbookExcel = jsonData;
            console.log(this.workbookExcel);
            this.createEmployeArray(jsonData)

        }
        reader.readAsBinaryString(file);

    }

    createEmployeArray(arrayOfEmployees) {
        arrayOfEmployees.forEach(json => {

            let empleado = new Empleado();
            empleado.primerNombre = json.primerNombre;
            empleado.segundoNombre = json.segundoNombre;
            empleado.primerApellido = json.primerApellido;
            empleado.segundoApellido = json.segundoApellido;
            empleado.codigo = json.codigo;
            empleado.direccion = json.direccion;
            empleado.fechaIngreso = json.fechaIngreso;
            empleado.emergencyContact = json.emergencyContact;
            empleado.corporativePhone = json.corporativePhone;
            empleado.phoneEmergencyContact = json.phoneEmergencyContact;
            empleado.emailEmergencyContact = json.emailEmergencyContact;
            empleado.fechaNacimiento = json.fechaNacimiento;
            empleado.genero = json.genero;
            empleado.numeroIdentificacion = json.numeroIdentificacion;
            empleado.telefono1 = json.telefono1;
            empleado.telefono2 = json.telefono2;
            empleado.ciudad = json.ciudad == null ? null : json.ciudad.id;
            if (json.afp != null) {
                empleado.afp = new Afp();
                empleado.afp.nombre = json.afp;
            }
            if (json.eps != null) {
                empleado.eps = new Eps();
                empleado.eps.nombre = json.eps || "";
            }
            empleado.tipoIdentificacion = json.tipoIdentificacion;
            empleado.tipoVinculacion = json.tipoVinculacion;
            empleado.zonaResidencia = json.zonaResidencia;
            empleado.area = new Area();
            empleado.cargo = new Cargo();
            empleado.usuario = new Usuario();
            empleado.area.nombre = json.area;
            empleado.cargo.nombre = json.cargo;
            empleado.usuario.email = json.email;
            empleado.usuario.ipPermitida = [];
            //empleado.usuario.id = this.empleadoSelect.usuario.id;
            // //console.log(json.ipPermitida);
            // empleado.usuario.ipPermitida = json.ipPermitida;
            empleado.usuario.usuarioEmpresaList = [];
            let empleadoValidado =  this.validateEmployeeCampos(empleado,json.perfil);
            if (empleadoValidado.error) {
                json.error = empleadoValidado.error;
                    this.fallidosArray.push(json)
                    return;
            }

            this.empleadosArray.push(empleadoValidado);
        
        });
        console.log(this.empleadosArray,this.fallidosArray);

    }


    dragStart(e: any, opt: any) {
        this.optDragged = opt;
    }

    validateEmployeeCampos(employe:Empleado,perfilName):any {
        let error;
        let eps = this.epsData.find(eps => employe.eps.nombre == eps.nombre);
        let perfil = this.perfilData.find(perfil=> perfilName == perfil.nombre);
        let afp = this.afpData.find(afp=> employe.afp.nombre == afp.nombre);
        let cargo = this.cargoData.find(cargo=> employe.cargo.nombre == cargo.nombre);
        let area = this.areaData.find(area=> employe.area.nombre == area.nombre);

        console.log(this.epsData,employe.eps.nombre);
         if(eps){
           employe.eps = eps; 
         }else{
            return {error:"Eps no existe o nula", employe}
         }

         if(afp){
            employe.afp = afp; 
          }else{
             return {error:"afp no existe o nula", employe}
          }
          if(area){
            employe.area = area; 
          }else{
             return {error:"area no existe o nula", employe}
          }

         if(cargo){
            employe.cargo = cargo; 
          }else{
             return {error:"cargo no existe o nula", employe}
          }

         if(perfil){
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfil.id;
            employe.usuario.usuarioEmpresaList.push(ue);          
        }else{
             return {error:"Perfil no existe o nula", employe}
          }
         return employe;
    }

    drop(e: any, cell: any) {
        this.mapping.forEach(cellCab => {
            if (cellCab['campo'] != null && cellCab['campo'].label == this.optDragged.label) {
                cellCab['campo'] = null;
            }
        });

        if (cell['campo'] != null) {
            cell['campo'].selected = false;
        }
        this.optDragged.selected = true;
        cell['campo'] = this.optDragged;
    }

    cargarDatos() {
        if (true) {
            this.empleadoService.loadAll(this.empleadosArray).then(
                resp => {
                    if ((<Message[]>resp).length == 0) {
                        localStorage.setItem(this.cabecera, JSON.stringify(this.mapping));
                        this.msgsCarga.push({ summary: 'Datos cargados', detail: 'Todos los registros fueron cargados exitosamente', severity: 'success' });
                    } else {
                        (<any[]>resp).forEach(element => {
                            this.msgsCarga.push({ summary: element.mensaje, detail: element.detalle, severity: element.tipoMensaje });
                        });
                    }
                }
            )
        } else {
            this.msgs = [];
            this.msgs.push({ summary: 'Campos incompletos', detail: 'No se han relacionado todas las columnas con los campos requeridos', severity: 'warn' });
        }
    }

    descargarFallidos() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.fallidosArray);  
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };  
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });  
        this.saveAsExcelFile(excelBuffer, 'Empleados con fallas');  
    }
    generarObjetos() {
        let empleadosList = [];
        this.dataFile.forEach(row => {
            let empleado = new Empleado();
            this.mapping.forEach(map => {
                let value = row[map['orden']] == null ? null : row[map['orden']].nombre;
                let dataValue = map['campo'].data != null ? (this[map['campo'].data])[value] : value;
                // empleado[map['campo'].nombre] = dataValue;
                this.cargarValor(empleado, map['campo'].nombre, dataValue);
            });
            empleadosList.push(empleado);
        });
        return empleadosList;
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        }); 
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
    cargarValor(objeto: any, campo: string, valor: string) {
        let indice = campo.indexOf('.');
        if (indice >= 0) {
            let nombreCampo = campo.substring(0, indice);
            objeto[nombreCampo] = objeto[nombreCampo] == null ? {} : objeto[nombreCampo];
            this.cargarValor(objeto[nombreCampo], campo.substring(indice + 1, campo.length), valor);
        } else {
            objeto[campo] = valor;
        }
    }

    validarDatos() {
    
        for (let i = 0; i < this.modelo[this.opcionSelect].length; i++) {
            let element = (this.modelo[this.opcionSelect])[i];
            if (element['selected'] == false) {
                return false;
            }
        };
        return true;
    }

    toggle(row, col) {
        this.editRowIndex = row;
        this.editColIndex = col;
    }
}
