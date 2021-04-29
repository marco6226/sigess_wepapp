import { Component, OnInit, ViewChild } from '@angular/core';
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { Inspeccion } from 'app/modulos/inspecciones/entities/inspeccion'
import { Calificacion } from 'app/modulos/inspecciones/entities/calificacion'
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { Programacion } from 'app/modulos/inspecciones/entities/programacion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'
import { InspeccionService } from 'app/modulos/inspecciones/services/inspeccion.service'
import { SistemaNivelRiesgoService } from 'app/modulos/core/services/sistema-nivel-riesgo.service';
import { SistemaNivelRiesgo } from 'app/modulos/core/entities/sistema-nivel-riesgo';
import { Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { ListaInspeccionFormComponent } from '../lista-inspeccion-form/lista-inspeccion-form.component';
import { FormularioComponent } from 'app/modulos/comun/components/formulario/formulario.component';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';

import { SesionService } from '../../../core/services/sesion.service';
import { Area } from '../../../empresa/entities/area';

@Component({
    selector: 'app-elaboracion-inspecciones',
    templateUrl: './elaboracion-inspecciones.component.html',
    styleUrls: ['./elaboracion-inspecciones.component.scss'],
    providers: [DirectorioService]
})
export class ElaboracionInspeccionesComponent implements OnInit {

    pdfGenerado: boolean;
    @ViewChild('listaInspeccionForm', { static: false }) listaInspeccionForm: ListaInspeccionFormComponent;
    msgs: Message[];
    listaInspeccion: ListaInspeccion;
    inspeccion: Inspeccion;
    inspeccionId: number;
    programacion: Programacion;
    nivelRiesgoList: SelectItem[] = [{ label: '--seleccione--', value: null }];
    inspTitlte: string;
    finalizado: boolean;
    consultar: boolean;
    modificar: boolean;
    adicionar: boolean;
    formValid: boolean;
    redireccion: string;

    area: Area;
    initLoading = false;
    solicitando = false;

    constructor(
        private router: Router,
        private directorioService: DirectorioService,
        private listaInspeccionService: ListaInspeccionService,
        private paramNav: ParametroNavegacionService,
        private inspeccionService: InspeccionService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private sesionService: SesionService,
    ) { }

    ngOnInit() {
        let filterQuery = new FilterQuery();
        let filter = new Filter();
        filter.criteria = Criteria.EQUALS;
        filter.field = 'seleccionado';
        filter.value1 = 'true';
        filterQuery.filterList = [filter];
        this.sistemaNivelRiesgoService.findByFilter(filterQuery).then(
            resp => (<SistemaNivelRiesgo>resp['data'][0]).nivelRiesgoList.forEach(element => {
                this.nivelRiesgoList.push({ label: element.nombre, value: element.id });
            })
        );

        let accion = this.paramNav.getAccion<string>();
        if (accion == 'POST') {
            this.redireccion = '/app/inspecciones/programacion';
            this.adicionar = true;
            this.programacion = this.paramNav.getParametro<Programacion>();
            this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.programacion.listaInspeccion;
            this.area = this.programacion == null ? this.inspeccion.area : this.programacion.area;
            // console.log(this.programacion);
            let filterQuery = new FilterQuery();

            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "listaInspeccionPK.id";
            filterId.value1 = this.listaInspeccion.listaInspeccionPK.id;

            let filterVersion = new Filter();
            filterVersion.criteria = Criteria.EQUALS;
            filterVersion.field = "listaInspeccionPK.version";
            filterVersion.value1 = this.listaInspeccion.listaInspeccionPK.version.toString();

            filterQuery.filterList = [filterId, filterVersion];

            this.initLoading = true;
            this.listaInspeccionService.findByFilter(filterQuery)
                .then(data => {
                    this.initLoading = false;
                    this.listaInspeccion = (<ListaInspeccion[]>data['data'])[0]
                })
                .catch(err => {
                    this.initLoading = false;
                });
        } else if (accion == 'GET' || accion == 'PUT') {
            this.redireccion = '/app/inspecciones/consultaInspecciones';
            this.consultar = accion == 'GET';
            this.modificar = accion == 'PUT';
            this.inspeccion = this.paramNav.getParametro<Inspeccion>();

            let filterQuery = new FilterQuery();
            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "id";
            filterId.value1 = this.inspeccion.id.toString();
            this.inspeccionId = this.inspeccion.id;

            filterQuery.filterList = [filterId];
            this.initLoading = true;
            this.inspeccionService.findByFilter(filterQuery)
                .then(data => {
                    this.inspeccion = (<Inspeccion[]>data['data'])[0];
                    this.programacion = this.inspeccion.programacion;
                    this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.inspeccion.programacion.listaInspeccion;
                    this.area = this.programacion == null ? this.inspeccion.area : this.inspeccion.programacion.area;

                    this.listaInspeccion.formulario.campoList.forEach(campo => {
                        for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                            let rc = this.inspeccion.respuestasCampoList[i];
                            if (rc.campoId == campo.id) {
                                campo.respuestaCampo = rc;
                                break;
                            }
                        }
                    });
                    this.cargarCalificaciones(this.listaInspeccion.elementoInspeccionList, this.inspeccion.calificacionList);
                    this.initLoading = false;
                })
                .catch(err => {
                    this.initLoading = false;
                });;
        }

        this.paramNav.reset();
    }

    private cargarCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        for (let i = 0; i < elemList.length; i++) {
            if (elemList[i].elementoInspeccionList != null && elemList[i].elementoInspeccionList.length > 0) {
                this.cargarCalificaciones(elemList[i].elementoInspeccionList, calificacionList);
            } else {
                let calif = this.buscarCalificacion(elemList[i], calificacionList);
                elemList[i].calificacion = calif;
            }
        }
    }

    private buscarCalificacion(elem: ElementoInspeccion, calificacionList: Calificacion[]): Calificacion {
        for (let i = 0; i < calificacionList.length; i++) {
            if (calificacionList[i].elementoInspeccion.id === elem.id) {
                return calificacionList[i];
            }
        }
        return null;
    }

    onSubmit() {
        let calificacionList: Calificacion[] = [];
        try {
            this.extraerCalificaciones(this.listaInspeccion.elementoInspeccionList, calificacionList);

            let inspeccion = new Inspeccion();
            inspeccion.area = this.area;
            inspeccion.listaInspeccion = this.listaInspeccion;
            inspeccion.programacion = this.programacion;
            inspeccion.calificacionList = calificacionList;
            inspeccion.respuestasCampoList = [];
            this.listaInspeccion.formulario.campoList.forEach(campo => {
                if (campo.tipo == 'multiple_select' && campo.respuestaCampo.valor != null) {
                    let arraySelection = (<string[]>campo.respuestaCampo.valor);
                    if (arraySelection.length > 0) {
                        let valorArray: string = "";
                        arraySelection.forEach(element => {
                            valorArray += element + ';';
                        });
                        valorArray = valorArray.substring(0, valorArray.length - 1);
                        campo.respuestaCampo.valor = valorArray;
                    } else {
                        campo.respuestaCampo.valor = null;
                    }
                }
                campo.respuestaCampo.campoId = campo.id;
                inspeccion.respuestasCampoList.push(campo.respuestaCampo);
            });

            this.solicitando = true;
            if (this.adicionar) {
                this.inspeccionService.create(inspeccion)
                    .then(data => {
                        this.manageResponse(<Inspeccion>data);
                        this.solicitando = false;
                    })
                    .catch(err => {
                        this.solicitando = false;
                    });
            } else {
                inspeccion.id = this.inspeccionId
                this.inspeccionService.update(inspeccion)
                    .then(data => {
                        this.manageResponse(<Inspeccion>data);
                        this.solicitando = false;
                    })
                    .catch(err => {
                        this.solicitando = false;
                    });
            }

        } catch (error) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: error });
        }
    }

    private manageResponse(insp: Inspeccion) {
        insp.calificacionList.
            forEach(calificacion => {
                let keyMap = calificacion.elementoInspeccion.id;
                let arrayFile = this.listaInspeccionForm.imgMap[keyMap];
                if (arrayFile != null) {
                    arrayFile.forEach(objFile => {
                        if (objFile != null && objFile.change == true)
<<<<<<< HEAD
                            this.solicitando = false;
=======
                        this.directorioService.upload(objFile.file, null, 'INP', calificacion.id, null);
>>>>>>> 3d1a910c193555765a2ffd042244fd0287ce0a4d
                    });
                }
            });

        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Inspección ' + (this.adicionar ? 'creada' : 'modificada'),
            detail: 'Se ha ' + (this.adicionar ? 'creado' : 'modificado') + ' correctamente la inspección' + ' INP-' + insp.id
        });
        this.finalizado = true;
    }

    private extraerCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        for (let i = 0; i < elemList.length; i++) {
            if (elemList[i].elementoInspeccionList != null && elemList[i].elementoInspeccionList.length > 0) {
                this.extraerCalificaciones(elemList[i].elementoInspeccionList, calificacionList);
            } else {
                if (elemList[i].calificacion.opcionCalificacion.id == null) {
                    throw new Error("El elemento \"" + elemList[i].codigo + " " + elemList[i].nombre + "\" aún no ha sido calificado.");
                } else {
                    let calif = elemList[i].calificacion;
                    if (calif.nivelRiesgo != null && calif.nivelRiesgo.id != null && (calif.recomendacion == null || calif.recomendacion == '')) {
                        throw new Error("Se ha establecido un nivel de riesgo para el elemento " + elemList[i].codigo + ". Debe especificar una recomendación");
                    }
                    calif.elementoInspeccion = new ElementoInspeccion();
                    calif.elementoInspeccion.id = elemList[i].id;
                    calificacionList.push(calif);
                }
            }
        }
    }


    actualizarValidacion(valido: boolean) {
        this.formValid = valido;
    }

    volver() {
        this.router.navigate(
            [this.redireccion]
        );
    }


    agregarElementos(nodoPlant: HTMLElement, elemInspList: ElementoInspeccion[]) {
        elemInspList.forEach(el => {
            let tr = nodoPlant.cloneNode(true);
            tr.childNodes[0].textContent = el.codigo;
            tr.childNodes[1].textContent = el.nombre;

            tr.childNodes[3].textContent = el.calificable ? "" : "Descripción del hallazgo";
            let count = 3;
            this.listaInspeccion.opcionCalificacionList.forEach(opc => {
                let tdCalf = tr.childNodes[2].cloneNode();
                if (el.calificable) {
                    this.inspeccion.calificacionList.forEach(cal => {
                        if (el.id == cal.elementoInspeccion.id && cal.opcionCalificacion.id === opc.id) {
                            tdCalf.textContent = 'X';
                            tr.childNodes[count].textContent = cal.recomendacion;
                        }
                    });
                } else {
                    tdCalf.textContent = opc.nombre;
                }
                tr.insertBefore(tdCalf, tr.childNodes[count++]);
            });
            nodoPlant.parentElement.appendChild(tr);
            if (el.elementoInspeccionList != null && el.elementoInspeccionList.length > 0) {
                this.agregarElementos(nodoPlant, el.elementoInspeccionList);
            }
            tr.childNodes[2].remove();
        });
    }

    imprimir() {
        let template = document.getElementById('plantilla');
        if (!this.pdfGenerado) {
            template.querySelector('#P_lista_nombre').textContent = this.listaInspeccion.nombre;
            template.querySelector('#P_codigo').textContent = this.listaInspeccion.codigo;
            template.querySelector('#P_version').textContent = '' + this.listaInspeccion.listaInspeccionPK.version;
           // template.querySelector('#P_ubicacion').textContent = '' + this.programacion.area.nombre;
            template.querySelector('#P_formulario_nombre').textContent = this.listaInspeccion.formulario.nombre;
            template.querySelector('#P_empresa_logo').setAttribute('src', this.sesionService.getEmpresa().logo);

            console.log(this.listaInspeccion.nombre);
            console.log(this.listaInspeccion.codigo);
            console.log(this.listaInspeccion.listaInspeccionPK.version);
            console.log(this.listaInspeccion.formulario.nombre);


            let camposForm = template.querySelector('#L_campos_formulario');
            this.listaInspeccion.formulario.campoList.forEach(campo => {
                let tr = camposForm.cloneNode(true);
                tr.childNodes[0].textContent = campo.nombre;
                for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                    let rc = this.inspeccion.respuestasCampoList[i];
                    if (rc.campoId == campo.id) {
                        tr.childNodes[1].textContent = campo.respuestaCampo.valor;
                        break;
                    }
                }
                camposForm.parentElement.appendChild(tr);
                console.log(this.inspeccion.respuestasCampoList);
            });

            let elemList = template.querySelector('#L_elementos_lista');
            this.agregarElementos(<HTMLElement>elemList, this.listaInspeccion.elementoInspeccionList);
            elemList.remove();
            this.pdfGenerado = true;
        }

        setTimeout(() => {
            var WinPrint = window.open('', '_blank');
            console.log(WinPrint);
            WinPrint.document.write(template.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
        }, 400);
    }

}
