import { Component, OnInit} from "@angular/core";
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

  datosGraf0:any;
  datosGraf0Print:any;

  datosGraf1:any;
  datosGraf1Print:any;

  datosGraf2:any;
  datosGraf2Print:any;
  

  datosGraf3:any;
  datosGraf3Print:any;

  selectDivisiones1:any=[]
  selectEvento1:any=[]

  selectDivisiones2:any=[]
  selectUbicacion2:any=[]
  selectEvento2:any=[]

  selectDivisiones3:any=[]
  selectEvento3:any=[]

  flag1:boolean=false
  flag2:boolean=true
  flag3:boolean=false
  flagReturnDatos2:boolean=false

  visibleDlg: boolean =false;

  selecDiv0=[]

  radioButon0:number=0;
  opcion0?:any;

  radioButon1:number=0;
  opcion1?:any;

  radioButon2:number=0;
  opcion2?:any;

  radioButon3:number=0;
  opcion3?:any;

  area:any=[];

  valueArray:any[]
  valueArray2:any[]
  scmList

  selectUbicacion:any=[]

  areasNodes: TreeNode[] = [];
  areasNodesMemory1: TreeNode[] = [];

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
  ]

  async ngOnInit() {
    await this.cargarDatos()
    this.numeroCasos()
    this.DatosGrafica1()
    this.DatosGrafica2()
    this.DatosGrafica4()
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
    this.datosGraf0=this.datos
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
    this.datosGraf1=this.datos
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
      this.datosGraf2=this.datos
      if(this.selectDivisiones2.length>0)this.datosGraf2=this.datosGraf2.filter(resp=>resp.divisionUnidad==this.selectDivisiones2)

      this.datosGraf2=this.filtroFecha(this.fechaDesde3,this.fechaHasta3,this.datosGraf2)
      let nombre=''
      if(this.radioButon2==0){this.opcion2=this.StatusList;nombre='estadoDelCaso'}
      if(this.radioButon2==1){this.opcion2=this.mesaLaboralList;nombre='casoMedicoLaboral'}
      if(this.radioButon2==2){this.opcion2=this.prioridadList;nombre='prioridadCaso'}
      if(this.radioButon2==3){this.opcion2=this.tipoOptionList;nombre='tipoCaso'}
  
      let plantas=[]
      let map=new Map()
      this.datosGraf2.forEach(resp=>{
        if(!map.has(resp['ubicacion']) && resp['divisionUnidad']==this.selectDivisiones2){
          map.set(resp['ubicacion'],0)
          plantas.push(resp['ubicacion'])}
      })
      let opcion2=this.filtroEventoMultiple(this.selectEvento2,this.opcion2)
      if(this.selectUbicacion2.length==0){
        this.datosGraf2Print=this.datosGraf2DDivisiones(plantas,this.datosGraf2,opcion2,nombre,'ubicacion')
        this.datosGraf2Print=this.top2(this.datosGraf2Print,10)
      }else{
        this.agregarDivision(opcion2)
      }
      this.flag2=true
    }
  
    returnDatos2(){
      this.selectEvento2=[]
      this.selectDivisiones2=[]
      this.DatosGrafica3()
      this.flagReturnDatos2=false
    }

    async cargarArea(){
      this.selectUbicacion2=[]
      this.areasNodesMemory1=this.areasNodes
      let areasNodesChildren=this.areasNodesMemory1[0]['children'].filter(resp=>resp.label==this.selectDivisiones2)
      this.areasNodesMemory1=[{children:areasNodesChildren[0]['children'],expanded:false,label:"",parent:undefined, selectable:false}]
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
      this.datosGraf3=this.datos
      this.datosGraf3=this.filtroFecha(this.fechaDesde2,this.fechaHasta4,this.datosGraf3)
      let nombre=''
      this.opcion3=this.reintegroTipos;nombre='tipoRetorno'
  
      let divisiones=this.filtroDivisionMultiple(this.selectDivisiones3,this.divisiones2)
  
      let opcion3=this.filtroEventoMultiple(this.selectEvento3,this.opcion3)
  
      this.datosGraf3Print=this.datosGraf2DDivisiones(divisiones,this.datosGraf1,opcion3,nombre,'divisionUnidad')
      this.flag3=true
    }
  
    returnDatos3(){
      this.selectEvento3=[]
      this.selectDivisiones3=[]
      this.DatosGrafica4()
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
