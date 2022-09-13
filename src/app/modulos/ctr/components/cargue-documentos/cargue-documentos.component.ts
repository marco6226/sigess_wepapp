import { Modulo } from './../../../core/enums/enumeraciones';
import { Component, Input, OnInit } from '@angular/core';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';

@Component({
  selector: 'app-cargue-documentos',
  templateUrl: './cargue-documentos.component.html',
  styleUrls: ['./cargue-documentos.component.scss']
})
export class CargueDocumentosComponent implements OnInit {

  @Input('analisisId') analisisId: string;
  @Input('documentos') documentos: Documento[];


  visibleDlgCertificadoARL: boolean = false;
  visibleDlgLicenciaSST: boolean = false;
  modulo = Modulo.SEC.value;
  documentosList: any[];

  constructor() { }

  ngOnInit(): void {
  }

  showDialog(tipo: string) {    
    switch (tipo) {
      case 'politicas':
        this.visibleDlgCertificadoARL = true
        break;
      case 'documento':
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

}
