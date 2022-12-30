import { ActividadesContratadas, _actividadesContratadasList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter,ViewEncapsulation} from '@angular/core';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, Message, TreeNode } from 'primeng/primeng';
import { element } from 'protractor';
import {parse, stringify} from 'flatted';

@Component({
  selector: 'app-actividades-contratadas',
  templateUrl: './actividades-contratadas.component.html',
   encapsulation: ViewEncapsulation.None,
  styleUrls: ['./actividades-contratadas.component.scss']
})
export class ActividadesContratadasComponent implements OnInit {
  @Input() flagConsult: boolean=false;
  @Input() flagPress: boolean=false;
  @Input('selectActividad') 
  set actividadesIn(actividades: string){
    if (actividades != null) {
      this.selectActividad = parse(actividades,this.dataReviver)[0];
      this.selectActividadSub = parse(actividades,this.dataReviver)[1];
      this.agregarActividad();
      this.agregarActividadSub();
    }    
  }
  dataReviver(key, value)
  { 
    return value == null ? undefined : value;
  }
  
  edit: string = null;

  @Output() data = new EventEmitter<String>();

  visibleDlg: boolean =false;
  visibleDlgSub: boolean =false;

  actividadesContratadasList:TreeNode[];
  actividadesContratadasListSub1:TreeNode[];
  actividadesContratadasListSub2:TreeNode[];

  selectActividad
  selectActividadSub

  actividadesList: any[];
  actividadesSubList: any[];

  constructor(
    private empresaService: EmpresaService,
    private rutaActiva: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.edit = this.rutaActiva.snapshot.params.onEdit;
    this.loadActividadesContratadas()
  }

  agregarActividad(){
    console.log(this.actividadesList)
    if(this.selectActividad != null){
      this.actividadesList = this.selectActividad.map(item => {
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
    this.data.emit(stringify([this.selectActividad, this.selectActividadSub], this.replacer));
  }
  replacer(key, value){
    return value == undefined ? null : value;
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
      let id1
      let id2
      element.forEach(elemen => {
        if(elemen.id==0)
        id1=elemen.id

        if(elemen.id==15)
        id2=elemen.id

        if(elemen.padre_id==1)
        this.actividadesContratadasListSub1.push({key:elemen.id.toString() ,label: elemen.actividad,  data: elemen.actividad})

        if(elemen.padre_id==15)
        this.actividadesContratadasListSub2.push({key:elemen.id.toString(),label: elemen.actividad,  data: elemen.actividad})
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

      this.actividadesContratadasList.push({key:id1,label: "SERVICIOS ADMINISTRATIVOS",  data: "SERVICIOS ADMINISTRATIVOS",selectable:false, children:this.actividadesContratadasListSub1})
      this.actividadesContratadasList.push({key:id2,label: "SERVICIOS DE MANTENIMIENTO",  data: "SERVICIOS DE MANTENIMIENTO",selectable:false, children:this.actividadesContratadasListSub2})
   });
  }

}
