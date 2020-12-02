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
    afpData = {};
    epsData = {};
    cargoData = {};
    perfilData = {};
    areaData = {};
    ciudadData = {};
    ccfData = {};

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

        this.areaService.findByFilter(areafiltQuery).then(
            resp => {
                (<Area[]>resp['data']).forEach(area => {
                    this.areaData[area.nombre] = area;
                    this.areaOpc.push(<SelectItem>{ label: area.nombre, value: area.nombre })
                });
                this.modelo['EMPLEADO'][15].opciones = this.defaultItem.concat(this.areaOpc);
            }
        );
        this.comunService.findAllAfp().then(
            data => {
                (<Afp[]>data).forEach(afp => {
                    this.afpData[afp.nombre] = afp;
                    this.afpOpc.push(<SelectItem>{ label: afp.nombre, value: afp.nombre })
                });
                this.modelo['EMPLEADO'][18].opciones = this.defaultItem.concat(this.afpOpc);
            }
        );
        this.comunService.findAllEps().then(
            data => {
                (<Eps[]>data).forEach(eps => {
                    this.epsData[eps.nombre] = eps;
                    this.epsOpc.push(<SelectItem>{ label: eps.nombre, value: eps.nombre })
                });
                this.modelo['EMPLEADO'][17].opciones = this.defaultItem.concat(this.epsOpc);
            }
        );
        this.ciudadService.findByFilter(ciudadfiltQuery).then(
            resp => {
                (<Ciudad[]>resp['data']).forEach(ciudad => {
                    this.ciudadData[ciudad.nombre] = ciudad;
                    this.ciudadOpc.push(<SelectItem>{ label: ciudad.nombre, value: ciudad.nombre })
                });
                this.modelo['EMPLEADO'][20].opciones = this.defaultItem.concat(this.ciudadOpc);
            }
        );
        this.comunService.findAllCcf().then(
            resp => {
                (<Ccf[]>resp).forEach(ccf => {
                    this.ccfData[ccf.nombre] = ccf;
                    this.ccfOpc.push(<SelectItem>{ label: ccf.nombre, value: ccf.nombre })
                });
                this.modelo['EMPLEADO'][19].opciones = this.defaultItem.concat(this.ccfOpc);
            }
        );
        this.cargoService.findByFilter(cargofiltQuery).then(
            resp => {
                (<Cargo[]>resp['data']).forEach(cargo => {
                    this.cargoData[cargo.nombre] = cargo;
                    this.cargoOpc.push(<SelectItem>{ label: cargo.nombre, value: cargo.nombre })
                });
                this.modelo['EMPLEADO'][16].opciones = this.defaultItem.concat(this.cargoOpc);
            }
        );
        this.perfilService.findAll().then(
            resp => {
                (<Perfil[]>resp['data']).forEach(perfil => {
                    this.perfilData = resp;
                    this.perfilOpc.push(<SelectItem>{ label: perfil.nombre, value: perfil.nombre })
                });
                this.modelo['EMPLEADO'][22].opciones = this.defaultItem.concat(this.perfilOpc);
            }
        );
    }

    ngOnInit() {

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
            this.validateJsonExcel(jsonData)

        }
        reader.readAsBinaryString(file);

    }

    validateJsonExcel(arrayOfEmployees) {
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
                empleado.afp.id = json.afp;
            }
            if (json.eps != null) {
                empleado.eps = new Eps();
                empleado.eps.id = json.eps;
            }
            empleado.tipoIdentificacion = json.tipoIdentificacion;
            empleado.tipoVinculacion = json.tipoVinculacion;
            empleado.zonaResidencia = json.zonaResidencia;
            empleado.area = new Area();
            empleado.cargo = new Cargo();
            empleado.usuario = new Usuario();
            empleado.area.id = json.area.id;
            empleado.cargo.id = json.cargoId;
            empleado.usuario.email = json.email;
            //empleado.usuario.id = this.empleadoSelect.usuario.id;
            // //console.log(json.ipPermitida);
            // empleado.usuario.ipPermitida = json.ipPermitida;
            empleado.usuario.usuarioEmpresaList = [];
            this.empleadosArray.push(empleado)
        });
        console.log(this.empleadosArray);

    }


    dragStart(e: any, opt: any) {
        this.optDragged = opt;
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
        if (this.validarDatos()) {
            this.empleadosList = this.generarObjetos();
            this.empleadoService.loadAll(this.empleadosList).then(
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
