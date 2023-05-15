import { Component, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { ReporteAtService } from "app/modulos/ind/services/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "app/modulos/core/entities/filter";
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from "app/modulos/empresa/services/area.service";
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from 'ngx-charts-8';
import { HhtService } from "app/modulos/empresa/services/hht.service";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { DataArea, DataHht, Hht } from "app/modulos/empresa/entities/hht";
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import {CaracterizacionViewService} from "app/modulos/ind/services/caracterizacion-view.service"
import {ViewscmcoService} from "app/modulos/ind/services/indicador-scmco.service"

@Component({
  selector: 'app-home-corona',
  templateUrl: './home-corona.component.html',
  styleUrls: ['./home-corona.component.scss'],
  providers: [HhtService, SesionService,CaracterizacionViewService], 
})
export class HomeCoronaComponent implements OnInit {
  ili: number | null = 0;
  mensajeILI: string | null = null;
  metaIli:number=0;
  colorIli?:string;

  localeES = locale_es;
  desde: Date;
  hasta: Date;
  NoEventos:number;
  diasPerdidos:number;
  incapacidades;

  filtroFechaAt: Date[] = [];
  filtroFechaDiasPerdidos: Date[] = [];

  areaList: Area[] = [];
  divisiones= new Array();

  title: string = 'Accidentalidad';
  data: [];
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  selectedDivisionResumen: string |null = null;
  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Proporción AT mortal', value: 2}];
  Eventos: any[] = [{label: 'Numero AT', value: 0}, {label: 'Numero días perdidos', value: 1}, {label: 'Numero AT mortales', value: 2}, {label: 'Numero AT con cero días', value: 3}];
  divisionesCorona: string[] = ['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
  divisionesCoronaConId: any[] = [];
  reporteTabla
  reporteTabla2
  totalDiasPerdidosDv: any[];
  totalEventosDv: any[];
  totalEventosDv2: any[];
  totalDiasEventos: any[];
  random: any[];
  flag:boolean=false
  flagdiv:boolean=false
  flagevent:boolean=false
  yearRange = new Array();
  añoPrimero:number=2015;
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  anioActualResumen: number = new Date().getFullYear();
  fechaInicioResumen: Date;
  fechaFinalResumen: Date;
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  //segunda grafica
  CaracterizacionView;
  ContLeve:number=0
  ContGrave:number=0
  ContSevero:number=0;
  ContMortal:number=0;
  CaracterizacionView1:any

  date1: Date;
  date2: Date;

  radioGra0:number=0
  radioGra0_1:number=0

  selectArea: any[] | null = null;

  ngAfterViewInit(){
    this.cargarEventosAt().then(() => {
      this.loadResumen();
    })
  }
  ngOnDestroy(): void {
    localStorage.removeItem('reportesAt');
  }

  async ngOnInit() {
    //Primera grafica
    this.dataPrimeraGrafica()

    //segunda grafica
    this.dataSegundaGrafica()

    //Tercera grafica
    this.dataTerceraGrafica()
  }

  constructor(
    private paramNav: ParametroNavegacionService,
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService,
    private hhtService: HhtService,
    private sessionService: SesionService,
    private caracterizacionViewService: CaracterizacionViewService,
    private viewscmcoService: ViewscmcoService,
  ){}

  dataPrimeraGrafica(){
    localStorage.removeItem('reportesAt');

    if(this.ili<=this.metaIli){
    this.colorIli="card l-bg-green-dark"}
    else {this.colorIli="card l-bg-red-dark"}

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    this.hasta = new Date(Date.now());
    this.desde = null;
    this.fechaInicioResumen = new Date(new Date().getFullYear(), 0, 1);
    this.fechaFinalResumen = new Date();

    this.getData().then();
  }

  async getData(){
    this.filtroFechaAt[0]=this.fechaInicioResumen
    this.filtroFechaAt[1]=(this.fechaFinalResumen)
    this.filtroFechaDiasPerdidos[0]=this.fechaInicioResumen
    this.filtroFechaDiasPerdidos[1]=(this.fechaFinalResumen)
    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre", "id"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      resp => {
        this.areaList = <Area[]>resp['data'];
        let cont=0
        this.areaList.forEach(element => {
          this.divisionesCoronaConId.push({nombre: element.nombre, id: element.id});
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
          cont+=1
        });
      }
    );
      this.reporteTabla=[]
      this.reporteTabla2=[]
      this.totalDiasPerdidosDv=[]
      this.totalEventosDv=[]
      this.totalEventosDv2=[]
      this.totalDiasEventos=[]
      await this.reporteAtService.findAllRAT()
      .then(res => {
        this.reporteTabla=res
        
        this.areaList.forEach(element => {
          let cont: number = 0;
          let diasPerdidos: number=0

          this.reporteTabla.forEach(element2 =>{
            if(element['nombre']==element2['padreNombre']){
              cont+=1;
              if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
                diasPerdidos+=JSON.parse(element2['incapacidades']).length
              }
            }
          })
          this.totalDiasPerdidosDv.push({name:element['nombre'],value:diasPerdidos})
          this.totalEventosDv.push({name:element['nombre'],value:cont})
          this.reporteTabla2.push({nombre:element['nombre'],eventos:cont,dias_Perdidos:diasPerdidos})
          this.totalDiasEventos.push({name:element['nombre'],series:[{name:'Eventos AT',value:cont},{name:'Días perdidos',value:diasPerdidos}]})
        });
      });
      this.totalEventosDv2=this.totalEventosDv
      this.data = this.reporteTabla2;
  }

  async cargarEventosAt(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.reporteAtService.getAllAt().then((reportesAt: any[]) => {
        localStorage.setItem('reportesAt', JSON.stringify(reportesAt.map(at => at)));
        resolve(true);
      }).catch((err) => {
        console.error(err);
        reject(false);
      });
    });
  }
  
  async loadResumen(){
    let filterQueryCorona = new FilterQuery();
    let filterQueryTemp = new FilterQuery();
    let empresaId = this.sessionService.getEmpresa().id;
    let hhtEmpresa: Hht[] = [];
    let hhtTemp: Hht[] = [];
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')).map(at => at);

    
    filterQueryCorona.sortOrder = SortOrder.ASC;
    filterQueryCorona.sortField = "id";
    filterQueryCorona.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: empresaId}
    ];

    filterQueryTemp.sortOrder = SortOrder.ASC;
    filterQueryTemp.sortField = "id";
    filterQueryTemp.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresa.id", value1: empresaId},
      {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    
    if(this.fechaInicioResumen){
      this.fechaInicioResumen.setFullYear(this.anioActualResumen);
    }

    if(this.fechaFinalResumen){
      this.fechaFinalResumen.setFullYear(this.anioActualResumen);
      this.fechaFinalResumen = new Date(this.fechaFinalResumen.getFullYear(), this.fechaFinalResumen.getMonth()+1, 0);
    }

    reportesAt = reportesAt.filter(at => new Date(at.fechaReporte).getFullYear() == this.anioActualResumen);

    reportesAt = reportesAt.filter(at => {
        return new Date(at['fechaReporte']) >= this.fechaInicioResumen && new Date(at['fechaReporte']) <= this.fechaFinalResumen;
    });

    if(this.selectedDivisionResumen && this.selectedDivisionResumen !== 'Total') reportesAt = reportesAt.filter(at => at.padreNombre === this.selectedDivisionResumen);

    this.NoEventos = reportesAt.length;

    this.diasPerdidos = 0;
    reportesAt.forEach(at => {
      if(at['incapacidades']!=null && at['incapacidades']!='null'){
        this.diasPerdidos = this.diasPerdidos + JSON.parse(at['incapacidades'])
        .reduce((count, incapacidad) => {
          return count + incapacidad.diasAusencia;
        }, 0);
      }
    });

    await this.hhtService.findByFilter(filterQueryCorona)
    .then(async (res: any) => {
      if(res.data.length > 0){
        hhtEmpresa = Array.from(res.data);
        if(!this.selectedDivisionResumen || this.selectedDivisionResumen === 'Total'){
          this.metaIli = JSON.parse(res.data[0].valor).ILI_Anual;
        }else{
          let data: DataHht = JSON.parse(res.data[0].valor).Data;
          data.Areas.forEach((area , index) => {
            this.areaList.forEach(ar => {
              if(ar.nombre === this.selectedDivisionResumen && ar.id == area.id.toString()){
                this.metaIli = area.ILIArea;
              }
            });
          });
        }
        // console.log('hhtEmpresa: ', hhtEmpresa);
      }else{
        console.error('No se obtuvieron registros hht de la empresa.');
      }
    }).catch(err => {
      console.error('Error al obtener hht de la empresa');
    });

    await this.hhtService.findByFilter(filterQueryTemp)
    .then(async (res: any) => {
      if(res.data.length > 0){
        hhtTemp = Array.from(res.data);
      }else{
        console.error('No se obtuvieron registros hht de las temporales');
      }
    }).catch(err => {
      console.error('Error al obtener hht de las temporales');
    });

    let accidentesConDiasPerdidos = 0;
    if(this.selectedDivisionResumen && this.selectedDivisionResumen !== 'Total'){
      accidentesConDiasPerdidos = reportesAt
      .filter(at => at.padreNombre === this.selectedDivisionResumen &&
        at.incapacidades !== null && at.incapacidades!== 'null').filter(at => {
          let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
          .reduce((count, incapacidad) => {
            return count + incapacidad.diasAusencia;
          }, 0);
          return diasTotales > 0 ? true : false;
        }).length;
    }else{
      accidentesConDiasPerdidos = reportesAt
      .filter(at => at.incapacidades !== null && at.incapacidades !== 'null').filter(at => {
        let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
        .reduce((count, incapacidad) => {
          return count + incapacidad.diasAusencia;
        }, 0);
        return diasTotales > 0 ? true : false;
      }).length;
    }

    let totalDiasSeveridad = 0;
    if(this.selectedDivisionResumen && this.selectedDivisionResumen !== 'Total'){
      totalDiasSeveridad = reportesAt
      .filter(at => at.padreNombre === this.selectedDivisionResumen && at.incapacidades !== null
        && at.incapacidades !== 'null')
        .reduce((count, at) => {
          return count + JSON.parse(at.incapacidades).reduce((count2, incapacidad) => {
            return count2 + incapacidad.diasAusencia;
          }, 0);
        }, 0);
    }else{
      totalDiasSeveridad = reportesAt
      .filter(at => at.incapacidades !== null && at.incapacidades !== 'null')
      .reduce((count, at) => {
        return count + JSON.parse(at.incapacidades).reduce((count2, incapacidad) => {
          return count2 + incapacidad.diasAusencia;
        }, 0);
      }, 0);
    }

    let totalHhtEmpresa = 0;
    let mesInicio = this.fechaInicioResumen.getMonth();
    let mesFinal = this.fechaFinalResumen.getMonth();
    totalHhtEmpresa = this.calcularTotalHht(hhtEmpresa, mesInicio, mesFinal, this.selectedDivisionResumen, false);
    let totalHHtTemporales = 0;
    totalHHtTemporales = this.calcularTotalHht(hhtTemp, mesInicio, mesFinal, this.selectedDivisionResumen, true);

    let IF = (accidentesConDiasPerdidos / (totalHhtEmpresa + totalHHtTemporales)) * 240000;
    let IS = (totalDiasSeveridad / (totalHhtEmpresa + totalHHtTemporales)) * 240000;
    let ILI = (IF * IS) / 1000;
    // console.log(accidentesConDiasPerdidos, totalHhtEmpresa, totalHHtTemporales, totalDiasSeveridad, IF, IS, ILI);
    this.ili = Number(ILI.toFixed(6));
    if(this.ili === Infinity){
      console.log('es infinito');
      this.ili = null;
      this.mensajeILI = 'Debe cargar horas hombre trabajadas.';
      this.colorIli = 'card l-bg-gray-dark';
      return;
    }

    if(this.ili<=this.metaIli){
      this.colorIli="card l-bg-green-dark"}
      else {this.colorIli="card l-bg-red-dark"}

  }
  calcularTotalHht(hht: Hht[], mesInicio: number, mesFinal: number, selectedDivisionResumen: string, flagTemporales: boolean): number{
    let totalHht = 0;
    if(mesInicio === mesFinal){
      hht.forEach(item => {
        if(item.mes === this.meses[mesInicio]){
          let dataHHT: DataHht = <DataHht>JSON.parse(item.valor).Data;
          totalHht += selectedDivisionResumen && selectedDivisionResumen !== 'Total' ?
          dataHHT.Areas.filter(data => data.id === this.divisionesCoronaConId.find(div => div.nombre === selectedDivisionResumen).id)[0].HhtArea
          : dataHHT.HhtMes;
        }
      });
    }else{
      hht.forEach(item => {
        let mesIndex = this.meses.findIndex(mes => item.mes === mes);
        if(mesIndex >= mesInicio && mesIndex <= mesFinal){
          let dataHHT: DataHht = <DataHht>JSON.parse(item.valor).Data;
          totalHht += selectedDivisionResumen && selectedDivisionResumen !== 'Total' ? 
          dataHHT.Areas.filter(data => data.id === this.divisionesCoronaConId.find(div => div.nombre === selectedDivisionResumen).id)[0].HhtArea
          : dataHHT.HhtMes;
        }
      });
    }
    return Number(totalHht);
  }


  IndicadoresAccidentalidad(){
    console.log('accidentalidad')
    this.paramNav.redirect('app/ind/accidentalidad');
  }

  //segunda grafica

  async dataSegundaGrafica(){
    this.date1 = new Date(new Date().getFullYear(), 0, 1);
    this.date2 = new Date();
    await this.caracterizacionViewService.findAllCAR().then(async (resp)=>{
      this.CaracterizacionView=resp
      this.CaracterizacionView.map(res1=>{
        res1.hora=Number(res1.hora.substr(0,2))
        res1.fechaaccidente=new Date(res1.fechaaccidente)
        res1.fechanacimientoempleado=new Date(res1.fechanacimientoempleado)
        res1.fechaingresoempleado=new Date(res1.fechaingresoempleado)
      });

      this.CardsClasificacion();
    })
  }
  CardsClasificacion(){

    this.CaracterizacionView1=this.CaracterizacionView

    if(this.date1 && !this.date2)
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
      return resp.fechaaccidente>=new Date(this.date1)
      })

    if(!this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      // date2=new Date(new Date(date2).setDate(new Date(date2).getDate()-1))
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente< date2;
        })
      }

    if(this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      this.CaracterizacionView1=this.CaracterizacionView.filter(resp=>{
        return resp.fechaaccidente<date2 && resp.fechaaccidente>=new Date(this.date1)
        })}

    this.ContLeve=0
    this.ContGrave=0
    this.ContSevero=0;
    this.ContMortal=0;

    this.CaracterizacionView1.forEach(element => {
      if(this.radioGra0==0){
        if(!this.selectArea)this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==1 && element.emptemporal!=null){
        if(!this.selectArea)this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==2 && element.emptemporal==null){
        if(!this.selectArea)this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }



    });
  }

  ContCardsClasificacion(element){
    switch (element.severidad) {
      case 'Leve':
        this.ContLeve=this.ContLeve+1;
        break;
      case 'Grave':
        this.ContGrave=this.ContGrave+1;
        break;
      case 'Severo':
        this.ContSevero=this.ContSevero+1;
        break;
      case 'Mortal':
        this.ContMortal=this.ContMortal+1;
        break;
      default:
        break;
    }

  }

  IndicadoresCaracterizacion(){
    console.log('Caracterización')
    this.paramNav.redirect('app/ind/indcaracterizacion');
  }

//Tercera grafica
  async dataTerceraGrafica(){
    this.fechaDesde0 = new Date(new Date().getFullYear(), 0, 1);
    this.fechaHasta0 = new Date();
    await this.cargarDatos()
    this.numeroCasos()
  }

  async cargarDatos(){
    // this.divisiones.forEach(resp=>{
    //   this.divisiones0.push({label:resp,value:resp})
    //   this.divisiones1.push({label:resp,value:resp})
    //   this.divisiones2.push(resp)
    //   this.divisiones3.push({label:resp,value:resp})
    // })
    // this.divisiones0.push({label:'Corona total',value:'Corona total'})
    // this.divisiones2.push('Corona total')
    await this.viewscmcoService.findByEmpresaId().then((resp:any)=>{
      this.datos=resp
    })

  }
  //Grafica cards
  datos:any[];
  numCasos:number=0;
  casosAbiertos:number=0;
  casosCerrados:number=0;
  datosNumeroCasos:any[];
  selecDiv0=null

  fechaDesde0:Date;
  fechaHasta0:Date;
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

  filtroDivisionMono(selecDiv:any,datos:any){
    let datos0=[]
    if(selecDiv){
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
  IndicadoresCasosMedicos(){
    console.log('CasosMedicos')
    this.paramNav.redirect('app/ind/indcasosmedicos');
  }
}
