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
import { Router, ActivatedRoute } from '@angular/router';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { Message, SelectItem } from 'primeng/primeng'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { ListaInspeccionFormComponent } from '../lista-inspeccion-form/lista-inspeccion-form.component';
import { FormularioComponent } from 'app/modulos/comun/components/formulario/formulario.component';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';

import { SesionService } from '../../../core/services/sesion.service';
import { Area } from '../../../empresa/entities/area';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { parse } from 'path';
import { EmpleadoService } from '../../../empresa/services/empleado.service';
import { OpcionCalificacion } from '../../entities/opcion-calificacion';
import { AuthService } from "app/modulos/core/auth.service";
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';

@Component({
    selector: 'app-elaboracion-inspecciones',
    templateUrl: './elaboracion-inspecciones.component.html',
    styleUrls: ['./elaboracion-inspecciones.component.scss'],
    providers: [DirectorioService,DatePipe]
})
export class ElaboracionInspeccionesComponent implements OnInit {

    editable: boolean = false;

    pdfGenerado: boolean;
    @ViewChild('listaInspeccionForm', { static: false }) listaInspeccionForm: ListaInspeccionFormComponent;
    msgs: Message[];
    listaInspeccion: ListaInspeccion;
    ElementoInspeccionList: ElementoInspeccion;
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
    empleado: Empleado;
    empleadoelabora: Empleado;
    Form: FormGroup;
    empresa:Empresa;
    area: Area;
    initLoading = false;
    solicitando = false;
    listaEvidence = [];
    firma =[];
    id;
    version;
    matriz: any[][];
    accion;

    localeES: any = locale_es;
    FormHseq: FormGroup;
    FormIng: FormGroup;
    maxDateHse: string = new Date().toISOString();
    minDateHse: string;
    selectDateHse;
    maxDateIngenieria: string = new Date().toISOString();
    minDateIngenieria: string;
    selectDateIngenieria;
    permisoHse:boolean=false;
    permisoIngenieria:boolean=false;



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private directorioService: DirectorioService,
        private listaInspeccionService: ListaInspeccionService,
        private empleadoService: EmpleadoService,
        private paramNav: ParametroNavegacionService,
        private inspeccionService: InspeccionService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private sesionService: SesionService,
        private datePipe : DatePipe,
        private authService: AuthService,
        private fb: FormBuilder
    ) { 
        this.FormHseq = this.fb.group({
            concepto: ['',Validators.required],
            usuarioGestiona: [sesionService.getEmpleado().primerNombre + " " +sesionService.getEmpleado().primerApellido ,Validators.required],
            cargo: [sesionService.getEmpleado().cargo.descripcion,Validators.required],
            fecha: ['',Validators.required]
        });
        this.FormIng = this.fb.group({
            concepto: ['',Validators.required],
            usuarioGestiona: [sesionService.getEmpleado().primerNombre + " " +sesionService.getEmpleado().primerApellido,Validators.required],
            cargo: [sesionService.getEmpleado().cargo.descripcion,Validators.required],
            fecha: ['',Validators.required]
        });
     }

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
        
        this.accion = this.paramNav.getAccion<string>();
        if (this.accion == 'POST') {
            this.redireccion = '/app/inspecciones/programacion';
            this.adicionar = true;
            this.programacion = this.paramNav.getParametro<Programacion>();
            this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.programacion.listaInspeccion;
            this.area = this.programacion == null ? this.inspeccion.area : this.programacion.area;
           
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
                this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id),this.listaInspeccion.listaInspeccionPK.version);

                
                // setTimeout(() => {           
                //     this.empleadoService.findempleadoByUsuario(this.inspeccion.usuarioRegistra.id).then(
                //         resp => {
                //           this.empleadoelabora = <Empleado>(resp);
                //           this.getFirma(this.empleadoelabora.id);
                                                       
                //         }
                //     );
                // }, 2000);
               
        } else if (this.accion == 'GET' || this.accion == 'PUT') {
            this.redireccion = '/app/inspecciones/consultaInspecciones';
            this.consultar = this.accion == 'GET';
            this.modificar = this.accion == 'PUT';
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
                    this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id),this.listaInspeccion.listaInspeccionPK.version);
                                        setTimeout(() => {           
                        this.empleadoService.findempleadoByUsuario(this.inspeccion.usuarioRegistra.id).then(
                            resp => {
                              this.empleadoelabora = <Empleado>(resp);
                              this.getFirma(this.empleadoelabora.id);
                                                          
                            }
                          );
                    }, 2000);

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
        else{
            this.redireccion = '/app/inspecciones/programacion';
            this.adicionar = true;
            this.programacion = this.paramNav.getParametro<Programacion>();

            
            this.id = this.route.snapshot.paramMap.get('id');
            this.version = this.route.snapshot.paramMap.get('version');
            

            
            let filterQuery = new FilterQuery();

            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "listaInspeccionPK.id";
            filterId.value1 = this.route.snapshot.paramMap.get('id');

            let filterVersion = new Filter();
            filterVersion.criteria = Criteria.EQUALS;
            filterVersion.field = "listaInspeccionPK.version";
            filterVersion.value1 = this.route.snapshot.paramMap.get('version');

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
                this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id),this.listaInspeccion.listaInspeccionPK.version);
                
                                        setTimeout(() => {           
                        this.empleadoService.findempleadoByUsuario(this.inspeccion.usuarioRegistra.id).then(
                            resp => {
                              this.empleadoelabora = <Empleado>(resp);
                              this.getFirma(this.empleadoelabora.id);
                                                           
                            }
                          );
                    }, 2000);
        }
        
        this.paramNav.reset();
        this.firmaPermisos();
    }

    findMatrizValue(fecha: Date) {
        for (let i = 0; i < this.matriz.length; i++) {
          for (let j = 0; j < this.matriz[i].length; j++) {
            if (this.matriz[i][j] != null && this.matriz[i][j].dia.valueOf() === fecha.valueOf()) {
              return this.matriz[i][j];
            }
          }
        }
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
            console.log("3")
            this.extraerCalificaciones(this.listaInspeccion.elementoInspeccionList, calificacionList);

            let inspeccion = new Inspeccion();
            console.log("4")
            inspeccion.area = this.area;
            // inspeccion.empleadohse = this.empleado;
            // inspeccion.empleadoing = this.empleado;
            // inspeccion.fechavistohse = new Date();
            // inspeccion.fechavistoing = new Date();
            console.log("5")
            inspeccion.listaInspeccion = this.listaInspeccion;
            inspeccion.programacion = this.programacion;
            console.log("6")
            inspeccion.calificacionList = calificacionList;
            inspeccion.respuestasCampoList = [];
            console.log("7")
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
            console.log("8")

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
            console.log("2",inspeccion)
        } catch (error) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: error });
        }
        
        console.log("1",this.inspeccion)
        let nocumple = <Calificacion[]><unknown>this.inspeccion.calificacionList;


        nocumple = nocumple.filter(function(element) {
            return element.opcionCalificacion.valor === 0;
           
            
          });
        
         
          let arrraynocumple = [];
          
          let var2 = nocumple.map(item =>{          
            arrraynocumple.push(item.elementoInspeccion.id)        
             return arrraynocumple;
          })
        
         
          let criticos = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList;
          let  var1=[]

          for (let idx = 0; idx < criticos.length; idx++){

            let criticosInterno = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList[idx].elementoInspeccionList;
            
           
           
            var1.push( criticosInterno.filter(function(element) {
                return element.criticidad === 'Alto' || element.criticidad === 'Medio' ;               
                
              }));
           
          }
          let obj2 = JSON.parse(JSON.stringify(var1));


          const newArray = []
          for (let idx = 0; idx < var1.length; idx++){
          let var2 = var1[idx].map(item =>{
          
                 newArray.push(item.id,item.criticidad,item.codigo,item.nombre)
        
          return newArray
          })
        }
        let arrayResultadoVar1=[]
          for (let idx = 0; idx < var1.length; idx++){
            var1[idx].map(item =>{
             
                   newArray.push(item.id)
                   arrraynocumple.forEach(element => {
                       if(item.id == element){
                           arrayResultadoVar1.push(item)
                       }
                   });
         
            return newArray
            })
          }

          console.log(arrayResultadoVar1.length)

          if(arrayResultadoVar1.length>0){
          this.authService.sendNotificationhallazgosCriticos(
            this.inspeccion.id,
            arrayResultadoVar1 
            );
        }
          setTimeout(() => { 
              if (this.finalizado === true){
            this.authService.sendNotificationhallazgosCriticos(
              this.inspeccion.id,
              arrayResultadoVar1);
      }
        }, 5000);
          
    

    }

    private manageResponse(insp: Inspeccion) {
        insp.calificacionList.
            forEach(calificacion => {
                let keyMap = calificacion.elementoInspeccion.id;
                let arrayFile = this.listaInspeccionForm.imgMap[keyMap];
                if (arrayFile != null) {
                    arrayFile.forEach(objFile => {
                        if (objFile != null && objFile.change == true)
                            this.directorioService.uploadv5(objFile.file, null, 'INP', calificacion.id, null, "PUBLICO");
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

    validarRequerirFoto(elementoSelect: ElementoInspeccion) {
        for(let i =0; i < this.listaInspeccionForm.opciones.length; i++){
            if(elementoSelect.calificacion.opcionCalificacion.id === this.listaInspeccionForm.opciones[i].id){
                elementoSelect.calificacion.opcionCalificacion.requerirDoc = this.listaInspeccionForm.opciones[i].requerirDoc
            }
        }
       
        if(this.accion=='POST'){
            if (
                elementoSelect != null &&
                elementoSelect.calificacion != null &&
                elementoSelect.calificacion.opcionCalificacion != null &&
                elementoSelect.calificacion.opcionCalificacion.requerirDoc == true &&
                (this.listaInspeccionForm.imgMap[elementoSelect.id] == null || this.listaInspeccionForm.imgMap[elementoSelect.id].length === 0) 
            ) {
                throw new Error("Debe especificar al menos una fotografía para la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
            }
            return true;
        }
        else{
            if (
                elementoSelect != null &&
                elementoSelect.calificacion != null &&
                elementoSelect.calificacion.opcionCalificacion != null &&
                elementoSelect.calificacion.opcionCalificacion.requerirDoc == true && 
                elementoSelect.calificacion.documentosList.length < 1 &&
                (this.listaInspeccionForm.imgMap[elementoSelect.id] == null || this.listaInspeccionForm.imgMap[elementoSelect.id].length === 0) 
            ) {
                throw new Error("Debe especificar al menos una fotografía para la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
            }
            return true;
        }        
    }

    validarDescripcion(elementoSelect: ElementoInspeccion) {

        for(let i =0; i < this.listaInspeccionForm.opciones.length; i++){
            if(elementoSelect.calificacion.opcionCalificacion.id === this.listaInspeccionForm.opciones[i].id){
                elementoSelect.calificacion.opcionCalificacion.requerirDoc = this.listaInspeccionForm.opciones[i].requerirDoc
            }
        }
        elementoSelect.calificacion.recomendacion = elementoSelect.calificacion.recomendacion === undefined ? '': elementoSelect.calificacion.recomendacion
        if (
            elementoSelect != null &&
            elementoSelect.calificacion != null &&
            elementoSelect.calificacion.recomendacion != null &&
            elementoSelect.calificacion.opcionCalificacion.requerirDoc === true &&
            (elementoSelect.calificacion.recomendacion == null || elementoSelect.calificacion.recomendacion === '' )
        ) {
            throw new Error("Debe agregar una descripción al adjuntar evidencia de la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
        }
        return true;
    }

    private extraerCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        console.log("1-1",elemList,calificacionList)
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
                    }else{            
                            calif.elementoInspeccion = new ElementoInspeccion();
                            calif.elementoInspeccion.id = elemList[i].id;
                            calificacionList.push(calif);
                            if( this.validarRequerirFoto(elemList[i]) && this.validarDescripcion(elemList[i]) ){}
                    }
                }
            }
        }
        console.log("1-2")
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
            const date = new Date (this.inspeccion.fechaRealizada);
            const fechahora = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
            template.querySelector('#P_lista_nombre').textContent = this.listaInspeccion.nombre;
            template.querySelector('#P_codigo').textContent = this.listaInspeccion.codigo;
            template.querySelector('#P_version').textContent = '' + this.listaInspeccion.listaInspeccionPK.version;
          //  template.querySelector('#P_version').textContent = '' + fechahora;
            // template.querySelector('#P_ubicacion').textContent = '' + this.programacion.area.nombre;
            template.querySelector('#P_formulario_nombre').textContent = this.listaInspeccion.formulario.nombre;
            template.querySelector('#P_empresa_logo').setAttribute('src', this.sesionService.getEmpresa().logo);
           //  template.querySelector('#P_firma').textContent = this.sesionService.getEmpleado().primerNombre +" " + this.sesionService.getEmpleado().primerApellido;
          if(this.empleadoelabora != null ){
            template.querySelector('#P_firma').textContent = this.empleadoelabora.primerNombre + " " + this.empleadoelabora.primerApellido + " ";
            template.querySelector('#P_cargo').textContent = " Cargo: " + this.empleadoelabora.cargo.nombre;           
        }else{
            template.querySelector('#P_firma').textContent = this.inspeccion.usuarioRegistra ? this.inspeccion.usuarioRegistra.email : "";
           
        }
            let  a: string | ArrayBuffer=this.listaInspeccion.listaInspeccionPK.id.toString();
            let b: string | ArrayBuffer=this.listaInspeccion.listaInspeccionPK.version.toString();
            //template.querySelector('#P_lista_logo').setAttribute('src', this.listaEvidence);
           
            


            let camposForm = template.querySelector('#L_campos_formulario');
            const tr = camposForm.cloneNode(true);
            tr.childNodes[0].textContent = "Ubicación"
            tr.childNodes[1].textContent = this.programacion ? this.programacion.area.nombre : "";
            camposForm.parentElement.appendChild(tr);
            const tfecha = camposForm.cloneNode(true);
            tfecha.childNodes[0].textContent = 'Fecha y Hora de realización'
            tfecha.childNodes[1].textContent = fechahora;
            camposForm.parentElement.appendChild(tfecha);
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
                
            });


            let elemList = template.querySelector('#L_elementos_lista');
            this.agregarElementos(<HTMLElement>elemList, this.listaInspeccion.elementoInspeccionList);
            elemList.remove();
            this.pdfGenerado = true;
        }

        setTimeout(() => {
            var WinPrint = window.open('', '_blank');
            
            WinPrint.document.write(template.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
        }, 400);
    }

    async getTareaEvidences(lista_id: number, version_id: number) {
        try {
            let res: any = await this.listaInspeccionService.getInspeccionImagen(lista_id, version_id);
           
            if (res) {
                res.files.forEach(async (evidence) => {
                    let ev: any = await this.directorioService.download(evidence);
                   
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        if (ev) {
                            this.listaEvidence.push(reader.result);
                        } else {
                            throw new Error("Ocurrió un problema al consultar las evidencias de la tarea");
                        }
                    }
                });
            }

        } catch (e) {
            
        }
    }

    async getFirma(id_empleado: string) {
        
        try {
            
            let res: any = await this.empleadoService.getFirma(id_empleado);
            
            if (res) {
                res.files.forEach(async (evidence) => {
                    let ev: any = await this.directorioService.download(evidence);
                    
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        if (ev) {
                            this.firma.push(reader.result);
                        } else {
                            throw new Error("Ocurrió un problema al consultar la firma");
                        }
                    }
                });
            }

        } catch (e) {
           
        }
    }

    rangoFechaCierre(){
        let permiso = this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
        if (permiso != null && permiso.valido == true) {
            this.minDateIngenieria = "2000-01-01";
        } else {
            this.minDateIngenieria = this.maxDateIngenieria;
        }
        console.log(permiso)
    }
      
    rangoFechaCierreHse(){
        let permiso = this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
        if (permiso != null && permiso.valido == true) {
            this.minDateHse = "2000-01-01";
        } else {
            this.minDateHse = this.maxDateHse;
        }
        console.log(permiso)
    }
    
    firmaPermisos(){
        this.permisoHse = this.sesionService.getPermisosMap()["HSE"];
        this.permisoIngenieria = this.sesionService.getPermisosMap()["INGENIERIA"];
        
        if(this.permisoHse){
            this.selectDateHse = this.maxDateHse;          
            // setTimeout(() => {
            //     this.FormHseq.value.usuarioGestiona = this.sesionService.getEmpleado().primerNombre + " " + this.sesionService.getEmpleado().primerApellido;
            //     this.FormHseq.value.cargo = this.sesionService.getEmpleado().cargo.descripcion;
            // }, 2000);
            
        }

        if(this.permisoIngenieria){
            this.selectDateIngenieria = this.maxDateIngenieria;
            // setTimeout(() => {
            //     this.FormIng.value.usuarioGestiona = this.sesionService.getEmpleado().primerNombre + " " + this.sesionService.getEmpleado().primerApellido;
            //     this.FormIng.value.cargo = this.sesionService.getEmpleado().cargo.descripcion;
            // }, 2000);
            
        }

    }
    
    cargarDatosVistoBueno(tipo: string){
        
    }

    botonAceptar(tipo: string){
        console.log(tipo)
        if(tipo=='HSE'){
            this.FormHseq.value.concepto = "Aceptado"
        }
        else if(tipo=='ING'){
            this.FormIng.value.concepto = "Aceptado"
        }
        this.guardarVistoBueno(tipo)
    }

    botonDenegar(tipo: string){
        console.log(tipo)
        if(tipo=='HSE'){
            this.FormHseq.value.concepto = "Denegado"
        }
        else if(tipo=='ING'){
            this.FormIng.value.concepto = "Denegado"
        }
        this.guardarVistoBueno(tipo)
    }
    
    guardarVistoBueno(tipo: string){
        let calificacionList: Calificacion[] = [];
        try {
            // console.log("3")
            this.extraerCalificaciones(this.listaInspeccion.elementoInspeccionList, calificacionList);

            let inspeccion = new Inspeccion();
            // console.log("4")
            inspeccion.area = this.area;

            if(tipo=='HSE'){
                inspeccion.fechavistohse = this.FormHseq.value.fecha;
                inspeccion.fkempleadohse = this.empleado;
                inspeccion.conceptohse = this.FormHseq.value.concepto;
            }
            else if(tipo=='ING'){
                inspeccion.fechavistoing = this.FormIng.value.fecha;
                inspeccion.fkempleadoing = this.empleado;
                inspeccion.conceptoing = this.FormIng.value.concepto;
            }

            // console.log("5")
            inspeccion.listaInspeccion = this.listaInspeccion;
            inspeccion.programacion = this.programacion;
            // console.log("6")
            inspeccion.calificacionList = calificacionList;
            inspeccion.respuestasCampoList = [];
            // console.log("7")
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
            inspeccion.id = this.inspeccionId
            this.inspeccionService.update(inspeccion)
                .then(data => {
                    this.manageResponse(<Inspeccion>data);
                    this.solicitando = false;
                })
                .catch(err => {
                    this.solicitando = false;
                });
            
        } catch (error) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: error });
        }
        
        


        // inspeccion.id = this.inspeccionId
        // this.inspeccionService.update(inspeccion)
        //     .then(data => {
        //         this.manageResponse(<Inspeccion>data);
        //         this.solicitando = false;
        //     })
        //     .catch(err => {
        //         this.solicitando = false;
        //     });
    }
    

}
