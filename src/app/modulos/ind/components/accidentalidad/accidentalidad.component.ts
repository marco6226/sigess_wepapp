import { Component, OnInit} from "@angular/core";
import { ReporteAtService } from "./../../services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";

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
  selector: "s-accidentalidad",
  templateUrl: "./accidentalidad.component.html",
  styleUrls: ["./accidentalidad.component.scss"],
  providers: [],
})
export class AccidentalidadComponent implements OnInit {

  title: string = 'Accidentalidad';

  fakeData: division[] = [
    {name: 'BAÑOS Y COCINAS', acumulado: 0.040, meta: 0.034, eventos: 67, diasPerdidos: 646, frecuencia: 2.1, severidad: 20.4},
    {name: 'SUPERFICIES MATERIALES Y PINTURAS', acumulado: 0.255, meta: 0.034, eventos: 36, diasPerdidos: 1035, frecuencia: 3.37, severidad: 97.0},
    {name: 'INSUMOS Y MANEJO DE ENERGÍA', acumulado: 0.028, meta: 0.090, eventos: 12, diasPerdidos: 173, frecuencia: 1.42, severidad: 20.42},
  ];

  divisiones;
  areaList: Area[] = [];

  data: [];

  constructor(
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService
    ) {  }

  ngOnInit() {
    this.getData()
      .then( () => {
        console.log('areaList: ' + this.areaList);
      });
    
  }
  reporteTabla
  reporteTabla2
  async getData(){
    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    // this.divisiones.push({label:'Total',value:'Total'})
      await this.areaService.findByFilter(areafiltQuery)
      .then(
        resp => {
          this.areaList = <Area[]>resp['data'];
          console.log(JSON.stringify(this.areaList))
          // this.diasPerdidos=this.diasPerdidos+JSON.parse(element['incapacidades']).length
          // this.areaList.forEach(item => {
          //   // temp.filter(item2 => item2.)
          // });
        }
      );
      
      this.reporteTabla=[]
      this.reporteTabla2=[]
      await this.reporteAtService.findAllRAT()
      .then(res => {
        this.reporteTabla=res
        
        this.areaList.forEach(element => {
          let cont=0
          let diasPerdidos=0

          this.reporteTabla.forEach(element2 =>{
            if(element['nombre']==element2['padreNombre'] && element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
              // console.log(element2)
              cont+=1;
              console.log('incidentes: ' + element2['incapacidades']);
              diasPerdidos+=JSON.parse(element2['incapacidades']).length
            }
          })
          this.reporteTabla2.push({nombre:element['nombre'],eventos:cont,diasPerdidos:diasPerdidos})
        });
        // console.log(res);
      });
      this.data = this.reporteTabla2;
      // console.log(JSON.stringify(this.data));
  }
}
