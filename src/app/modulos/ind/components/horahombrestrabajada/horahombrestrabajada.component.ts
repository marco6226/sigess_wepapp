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
import { MessageService } from 'primeng/primeng';
import { Observable, Observer } from 'rxjs';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';


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
  Empresas: Array<any> = [
    // {label: 'Corona', value: '22'},
    // {label: 'Temporal uno', value: '12341'},
    // {label: 'Temporal dos', value: '12342'},
    // {label: 'Temporal tres', value: '12343'},
  ];
  // @ViewChildren('acordionTab') childListaMeses: QueryList <any>;
  cargando: boolean = false;

  constructor(
    private areaService: AreaService,
    private hhtService: HhtService,
    private plantasService: PlantasService,
    private messageService: MessageService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
  ) { }

  async ngOnInit() {
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    let empresa: Empresa = this.sessionService.getEmpresa();
    if(empresa.idEmpresaAliada == null){
      this.Empresas = [];
      this.Empresas.push({label: empresa.razonSocial, value: empresa.id})
      this.empresaService.getTemporalesByEmpresa(empresa.idEmpresaAliada == null ? Number(empresa.id) : empresa.idEmpresaAliada)
      .then((res: Empresa[]) => {
        res.forEach(emp => {
          this.Empresas.push({label: emp.razonSocial, value: emp.id});
        });
      })
    }else{
      this.Empresas = [];
      this.Empresas.push({label: empresa.razonSocial, value: empresa.id});
    }

    
    await this.getAreas().then();
    await this.getPlantas(empresa.idEmpresaAliada == null ? Number(empresa.id) : empresa.idEmpresaAliada).then();
  }

  ngAfterViewInit(): void {
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
    this.cargando = true;
    await this.loadDataHHT().then();
    if(this.esNuevoRegistro){
      await this.initFormHHT().then();
    }
    this.mostrarForm = true;
    this.mostrarBotones = true;
    setTimeout(() => {
      this.cargando = false
    }, 2000);
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
      // let totalHombres = 0;
      // let totalHHT = 0;
      // data.Areas.forEach(area => {
      //   if(area.Plantas.length > 0){
      //     totalHombres += area.Plantas.reduce((count, planta) => {
      //       return count + planta.NumPersonasPlanta;
      //     }, 0);
      //     totalHHT += area.Plantas.reduce((count, planta) => {
      //       return count + planta.HhtPlanta;
      //     }, 0);
      //   }else{
      //     totalHombres += area.NumPersonasArea;
      //     totalHHT += area.HhtArea;
      //   }
      // });
      this.dataHHT[index] ={
        id: Number(hht.id),
        mes: mes.value,
        HhtMes: data.HhtMes,
        NumPersonasMes: data.NumPersonasMes,
        Areas: data.Areas
      }
      data.Areas.forEach((area, indexAr) => {
        if(area.Plantas.length > 0){
          this.calcularTotalesPorArea(index, indexAr);
        }
      });
      
      this.calcularTotalesMes(index);
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
            ILIArea: null,
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

  getPlantasByArea(id: any): Plantas[]{
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
    setTimeout(() => {
      this.loadDataHHT();
    }, 2000);
    this.messageService.add({key: 'hht', severity: 'success', detail: 'Registro HHT guardado', summary: 'Guardado', life: 6000});
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
    setTimeout(() => {
      this.loadDataHHT().then();
    }, 2000);
    this.messageService.add({key: 'hht', severity: 'warn', summary: 'Actualizado', detail: 'Registro HHT actualizado', life: 6000});
  }

  calcularTotalesMes(mesIndex: number){
    let totalPersonas = 0;
    let totalHHT = 0;
    
    this.dataHHT[mesIndex].Areas
    .forEach((area, index) => {
      totalPersonas += area.NumPersonasArea == null ? 0 : area.NumPersonasArea;
      totalHHT += area.HhtArea == null ? 0 : area.HhtArea;
    });

    this.dataHHT[mesIndex].NumPersonasMes = totalPersonas;
    this.dataHHT[mesIndex].HhtMes = totalHHT;
  }

  calcularTotalesPorArea(mesIndex:number, areaIndex: number){
    // console.log(mesIndex, areaIndex);
    let totalPersonas = 0;
    let totalHHT = 0;
    this.dataHHT[mesIndex].Areas[areaIndex].Plantas
    .forEach((planta, index) => {
      // console.log(totalPersonas, planta.NumPersonasPlanta);
      totalPersonas += planta.NumPersonasPlanta == null ? 0 : planta.NumPersonasPlanta;
      totalHHT += planta.HhtPlanta == null ? 0 : planta.HhtPlanta;
    });
    // console.log(totalPersonas, totalHHT);
    this.dataHHT[mesIndex].Areas[areaIndex].NumPersonasArea = totalPersonas;
    this.dataHHT[mesIndex].Areas[areaIndex].HhtArea = totalHHT;
    this.calcularTotalesMes(mesIndex);
  }

}
