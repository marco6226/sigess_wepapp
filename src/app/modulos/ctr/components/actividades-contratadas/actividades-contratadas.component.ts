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
      // console.log(actividades);
      this.selectActividad = JSON.parse(actividades)[0];
      this.selectActividadSub = JSON.parse(actividades)[1];
      this.agregarActividad();
      this.agregarActividadSub();
    }    
  }

  @Output() data = new EventEmitter<String>();

  visibleDlg: boolean =false;
  visibleDlgSub: boolean =false;

  actividadesContratadasList:any[];

  selectActividad: any[];
  selectActividadSub: any[];

  actividadesList: any[];
  actividadesSubList: any[];

  constructor(
    private empresaService: EmpresaService,

  ) { }

  ngOnInit(): void {
    this.loadActividadesContratadas()
  }

  agregarActividad(){
    if(this.selectActividad != null){
      this.actividadesList = this.selectActividad.map(item => {
        return {nombre: item}
      });
      this.cerrarDialogo();
      this.saveActividad();
    }
  }

  agregarActividadSub(){
    if(this.selectActividadSub != null){
      this.actividadesSubList = this.selectActividadSub.map(item => {
        return {nombre: item}
      });
      this.cerrarDialogoSub();
      this.saveActividad();
    }
  }

  saveActividad(){
    // console.log(JSON.stringify([this.selectActividad, this.selectActividadSub]));
    this.data.emit(JSON.stringify([this.selectActividad, this.selectActividadSub]));
  }

  abrirDialogo(param: string =null){
    if (param) {
      this.selectActividad = []
    }
    this.visibleDlg = true;
  }

  abrirDialogoSub(param: string =null){
    if (param) {
      this.selectActividadSub = []
    }
    this.visibleDlgSub = true;
  }

  cerrarDialogo(){
    this.visibleDlg = false;
  }

  cerrarDialogoSub(){
    this.visibleDlgSub = false;
  }

  async loadActividadesContratadas(){
    this.actividadesContratadasList=[]
    await this.empresaService.getActividadesContratadas().then((element: ActividadesContratadas[]) =>{
      element.sort(function(a,b){
        if(a.actividad > b.actividad){
          return 1
        }else if(a.actividad < b.actividad){
          return -1;
        }
        return 0;
      });
      element.forEach(elemen => {
        this.actividadesContratadasList.push({label:elemen.actividad, value: elemen.actividad})
    });
   });
    // console.log(this.actividadesContratadasList);
  }

}
