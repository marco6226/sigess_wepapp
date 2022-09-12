import { _actividadesContratadasList, _divisionList } from './../../entities/aliados';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {

  visibleDlg: boolean =false;

  // actividadesContratadasList = _actividadesContratadasList
  divisionList= _divisionList


  selectActividad: string[]=[]

  actividadesList: string[]=[]

  locadidadList: string[]=[]

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
