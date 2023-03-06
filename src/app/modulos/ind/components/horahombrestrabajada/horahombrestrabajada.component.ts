import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { SortOrder } from "app/modulos/core/entities/filter";
import { Criteria } from "../../../core/entities/filter";
import { HhtService } from 'app/modulos/empresa/services/hht.service'
import { DataArea, DataHht, DataPlanta, Hht } from "../../../empresa/entities/hht";
import { PlantasService } from '../../services/Plantas.service';
import { Plantas } from '../../entities/Plantas';


@Component({
  selector: 'app-horahombrestrabajada',
  templateUrl: './horahombrestrabajada.component.html',
  styleUrls: ['./horahombrestrabajada.component.scss'],
  providers: [HhtService, PlantasService]
})
export class HorahombrestrabajadaComponent implements OnInit, AfterViewInit {
  fechaActual = new Date();
  areaList: Area[] = null;
  plantasList: Plantas[] = null;
  dateValue= new Date();
  añoPrimero:number=2015;
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);
  yearRange = new Array();
  anioSelected: number;
  empresaSelected: string;
  mostrarForm: boolean = false;
  guardarFlag:boolean=true;
  dataHHT:DataHht[] = null;
  listaHHT: Hht[] = [];
  metaAnualILI: number = null;
  metaMensualILI: number = null;
  mostrarBotones: boolean = false;
  esNuevoRegistro: boolean = true;
  meses: Array<any> = [
    {label: 'Enero', value: 'Enero'},
    {label: 'Febrero', value: 'Febrero'},
    {label: 'Marzo', value: 'Marzo'},
    {label: 'Abril', value: 'Abril'},
    {label: 'Mayo', value: 'Mayo'},
    {label: 'Junio', value: 'Junio'},
    {label: 'Julio', value: 'Julio'},
    {label: 'Agosto', value: 'Agosto'},
    {label: 'Septiembre', value: 'Septiembre'},
    {label: 'Octubre', value: 'Octubre'},
    {label: 'Noviembre', value: 'Noviembre'},
    {label: 'Diciembre', value: 'Diciembre'}
  ];
  Empresas= [
    {label: 'Corona', value: '22'},
    {label: 'Temporal uno', value: '12341'},
    {label: 'Temporal dos', value: '12342'},
    {label: 'Temporal tres', value: '12343'},
  ];
  // @ViewChildren('acordionTab') childListaMeses: QueryList <any>;

  constructor(
    private areaService: AreaService,
    private hhtService: HhtService,
    private plantasService: PlantasService,
  ) { }

  async ngOnInit() {
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
  }

  ngAfterViewInit(): void {
    // this.childListaMeses.changes.subscribe((t) => {
    //   console.log(t);
    // });
  }

  async getAreas(){
    let areafiltQuery = new FilterQuery();
    areafiltQuery.sortOrder = SortOrder.ASC;
    areafiltQuery.sortField = "nombre";
    areafiltQuery.fieldList = ["id", "nombre","nivel"];
    areafiltQuery.filterList = [
      { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    await this.areaService.findByFilter(areafiltQuery).then(
      resp => {
        this.areaList = <Area[]>resp['data'];
      }
    );
  }

  async getPlantas(empresaId: number){
    await this.plantasService.getPlantasByEmpresaId(empresaId)
      .then((res) => {
        this.plantasList = <Plantas[]>res;
      }).catch(err => {
        this.plantasList = [];
        console.error('Sin plantas: ',err);
      })
  }

  onSelectAnio(event: number){
    this.anioSelected = event;
    if(this.empresaSelected && this.anioSelected) this.loadForm();
  }

  onSelectEmpresa(event: any){
    this.empresaSelected = event.value;
    if(this.empresaSelected && this.anioSelected) this.loadForm();
  }

  async loadForm(){
    this.mostrarForm = false;
    this.mostrarBotones = false;
    await this.getAreas().then();
    await this.getPlantas(Number(this.empresaSelected)).then();
    await this.initFormHHT().then();
    await this.loadDataHHT().then();
    this.mostrarForm = true;
    this.mostrarBotones = true;
  }

  async loadDataHHT(){
    let idhttquery = new FilterQuery();
    idhttquery.sortOrder = SortOrder.DESC;
    idhttquery.sortField = "id";
    idhttquery.filterList = [
      {criteria: Criteria.EQUALS, field: 'anio', value1: this.anioSelected['value']},
      {criteria: Criteria.EQUALS, field: 'empresaSelect', value1: this.empresaSelected}
    ];
    
    this.hhtService.findByFilter(idhttquery)
    .then((res) => {
      if(res['data'].length == 0){
        this.metaAnualILI = null;
        this.metaMensualILI = null;
        return this.esNuevoRegistro = true;
      }
      this.listaHHT = res['data'].map(hht => hht);
      this.loadDataOnForm();

      this.esNuevoRegistro = false;
    });
  }

  async loadDataOnForm(){
    this.meses.forEach((mes, index) => {
      let hht = this.listaHHT.filter(hht => hht.mes === mes.value)[0];
      let data = <DataHht>JSON.parse(hht.valor).Data;
      this.metaAnualILI = JSON.parse(hht.valor).ILI_Anual;
      this.metaMensualILI = JSON.parse(hht.valor).ILI_Mensual;
      this.dataHHT[index] ={
        id: Number(hht.id),
        mes: mes.value,
        HhtMes: data.HhtMes,
        NumPersonasMes: data.NumPersonasMes,
        Areas: data.Areas
      }
    });
  }

  async initFormHHT(){
    this.dataHHT = [];
    this.meses.forEach((mes, index) => {
      this.dataHHT.push({
        id: index,
        mes: mes.value,
        NumPersonasMes: null,
        HhtMes: null,
        Areas: this.areaList.map((area):DataArea => {
          return {
            id: Number(area.id),
            NumPersonasArea: null,
            HhtArea: null,
            Plantas: this.plantasList.filter(pl => pl.id_division == area.id).map((planta):DataPlanta => {
              return {
                id: planta.id,
                NumPersonasPlanta: null,
                HhtPlanta: null,
              }
            })
          }
        })
      });
    });
  }

  getPlantasByArea(id: any){
    let plantas = this.plantasList.filter(pl => pl.id_division == id);
    return plantas.length > 0 ? plantas: null;
  }

  tienePlantas(areaId: any){
    return this.plantasList.find(planta => planta.id_division == areaId) == undefined ? false : true;
  }

  async guardarHht(){
    let flagListHHT = false;
    if(this.listaHHT.length === 0) flagListHHT = true;
    await this.meses.forEach((mes, index) => {
      
      let hht = new Hht();
      hht.id = null;
      hht.anio = this.anioSelected['value'];
      hht.empresaSelect = this.empresaSelected;
      hht.mes = mes.value; 
      hht.valor = JSON.stringify({
        ILI_Anual: this.metaAnualILI,
        ILI_Mensual: this.metaMensualILI,
        Data: this.dataHHT[index]
      });

      if(flagListHHT){
        this.listaHHT.push(hht);
      }
      
      this.hhtService.create(hht).then(() => {
        console.info('HHT creado para el mes de: ', `${mes.value} de ${this.anioSelected['value']}`);
      });
    });
    this.loadDataHHT();
    this.esNuevoRegistro = false;
  }

  async actualizarHht(){
    await this.meses.forEach((mes, index) => {
      let HHT = new Hht();
      let localHHT = this.listaHHT.filter(hht => hht.mes == mes.value)[0];
      HHT.id = localHHT.id;
      HHT.mes = localHHT.mes;
      HHT.anio = localHHT.anio;
      HHT.empresaSelect = localHHT.empresaSelect;
      HHT.valor = JSON.stringify({
        ILI_Anual: this.metaAnualILI,
        ILI_Mensual: this.metaMensualILI,
        Data: this.dataHHT.filter(hht => hht.mes == mes.value)[0]
      })
      
      this.hhtService.update(HHT).then(() => {
        console.info(`HHT actualizado para el mes de : ${mes.value} de ${HHT.anio}`);
      }).catch((err) => {
        console.error(`Error al actualizar HHT del mes de ${mes.value} de ${HHT.anio}`, err);
      });
    });
  }

}
