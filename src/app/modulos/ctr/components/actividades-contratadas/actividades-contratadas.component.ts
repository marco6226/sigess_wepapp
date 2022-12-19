import { ActividadesContratadas, _actividadesContratadasList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter,ViewEncapsulation} from '@angular/core';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, Message, TreeNode } from 'primeng/primeng';

@Component({
  selector: 'app-actividades-contratadas',
  templateUrl: './actividades-contratadas.component.html',
   encapsulation: ViewEncapsulation.None,
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

  edit: string = null;

  @Output() data = new EventEmitter<String>();

  visibleDlg: boolean =false;
  visibleDlgSub: boolean =false;

  actividadesContratadasList:any[];
  actividadesContratadasListSub1:any[];
  actividadesContratadasListSub2:any[];

  selectActividad: any[];
  selectActividadSub: any[];

  actividadesList: any[];
  actividadesSubList: any[];

  constructor(
    private empresaService: EmpresaService,
    private rutaActiva: ActivatedRoute,
  ) { }
  nodes1: TreeNode[] = [];
  ngOnInit(): void {
    this.edit = this.rutaActiva.snapshot.params.onEdit;
    this.loadActividadesContratadas()
    console.log(this.nodes1)
  }

  agregarActividad(){
    if(this.selectActividad != null){
      this.actividadesList = this.selectActividad.map(item => {
        console.log(item)
        return {nombre: item.data}
      });
      this.cerrarDialogo();
      this.saveActividad();
    }
  }

  agregarActividadSub(){
    if(this.selectActividadSub != null){
      this.actividadesSubList = this.selectActividadSub.map(item => {
        return {nombre: item.data}
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
    this.actividadesContratadasListSub1=[]
    this.actividadesContratadasListSub2=[]
    await this.empresaService.getActividadesContratadas(this.rutaActiva.snapshot.params.id).then((element: ActividadesContratadas[]) =>{

      console.log(element)
      
      element.forEach(elemen => {
        
        if(elemen.padre_id==1)
        this.actividadesContratadasListSub1.push({"label": elemen.actividad,  "data": elemen.actividad})

        if(elemen.padre_id==15)
        this.actividadesContratadasListSub2.push({"label": elemen.actividad,  "data": elemen.actividad})
        // this.actividadesContratadasList.push({label:elemen.actividad, value: elemen.actividad})
    });

      this.actividadesContratadasListSub1.sort(function(a,b){
        if(a.label > b.label){
          return 1
        }else if(a.label < b.label){
          return -1;
        }
        return 0;
      });

      this.actividadesContratadasListSub2.sort(function(a,b){
        if(a.label > b.label){
          return 1
        }else if(a.label < b.label){
          return -1;
        }
        return 0;
      });

      this.actividadesContratadasList.push({"label": "SERVICIOS ADMINISTRATIVOS",  "data": "SERVICIOS ADMINISTRATIVOS", "children":this.actividadesContratadasListSub1})

      this.actividadesContratadasList.push({"label": "SERVICIOS DE MANTENIMIENTO",  "data": "SERVICIOS DE MANTENIMIENTO", "children":this.actividadesContratadasListSub2})
   });
    // console.log(this.actividadesContratadasList);
  }

}
