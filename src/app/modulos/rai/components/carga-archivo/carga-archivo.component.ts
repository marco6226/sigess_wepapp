import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { Message } from 'primeng/api';

@Component({
  selector: 's-cargaArchivo',
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss']
})
export class CargaArchivoComponent implements OnInit {


  file: File;
  tipoReporte: string;
  cargando: boolean;
  msgs: Message[];

  constructor(
    public repService: ReporteService,
  ) { }

  ngOnInit() {
  }

  onFileSelect(files: FileList) {
    this.cargando = true;
    this.file = files[0];
    this.repService.cargarArchivo(this.file, this.tipoReporte)
      .then(resp => {
        this.cargando = false;
        this.msgs = [{
          severity: 'success',
          summary: 'Carga de reportes realizada',
          detail: 'El archivo de reportes ha sido cargado correctamente'
        }];
        this.file = null;
      })
      .catch(err => {
        this.cargando = false;
        this.file = null;
      });
  }
}
