import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modulo } from '../../../../core/enums/enumeraciones';
import { AnalisisDesviacion } from '../../../entities/analisis-desviacion';
import { Documento } from '../../../../ado/entities/documento';
import { Directorio } from '../../../../ado/entities/directorio';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'
import { Util } from '../../../../comun/util';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.scss']
})
export class EvidenciasComponent implements OnInit {
  @Input('analisisId') analisisId: string;
  @Input('tipoEvidencias') tipoEvidencias: string;

  @Input('documentos') documentos: Documento[];
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Input('readOnly') readOnly: boolean;
  documentosList: any[];
  documentosListFoto: any[]=[];
  documentosListDocumental: any[]=[];
  documentosListPoliticas: any[]=[];
  documentosListProcedimientos: any[]=[];
  documentosListMultimedia: any[]=[];
  // visibleDlg1: boolean;
  // visibleDlg2: boolean;
  // visibleDlg3: boolean;
  // visibleDlg4: boolean;
  // visibleDlg5: boolean;

  visibleDlgFoto: boolean;
  visibleDlgDocumento: boolean;
  visibleDlgPoliticas: boolean;
  visibleDlgProcedimientos: boolean;
  visibleDlgMultimedia: boolean;
  
  modulo = Modulo.SEC.value;
  msgs: Message[];


  constructor(
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
  ) { }

  ngOnInit() {
    // if (this.documentos != null) {
    //   this.documentosList = [];
    //    this.documentos.forEach(doc => this.adicionarAGaleria(doc));
    // }
  }
  // adicionarAGaleria(doc: Documento) {
  //   if (this.esImagen(doc)) {
  //     this.directorioService.download(doc.id).then(
  //       data => {
  //         let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(<any>data));
  //         if(doc.proceso == "politica")
  //         this.documentosList.push({ source: urlData, documento: doc });
  //         this.documentosList = this.documentosList.slice();
  //         console.log(this.documentosList)
  //       }
  //     );
  //   }
  // }

  esImagen(doc: Documento) {
    let split = doc.nombre.split('.');
    let strExt = split[split.length - 1]
    let extension = Util.tipo_archivo[strExt];
    doc['extension'] = extension;
    return (extension != null && (extension.extension == 'png' || extension.extension == 'jpg'));
  }

  showDialog(tipo: string) {
    console.log("hola");
    
    switch (tipo) {
      case 'foto':
        this.visibleDlgFoto = true
        break;
      case 'documento':
        this.visibleDlgDocumento = true
        break;
      case 'politicas':
        this.visibleDlgPoliticas = true
        break;
      case 'procedimientos':
        this.visibleDlgProcedimientos = true
        break;
      case 'multimedia':
        this.visibleDlgMultimedia = true
        break;
    
      default:
        break;
    }
  }

  // showDialog1() {
  //   this.visibleDlg1 = true;
  // }
  // showDialog2() {
  //   this.visibleDlg2 = true;
  // }
  // showDialog3() {
  //   this.visibleDlg3 = true;
  // }
  // showDialog4() {
  //   this.visibleDlg4 = true;
  // }
  // showDialog5() {
  //   this.visibleDlg5 = true;
  // }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento);
    // this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
    console.log(this.documentos)
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

  test(){
    console.log(this.documentos);
    this.separador()
    console.log(this.documentosListFoto,this.documentosListDocumental,this.documentosListMultimedia,this.documentosListPoliticas,this.documentosListProcedimientos);
    
  }

  separador(){
    // setTimeout(() => {
      this.documentosListFoto=this.documentosListDocumental=this.documentosListMultimedia=this.documentosListPoliticas=this.documentosListProcedimientos =[]
      this.documentos.forEach(key => {
        // console.log(key);
        
        switch (key.proceso) {
          case 'fotografica':
            this.documentosListFoto.push(key)
            break;
          case 'documental':
            this.documentosListDocumental.push(key)
            break;
          case 'politica':
            this.documentosListPoliticas.push(key)
            break;
          case 'procedimientos':
            this.documentosListProcedimientos.push(key)
            break;
          case 'multimedia':
            this.documentosListMultimedia.push(key)
            break;
        
          default:
            break;
        }
      });
    // }, 5000);
    
  }
}

