import { Component, Input, OnInit } from '@angular/core';

import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Message, MenuItem, ConfirmationService,SelectItem } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/paginator';
import { SesionService } from 'app/modulos/core/services/sesion.service';

import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { TreeNode } from 'primeng/api';
import { Util } from 'app/modulos/comun/util';
import { Console } from 'console';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { Perfil } from 'app/modulos/empresa/entities/perfil';

@Component({
    selector: 'app-gestion-documental',
    templateUrl: './gestion-documental.component.html',
    styleUrls: ['./gestion-documental.component.scss'],
    providers: [PerfilService],
})
export class GestionDocumentalComponent implements OnInit {
    @Input('flagSCM') flagSCM: boolean = false;
    growlMsgs: Message[];
    msgs: Message[];
    @Input() caseid: any;
    totalRecords: number;
    nombreCarpeta: string;
    visibleDlgNuevaCarpeta: boolean;
    visibleDlgUpload: boolean;
    visibleDlgFichaTecnica: boolean;
    directorioList: TreeNode[];
    uploadedFiles: any[] = [];
    uploadEndPoint: string;
    menuItems: MenuItem[] = [
        { label: 'Compartir', icon: 'fa fa-share-alt', command: (event) => this.compartir(this.nodeSelect.data), disabled: true },
        //{ label: 'Ficha técnica', icon: 'fa fa-eye', command: (event) => this.abrirDlgFichaTecnica() },
        { label: 'Descargar', icon: 'fa fa-download', command: (event) => this.descargar(this.nodeSelect.data) },
        { label: '', separator: true },
        { label: 'Eliminar', icon: 'fa fa-trash', command: (event) => this.confirmarEliminar() },
    ];
    homeItem: MenuItem = { command: (event) => this.reconstruir(event) };
    breadCrumbItems: MenuItem[] = [];
    nodeSelect: TreeNode;
    nodoPadre: TreeNode;
    loading: boolean;
    draggedNode: TreeNode;
    criterioBusqueda: string;
    esPrivado: boolean;
    usuarioId: string;
    regactual:any;
    sortOrder;
    sortField;
    rows;
    esConsulta: boolean = false;
    flagSCMPPrivado:boolean=false;
    perfiles: any =[];
    perfilList: SelectItem[] = [];
    

    constructor(
        private directorioService: DirectorioService, 
        private confirmationService: ConfirmationService, 
        private sesionService: SesionService,    
        private perfilService: PerfilService) {
        this.uploadEndPoint = this.directorioService.uploadEndPoint;
    }

    ngOnInit() {
        this.perfilService.findAll().then((resp) => {
            (<Perfil[]>resp['data']).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
        });

        this.loading = true;
        this.esPrivado = false;
        this.usuarioId = this.sesionService.getUsuario().id;
        try {
            this.esConsulta = JSON.parse(localStorage.getItem('scmShowCase')) == true ? true : false;
        } catch (error) {
            this.esConsulta = false;            
        }
    }

    loadNodes(event: any) {
        this.cargarRaiz(event);
    }

    cargarRaiz(event) {
        this.nodoPadre = null;
        // Busca los directorios del directorio seleccionado

        let filterQuery = new FilterQuery();
        let filterQuery2 = new FilterQuery();
        filterQuery.sortField = event.sortField;
       // filterQuery.sortOrder = event.sortOrder;
       filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        this.regactual=event.first;
        this.sortOrder=event.sortOrder;
        this.sortField=event.sortField;
        this.rows=event.rows;
        filterQuery.rows = event.rows;

        let filterEliminado = new Filter();
        filterEliminado.criteria = Criteria.EQUALS;
        filterEliminado.field = 'eliminado';
        filterEliminado.value1 = 'false';

        filterQuery.count = true;

        let filterPadre = new Filter();
        filterPadre.criteria = Criteria.IS_NULL;
        filterPadre.field = 'directorioPadre';
        filterQuery.filterList = [filterPadre, filterEliminado];

        

        let filterCase = new Filter();
        filterCase.criteria = Criteria.IS_NULL;
        filterCase.field = 'caseId';

        if (this.caseid) {
            filterCase.criteria = Criteria.EQUALS;
            filterCase.value1 = this.caseid;
        }

        filterQuery.filterList = [filterPadre, filterEliminado, filterCase];

        if(!this.flagSCM){
            let filterAdo = new Filter();
            filterAdo.criteria = Criteria.EQUALS;
            filterAdo.field = 'modulo';
            //filterAdo.field = 'documento.modulo';
            filterAdo.value1 = 'ADO';
            filterQuery.filterList = [filterPadre, filterEliminado,filterCase,filterAdo];
        }

        return this.directorioService.findByFilter(filterQuery).then(async (data) => {
            this.totalRecords = data['count'];
            let dirList = this.inicializarFechas(<Directorio[]>data['data']);
            let dirList2=[]

            let perfilesId = [];

            let filterQuery = new FilterQuery();
            filterQuery.filterList = [{
                field: 'usuarioEmpresaList.usuario.id',
                criteria: Criteria.EQUALS,
                value1: this.sesionService.getUsuario().id,
                value2: null
            }];
            filterQuery.fieldList = ["id"];
            await this.perfilService.findByFilter(filterQuery).then(
                resp => {
                    resp['data'].forEach(ident => perfilesId.push(ident.id));
                })

            dirList.forEach((resp1:any)=>{
                if(resp1.perfilId == null){dirList2.push(resp1)}
                else{
                    let perfilid=resp1.perfilId.split(',');
                    let flag=false

                    perfilid.forEach(resp2=>{
                        perfilesId.forEach(resp3=>{
                            if(Number(resp2)==resp3){flag=true}
                        })
                    })

                    if(flag){
                        dirList2.push(resp1)
                    }
                }
                
                
            })

            this.directorioList = this.generarModelo(dirList2, null);

            this.loading = false;
        });
    }

    recarguesimple(event, actual:number) {
        
        this.nodoPadre = null;
        // Busca los directorios del directorio seleccionado

        let filterQuery = new FilterQuery();
        filterQuery.sortField = this.sortField;
        filterQuery.sortOrder = this.sortOrder;
      
        filterQuery.offset = actual;
        filterQuery.rows = this.rows;

        let filterEliminado = new Filter();
        filterEliminado.criteria = Criteria.EQUALS;
        filterEliminado.field = 'eliminado';
        filterEliminado.value1 = 'false';

        filterQuery.count = true;

        let filterPadre = new Filter();
        filterPadre.criteria = Criteria.IS_NULL;
        filterPadre.field = 'directorioPadre';
        filterQuery.filterList = [filterPadre, filterEliminado];

        let filterCase = new Filter();
        filterCase.criteria = Criteria.IS_NULL;
        filterCase.field = 'caseId';
        filterQuery.filterList = [filterPadre, filterEliminado, filterCase];
        if (this.caseid) {
            filterCase.criteria = Criteria.EQUALS;
            filterCase.value1 = this.caseid;
        }

        return this.directorioService.findByFilter(filterQuery).then((data) => {
            this.totalRecords = data['count'];
            let dirList = this.inicializarFechas(<Directorio[]>data['data']);

            this.directorioList = this.generarModelo(dirList, null);

            this.loading = false;
        });
    }

    generarModelo(dirList: Directorio[], nodoPadre: TreeNode) {
        let model = [];
        dirList.forEach((dir) => {
            model.push(this.generarNodo(dir, nodoPadre));
        });
        return model;
    }

    generarNodo(dir: Directorio, nodoPadre: TreeNode): TreeNode {
        let node: TreeNode;
        let split = dir.nombre.split('.');
        let strExt = dir.esDocumento ? split[split.length - 1] : 'dir';
        let extension = Util.tipo_archivo[strExt];
        dir['extension'] = extension == null ? Util.tipo_archivo['default'] : extension;
        dir['nodoPadre'] = nodoPadre;
        node = {
            label: dir.nombre,
            leaf: false,
            data: dir,
        };
        return node;
    }

    /**
     * Método que inicializa a un objeto Date las fechas recibidas como long
     */
    inicializarFechas(data: Directorio[]) {
        data.map((dir) => {
            if (dir.documento) {
                dir.documento.fechaAprobacion = dir.documento.fechaAprobacion == null ? null : new Date(dir.documento.fechaAprobacion);
                dir.documento.fechaElaboracion = dir.documento.fechaElaboracion == null ? null : new Date(dir.documento.fechaElaboracion);
                dir.documento.fechaVerificacion = dir.documento.fechaVerificacion == null ? null : new Date(dir.documento.fechaVerificacion);
            }
        });
        return data;
    }

    nuevoDocumento() {}

    abrirDlgUpload() {
        this.visibleDlgUpload = true;
    }
    cerrarDlgUpload() {
        this.visibleDlgUpload = false;
    }

    abrirDlgNuevaCarpeta() {
        this.nombreCarpeta = null;
        this.visibleDlgNuevaCarpeta = true;
    }
    cerrarDlgNuevaCarpeta() {
        this.visibleDlgNuevaCarpeta = false;
    }

    crearNuevaCarpeta() {
        
        let dir = new Directorio();
        dir.directorioPadre=null;
        if (this.nodeSelect != null) {
            // Determina el nodo padre de tipo carpeta
            let nodoPadre = this.nodeSelect.data.esDocumento ? this.nodeSelect.parent : this.nodeSelect;
            dir.directorioPadre = nodoPadre.data.id;
        }
        dir.nombre = this.nombreCarpeta;
        dir.caseId = this.caseid;
        dir.nivelAcceso="PUBLICO"
        if(!this.flagSCM)dir.modulo='ADO'
        this.directorioService.create(dir).then((data) => this.gestionarRespuesta(<Directorio>data));
    }
    gestionarRespuesta(dir: Directorio) {
        this.adicionarRegistroAArbol(dir, this.nodeSelect);
        this.cerrarDlgNuevaCarpeta();
        this.growlMsgs = [];
        this.growlMsgs.push({ severity: 'success', summary: 'Carpeta creada', detail: 'Se ha creado correctamente la carpeta ' + dir.nombre });
    }

    onUpload(event) {
        let dir = <Directorio>event;
        this.adicionarRegistroAArbol(dir, this.nodeSelect);
        this.cerrarDlgUpload();
        this.growlMsgs = [];
        this.growlMsgs.push({ severity: 'success', summary: 'Archivo creado', detail: 'Se ha subido correctamente el archivo ' + dir.nombre });
        this.cargarRaiz(event);
    }

    adicionarRegistroAArbol(dir: Directorio, nodo: TreeNode) {
        if (nodo != null) {
            let nodoPadre = nodo.data.esDocumento ? nodo.parent : nodo;
            if (nodoPadre.children == null) {
                nodoPadre.children = [];
            }
            nodoPadre.children.push(this.generarNodo(dir, nodo));
        } else {
            this.directorioList.push(this.generarNodo(dir, nodo));
        }
        this.directorioList = [...this.directorioList];
    }

    /* */
    onDoubleClick(event) {
        let nodeSelect = <TreeNode>event.node;
        if (!nodeSelect.data.esDocumento) {
            this.consultarNodos(nodeSelect).then((data) => {
                // Asigna el resultado al dataTable
                let dirList = this.inicializarFechas(<Directorio[]>data['data']);

                this.directorioList = this.generarModelo(dirList, nodeSelect);
                // Crea el item para añadir al breadcrumb
                this.breadCrumbItems = [];
                let parents = [nodeSelect];
                this.parentsItems(nodeSelect, parents);
                let index = parents.length - 1;
                parents.forEach((parent) => {
                    let item = {
                        label: parent.data.nombre,
                        command: (event) => this.reconstruir(event),
                        nodo: parent,
                        indice: index--,
                    };
                    this.breadCrumbItems.splice(0, 0, item);
                });
                // Inicializa las fechas de la ficha técnica
            });
        } else {
            this.nodeSelect = nodeSelect;
            this.descargar(nodeSelect.data);
        }
        //this.cargarRaiz(event);
    }

    parentsItems(node: TreeNode, list: TreeNode[]): TreeNode[] {
        if (node.data.nodoPadre == null && node.parent == null) {
            return list;
        } else {
            list.push(node.parent == null ? node.data.nodoPadre : node.parent);
            return this.parentsItems(node.parent == null ? node.data.nodoPadre : node.parent, list);
        }
    }

    consultarNodos(padre: TreeNode) {
        this.nodoPadre = padre;
        // Busca los directorios del directorio seleccionado

        let filterQuery = new FilterQuery();
        let filterEliminado = new Filter();
        filterEliminado.criteria = Criteria.EQUALS;
        filterEliminado.field = 'eliminado';
        filterEliminado.value1 = 'false';

        let filterPadre = new Filter();
        filterPadre.criteria = Criteria.EQUALS;
        filterPadre.field = 'directorioPadre.id';
        filterPadre.value1 = this.nodoPadre.data.id;

        let filterCase = new Filter();
        filterCase.criteria = Criteria.IS_NULL;
        filterCase.field = 'caseId';

        if (this.caseid) {
            filterCase.criteria = Criteria.EQUALS;
            filterCase.value1 = this.caseid;
        }
        filterQuery.filterList = [filterPadre, filterEliminado, filterCase];

        return this.directorioService.findByFilter(filterQuery);
    }

    reconstruir(event) {
        this.nodeSelect = null;
        if (event.item.nodo == null) {
            this.breadCrumbItems.splice(0);
            this.cargarRaiz(event);
        } else {
            this.breadCrumbItems.splice(event.item.indice + 1);
            this.nodoPadre = <TreeNode>event.item.nodo;

            let filterQuery = new FilterQuery();
            let filterPadre = new Filter();
            filterPadre.criteria = Criteria.EQUALS;
            filterPadre.field = 'eliminado';
            filterPadre.value1 = 'false';
            filterQuery.rows = event.rows;
            filterQuery.count = true;

            let filterEliminado = new Filter();
            filterEliminado.criteria = Criteria.EQUALS;
            filterEliminado.field = 'directorioPadre.id';
            filterEliminado.value1 = this.nodoPadre.data.id;

            let filterCase = new Filter();
            filterCase.criteria = Criteria.IS_NULL;
            filterCase.field = 'caseId';

            if (this.caseid) {
                filterCase.criteria = Criteria.EQUALS;
                filterCase.value1 = this.caseid;
            }
            filterQuery.filterList = [filterPadre, filterEliminado, filterCase];

            this.directorioService.findByFilter(filterQuery).then((data) => {
                let dirList = this.inicializarFechas(<Directorio[]>data['data']);

                this.directorioList = this.generarModelo(dirList, this.nodoPadre);
                this.totalRecords = data['count'];
            });
        }
    }

    /* */
    compartir(directorio: Directorio) {}

    actualizarDocumento(directorio: Directorio) {
        this.directorioService.actualizarDocumento(directorio.documento).then((data) => {
            this.growlMsgs = [];
            this.growlMsgs.push({
                severity: 'success',
                summary: 'Ficha técnica actualizada',
                detail: 'Se ha actualizado correctamente la ficha técnica del archivo ' + this.nodeSelect.data.nombre,
            });
        });
    }

    async actualizarDirectorio(nodo: TreeNode) {
        let perfil
        this.perfiles.length==0?null:perfil=this.perfiles.toString()

        let directorio = nodo.data;
        let dir = new Directorio();
        dir.id = directorio.id;
        dir.nombre = directorio.nombre;
        dir.nivelAcceso = this.esPrivado ? 'PRIVADO' : 'PUBLICO';
        dir.perfilId=perfil

        if (nodo.parent != null || directorio.directorioPadre != null) {
            let dirPadre = new Directorio();
            dirPadre.id = nodo.parent == null ? directorio.directorioPadre.id : nodo.parent.data.id;
            dir.directorioPadre = dirPadre;
        }
        await this.directorioService.update(dir).then((data) => {
            this.growlMsgs = [];
            this.growlMsgs.push({
                severity: 'success',
                summary: 'Actualización realizada',
                detail: 'Se ha realizado correctamente la actualización ' + this.nodeSelect.data.nombre,
            });
        });
        this.cargarRaiz(event);
    }

    descargar(directorio: Directorio) {
        if (!this.nodeSelect.data.esDocumento) {
            this.growlMsgs = [];
            this.growlMsgs.push({
                severity: 'warn',
                summary: 'Operación no permitida',
                detail: 'No es posible descargar un directorio, esta opción solo es permitida para archivos',
            });
            return;
        }
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Descargando...', detail: this.nodeSelect.data.nombre });
        this.directorioService.download(this.nodeSelect.data.id).then((resp) => {
            if (resp != null) {
                var blob = new Blob([<any>resp]);
                let url = URL.createObjectURL(blob);
                let dwldLink = document.getElementById('dwldLink');
                dwldLink.setAttribute('href', url);
                dwldLink.setAttribute('download', this.nodeSelect.data.nombre);
                dwldLink.click();
                this.msgs = [];
                this.growlMsgs = [];
                this.growlMsgs.push({
                    severity: 'success',
                    summary: 'Archvo descargado',
                    detail: 'Se ha descargado correctamente el archivo ' + this.nodeSelect.data.nombre,
                });
            }
        });
    }

    confirmarEliminar() {
        let msg = this.nodeSelect.data.esDocumento
            ? 'Esta acción eliminará el archivo ' + this.nodeSelect.data.nombre + ' ¿Esta seguro de continuar?'
            : 'Esta acción eliminará el directorio ' + this.nodeSelect.data.nombre + ' y todo su contenido ¿Esta seguro de continuar?';

        this.confirmationService.confirm({
            header: 'Eliminar ' + (this.nodeSelect.data.esDocumento ? ' archivo ' : ' directorio '),
            message: msg,
            accept: () => {
                this.eliminar(this.nodeSelect.data);
            },
        });
    }

    eliminar(directorio: Directorio) {
        this.directorioService.delete(directorio.id).then((resp) => {
            let lista = this.nodeSelect.parent == null ? this.directorioList : this.nodeSelect.parent.children;
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].data.id == directorio.id) {
                    lista.splice(i, 1);
                    this.directorioList = [...this.directorioList];
                    break;
                }
            }
            this.growlMsgs = [];
            this.growlMsgs.push({
                severity: 'success',
                summary: 'Archvo eliminado',
                detail: 'Se ha eliminado correctamente el archivo ' + directorio.nombre,
            });
        });
    }

    onNodeExpand(event: any) {
        let nodo = event.node;
        this.loading = true;
        this.consultarNodos(nodo).then((data) => {
            let children = [];
            let dirList = this.inicializarFechas(<Directorio[]>data['data']);

            dirList.forEach((dir) => {
                children.push(this.generarNodo(dir, this.nodeSelect));
            });
            nodo.children = children;
            this.directorioList = [...this.directorioList];
            this.loading = false;
        });
    }

    dragStart(event, param: any) {
        this.draggedNode = param.node;
    }

    async drop(event, dropParam: any) {
        // Si dropParam se recibe como null, indica que el nodo arrastrado deberá moverse a la raíz
        let dropNode = dropParam == null ? null : dropParam.node;
        let directorio = this.draggedNode.data;
        if (dropNode != null && (directorio.id == dropNode.data.id || dropNode.data.esDocumento)) {
            return;
        }

        let dir = new Directorio();
        dir.id = directorio.id;
        dir.nombre = directorio.nombre;
        dir.nivelAcceso= directorio.nivelAcceso;

        if (dropParam != null) {
            let dirPadre = new Directorio();
            dirPadre.id = dropNode.data.id;
            dir.directorioPadre = dirPadre;
        } else {
            dir.directorioPadre = null;
        }

       await this.directorioService.update(dir).then((data) => {
            let childrenList = this.draggedNode.parent == null ? this.directorioList : this.draggedNode.parent.children;
            for (let i = 0; childrenList.length; i++) {
                if (childrenList[i].data.id == this.draggedNode.data.id) {
                    childrenList.splice(i, 1);
                    break;
                }
            }
            if (dropNode != null && dropNode.children == null) {
                dropNode.children = [];
            }
            if (dropNode != null) {
                dropNode.children.push(this.draggedNode);
            } else {
                this.directorioList.push(this.draggedNode);
            }
            this.draggedNode.parent = dropNode;
            this.directorioList = [...this.directorioList];
            this.growlMsgs = [];
            this.growlMsgs.push({
                severity: 'success',
                summary: 'Traslado realizado',
                detail: 'Se ha trasladado correctamente el archivo. ' + this.draggedNode.data.nombre,
            });
        });
    this.recarguesimple(event,this.regactual);
    }

    dragEnd(event) {
        this.draggedNode = null;
    }

    buscar(event: any) {
        setTimeout(() => {
        // if (event.keyCode == 13) {
            this.loading = true;
            let filterQuery = new FilterQuery();
            filterQuery.filterList = [];
            filterQuery.count = true;
            filterQuery.rows = event.rows;

            let filtEliminado = new Filter();
            filtEliminado.criteria = Criteria.EQUALS;
            filtEliminado.field = 'eliminado';
            filtEliminado.value1 = 'false';
            filterQuery.filterList.push(filtEliminado);

            if (this.criterioBusqueda == null || this.criterioBusqueda == '') {
                let filtPadre = new Filter();
                filtPadre.criteria = Criteria.IS_NULL;
                filtPadre.field = 'directorioPadre';
                filterQuery.filterList.push(filtPadre);
            } else {
                let filterValue = new Filter();
                filterValue.criteria = Criteria.LIKE;
                filterValue.field = 'nombre';
                filterValue.value1 ='%' + this.criterioBusqueda + '%';
              //  filterValue.value1 =this.criterioBusqueda;
                filterQuery.filterList.push(filterValue);
            }

            let filterCase = new Filter();
            filterCase.criteria = Criteria.IS_NULL;
            filterCase.field = 'caseId';


            if (this.caseid) {
                filterCase.criteria = Criteria.EQUALS;
                filterCase.value1 = this.caseid;
            }
            filterQuery.filterList.push(filterCase);

            if(!this.flagSCM){
                let filterAdo = new Filter();
                filterAdo.criteria = Criteria.EQUALS;
                //filterAdo.field = 'documento.modulo';
                filterAdo.field = 'modulo';
                filterAdo.value1 = 'ADO';
                filterQuery.filterList.push(filterAdo);}

            return this.directorioService.findByFilter(filterQuery).then((data) => {
                this.totalRecords = data['count'];
                let dirList = this.inicializarFechas(<Directorio[]>data['data']);
                this.directorioList = this.generarModelo(dirList, null);
                this.loading = false;
            });
        // }
    }, 500);
    }
    getNivelAcceso(event, dataNode?: Directorio) {
        let perfil:any
        this.perfiles=[]
        if(dataNode.perfilId){
            this.flagSCMPPrivado=true
            perfil=dataNode.perfilId.split(',');
            perfil.forEach(element => {
                this.perfiles.push(Number(element))
            });
        }else{
            this.flagSCMPPrivado=false 
        }
        if (dataNode != null) {
            this.esPrivado = dataNode.nivelAcceso == 'PRIVADO';
           // this.cargarRaiz(event);
        }
    }

}
