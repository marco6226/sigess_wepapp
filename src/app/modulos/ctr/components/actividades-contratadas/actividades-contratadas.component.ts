import { _actividadesContratadasList } from './../../entities/aliados';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actividades-contratadas',
  templateUrl: './actividades-contratadas.component.html',
  styleUrls: ['./actividades-contratadas.component.scss']
})
export class ActividadesContratadasComponent implements OnInit {

  visibleDlg: boolean =false;

  actividadesContratadasList = _actividadesContratadasList

  selectActividad: string[]=[]

  actividadesList: string[]=[]

  constructor() { }

  ngOnInit(): void {
  }

  agregarActividad(){
    this.actividadesList = this.selectActividad;
    this.cerrarDialogo();
  }

  abrirDialogo(param: string =null){
    if (param) {
      this.selectActividad = []
    }
    this.visibleDlg = true;
  }

  cerrarDialogo(){
    this.visibleDlg = false;
  }

}
