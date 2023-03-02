import { Component, OnInit } from '@angular/core';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { SelectItem } from 'primeng/primeng';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { SortOrder } from "app/modulos/core/entities/filter";
import { Criteria } from "../../../core/entities/filter";
//import { TipoAreaService } from './services/tipo-area.service';
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
export class HorahombrestrabajadaComponent implements OnInit {
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
  dataHHT:any[] = null;
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
    await this.initFormHHT();
    await this.loadDataHHT();
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
        return this.esNuevoRegistro = true;
      }
      this.esNuevoRegistro = false;
      console.log(res);
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
    console.log(this.dataHHT);
  }

  getPlantasByArea(id: any): Plantas[]{
    return this.plantasList.filter(pl => pl.id_division == id).length > 0 ? this.plantasList.filter(pl => pl.id_division == id): null;
  }

  tienePlantas(areaId: any){
    return this.plantasList.find(planta => planta.id_division == areaId) == undefined ? false : true;
  }

  async guardarHht(){
    await this.meses.forEach((mes, index) => {
      let hht = new Hht();
      hht.id = null;
      hht.anio = this.anioSelected['value'];
      hht.empresaSelect = this.empresaSelected;
      hht.mes = mes.value; 
      // let data = this.dataHHT.filter(data => data.id === index);
      hht.valor = JSON.stringify({
        ILI_Anual: this.metaAnualILI,
        ILI_Mensual: this.metaMensualILI,
        Data: this.dataHHT[index]
      });
      // console.info(hht);
      this.hhtService.create(hht).then(() => {
        console.info('HHT creado para el mes de: ', `${mes.value} de ${this.anioSelected['value']}`);
      });
    });
    this.esNuevoRegistro = false;
  }
}
