import { Modulo } from './../../../core/enums/enumeraciones';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { ConfirmationService, Message } from 'primeng/primeng';
import { locale_es, tipo_identificacion, tipo_vinculacion} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cargue-documentos',
  templateUrl: './cargue-documentos.component.html',
  styleUrls: ['./cargue-documentos.component.scss']
})
export class CargueDocumentosComponent implements OnInit {

  @Input('analisisId') analisisId: number;
  documentos: Documento[];
  @Input() puntajeARL:number =0;
  @Input() flagConsult: boolean=false;
  // directorios: Directorio[];
  // @Input('documentos') 
  // set addDocumentos(data: Directorio){
  //   debugger
  //   console.log(data);
    
  // }
  @Input('documentos') directorios: Directorio[]=[];

  @Output() idDoc = new EventEmitter<string>();
  @Output() fechaVencimientoArlEvent = new EventEmitter<Date>();
  @Output() fechaVencimientoSstEvent = new EventEmitter<Date>();
  @Output() fechaVencimientoCertExternaEvent = new EventEmitter<Date>();
  @Output() dataPuntajeArl = new EventEmitter<number>();
  msgs: Message[];
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Output('onDelete') onDelete = new EventEmitter<any>();

  visibleDlgCertificadoARL: boolean = false;
  visibleDlgLicenciaSST: boolean = false;
  visibleDlgCertiExterna: boolean = false;
  
  modulo: String = Modulo.EMP.value;
  documentosList: any[];
  
  fechaActual = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  localeES: any = locale_es;
  
  @Input('fechaVencimientoArl')
  set fechaVencimientoArlIn(fechaVencimientoArl: number){
    if(fechaVencimientoArl){
      this.fecha_vencimiento_arl = new Date(fechaVencimientoArl);
    }
  }
 
  @Input('fechaVencimientoSst')
  set fechaVencimientoSstIn(fechaVencimientoSst: number){
    if (fechaVencimientoSst) {
      this.fecha_vencimiento_sst = new Date(fechaVencimientoSst);
    }
  }

  @Input('fechaVencimientoCertExterna')
  set fechaVencimientoCertExternaIn(fechaVencimientoCertExterna: number){
    if (fechaVencimientoCertExterna) {
      this.fecha_vencimiento_cert_ext = new Date(fechaVencimientoCertExterna);
    }
  }
  
  fecha_vencimiento_arl: Date;
  fecha_vencimiento_sst: Date;
  fecha_vencimiento_cert_ext: Date;
  onEdit: string = '';

  constructor(
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.onEdit = this.activatedRoute.snapshot.params.onEdit;
  }

  showDialog(tipo: string) {    
    switch (tipo) {
      case 'arl':
        this.visibleDlgCertificadoARL = true
        break;
      case 'licencia':
        this.visibleDlgLicenciaSST = true
        break;
      case 'certificacionExterna':
        this.visibleDlgCertiExterna = true;
      default:
        break;
    }
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    if(this.directorios == null){
      this.directorios = []
    }
    this.directorios.push(event)
    // event.documento.fechaElaboracion = event.fechaCreacion;
    this.documentos.push(event.documento);
    // this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
    //console.log(this.documentos)
    //console.log(this.directorios);
    this.idDoc.emit(event.id)
    
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

  // descargarDocumentoId(doc: number) {
  //   let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
  //   this.msgs = [];
  //   this.msgs.push(msg);
  //   this.directorioService.download(doc.toString()).then(
  //     resp => {
  //       if (resp != null) {
  //         var blob = new Blob([<any>resp]);
  //         let url = URL.createObjectURL(blob);
  //         let dwldLink = document.getElementById("dwldLink");
  //         dwldLink.setAttribute("href", url);
  //         // dwldLink.setAttribute("download", doc.nombre);
  //         dwldLink.click();
  //         this.msgs = [];
  //         this.msgs.push({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
  //       }
  //     }
  //   );
  // }

  onSelectArl(value: Date){
    let fecha_vencimiento_arl = value;
    // console.log(fecha_vencimiento_arl);
    this.fechaVencimientoArlEvent.emit(fecha_vencimiento_arl);
  }

  onSelectSst(value: Date){
    let fecha_vencimiento_sst = value;
    // console.log(fecha_vencimiento_sst);
    this.fechaVencimientoSstEvent.emit(fecha_vencimiento_sst);
  }

  onSelectCertExt(value: Date){
    let fecha_vencimiento_cert_ext = value;
    // console.log(fecha_vencimiento_cert_ext);
    this.fechaVencimientoCertExternaEvent.emit(fecha_vencimiento_cert_ext);
  }

  onPuntajeARL(){
    this.dataPuntajeArl.emit(this.puntajeARL);
  }

  eliminarDocument(doc: Documento) {
    // console.log(doc)
    // console.log(this.directorios)
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directorios = this.directorios.filter(val => val.id !== doc.id);
              // console.log(this.directorios);
              let docIds: string[] = []
              this.directorios.forEach(el => {
                docIds.push(el.id);
              });
              this.onDelete.emit(JSON.stringify(docIds));
              // this.eliminarPorName(doc.id);
              // this.onUpload()
              // this.actualizarDesc(doc)
              // this.onUpdate.emit(doc);
            }
          );
      }
  });
  }
 
  test(){
    // debugger
    console.log(this.directorios);
    let dwldLink = document.getElementById("dwldLink");    
    this.idDoc.emit('777')
  }
}
