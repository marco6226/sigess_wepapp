import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion'
import { SistemaNivelRiesgo } from 'app/modulos/core/entities/sistema-nivel-riesgo';
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo';
import { Calificacion } from 'app/modulos/inspecciones/entities/calificacion'
import { DomSanitizer } from '@angular/platform-browser';

import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Message, OverlayPanel } from 'primeng/primeng'
import { TipoHallazgoService } from 'app/modulos/inspecciones/services/tipo-hallazgo.service'
import { TipoHallazgo } from '../../entities/tipo-hallazgo';
import { SesionService } from '../../../core/services/sesion.service';

@Component({
  selector: 's-lista-inspeccion-form',
  templateUrl: './lista-inspeccion-form.component.html',
  styleUrls: ['./lista-inspeccion-form.component.scss'],
  providers: [DirectorioService, TipoHallazgoService]
})
export class ListaInspeccionFormComponent implements OnInit {


  @Output() onElementoClick = new EventEmitter<any>();
  @Input("value") value: ElementoInspeccion[];
  @Input("opciones") opciones: OpcionCalificacion[];
  @Input("editable") editable: boolean = false;
  @Input("disabled") disabled: boolean = false;
  @Input("nivelRiesgoList") nivelRiesgoList: any;
  @Input("diligenciable") diligenciable: boolean;
  @Input("usarNivelRiesgo") usarNivelRiesgo: boolean;
  @Input("usarTipoHallazgo") usarTipoHallazgo: boolean;
  visibleDlg: boolean;

  contadorElem: number = 0;
  elementoSelect: ElementoInspeccion;
  imagenesList: any[] = [];
  imgMap: any = {};
  msgs: Message[] = [];
  tipoHallazgoList: TipoHallazgo[];

  loadingImg: boolean;
  numMaxImg = 1;

  constructor(
    private sessionService: SesionService,
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
    private tipoHallazgoService: TipoHallazgoService,
  ) { }

  ngOnInit() {
    this.numMaxImg = this.sessionService.getConfigParam('NUM_MAX_FOTO_INP');
    this.tipoHallazgoService.findByFilter()
      .then(resp => {
        this.tipoHallazgoList = resp['data'];
      });
  }

  adicionarElementoInp() {
    let elemento = new ElementoInspeccion();
    elemento.numero = ++this.contadorElem;
    if (this.value == null)
      this.value = [];
    this.value.push(elemento);
  }

  elementoClick(elem: ElementoInspeccion) {
    if (elem.calificacion == null) {
      elem.calificacion = new Calificacion();
      elem.calificacion.opcionCalificacion = new OpcionCalificacion();
      elem.calificacion.nivelRiesgo = new NivelRiesgo();
      elem.calificacion.tipoHallazgo = new TipoHallazgo();
    }
    if (elem.calificacion.nivelRiesgo == null) {
      elem.calificacion.nivelRiesgo = new NivelRiesgo();
    }
    if (elem.calificacion.opcionCalificacion == null) {
      elem.calificacion.opcionCalificacion = new OpcionCalificacion();
    }
    if (elem.calificacion.tipoHallazgo == null) {
      elem.calificacion.tipoHallazgo = new TipoHallazgo();
    }
    this.elementoSelect = elem;
    this.imagenesList = [];
    let elemImgs: any[] = this.imgMap[elem.id];
    if (elemImgs != null && elemImgs.length > 0) {
      elemImgs.forEach(objFile => {
        if (objFile.file != null) {
          let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(objFile.file));
          this.imagenesList.push({ source: urlData });
        }
      });
      this.imagenesList = this.imagenesList.slice();
    } else if (this.elementoSelect.calificacion.documentosList != null && this.elementoSelect.calificacion.documentosList.length > 0) {
      this.loadingImg = true;
      this.elementoSelect.calificacion.documentosList.forEach(doc => {
        this.imgMap[elem.id] = [];
        this.directorioService.download(doc.id)
          .then(data => {
            let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
            this.imagenesList.push({ source: urlData });
            this.imagenesList = this.imagenesList.slice();
            this.imgMap[elem.id].push({ file: data, change: false });
            this.loadingImg = false;
          })
          .catch(err => {
            this.loadingImg = false;
          });
      });
    }
    this.visibleDlg = true;
  }

  onArchivoSelect(event) {
    let file = event.target.files[0];
    if (file.type != "image/jpeg" && file.type != "image/png") {
      this.msgs.push({ severity: 'warn', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg' });
      return;
    }
    if (file.size > 1_500_000) {
      this.msgs.push({ severity: 'warn', summary: 'Tamaño máximo superado 1.5MB', detail: 'La imágen supera el tamaño máximo permitido' });
      return;
    }
    this.msgs = [];

    if (this.imagenesList == null)
      this.imagenesList = [];

    if (this.imagenesList.length >= this.numMaxImg) {
      this.msgs.push({
        severity: 'warn',
        summary: 'Número maximo de fotografias alcanzado',
        detail: 'Ha alcanzado el número máximo de fotografias (' + this.numMaxImg + ') que puede adjuntar para este hallazgo'
      });
      return;
    }
    let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    this.imagenesList.push({ source: urlData });
    this.imagenesList = this.imagenesList.slice();
    let keyMap = this.elementoSelect.id;
    if (this.imgMap[keyMap] == null)
      this.imgMap[keyMap] = [];
    this.imgMap[keyMap].push({ file: file, change: true });
  }

  removerImagen(event: any) {
    this.imgMap[this.elementoSelect.id].splice(event.index, 1);
    if (this.elementoSelect.calificacion.documentosList != null) {
      this.elementoSelect.calificacion.documentosList.splice(event.index, 1);
    }
  }
}
