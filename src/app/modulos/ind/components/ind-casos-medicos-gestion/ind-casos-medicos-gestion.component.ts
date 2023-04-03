import { Component, OnInit } from '@angular/core';
import {ViewscmgeService} from "../../services/indicador-scmge.service"
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { SelectItem, Message, TreeNode } from 'primeng/primeng';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';

@Component({
  selector: 'app-ind-casos-medicos-gestion',
  templateUrl: './ind-casos-medicos-gestion.component.html',
  styleUrls: ['./ind-casos-medicos-gestion.component.scss']
})
export class IndCasosMedicosGestionComponent implements OnInit {
  //comun
  localeES = locale_es;
  datos:any[];

  areasNodes: TreeNode[] = [];

  divisiones=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
  divisiones1:any=[]

  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };

  rangoFechaEdad=['18 a 25 años','26 a 35 años','36 a 45 años','46 a 59 años','60 años en adelante']
  rangoFechaEdadArray=[]
  rangoFechaAntiguedad=['0 a 1 años','2 a 5 años','6 a 10 años','11 a 20 años','21 a 30 años','31 años en adelante']
  rangoFechaAntiguedadArray=[]

  //grafica uno
  flag1:boolean=false

  divisiones0=[]
  radioButon1:number=0;
  opcion1?:any;

  selectDivisiones1:any=[]
  selectEvento1:any=[]

  fechaDesde1:Date;
  fechaHasta1:Date;

  datosGraf1:any;
  datosGraf1Print:any;

  nameGraf1:string='Antiguedad'


  constructor(
    private ViewscmgeService: ViewscmgeService,
    private areaService: AreaService,
  ) { }

  async ngOnInit() {
    await this.cargarDatos()
    this.DatosGrafica1()
  }

  // Primera grafica
  DatosGrafica1(){
    this.flag1=false
    this.datosGraf1=Array.from(this.datos)
    this.datosGraf1=this.filtroFecha(this.fechaDesde1,this.fechaHasta1,this.datosGraf1)
    let nombre=''
    if(this.radioButon1==0){this.opcion1=this.rangoFechaAntiguedadArray;nombre='estadoDelCaso';this.nameGraf1='Antiguedad'}
    if(this.radioButon1==1){this.opcion1=this.rangoFechaEdadArray;nombre='casoMedicoLaboral';this.nameGraf1='Edad'}
    if(this.radioButon1==2){this.opcion1=this.rangoFechaAntiguedadArray;nombre='prioridadCaso';this.nameGraf1='Fecha diagnostico - Fecha PCL'}
    if(this.radioButon1==3){this.opcion1=this.rangoFechaAntiguedadArray;nombre='tipoCaso';this.nameGraf1='Fecha diagnostico - Fecha origen'}

    let divisiones=this.filtroDivisionMultiple(this.selectDivisiones1,this.divisiones1)

    let opcion1=this.filtroEventoMultiple(this.selectEvento1,this.opcion1)

    // this.datosGraf1Print=this.datosGraf2DDivisiones(divisiones,this.datosGraf1,opcion1,nombre,'divisionUnidad')
    this.flag1=true
  }
  returnDatos1(){
    this.selectEvento1=[]
    this.selectDivisiones1=[]
    this.DatosGrafica1()
  }

  //codigo comun
  async cargarDatos(){
    this.divisiones.forEach(resp=>{
      this.divisiones0.push({label:resp,value:resp})
      this.divisiones1.push(resp)
    })
    this.divisiones1.push('Corona total')

    this.rangoFechaEdad.forEach(resp=>{
      this.rangoFechaEdadArray.push({label:resp,value:resp})
    })

    this.rangoFechaAntiguedad.forEach(resp=>{
      this.rangoFechaAntiguedadArray.push({label:resp,value:resp})
    })

    this.divisiones0.push({label:'Corona total',value:'Corona total'})
    await this.ViewscmgeService.findByEmpresaId().then((resp:any)=>{
      this.datos=resp
    })
  }

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
