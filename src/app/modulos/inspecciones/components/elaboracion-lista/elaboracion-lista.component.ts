import { Documento } from './../../../ado/entities/documento';
import { ListaInspeccionPK } from 'app/modulos/inspecciones/entities/lista-inspeccion-pk';
import { stringify } from 'querystring';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion'
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Formulario } from 'app/modulos/comun/entities/formulario';
import { FormularioConstructorComponent } from 'app/modulos/comun/components/formulario-constructor/formulario-constructor.component';

import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'

import { Message, SelectItem } from 'primeng/primeng';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { Perfil } from 'app/modulos/empresa/entities/perfil';

import { DirectorioService } from 'app/modulos/ado/services/directorio.service';

import { TareaService } from 'app/modulos/sec/services/tarea.service';
import { SeguimientosService } from 'app/modulos/sec/services/seguimientos.service';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-elaboracion-lista',
    templateUrl: './elaboracion-lista.component.html',
    styleUrls: ['./elaboracion-lista.component.scss'],
})
export class ElaboracionListaComponent implements OnInit {

    @ViewChild("formularioConstructor", { static: false }) formularioConstructor: FormularioConstructorComponent;
    msgs: Message[] = [];
    form: FormGroup;
    opcionesCalifList: OpcionCalificacion[] = [];
    elementoInspeccionList: ElementoInspeccion[] = [];
    consultar: boolean = false;
    adicionar: boolean = false;
    modificar: boolean = false;
    finalizado: boolean = false;
    perfilList: SelectItem[] = [];
    
    imagenesList: any[];
    numMaxImg = 2;

    listaEvidence = [];

    tipoListaOpts: SelectItem[] = [    
        
{ label: 'Bioseguridad', value: 'Bioseguridad' },
{ label: 'COPASST', value: 'COPASST' },
{ label: 'Eléctrico', value: 'Eléctrico' },
{ label: 'Emergencias', value: 'Emergencias' },
{ label: 'EPP', value: 'EPP' },
{ label: 'Equipos', value: 'Equipos' },
{ label: 'Ergonomía', value: 'Ergonomía' },
{ label: 'Higiene Industrial', value: 'Higiene Industrial' },
{ label: 'Instalaciones', value: 'Instalaciones' },
{ label: 'Legal', value: 'Legal' },
{ label: 'Mantenimiento', value: 'Mantenimiento' },
{ label: 'Maquinaria', value: 'Maquinaria' },
{ label: 'Medicina', value: 'Medicina' },
{ label: 'Orden y Aseo', value: 'Orden y Aseo' },
{ label: 'Primeros Auxilios', value: 'Primeros Auxilios' },
{ label: 'Psicosocial', value: 'Psicosocial' },
{ label: 'Químicos', value: 'Químicos' },
{ label: 'Seguridad', value: 'Seguridad' },
{ label: 'Teletrabajo', value: 'Teletrabajo' },
{ label: 'Transporte', value: 'Transporte' },


    ];

    constructor(
        private fb: FormBuilder,
        private listaInspeccionService: ListaInspeccionService,
        private paramNav: ParametroNavegacionService,
        private perfilService: PerfilService,
        private directorioService: DirectorioService,
        private seguimientoService: SeguimientosService,
        private tareaService: TareaService,

        private domSanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        
        this.perfilService.findAll().then(
            resp => {
                
                (<Perfil[]>resp['data']).forEach(perfil => {
                    this.perfilList.push({ label: perfil.nombre, value: perfil.id });
                });
            }
        );
        this.form = this.fb.group({
            'id': null,
            'version': [null, Validators.required],
            'codigo': [null, Validators.required],
            'nombre': [null, Validators.required],
            'tipoLista': [null, Validators.required],
            'descripcion': [null],
            'perfilesId': [null, Validators.required],
            'estado': [null]
        });

        switch (this.paramNav.getAccion<string>()) {
            case 'GET':
                this.consultar = true;
                this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
                break;
            case 'PUT':
                this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
                this.modificar = true;
                break;
            default:
                this.adicionar = true;
                break;
        }
        this.paramNav.reset();
        
    }
    
    
    buildPerfilesIdList(ids: Array<any>) {
        let perfilesIdList = [];        
        ids.forEach(ue => {

            perfilesIdList.push({ id: ue });
        });
        return perfilesIdList;
    }
    consultarLista(listaInsp: ListaInspeccion) {
        let filterQuery = new FilterQuery();
        let filterId = new Filter();
        filterId.criteria = Criteria.EQUALS;
        filterId.field = "listaInspeccionPK.id";
        filterId.value1 = listaInsp.listaInspeccionPK.id;

        let filterVersion = new Filter();
        filterVersion.criteria = Criteria.EQUALS;
        filterVersion.field = "listaInspeccionPK.version";
        filterVersion.value1 = listaInsp.listaInspeccionPK.version.toString();

        filterQuery.filterList = [filterId, filterVersion];

        this.listaInspeccionService.findByFilter(filterQuery).then(
            data => {
                listaInsp = (<ListaInspeccion[]>data['data'])[0];
                this.opcionesCalifList = listaInsp.opcionCalificacionList;
                this.elementoInspeccionList = listaInsp.elementoInspeccionList;
                this.formularioConstructor.formulario = listaInsp.formulario;
                this.form.patchValue({ 'perfilesId': JSON.parse(listaInsp.fkPerfilId) })
            }
        );
        this.form.patchValue({
            id: listaInsp.listaInspeccionPK,
            codigo: listaInsp.codigo,
            nombre: listaInsp.nombre,
            version: listaInsp.listaInspeccionPK.version,
            tipoLista: listaInsp.tipoLista,
            descripcion: listaInsp.descripcion
        });
        if (this.consultar) {
            this.form.disable();
        }
        this.getTareaEvidences(parseInt(listaInsp.listaInspeccionPK.id),listaInsp.listaInspeccionPK.version);
    }


    addOpcionRespuesta() {
        let opc = new OpcionCalificacion();
        opc.despreciable = false;
        opc.requerirDoc = true;
        opc.numeral = this.opcionesCalifList.length == 0 ? 1 : this.opcionesCalifList[this.opcionesCalifList.length - 1].numeral + 1;
        this.opcionesCalifList.push(opc);
        this.opcionesCalifList = this.opcionesCalifList.slice();
    }



    removeOpcionCalificacion(opc: OpcionCalificacion) {
        for (let i = 0; i < this.opcionesCalifList.length; i++) {
            if (this.opcionesCalifList[i].numeral == opc.numeral) {
                this.opcionesCalifList.splice(i, 1);
                this.opcionesCalifList = this.opcionesCalifList.slice();
                break;
            }
        }
    }

    async guardar() {
        console.log();
        

        this.msgs = [];
        if (this.opcionesCalifList.length < 2) {
            this.msgs.push({ severity: 'warn', summary: 'Cuidado', detail: 'Necesitas minimo dos opciones de respuesta' });
            return false;
        } else {
            let err = false;
            for (const element of this.opcionesCalifList) {
                if (!element.nombre || !element.descripcion)
                    return this.msgs.push({ severity: 'warn', summary: 'Cuidado', detail: 'Necesitas Nombre y descripcion en opciones de respuesta  ' });

            }
        }
        if (Object.keys(this.formularioConstructor.formulario).length < 1) {
            return this.msgs.push({ severity: 'warn', summary: 'Cuidado', detail: 'Minimo 1 formulario en Datos generales' });
        }else{
            let err = false;
            for (const element of this.formularioConstructor.formulario.campoList) {
                if (!element.nombre || !element.descripcion || !element.tipo)
                    return this.msgs.push({ severity: 'warn', summary: 'Cuidado', detail: 'Necesitas Nombre y descripcion y tipo en datos generales ' });

            }
        }
        if (this.elementoInspeccionList.length < 1) {
            return this.msgs.push({ severity: 'warn', summary: 'Cuidado', detail: 'Minimo 1 Elemento de inspeccion' });
        }

        let listInp = new ListaInspeccion();
        listInp.nombre = this.form.value.nombre;
        listInp.codigo = this.form.value.codigo;
        listInp.listaInspeccionPK.version = this.form.value.version;
        listInp.tipoLista = this.form.value.tipoLista;
        listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);
        listInp.descripcion = this.form.value.descripcion;
        listInp.tipoLista = this.form.value.tipoLista;
        listInp.opcionCalificacionList = this.opcionesCalifList;
        listInp.estado = 'activo';
        listInp.elementoInspeccionList = this.elementoInspeccionList;
        listInp.formulario = this.formularioConstructor.formulario;
        await this.verifyIntegrity(listInp);
        this.listaInspeccionService.create(listInp).then(
            data => {

                if (this.imagenesList != null) {
                    this.imagenesList.forEach(async imgObj => {                                              
                        let resp = await this.directorioService.upload(imgObj.file, null, 'INP', listInp.listaInspeccionPK.id.toString(), null);
                        let respid = Object.values(resp);
                        this.directorioService.uploadv4(respid[0], listInp.listaInspeccionPK.id.toString(), listInp.listaInspeccionPK.version.toString());                                                
                    });
                }
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Lista de inspección creada', detail: 'Se ha creado correctamente la lista de inspección  ' + listInp.nombre });
                this.finalizado = true;
                this.adicionar = false;
            }
        );
    }
    actualizarProfile(actualizarVersion: boolean) {
        let listInp = new ListaInspeccion();
        listInp.listaInspeccionPK = this.form.value.id;
        listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);

        let param = (actualizarVersion == false ? null : 'actualizarVersion=true') + '&putProfile=true';
        this.listaInspeccionService.update(listInp, param).then(
            data => {

                this.msgs = [];
                let detalle = actualizarVersion ? 'Se ha generado correctamente una nueva versión de la lista de inspección ' : 'Se ha actualizado correctamente la lista de inspección ';
                this.msgs.push({ severity: 'success', summary: 'Perfiles de inspección actualizados' });
            }
        );

    }

    actualizar(actualizarVersion: boolean) {        
        let listInp = new ListaInspeccion();
        listInp.listaInspeccionPK = this.form.value.id;
        listInp.nombre = this.form.value.nombre;
        listInp.codigo = this.form.value.codigo;
        listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);
        

        listInp.descripcion = this.form.value.descripcion;
        listInp.tipoLista = this.form.value.tipoLista;
        listInp.opcionCalificacionList = this.opcionesCalifList;
        listInp.elementoInspeccionList = this.elementoInspeccionList;
        listInp.formulario = this.formularioConstructor.formulario;
        let param = (actualizarVersion == false ? null : 'actualizarVersion=true');
        if(actualizarVersion==true){
            listInp.estado = 'inactivo';
            listInp.listaInspeccionPK.version = listInp.listaInspeccionPK.version + 1;
            this.listaInspeccionService.update(listInp,'actualizarVersion=false')
        }
        listInp.estado = 'activo';
         
        this.listaInspeccionService.update(listInp, param).then(
            data => {
                if (this.imagenesList != null) {
                    this.imagenesList.forEach(async imgObj => {                                              
                        let resp = await this.directorioService.upload(imgObj.file, null, 'INP', listInp.listaInspeccionPK.id.toString(), null);
                        let respid = Object.values(resp);
                        
                        this.directorioService.uploadv4(respid[0], listInp.listaInspeccionPK.id.toString(), listInp.listaInspeccionPK.version.toString());                                                
                    });
                }
                
                this.msgs = [];
                let detalle = actualizarVersion ? 'Se ha generado correctamente una nueva versión de la lista de inspección ' : 'Se ha actualizado correctamente la lista de inspección ';
                this.msgs.push({ severity: 'success', summary: 'Lista de inspección actualizada', detail: detalle + listInp.nombre });
            }
        );
        console.log(listInp.estado)
    }



    verifyIntegrity(listInp) {



    }




    resetAll() {
        this.adicionar = true;
        this.finalizado = false;
        this.opcionesCalifList = [];
        this.elementoInspeccionList = [];
        this.form.reset();
    }

    
    onArchivoSelect(event) {
        let file = event.target.files[0];
        this.msgs = [];
        if (file.type != "image/jpeg" && file.type != "image/png") {
            this.msgs.push({ severity: 'error', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg' });
            return;
        }
        if (file.size > 3_500_000) {
            this.msgs.push({ severity: 'error', summary: 'Tamaño máximo superado 3.5 MB', detail: 'La imágen supera el tamaño máximo permitido' });
            return;
        }
        if (this.imagenesList == null)
            this.imagenesList = [];
        let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.imagenesList.push({ source: urlData, file: file });
        this.imagenesList = this.imagenesList.slice();
    }

    async getTareaEvidences(lista_id: number, version_id: number) {
        try {
            let res: any = await this.listaInspeccionService.getInspeccionImagen(lista_id, version_id);
            console.log(res);
            if (res) {
                res.files.forEach(async (evidence) => {
                    let ev: any = await this.directorioService.download(evidence);
                    console.log(ev)
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
            console.log(e);
        }
    }


}
