import { _actividadesContratadasList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actividades-contratadas',
  templateUrl: './actividades-contratadas.component.html',
  styleUrls: ['./actividades-contratadas.component.scss']
})
export class ActividadesContratadasComponent implements OnInit {

  @Input('selectActividad') 
  set actividadesIn(actividades: string){
    if (actividades != null) {
      console.log(actividades);
      this.selectActividad = JSON.parse(actividades)
      this.agregarActividad()
    }    
  }

  @Output() data = new EventEmitter<String>();

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
    this.data.emit(JSON.stringify(this.actividadesList));
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
