import { Modulo } from './../../../core/enums/enumeraciones';
import { Component, Input, OnInit } from '@angular/core';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { ConfirmationService, Message } from 'primeng/primeng';

@Component({
  selector: 'app-cargue-documentos',
  templateUrl: './cargue-documentos.component.html',
  styleUrls: ['./cargue-documentos.component.scss']
})
export class CargueDocumentosComponent implements OnInit {

  @Input('analisisId') analisisId: string;
  @Input('documentos') documentos: Documento[];

  msgs: Message[];

  visibleDlgCertificadoARL: boolean = false;
  visibleDlgLicenciaSST: boolean = false;
  
  modulo = Modulo.SEC.value;
  documentosList: any[];

  constructor(
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }

  showDialog(tipo: string) {    
    switch (tipo) {
      case 'arl':
        this.visibleDlgCertificadoARL = true
        break;
      case 'licencia':
        this.visibleDlgLicenciaSST = true
        break;    
      default:
        break;
    }
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento);
    // this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
    console.log(this.documentos)
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
