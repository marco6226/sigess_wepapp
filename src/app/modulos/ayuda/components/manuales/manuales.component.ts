import { Component, OnInit } from '@angular/core';
import { ManualService } from '../../services/manual.service';
import { Manual } from '../entities/manual';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manuales',
  templateUrl: './manuales.component.html',
  styleUrls: ['./manuales.component.scss'],
  providers: [ManualService]
})
export class ManualesComponent implements OnInit {


  manuales: Manual[];
  loading: boolean;
  loadingVideo: boolean;
  visibleDlg: boolean;
  rutaVideo: any;
  file: any;
  videoTitle:string;

  archivos: any = {};

  constructor(
    protected sanitizer: DomSanitizer,
    public manualService: ManualService,
  ) { }

  ngOnInit() {
    this.cargarManuales();
  }


  cargarManuales() {
    this.loading = true;
    this.manualService.buscarPorUsuario()
      .then((resp: any) => {
        this.manuales = resp.data;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  abrirVideo(man: Manual) {
    this.videoTitle = man.nombre;
    this.visibleDlg = true;
    this.loadingVideo = true;
    this.rutaVideo = null;
    if (this.archivos[man.id] != null) {
      this.rutaVideo = this.archivos[man.id];
      this.loadingVideo = false;
    } else {
      this.manualService.descargar(man)
        .then((resp: any) => {
          // let blob = new Blob([<any>resp], { type: resp.type });
          this.file = new File([<any>resp], man.codigo + '.' + man.tipo, { type: 'video/mp4' });
          let url = URL.createObjectURL(this.file);
          this.rutaVideo = this.sanitizer.bypassSecurityTrustUrl(url);
          this.archivos[man.id] = this.rutaVideo;
          this.loadingVideo = false;
        })
        .catch(err => {
          this.loadingVideo = false;
        });
    }

  }

}
