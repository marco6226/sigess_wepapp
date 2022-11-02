import { ActividadesContratadas, _actividadesContratadasList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';

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

  actividadesContratadasList:any[]

  selectActividad: any[]

  actividadesList: any[]

  constructor(
    private empresaService: EmpresaService,

  ) { }

  ngOnInit(): void {
    this.loadActividadesContratadas()
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

  async loadActividadesContratadas(){
    this.actividadesContratadasList=[]
    let x = await this.empresaService.getActividadesContratadas().then((element: ActividadesContratadas[]) =>{

      element.forEach(elemen => {
      
        this.actividadesContratadasList.push({label:elemen.actividad, value: elemen.actividad})
      
    });
   });
    console.log(this.actividadesContratadasList);
    
  }

}
