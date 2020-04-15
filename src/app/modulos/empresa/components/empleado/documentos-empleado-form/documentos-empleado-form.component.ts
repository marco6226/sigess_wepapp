import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { Documento } from 'app/modulos/ado/entities/documento'
import { Modulo } from 'app/modulos/core/enums/enumeraciones'
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'
import { Directorio } from 'app/modulos/ado/entities/directorio'
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng'

@Component({
  selector: 's-documentosEmpleadoForm',
  templateUrl: './documentos-empleado-form.component.html',
  styleUrls: ['./documentos-empleado-form.component.scss']
})
export class DocumentosEmpleadoFormComponent implements OnInit {


  @Input("value") empleado: Empleado;
  tipoDocumentosList: SelectItem[] = [
    { label: '--Seleccione--', value: null },
    { label: 'Personal', value: 'Personal' },
    { label: 'Formación', value: 'Formacion' },
    { label: 'Educación', value: 'Educacion' },
    { label: 'Laboral', value: 'Laboral' },
    { label: 'Legal', value: 'Legal' },
  ];
  visibleDlg: boolean;
  documentosList: Documento[];
  modulo: string;
  msgs: Message[];
  msgsSticky: Message[];

  constructor(
    private confirmationService: ConfirmationService,
    private directorioService: DirectorioService,
  ) {
    this.modulo = Modulo.EMP.value;
    this.documentosList = [];
  }

  ngOnInit() {
    this.documentosList = this.empleado == null ? null : this.empleado.documentosList;
  }

  showDialog() {
    this.visibleDlg = true;
  }

  onUpload(event: Directorio) {
    if (this.documentosList == null)
      this.documentosList = [];
    this.documentosList.push(event.documento);
    this.documentosList = this.documentosList.slice();
  }

  confirmarEliminar(doc: Documento) {
    this.confirmationService.confirm({
      header: 'Eliminar documento de empleado',
      message: 'Esta acción no se podrá deshacer ¿Desea continuar de todos modos?',
      accept: () => {
        this.eliminarDocumento(doc);
      }
    });
  }

  eliminarDocumento(doc: Documento) {
    this.directorioService.eliminarDocumento(doc.id).then(
      data => {
        for (let i = 0; i < this.documentosList.length; i++) {
          if (this.documentosList[i].id == doc.id) {
            this.documentosList.splice(i, 1);
            break;
          }
        }
        this.documentosList = this.documentosList.slice();
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Documento eliminado', detail: 'Se ha eliminado correctamente el documento' });
      }
    );
  }

  modificar(doc: Documento) {
    this.directorioService.actualizarDocumento(doc).then(
      data => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Documento actualizado', detail: 'Se ha actualizado correctamente el documento' });
      }
    );
  }

  download(documento: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + documento.nombre + "\" en proceso de descarga" };
    this.msgsSticky = [];
    this.msgs = [];
    this.msgsSticky.push(msg);
    this.msgs.push(msg);
    this.directorioService.download(documento.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", documento.nombre);
          dwldLink.click();
          this.msgsSticky = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + documento.nombre });
        }
      }
    );
  }

}




