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
b
  @Input('selectActividad') 
  set actividadesIn(actividades: string){
    if (actividades != null) {
      // console.log(actividades);
      // this.selectActividad = [];
      // this.selectActividadSub = [];
      this.selectActividad = parse(actividades,this.dataReviver)[0];
this.b=this.selectActividad
console.log('A:',this.a,'B:',this.b)

console.log(this.a===this.b)
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
  ngOnInit(): void {
    this.edit = this.rutaActiva.snapshot.params.onEdit;
    this.loadActividadesContratadas()
  }

  agregarActividad(){
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
  a
  saveActividad(){

this.a= this.selectActividad;
    console.log('con:', typeof this.selectActividad,'sub:',this.selectActividadSub)
    this.data.emit(stringify([this.selectActividad, this.selectActividadSub], this.replacer));
  }
  replacer(key, value){
    return value == undefined ? null : value;
  }
  

  abrirDialogo(param: string =null){
    if (param) {
      this.selectActividad = []
    }else{
      // this.selectActividad = []
      console.log(typeof this.selectActividad)
    }
    this.visibleDlg = true;
  }

  abrirDialogoSub(param: string =null){
    if (param) {
      this.selectActividadSub = []
    }else{
      // this.selectActividadSub = []
      console.log(this.selectActividadSub)
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

      this.actividadesContratadasList.push({"label": "SERVICIOS ADMINISTRATIVOS",  "data": "SERVICIOS ADMINISTRATIVOS","selectable":false, "children":this.actividadesContratadasListSub1})

      this.actividadesContratadasList.push({"label": "SERVICIOS DE MANTENIMIENTO",  "data": "SERVICIOS DE MANTENIMIENTO","selectable":false, "children":this.actividadesContratadasListSub2})
   });
  }

}
