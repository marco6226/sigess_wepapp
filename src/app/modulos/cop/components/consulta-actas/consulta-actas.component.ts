import { Component, OnInit, ViewChild } from '@angular/core';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Message, ConfirmationService } from 'primeng/api';
import { Directorio } from '../../../ado/entities/directorio';
import { ActaService } from '../../services/acta.service';
import { Acta } from '../../entities/acta';
import { Documento } from '../../../ado/entities/documento';
import { Area } from '../../../empresa/entities/area';
import { Util } from '../../../comun/util';
import { SesionService } from '../../../core/services/sesion.service';
import { Criteria } from '../../../core/entities/filter';

@Component({
    selector: 'app-consulta-actas',
    templateUrl: './consulta-actas.component.html',
    styleUrls: ['./consulta-actas.component.scss'],
    providers: [ActaService, DirectorioService]
})
export class ConsultaActasComponent implements OnInit {

    @ViewChild('fileChooser', { static: true }) fileChooser: HTMLInputElement;

    nombre: string;
    descripcion: string;
    area: Area;
    documentoList: Documento[];

    actasList: Acta[];

    visibleDlg: boolean;
    msgs: Message[];
    loading: boolean;
    totalRecords: number;

    areasPerm: string;


    constructor(
        private sesionService: SesionService,
        private dirService: DirectorioService,
        private actaService: ActaService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit() {
        this.loading = true;
        this.areasPerm = this.sesionService.getPermisosMap()['COP_GET_ACT'].areas;
        let areasPermiso =this.areasPerm.replace('{','');
        areasPermiso =areasPermiso.replace('}','');
        let areasPermiso2=areasPermiso.split(',')
    
        const filteredArea = areasPermiso2.filter(function(ele , pos){
          return areasPermiso2.indexOf(ele) == pos;
        }) 
        this.areasPerm='{'+filteredArea.toString()+'}';
    }

    lazyLoad(event: any) {
        this.loading = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;

        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPerm });

        this.actaService.findByFilter(filterQuery)
            .then(resp => {
                this.totalRecords = resp['count'];
                this.loading = false;
                this.actasList = [];
                (<any[]>resp['data']).forEach(dto => this.actasList.push(FilterQuery.dtoToObject(dto)));
            });
    }

    showDlg() {
        this.documentoList = null;
        this.nombre = null;
        this.descripcion = null;
        this.area = null;
        this.visibleDlg = true;
    }

    onUpload(acta: Acta) {
        this.actasList.unshift(acta);
        this.msgs = [{
            severity: 'success',
            summary: 'Acta adjuntada',
            detail: 'Se ha subido correctamente el acta ' + acta.nombre
        }];
        this.visibleDlg = false;
    }

    guardarActa() {
        let acta: Acta = new Acta();
        acta.nombre = this.nombre;
        acta.descripcion = this.descripcion;
        acta.area = this.area;
        this.actaService.create(acta)
            .then((resp: Acta) => {
                acta.id = resp.id;
                acta.fechaElaboracion = resp.fechaElaboracion;
                if (this.documentoList == null || this.documentoList.length == 0) {
                    this.onUpload(acta);
                } else {
                    let count = 0;
                    this.documentoList.forEach(arch => {
                        let file = Util.cambiarNombreFile(arch['file'], arch.nombre + '.' + arch['ext']);
                        this.dirService.upload(file, null, 'cop', acta.id, null)
                            .then((dir: Directorio) => {
                                if (acta.documentosList == null) {
                                    acta.documentosList = []
                                }
                                acta.documentosList.push(dir.documento);
                                count += 1;
                                if (count == this.documentoList.length) {
                                    this.onUpload(acta);
                                }
                            })
                            .catch(err => {
                                count += 1;
                                if (count == this.documentoList.length) {
                                    this.onUpload(acta);
                                }
                            });
                    });
                }
            });
    }


    descargar(doc: Documento) {
        this.msgs = [{
            severity: 'info',
            summary: 'Descargando...',
            detail: 'Descargando ' + doc.nombre
        }];
        this.dirService.download(doc.id, 'cop').then(
            resp => {
                if (resp != null) {
                    var blob = new Blob([<any>resp]);
                    let url = URL.createObjectURL(blob);
                    let dwldLink = document.createElement("a");
                    dwldLink.setAttribute("href", url);
                    dwldLink.setAttribute("download", doc.nombre);
                    dwldLink.click();
                    this.msgs = [{
                        severity: 'success',
                        summary: 'Archivo descargado',
                        detail: 'Se ha descargado correctamente el archivo ' + doc.nombre
                    }];
                }
            }
        );
    }

    eliminarActa(acta: Acta, index: number) {
        this.confirmationService.confirm({
            header: 'Confirmar acción',
            message: 'El acta ' + acta.nombre + ' será eliminada, no podrá deshacer esta acción, ¿Desea continuar?',
            accept: () => {
                this.actaService.delete(acta.id)
                    .then((resp: Acta) => {
                        this.actasList.splice(index, 1);
                        this.actasList = this.actasList.slice();
                        this.msgs = [{
                            severity: 'success',
                            summary: 'Acta eliminada',
                            detail: 'Se ha eliminado correctamente el acta ' + acta.nombre
                        }]
                    })
            }
        });
    }

    /* ********************** DOCUMENTOS ****************************** */
    openFileChooser() {
        (<any>this.fileChooser).nativeElement.click();
    }

    onFileSelect(file: FileList) {
        if (this.documentoList == null)
            this.documentoList = [];

        let nombreSplit = file.item(0).name.split(".");
        let ext = nombreSplit.length > 0 ? nombreSplit[1] : "";
        let fileName = nombreSplit[0];
        let doc = { nombre: fileName, ext: ext };
        doc['file'] = file.item(0);
        this.documentoList.unshift(<any>doc);
        this.documentoList = this.documentoList.slice();

    }

    removerDoc(doc, idx: number) {
        this.documentoList.splice(idx, 1);
    }

    downloadFile(doc: Documento) {
        if (doc['file'] != null) {
            let url = URL.createObjectURL(doc['file']);
            let dwldLink = document.createElement("a");
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", doc.nombre);
            dwldLink.click();
            dwldLink.remove();
        } else {

        }
    }
}
