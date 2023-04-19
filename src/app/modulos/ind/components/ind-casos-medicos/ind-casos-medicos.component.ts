import { Component, OnInit,ViewChild} from "@angular/core";
import { ReporteAtService } from "./../../services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
import {ViewscmcoService} from "../../services/indicador-scmco.service"
import { SelectItem, Message, TreeNode } from 'primeng/primeng';
import {TreeModule} from 'primeng/tree';
// import { multi} from './data';

class division {
  name: string;
  acumulado: number;
  meta: number;
  eventos: number;
  diasPerdidos: number;
  frecuencia: number;
  severidad: number;
}
@Component({
  selector: 'app-ind-casos-medicos',
  templateUrl: './ind-casos-medicos.component.html',
  styleUrls: ['./ind-casos-medicos.component.scss'],
  providers: [],
})
export class IndCasosMedicosComponent implements OnInit {
  localeES = locale_es;
  numCasos:number=0;
  casosAbiertos:number=0;
  casosCerrados:number=0;
  datos:any[];
  datosNumeroCasos:any[];
  divisiones=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorSchemeText=['colorSchemeText1','colorSchemeText2','colorSchemeText3','colorSchemeText4','colorSchemeText5','colorSchemeText6','colorSchemeText7']
  // colorSchemeText = ['background-color:#00B0F0;', 'background-color:#FC4512;', 'background-color:#FFC000;', 'background-color:#002060;','background-color:#FCB8FC;', 'background-color:#5B9BD5;','background-color:#70AD47;']
  // colorSchemeText1 = ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  divisiones0=[]
  divisiones1=[]
  divisiones2=[]
  divisiones3=[]

  fechaDesde0:Date;
  fechaHasta0:Date;

  fechaDesde1:Date;
  fechaHasta1:Date;

  fechaDesde2:Date;
  fechaHasta2:Date;
  
  fechaDesde3:Date;
  fechaHasta3:Date;

  fechaDesde4:Date;
  fechaHasta4:Date;

  fechaDesde5:Date;
  fechaHasta5:Date;

  fechaDesde6:Date;
  fechaHasta6:Date;

  fechaDesde7:Date;
  fechaHasta7:Date;


  datosGraf0:any;
  datosGraf0Print:any;

  datosGraf1:any;
  datosGraf1Print:any;

  datosGraf2:any;
  datosGraf2Print:any;
  

  datosGraf3:any;
  datosGraf3Print:any;

  datosGraf4:any;
  datosGraf4Print:any;

  datosGraf5:any;
  datosGraf5Print:any;

  datosGraf6:any;
  datosGraf6Print:any;

  selectDivisiones1:any=[]
  selectEvento1:any=[]

  selectDivisiones2:any=[]
  selectUbicacion2:any=[]
  selectEvento2:any=[]

  selectDivisiones3:any=[]
  selectEvento3:any=[]

  selectDivisiones4:any=[]
  selectUbicacion4:any=[]
  selectEvento4:any=[]

  selectDivisiones5:any=[]
  selectEvento5:any=[]

  selectDivisiones6:any=[]
  selectUbicacion6:any=[]
  selectEvento6:any=[]

  flag1:boolean=false
  flag2:boolean=true
  flag3:boolean=false
  flag4:boolean=true
  flag5:boolean=false
  flag6:boolean=true
  dataFlag5:boolean=false
  dataFlag6:boolean=false
  flagReturnDatos2:boolean=false
  flagReturnDatos4:boolean=false
  flagReturnDatos6:boolean=false

  visibleDlg: boolean =false;

  visibleDlg2: boolean =false;

  visibleDlg3: boolean =false;

  selecDiv0=[]

  radioButon0:number=0;
  opcion0?:any;

  radioButon1:number=0;
  opcion1?:any;

  radioButon2:number=0;
  opcion2?:any;

  radioButon3:number=0;
  opcion3?:any;

  radioButon4:number=0;
  opcion4?:any;

  radioButon5:number=0;
  opcion5?:any;

  radioButon6:number=0;
  opcion6?:any;

  valueArray:any[]
  valueArray2:any[]
  scmList

  valueArray_5:any[]
  valueArray5:any[]
  scmList5

  valueArray_7:any[]
  valueArray7:any[]
  scmList7

  selectUbicacion:any=[]
  selectUbicacion_5:any=[]
  selectUbicacion_7:any=[]

  areasNodes: TreeNode[] = [];
  areasNodesMemory1: TreeNode[] = [];
  areasNodesMemory5: TreeNode[] = [];
  areasNodesMemory7: TreeNode[] = [];

  mesaLaboralList = [
    { label: "Si", value: "1" },
    { label: "No", value: "0" },
    { label: "En Seguimiento", value: "2" },
    { label: "No Aplica", value: "3" },
  ]

  prioridadList = [
    { label: "Alta", value: "Alta" },
    { label: "Media", value: "Media" },
    { label: "Baja", value: "Baja" },
  ]

  tipoOptionList = [
    { label: "Medico", value: "Medico" },
    { label: "Juridico", value: "Juridico" },
    { label: "Otros", value: "Otros" },
  ]

  StatusList = [
    { label: "Abierto", value: "1" },
    { label: "Cerrado", value: "0" },
  ]

  reintegroTipos=[
    {label: 'Reintegro', value:'Reintegro'},
    {label: 'Reubicación', value:'Reubicación'},
    {label: 'Reconversión', value:'Reconversión'},
    {label: 'Sin PRL', value:'null'},
  ]

  async ngOnInit() {
    await this.cargarDatos()
    this.numeroCasos()
    this.DatosGrafica1()
    this.DatosGrafica2()
    this.DatosGrafica4()
    this.DatosGrafica6()
    this.loadAreas()
  }

  constructor(
    private viewscmcoService: ViewscmcoService,
    private areaService: AreaService,
  ){}
  
  async cargarDatos(){
    this.divisiones.forEach(resp=>{
      this.divisiones0.push({label:resp,value:resp})
      this.divisiones1.push({label:resp,value:resp})
      this.divisiones2.push(resp)
      this.divisiones3.push({label:resp,value:resp})
    })
    this.divisiones0.push({label:'Corona total',value:'Corona total'})
    this.divisiones2.push('Corona total')
    await this.viewscmcoService.findByEmpresaId().then((resp:any)=>{
      this.datos=resp
    })

    if(this.radioButon2==0){this.opcion2=this.StatusList;}
    if(this.radioButon2==1){this.opcion2=this.mesaLaboralList;}
    if(this.radioButon2==2){this.opcion2=this.prioridadList;}
    if(this.radioButon2==3){this.opcion2=this.tipoOptionList;}

    this.opcion4=this.reintegroTipos
  }

  //Grafica cards
  numeroCasos(){
    this.numCasos=0
    this.casosAbiertos=0
    this.datosNumeroCasos=this.datos
    this.datosNumeroCasos=this.filtroDivisionMono(this.selecDiv0,this.datosNumeroCasos)
    this.datosNumeroCasos=this.filtroFecha(this.fechaDesde0,this.fechaHasta0,this.datosNumeroCasos)

    this.numCasos=this.datosNumeroCasos.length
    this.datosNumeroCasos.forEach(resp=>{
      if(resp['estadoDelCaso']=='1')this.casosAbiertos=this.casosAbiertos+1
    })
    this.casosCerrados=this.numCasos-this.casosAbiertos
  }

  //Grafica uno
  DatosGrafica1(){
    this.datosGraf0=Array.from(this.datos)
    this.datosGraf0=this.filtroFecha(this.fechaDesde1,this.fechaHasta1,this.datosGraf0)
    switch (this.radioButon0) {
      case 1:
        this.datosGraf0=this.datosGraf0.filter(resp1=>{return resp1['estadoDelCaso']=='1'})
        break;
      case 2:
        this.datosGraf0=this.datosGraf0.filter(resp1=>{return resp1['estadoDelCaso']=='0'})
        break;
      default:
        break;
    }
    this.datosGraf0Print=[]
    this.divisiones.forEach(resp=>{
      this.datosGraf0Print.push({name:resp,value:(this.datosGraf0.filter(resp1=>{return resp1['divisionUnidad']==resp})).length})
    })
  }

  //Grafica dos
  DatosGrafica2(){
    this.flag1=false
    this.datosGraf1=Array.from(this.datos)
    this.datosGraf1=this.filtroFecha(this.fechaDesde2,this.fechaHasta2,this.datosGraf1)
    let nombre=''
    if(this.radioButon1==0){this.opcion1=this.StatusList;nombre='estadoDelCaso'}
    if(this.radioButon1==1){this.opcion1=this.mesaLaboralList;nombre='casoMedicoLaboral'}
    if(this.radioButon1==2){this.opcion1=this.prioridadList;nombre='prioridadCaso'}
    if(this.radioButon1==3){this.opcion1=this.tipoOptionList;nombre='tipoCaso'}

    let divisiones=this.filtroDivisionMultiple(this.selectDivisiones1,this.divisiones2)

    let opcion1=this.filtroEventoMultiple(this.selectEvento1,this.opcion1)

    this.datosGraf1Print=this.datosGraf2DDivisiones(divisiones,this.datosGraf1,opcion1,nombre,'divisionUnidad')
    this.flag1=true
  }

  returnDatos1(){
    this.selectEvento1=[]
    this.selectDivisiones1=[]
    this.DatosGrafica2()
  }

    //Grafica tres
    DatosGrafica3(){
      this.flagReturnDatos2=true
      this.flag2=false
      this.datosGraf2=Array.from(this.datos)
      if(this.selectDivisiones2.length>0)this.datosGraf2=this.datosGraf2.filter(resp=>resp.divisionUnidad==this.selectDivisiones2)

      this.datosGraf2=this.filtroFecha(this.fechaDesde3,this.fechaHasta3,this.datosGraf2)
      let nombre=''
      let nombre2=''
      if(this.radioButon2==0){this.opcion2=this.StatusList;nombre='estadoDelCaso';nombre2='Sin estado del caso'}
      if(this.radioButon2==1){this.opcion2=this.mesaLaboralList;nombre='casoMedicoLaboral';nombre2='Sin caso medico laboral'}
      if(this.radioButon2==2){this.opcion2=this.prioridadList;nombre='prioridadCaso';nombre2='Sin prioridad del caso'}
      if(this.radioButon2==3){this.opcion2=this.tipoOptionList;nombre='tipoCaso';nombre2='Sin tipo de caso'}
  
      this.datosGraf2.map(resp=>{if(resp[nombre]==null){return resp[nombre]=nombre2}})

      let plantas=[]
      let map=new Map()
      this.datosGraf2.forEach(resp=>{
        if(!map.has(resp['ubicacion']) && resp['divisionUnidad']==this.selectDivisiones2  && resp[nombre] !=null){
          map.set(resp['ubicacion'],0)
          plantas.push(resp['ubicacion'])}
      })
      let opcion2=this.filtroEventoMultiple(this.selectEvento2,this.opcion2)
      if(this.selectUbicacion2.length==0){
        this.datosGraf2Print=this.datosGraf2DDivisiones(plantas,this.datosGraf2,opcion2,nombre,'ubicacion')
        this.datosGraf2Print=this.top2(this.datosGraf2Print,10)
        this.datosGraf2Print=this.top(this.datosGraf2Print,10)
      }else{
        this.agregarDivision(opcion2)
      }
      this.flag2=true
    }
    @ViewChild('tree',{static:true}) tree1:any;
    restarTree(){
      this.tree1.resetFilter();
    }
    returnDatos2(){
      this.selectEvento2=[]
      this.selectDivisiones2=[]
      this.selectUbicacion2=[]
      this.DatosGrafica3()
      this.flagReturnDatos2=false
    }
    flagTree1:boolean=false
    cargarArea(){
      this.flagTree1=false
      this.selectUbicacion2=[]
      this.areasNodesMemory1=Array.from(this.areasNodes)
      let areasNodesChildren=this.areasNodesMemory1[0]['children'].filter(resp=>resp.label==this.selectDivisiones2)
      this.areasNodesMemory1=[{children:areasNodesChildren[0]['children'],expanded:false,label:"",parent:undefined, selectable:false}]
      this.DatosGrafica3()
      this.flagTree1=true
    }
  
    sumAreaSelect2(scm,opcion,flag,datos,selectOpcion){
      let datos0=datos
      let datos0_1
      if(flag){
        this.valueArray=[]
        opcion.forEach(resp=>{
          this.valueArray.push({name:resp.label,value:0})
        })
        this.scmList=scm.label
      }
  
      this.selectUbicacion.map(resp=>{
        if(resp.label===scm.label){
          resp.flag=true
        }
      })
  
  
      datos0=datos0.filter(resp=>{return resp.ubicacion==scm.label})
      opcion.forEach(resp=>{
        datos0_1=datos0.filter(resp1=>{return resp1[selectOpcion]==resp.value})
        const indice=this.valueArray.findIndex(el => el.name == resp.label )
        this.valueArray[indice].value=this.valueArray[indice].value+datos0_1.length;
      })
  
      if(scm.children.length>0){
        scm.children.forEach(resp=>{
          this.sumAreaSelect2(resp,opcion,false,datos,selectOpcion)
        })
      }
    }
  
    cerrarDialogo(){
      this.visibleDlg = false;
    }
  
    abrirDialogo1(){
      this.visibleDlg = true;
    }

    agregarDivision(opcion){
      let nombre=''
      if(this.radioButon2==0){nombre='estadoDelCaso'}
      if(this.radioButon2==1){nombre='casoMedicoLaboral'}
      if(this.radioButon2==2){nombre='prioridadCaso'}
      if(this.radioButon2==3){nombre='tipoCaso'}
      
      this.selectUbicacion2=this.order2(this.selectUbicacion2)
      this.selectUbicacion2=this.selectUbicacion2.filter(resp=>resp.label!="")
      this.selectUbicacion=[]
      this.selectUbicacion2.forEach(resp=>{
        this.selectUbicacion.push({
          id:resp.key,
          label:resp.label,
          children:resp.children,
          flag:false
        })
      })
  
      this.valueArray2=[]
      this.selectUbicacion.forEach(resp=>{
        if(resp.flag==false){
          this.sumAreaSelect2(resp,opcion,true,this.datosGraf2,nombre)
          this.valueArray2.push({name:this.scmList,series:this.valueArray})
        }
      })
  
      this.datosGraf2Print=this.valueArray2
      this.cerrarDialogo();
    }

    //Grafica cuatro
    DatosGrafica4(){
      this.flag3=false
      this.datosGraf3=Array.from(this.datos)
      this.datosGraf3=this.filtroFecha(this.fechaDesde4,this.fechaHasta4,this.datosGraf3)
      this.datosGraf3.map(resp=>{if(resp['tipoRetorno']==null){return resp['tipoRetorno']='null'}})
      
      let nombre=''
      this.opcion3=this.reintegroTipos;nombre='tipoRetorno'
  
      let divisiones=this.filtroDivisionMultiple(this.selectDivisiones3,this.divisiones2)
  
      let opcion3=this.filtroEventoMultiple(this.selectEvento3,this.opcion3)
  
      this.datosGraf3Print=this.datosGraf2DDivisiones(divisiones,this.datosGraf3,opcion3,nombre,'divisionUnidad')
      this.flag3=true
    }
  
    returnDatos3(){
      this.selectEvento3=[]
      this.selectDivisiones3=[]
      this.DatosGrafica4()
    }

    //Grafica cinco
    DatosGrafica5(){
      this.flagReturnDatos4=true
      this.flag4=false
      this.datosGraf4=Array.from(this.datos)
      if(this.selectDivisiones4.length>0)this.datosGraf4=this.datosGraf4.filter(resp=>resp.divisionUnidad==this.selectDivisiones4)

      this.datosGraf4=this.filtroFecha(this.fechaDesde5,this.fechaHasta5,this.datosGraf4)
      this.datosGraf4.map(resp=>{if(resp['tipoRetorno']==null){return resp['tipoRetorno']='null'}})

      let nombre=''
      this.opcion4=this.reintegroTipos;nombre='tipoRetorno'
  
      let plantas=[]
      let map=new Map()
      this.datosGraf4.forEach(resp=>{
        if(!map.has(resp['ubicacion']) && resp['divisionUnidad']==this.selectDivisiones4){
          map.set(resp['ubicacion'],0)
          plantas.push(resp['ubicacion'])}
      })
      let opcion4=this.filtroEventoMultiple(this.selectEvento4,this.opcion4)
      if(this.selectUbicacion4.length==0){
        this.datosGraf4Print=this.datosGraf2DDivisiones(plantas,this.datosGraf4,opcion4,nombre,'ubicacion')
        this.datosGraf4Print=this.top2(this.datosGraf4Print,10)
        this.datosGraf4Print=this.top(this.datosGraf4Print,10)
      }else{
        this.agregarDivision5(opcion4)
      }
      this.flag4=true
    }

    cargarArea5(){
      this.selectUbicacion4=[]
      this.areasNodesMemory5=Array.from(this.areasNodes)
      let areasNodesChildren=this.areasNodesMemory5[0]['children'].filter(resp=>resp.label==this.selectDivisiones4)
      this.areasNodesMemory5=[{children:areasNodesChildren[0]['children'],expanded:false,label:"",parent:undefined, selectable:false}]
      this.DatosGrafica5()
    }
  
    sumAreaSelect5(scm,opcion,flag,datos,selectOpcion){
      let datos0=datos
      let datos0_1
      if(flag){
        this.valueArray_5=[]
        opcion.forEach(resp=>{
          this.valueArray_5.push({name:resp.label,value:0})
        })
        this.scmList5=scm.label
      }
  
      this.selectUbicacion_5.map(resp=>{
        if(resp.label===scm.label){
          resp.flag=true
        }
      })
  
  
      datos0=datos0.filter(resp=>{return resp.ubicacion==scm.label})
      opcion.forEach(resp=>{
        datos0_1=datos0.filter(resp1=>{return resp1[selectOpcion]==resp.value})
        const indice=this.valueArray_5.findIndex(el => el.name == resp.label )
        this.valueArray_5[indice].value=this.valueArray_5[indice].value+datos0_1.length;
      })
  
      if(scm.children.length>0){
        scm.children.forEach(resp=>{
          this.sumAreaSelect5(resp,opcion,false,datos,selectOpcion)
        })
      }
    }
  
    cerrarDialogo5(){
      this.visibleDlg2 = false;
    }
  
    abrirDialogo5(){
      this.visibleDlg2 = true;
    }

    agregarDivision5(opcion){
      let nombre=''
      this.opcion4=this.reintegroTipos;nombre='tipoRetorno'
      
      this.selectUbicacion4=this.order2(this.selectUbicacion4)
      this.selectUbicacion4=this.selectUbicacion4.filter(resp=>resp.label!="")
      this.selectUbicacion_5=[]
      this.selectUbicacion4.forEach(resp=>{
        this.selectUbicacion_5.push({
          id:resp.key,
          label:resp.label,
          children:resp.children,
          flag:false
        })
      })
  
      this.valueArray5=[]
      this.selectUbicacion_5.forEach(resp=>{
        if(resp.flag==false){
          this.sumAreaSelect5(resp,opcion,true,this.datosGraf4,nombre)
          this.valueArray5.push({name:this.scmList5,series:this.valueArray_5})
        }
      })
  
      this.datosGraf4Print=this.valueArray5
      this.cerrarDialogo5();
    }

    //Grafica seis
    reset6(){
      this.selectDivisiones5=[]
      this.selectEvento5=[]
      this.fechaDesde6=null
      this.fechaHasta6=null
      this.DatosGrafica6()
    }
    DatosGrafica6(){
      this.flag5=false
      this.datosGraf5=Array.from(this.datos)

      this.datosGraf5=this.datosGraf5.filter(resp=>{return resp['origen']!=null})
      if(this.radioButon5==1){this.datosGraf5=this.datosGraf5.filter(resp=>{return resp['origen']=='Común'})}
      if(this.radioButon5==2){this.datosGraf5=this.datosGraf5.filter(resp=>{return resp['origen']!='Común'})}

      this.datosGraf5=this.filtroFecha(this.fechaDesde6,this.fechaHasta6,this.datosGraf5)

      let opcion=[]
      let map=new Map()
      this.datosGraf5.forEach(resp=>{
        if(!map.has(resp['diagnostico'])){
          map.set(resp['diagnostico'],0)
          opcion.push({label:resp['diagnostico'],value:resp['diagnostico']})}
      })

      let nombre=''
      this.opcion5=opcion;nombre='diagnostico'

      let divisiones=[].concat(this.divisiones2)
      divisiones.splice(divisiones.length-1,1)
      divisiones=this.filtroDivisionMultiple(this.selectDivisiones5,divisiones)
  
      let opcion5=this.filtroEventoMultiple(this.selectEvento5,this.opcion5)
  
      this.datosGraf5=this.datosGraf2DDivisiones(divisiones,this.datosGraf5,opcion5,nombre,'divisionUnidad')

      this.datosGraf5Print=this.top(this.datosGraf5,10)
      this.flag5=true
      if(this.selectEvento5.length>0 && this.selectEvento5.length<=5 ){this.dataFlag5=true}
      else{this.dataFlag5=false}
    }
  
    returnDatos6(){
      this.selectEvento5=[]
      this.selectDivisiones5=[]
      this.DatosGrafica6()
    }


    //Grafica sieto
    reset7(){
      this.selectDivisiones6=[]
      this.selectUbicacion6=[]
      this.selectEvento6=[]
      this.fechaDesde7=null
      this.fechaHasta7=null
      this.flagReturnDatos6=false
    }

    DatosGrafica7(){
      this.flagReturnDatos6=true
      this.flag6=false
      this.datosGraf6=Array.from(this.datos)

      this.datosGraf6=this.datosGraf6.filter(resp=>{return resp['origen']!=null})
      if(this.radioButon6==1){this.datosGraf6=this.datosGraf6.filter(resp=>{return resp['origen']=='Común'})}
      if(this.radioButon6==2){this.datosGraf6=this.datosGraf6.filter(resp=>{return resp['origen']!='Común'})}

      if(this.selectDivisiones6.length>0)this.datosGraf6=this.datosGraf6.filter(resp=>resp.divisionUnidad==this.selectDivisiones6)

      this.datosGraf6=this.filtroFecha(this.fechaDesde7,this.fechaHasta7,this.datosGraf6)
      this.datosGraf6.map(resp=>{if(resp['diagnostico']==null){return resp['diagnostico']='Sin diagnostico'}})
      let opcion=[]
      let map=new Map()
      this.datosGraf6.forEach(resp=>{
        if(!map.has(resp['diagnostico'])){
          map.set(resp['diagnostico'],0)
          opcion.push({label:resp['diagnostico'],value:resp['diagnostico']})}
      })

      let nombre=''
      this.opcion6=opcion;nombre='diagnostico'
  
      let plantas=[]
      let map2=new Map()
      this.datosGraf6.forEach(resp=>{
        if(!map2.has(resp['ubicacion']) && resp['divisionUnidad']==this.selectDivisiones6){
          map2.set(resp['ubicacion'],0)
          plantas.push(resp['ubicacion'])}
      })
      let opcion6=this.filtroEventoMultiple(this.selectEvento6,this.opcion6)
      if(this.selectUbicacion6.length==0){
        this.datosGraf6Print=this.datosGraf2DDivisiones(plantas,this.datosGraf6,opcion6,nombre,'ubicacion')
        this.datosGraf6Print=this.top2(this.datosGraf6Print,10)
        this.datosGraf6Print=this.top(this.datosGraf6Print,10)
      }else{
        this.agregarDivision7(opcion6)
      }
      this.flag6=true
      if(this.selectEvento6.length>0 && this.selectEvento6.length<=5 ){this.dataFlag6=true}
      else{this.dataFlag6=false}
    }

    cargarArea7(){
      this.selectUbicacion6=[]
      this.areasNodesMemory7=Array.from(this.areasNodes)
      let areasNodesChildren=this.areasNodesMemory7[0]['children'].filter(resp=>resp.label==this.selectDivisiones6)
      this.areasNodesMemory7=[{children:areasNodesChildren[0]['children'],expanded:false,label:"",parent:undefined, selectable:false}]
      this.DatosGrafica7()
    }
  
    sumAreaSelect7(scm,opcion,flag,datos,selectOpcion){
      let datos0=datos
      let datos0_1
      if(flag){
        this.valueArray_7=[]
        opcion.forEach(resp=>{
          this.valueArray_7.push({name:resp.label,value:0})
        })
        this.scmList7=scm.label
      }
  
      this.selectUbicacion_7.map(resp=>{
        if(resp.label===scm.label){
          resp.flag=true
        }
      })
  
  
      datos0=datos0.filter(resp=>{return resp.ubicacion==scm.label})
      opcion.forEach(resp=>{
        datos0_1=datos0.filter(resp1=>{return resp1[selectOpcion]==resp.value})
        const indice=this.valueArray_7.findIndex(el => el.name == resp.label )
        this.valueArray_7[indice].value=this.valueArray_7[indice].value+datos0_1.length;
      })
  
      if(scm.children.length>0){
        scm.children.forEach(resp=>{
          this.sumAreaSelect7(resp,opcion,false,datos,selectOpcion)
        })
      }
    }
  
    cerrarDialogo7(){
      this.visibleDlg3 = false;
    }
  
    abrirDialogo7(){
      this.visibleDlg3 = true;
    }

    agregarDivision7(opcion){
      let opcion1=[]
      let map=new Map()
      this.datosGraf5.forEach(resp=>{
        if(!map.has(resp['diagnostico'])){
          map.set(resp['diagnostico'],0)
          opcion1.push({label:resp['diagnostico'],value:resp['diagnostico']})}
      })

      let nombre=''
      this.opcion5=opcion1;nombre='diagnostico'
      
      this.selectUbicacion6=this.order2(this.selectUbicacion6)
      this.selectUbicacion6=this.selectUbicacion6.filter(resp=>resp.label!="")
      this.selectUbicacion_7=[]
      this.selectUbicacion6.forEach(resp=>{
        this.selectUbicacion_7.push({
          id:resp.key,
          label:resp.label,
          children:resp.children,
          flag:false
        })
      })
  
      this.valueArray7=[]
      this.selectUbicacion_7.forEach(resp=>{
        if(resp.flag==false){
          this.sumAreaSelect7(resp,opcion,true,this.datosGraf6,nombre)
          this.valueArray7.push({name:this.scmList7,series:this.valueArray_7})
        }
      })
  
      this.datosGraf6Print=this.valueArray7
      this.datosGraf6Print=this.organizarDatosMayorMenor(this.datosGraf6Print)
      this.datosGraf6Print=this.top(this.datosGraf6Print,10)
      this.cerrarDialogo7();
    }

  //codigo comun
  filtroFecha(fechaDesde:Date,fechaHasta:Date,datos:any){
    let datos0
    if(fechaHasta)fechaHasta=new Date(new Date(fechaHasta).setMonth(new Date(fechaHasta).getMonth()+1))

    if(fechaDesde && fechaHasta){
      datos0=datos.filter(resp=>{return new Date(resp.fechaCreacion)>=fechaDesde && new Date(resp.fechaCreacion)<fechaHasta})
    }
    else if(fechaDesde){
      datos0=datos.filter(resp=>{return new Date(resp.fechaCreacion)>=fechaDesde})
    }
    else if(fechaHasta){
      datos0=datos.filter(resp=>{return new Date(resp.fechaCreacion)<fechaHasta})
    }
    else{
      datos0=datos
    }
    return datos0
  }

  filtroDivisionMono(selecDiv:any,datos:any){
    let datos0=[]
    if(selecDiv.length>0){
      if(selecDiv=='Corona total'){
        datos0=datos
      }else{
        datos0=datos.filter(resp1=>{
          return resp1['divisionUnidad']==selecDiv
        })
      }
    }else{
      datos0=datos
    }
    return datos0
  }

  filtroDivisionMultiple(selecDiv:any,div:any){
    let divisiones=[]
    if(selecDiv.length>0){
      selecDiv.forEach(element => {
        let div1=div.filter(resp=>resp==element.label)
        divisiones.push(div1)
      });
    }else{
      divisiones=div
    }
    return divisiones
  }

  filtroEventoMultiple(selecEve:any,eve:any){
   let opcion1=[]
    if(selecEve.length>0){
      selecEve.forEach(element => {
        let op=eve.filter(resp=>resp.label==element.label)
        opcion1.push(op[0])
      });
    }else{
      opcion1=eve
    }  
    return opcion1 
  }

  datosGraf2DDivisiones(division:any,datos:any,opciones:any,nombre:string,div:string){
    let datos0=datos
    let datos0_1=[]
    let datos0_2=[]

    opciones.forEach(resp=>{
      datos0_2.push({name:resp.label,value:0})
    })

    division.forEach(resp=>{
      if(resp!='Corona total')datos0_1.push({name:resp,series:datos0_2})
    })

    let datos0_coronaTotal=[{name:'Corona total',series:datos0_2}]
    const index = division.findIndex(el => el == 'Corona total' )

    datos0.forEach(resp=>{
      if(resp[nombre]){

        const indexobj = opciones.findIndex(el => el.value == resp[nombre] )
        if(indexobj!=-1){
          let nomObj=opciones[indexobj]['label']

          const indiceElemento1 = datos0_1.findIndex(el => el.name == resp[div] )
          if(indiceElemento1!=-1){
            let newTodos1 = [...datos0_1]
            // if(indexobj!=-1){
            const indiceElemento2 = newTodos1[indiceElemento1]['series'].findIndex(el => el.name == nomObj )
            if(indiceElemento2!=-1){
              let newTodos2 = [...newTodos1[indiceElemento1]['series']]

              let sum=datos0_1[indiceElemento1]['series'][indiceElemento2]['value']+1
              newTodos2[indiceElemento2] = {...newTodos2[indiceElemento2], value: sum}

              newTodos1[indiceElemento1]['series'] = newTodos2

              datos0_1 = newTodos1
              // }
            }
          }

          //corona Total
          const indiceTotal=datos0_coronaTotal[0]['series'].findIndex(el => el.name == nomObj )
          if(indiceTotal!=-1 && index!=-1){
            let newTotal1 = [...datos0_coronaTotal[0]['series']]

            let sum=datos0_coronaTotal[0]['series'][indiceTotal]['value']+1
            newTotal1[indiceTotal] = {...newTotal1[indiceTotal], value: sum}

            datos0_coronaTotal[0]['series'] = newTotal1
          }
        }
      }
    })

    if(index!=-1)datos0_1.push(datos0_coronaTotal[0])

    return datos0_1 
  }

  organizarDatosMayorMenor(dato){
    let datosReturn=[]
    dato.forEach(resp=>{
      let datos=Array.from(resp['series'])
      datos=this.order(datos)
      datosReturn.push({name:resp['name'],series:datos})
    })
    // console.log(datosReturn)
    return datosReturn
  }


  top(dato, limit) {
    let dato2=[]
    dato.forEach(ele =>{
      let cont=0
      let serie=[]
      ele.series.forEach(ele2=>{
        if(ele.series.length>=limit){
          if(cont<limit){
            serie.push({name:ele2.name , value:ele2.value} ) 
          }
        }else{
          serie.push({name:ele2.name , value:ele2.value})
        }
        cont++
      }) 
      dato2.push({name:ele.name ,series:serie} )
    })
    return dato2
  }

  top2(dato, limit) {
    let dato2=[] 
    let cont=0
    let order=[]
    dato.forEach(resp=>{
      let sum=0
      resp['series'].forEach(resp2=>{
        sum+=resp2.value
      })
      order.push({label:resp.name,value:sum})
    })
    order=this.order(order)

    order.forEach(resp=>{
      if(cont<limit){
        dato2.push(dato.find(resp1=>resp1.name==resp.label))
      }
      cont +=1;
    })

    return dato2
  }

  order(ele){
    ele.sort(function (a, b) {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });
    return ele
  }

  order2(ele){
    ele.sort(function (a, b) {
      if (a.tipoAreaId > b.tipoAreaId) {
        return 1;
      }
      if (a.tipoAreaId < b.tipoAreaId) {
        return -1;
      }
      return 0;
    });
    return ele
  }

  
  // Component methods
  async loadAreas() {
    let allComplete = {
      organi: false,
      fisica: false
    };

    // Consulta las areas de estructura organizacional
    let filterAreaQuery = new FilterQuery();
    //filterAreaQuery.fieldList=['id','nombre','descripcion','tipoArea','estructura','areaPadre','areaList']
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
    ];
    this.areaService.findByFilter(filterAreaQuery)
      .then(data => {
        let root: TreeNode = {
          label: '',
          selectable: false,
          expanded: false,
        };
        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.areasNodes.push(root);
        allComplete.organi = true;
      })
  }

  createTreeNode(areas: Area[], nodoPadre: TreeNode): TreeNode[] {
    let nodes: TreeNode[] = [];
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];
      let n = {
        key: area.id,
        label: area.nombre,
        descripcion: area.descripcion,
        tipoAreaId: area.tipoArea.id,
        estructura: area.estructura,
        expanded: false,
        parent: nodoPadre,
        children: null,
        selected: true
      };
      n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : null);
      // n.expanded = area.areaList != null && area.areaList.length > 0;
      nodes.push(n);
    }
    return nodes;
  }

}
