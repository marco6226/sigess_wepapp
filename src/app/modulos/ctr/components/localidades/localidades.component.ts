import { _actividadesContratadasList, _divisionList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {

  visibleDlg: boolean =false;

  // actividadesContratadasList = _actividadesContratadasList
  
  @Input('selectDivision') 
  set actividadesIn(actividades: string){
    if(actividades != null){
      console.log(actividades);
      this.selectActividad = JSON.parse(actividades)
      this.agregarActividad()
    }
  }

  @Input('selectLocalidad') 
  set localidadesIn(actividades: string){
    if(actividades != null){
      console.log(actividades);
      this.locadidadList = JSON.parse(actividades)
    }
  }

  @Output() data =new EventEmitter();
  @Output() dataLocalidad = new EventEmitter<string>();
  
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

  onAddLocalidad(){
    console.log(this.locadidadList);
    this.dataLocalidad.emit(JSON.stringify(this.locadidadList))
    
  }

}
