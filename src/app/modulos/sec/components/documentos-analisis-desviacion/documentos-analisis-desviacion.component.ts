import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modulo } from '../../../core/enums/enumeraciones';
import { AnalisisDesviacion } from '../../entities/analisis-desviacion';
import { Documento } from '../../../ado/entities/documento';
import { Directorio } from '../../../ado/entities/directorio';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'
import { Util } from '../../../comun/util';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 's-documentosAnalisisDesviacion',
  templateUrl: './documentos-analisis-desviacion.component.html',
  styleUrls: ['./documentos-analisis-desviacion.component.scss'],
  providers: [DirectorioService]
})
export class DocumentosAnalisisDesviacionComponent implements OnInit {

  @Input('analisisId') analisisId: string;
  documentos: Documento[];
  @Input('documentos') 
  set documentosIn(documentos: Documento[]){
    this.documentos = documentos.filter((element:Documento)=> element.proceso == null)
  }
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Input('readOnly') readOnly: boolean;
  documentosList: any[];
  visibleDlg: boolean;
  modulo = Modulo.SEC.value;
  msgs: Message[];


  constructor(
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    console.log("--------------------------");
    
    // if (this.documentos != null) {
    //   this.documentosList = [];
    //   this.documentos.forEach(doc => this.adicionarAGaleria(doc));
    // }
  }

  eliminarDocument(doc: Documento) {
    console.log(doc)
    console.log(this.documentos)
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.documentos = this.documentos.filter(val => val.id !== doc.id);
              console.log(this.documentos)
              // this.eliminarPorName(doc.id);
              // this.onUpload()
              // this.actualizarDesc(doc)
              // this.onUpdate.emit(doc);
            }
          );
      }
  });
  }

  adicionarAGaleria(doc: Documento) {
    // if (this.esImagen(doc)) {
    //   this.directorioService.download(doc.id).then(
    //     data => {
    //       let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(<any>data));
    //       this.documentosList.push({ source: urlData, documento: doc });
    //       this.documentosList = this.documentosList.slice();
    //     }
    //   );
    // }
  }

  esImagen(doc: Documento) {
    let split = doc.nombre.split('.');
    let strExt = split[split.length - 1]
    let extension = Util.tipo_archivo[strExt];
    doc['extension'] = extension;
    return (extension != null && (extension.extension == 'png' || extension.extension == 'jpg'));
  }

  showDialog() {
    this.visibleDlg = true;
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento);
    this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
  }

  actualizarDesc(doc: Documento) {
    this.directorioService.actualizarDocumento(doc).then(
      data => {
        this.onUpdate.emit(doc);
      }
    );
  }

  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.msgs = [];
    this.msgs.push(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }
}
