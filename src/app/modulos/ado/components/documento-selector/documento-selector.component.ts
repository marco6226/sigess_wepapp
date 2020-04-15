import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Documento } from 'app/modulos/ado/entities/documento'
import { Directorio } from 'app/modulos/ado/entities/directorio'
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'

import { Message } from 'primeng/primeng'

@Component({
  selector: 's-documento-selector',
  templateUrl: './documento-selector.component.html',
  styleUrls: ['./documento-selector.component.scss']
})
export class DocumentoSelectorComponent implements OnInit {

  @Input("visible") visible: boolean = true;
  @Output("visibleChange") visibleChange = new EventEmitter();
  @Input("seleccion") seleccion: Documento[];
  @Input("titulo") titulo: string;
  @Input("modificar") modificar: boolean;
  @Output("onSave") onSave = new EventEmitter();
  directorioList: Directorio[];
  seleccionAutocomplete:string;


  msgs: Message[];

  constructor(
    private directorioService: DirectorioService,
  ) { }

  ngOnInit() {

  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  download(documento: Documento) {
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Descargando...', detail: documento.nombre });
    this.directorioService.download(documento.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", documento.nombre);
          dwldLink.click();
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Archivo descargado', detail: '.' });
        }
      }
    );
  }

  eliminarDocumento(dir: Directorio) {
    for (let i = 0; i < this.seleccion.length; i++) {
      if (this.seleccion[i].id == dir.id) {
        this.seleccion.splice(i, 1);
        break;
      }
    }
  }

  buscarDocumentos(event) {
    this.directorioService.buscarDocumentos(event.query).then(
      data => this.directorioList = <Directorio[]>data
    );
  }

  onSelect(dir: Directorio) {
    this.seleccionAutocomplete = null;
    for (let i = 0; i < this.seleccion.length; i++) {
      if (this.seleccion[i].id == dir.id) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', detail: ('El archivo ' + dir.nombre + ' ya se encuentra seleccionado') });
        return;
      }
    }
    this.seleccion.push(dir.documento);
  }

  actualizar() {
    this.onSave.emit(this.seleccion);
  }

}
