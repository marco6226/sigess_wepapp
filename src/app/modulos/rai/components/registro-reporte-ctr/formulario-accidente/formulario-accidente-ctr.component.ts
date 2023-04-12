import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { Criteria, SortOrder } from 'app/modulos/core/entities/filter';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { PlantasService } from 'app/modulos/ind/services/Plantas.service';
import { Peligro } from 'app/modulos/ipr/entities/peligro';
import { PeligroService } from 'app/modulos/ipr/services/peligro.service';
import { TipoPeligroService } from 'app/modulos/ipr/services/tipo-peligro.service';
// import { Router } from '@angular/router';
import { agente, jornada_trabajo, locale_es, lugar, mecanismo, parte_cuerpo, severidad, sitio, tipoAccidente, tipo_identificacion, tipo_lesion } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { SistemaCausaInmediata } from 'app/modulos/sec/entities/sistema-causa-inmediata';
import { SistemaCausaRaiz } from 'app/modulos/sec/entities/sistema-causa-raiz';
import { SistemaCausaInmediataService } from 'app/modulos/sec/services/sistema-causa-inmediata.service';
import { SistemaCausaRaizService } from 'app/modulos/sec/services/sistema-causa-raiz.service';
import { SelectItem, TreeNode } from 'primeng/primeng';

@Component({
  selector: 'app-formulario-accidente-ctr',
  templateUrl: './formulario-accidente-ctr.component.html',
  styleUrls: ['./formulario-accidente-ctr.component.scss'],
  providers: [PeligroService, SistemaCausaInmediataService, SistemaCausaRaizService]
})
export class FormularioAccidenteCtrComponent implements OnInit {

  consultar: boolean = false;
  modificar: boolean = false;
  @Input('nombreEmpresa') nombreEmpresa: string | null;
  @Input('nitEmpresa') nitEmpresa: string | null;
  jornadaTrabajoList: SelectItem[] = null;
  divisionList: SelectItem[] = null;
  plantaList: SelectItem[] = null;
  clasificacionEventoList: SelectItem[] = null;
  plantaListAux: any[] = null;
  tipoAccidenteList: SelectItem[] = null;
  lugarList: SelectItem[] = null;
  sitioList: SelectItem[] = null;
  tipoLesionList: SelectItem[] = null;
  agenteList: SelectItem[] = null;
  mecanismoList: SelectItem[] = null;
  parteCuerpoList: SelectItem[] = null;
  tipoPeligroList: SelectItem[] = null;
  peligroList: SelectItem[] = null;
  infPersonaAccidentada: FormGroup;
  infAccidente: FormGroup;
  selectedTipoPeligro: SelectItem = null;
  selectedPeligro: SelectItem = null;
  causaInmediataList: TreeNode[];
  causaInmediataSelect: TreeNode[] = [];
  causaBasicaList: TreeNode[];
  causaBasicaSelect: TreeNode[];
  tipoIdentificacion: any[] = tipo_identificacion;
  locale: any = locale_es;
  flagSelectPlanta: boolean = false;
  analisisId: string;
  modulo: string = Modulo.EMPRESA.value;

  //Dialogs
  showDialogFurat: boolean = false;
  showDialogInvAt: boolean = false;
  showDialogReporteEps: boolean = false;
  showDialogEvidenciasPA: boolean = false;
  showDialogNovedadSeg: boolean = false;
  showDialogOtros: boolean = false;

  //documentos
  documentosFurat: Documento[] = [];
  documentosInvAt: Documento[] = [];
  documentosRepEps: Documento[] = [];
  documentoEvidenciasPA: Documento[] = [];
  documentosNovedadSeg: Documento[] = [];
  documentoOtros: Documento[] = [];

  constructor(
    private sesionService: SesionService,
    private areaService: AreaService,
    private plantaService: PlantasService,
    private sessionService: SesionService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private causaInmediataService: SistemaCausaInmediataService,
    private causaBasicaService: SistemaCausaRaizService
  ) {
    this.infPersonaAccidentada = new FormGroup({
      primerNombre: new FormControl(null, Validators.required),
      primerApellido: new FormControl(null, Validators.required),
      segundoNombre: new FormControl(null),
      segundoApellido: new FormControl(null),
      tipoIdentificacion: new FormControl(null, Validators.required),
      numeroIdentificacion: new FormControl(null, Validators.required),
      fechaNacimiento: new FormControl(null, Validators.required),
      sexo: new FormControl(null, Validators.required),
      fechaIngreso: new FormControl(null, Validators.required),
      cargo: new FormControl(null, Validators.required),
      jornada: new FormControl(null, Validators.required),
      ubicacion: new FormControl(null),
      division: new FormControl(null, Validators.required),
      planta: new FormControl(null, Validators.required)
    });

    this.infAccidente = new FormGroup({
      fechaAccidente: new FormControl(null),
      horaAccidente: new FormControl(null),
      jornada: new FormControl(null),
      labores: new FormControl(null),
      horaInicioLabores: new FormControl(null),
      tipoAccidente: new FormControl(null),
      clasificacionEvento: new FormControl(null),
      lugarAccidente: new FormControl(null),
      sitioAccidente: new FormControl(null),
      tipoLesion: new FormControl(null),
      agenteAccidente: new FormControl(null),
      mecanismo: new FormControl(null),
      parteDelCuerpoAfectada: new FormControl(null),
      descripcionPreliminarAccidente: new FormControl(null, Validators.required)
    });


    this.jornadaTrabajoList = <SelectItem[]>jornada_trabajo;
    this.tipoAccidenteList = <SelectItem[]>tipoAccidente;
    this.clasificacionEventoList = <SelectItem[]>severidad;
    this.lugarList = <SelectItem[]>lugar;
    this.sitioList = <SelectItem[]>sitio;
    this.tipoLesionList = <SelectItem[]>tipo_lesion;
    this.agenteList = <SelectItem[]>agente;
    this.mecanismoList = <SelectItem[]>mecanismo;
    this.parteCuerpoList = <SelectItem[]>parte_cuerpo;
  }

  ngOnInit() {
    // Llena la lista de divisiones
    let areafiltQuery = new FilterQuery();
    areafiltQuery.sortOrder = SortOrder.ASC;
    areafiltQuery.sortField = "nombre";
    areafiltQuery.fieldList = ["nombre", "id"];
    areafiltQuery.filterList = [
      { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.areaService.findByFilter(areafiltQuery)
    .then((res: any) => {
      this.divisionList = [];
      res.data.forEach(element => {
        this.divisionList.push({label: element.nombre, value: element.id});
      });
    }).catch(err => {
      console.error('Error al obtener areas: ', err);
    });

    // Llena la lista de plantas
    let empresaId = this.sessionService.getEmpresa().idEmpresaAliada;
    this.plantaService.getPlantasByEmpresaId(empresaId)
    .then((res: any) => {
      this.plantaListAux = res;
    }).catch(err => {
      console.error('Error al obtener plantas: ', err);
    });

    this.analisisId = empresaId.toString();
    this.cargarTiposPeligro();
    this.cargarCausasInmediatas();
    this.cargarCausasBasicas();
  }

  cargarListaPlantas(divisionValue: number){
    this.plantaList = [];
    this.infPersonaAccidentada.get('planta').setValue(null);
    if (divisionValue) {
      this.plantaListAux.forEach(element => {
        console.log(element);
        if (Number(element.id_division) === divisionValue) {
          this.plantaList.push({label: element.nombre, value: element.id});
        }
      });
      
      if(this.plantaList.length < 1){
        this.flagSelectPlanta = false;
        this.infPersonaAccidentada.get('planta').clearValidators();
      }else{
        this.flagSelectPlanta = true;
        this.infPersonaAccidentada.get('planta').setValidators(Validators.required);
      }
    }
  }

  async cargarTiposPeligro(){
    await this.tipoPeligroService.getForEmpresa().then((resp:any)=>{
      let tipoPeligroItemList=[];
      
      this.tipoPeligroList = [];
      resp.forEach(
        data => tipoPeligroItemList.push({ label: data[2], value: data[0] })
      );

      tipoPeligroItemList=this.order(tipoPeligroItemList);
      tipoPeligroItemList.forEach(resp=>{
        this.tipoPeligroList.push(resp);
      });
    })
  }

  async cargarPeligro(idtp) {
    let peligroItemList = [];
    this.selectedPeligro = null;
    if(idtp != null){
      let filter = new FilterQuery();
      filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp }];
      await this.peligroService.findByFilter(filter).then(
        resp => {
          this.peligroList = [];
          (<Peligro[]>resp).forEach(
            data => {
              peligroItemList.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
            }
          )
          peligroItemList=this.order(peligroItemList)
          peligroItemList.forEach(resp=>{
            this.peligroList.push(resp)
          })
        }
      );
    }else{
      this.peligroList = [];
    }
  }

  order(ele){
    ele.sort(function (a, b) {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });
    return ele;
  }

  async cargarCausasInmediatas(){
    await this.causaInmediataService
    .findDefault2(this.sesionService.getEmpresa().idEmpresaAliada)
    .then((res: SistemaCausaInmediata) => {
      this.causaInmediataList = this.buildTreeNode(
        res.causaInmediataList,
        null,
        "causaInmediataList"
      );
    })
    .catch(err => {
      console.error('error al obtener causas inmediatas', err);
    });
  }

  async cargarCausasBasicas(){
    await this.causaBasicaService
    .findDefault2(this.sesionService.getEmpresa().idEmpresaAliada)
    .then((res: SistemaCausaRaiz) => {
      this.causaBasicaList = this.buildTreeNode(
        res.causaRaizList,
        null,
        "causaRaizList"
      );
    })
    .catch(err => {
      console.error('error al obtener causas básicas', err);
    });
  }

  buildTreeNode(list: any[], parentNode: any, listField: string, causasList?: any[], causasSelectList?: any[]): any {
    let treeNodeList: TreeNode[] = [];
    list.forEach((ci) => {
        let node: any = {
            id: ci.id,
            label: ci.nombre,
            selectable: !this.consultar,
            parent: parentNode,
        };
        if (ci[listField] == null || ci[listField].length == 0) {
            node.children = null;
        } else {
            node.children = this.buildTreeNode(
                ci[listField],
                node,
                listField,
                causasList,
                causasSelectList
            );
        }
        if (causasList != null) {
            this.adicionarSelect(node, causasList, causasSelectList);
        }
        treeNodeList.push(node);
    });
    return treeNodeList;
  }

  adicionarSelect(node: any, list: any[], listselec: any[]) {
    if (list == null) {
        return;
    }
    for (let i = 0; i < list.length; i++) {
        let itemAnalisis = list[i];
        if (itemAnalisis.id === node.id) {
            this.expandParent(node);
            listselec.push(node);
            return;
        }
    }
  }

  expandParent(node: any) {
    if (node.parent != null) {
        this.expandParent(node.parent);
    }
    node.expanded = true;
  }

  onCausaInmediataSelected(){
  }

  onCausaBasicaSelected(){
  }

  showDialog(dialogName: string){
    switch(dialogName){
      case 'furat':
        this.showDialogFurat = true;
        break;
      case 'invAt':
        this.showDialogInvAt = true;
        break;
      case 'reporteEps':
        this.showDialogReporteEps = true;
        break;
      case 'evidenciasPA':
        this.showDialogEvidenciasPA = true;
        break;
      case 'novedadSeg':
        this.showDialogNovedadSeg = true;
        break;
      case 'otros':
        this.showDialogOtros = true;
        break;
      default:
        console.error('El dialog proporcionado no existe');
        break;
    }
  }

  onUpload(event: Directorio, tipo: string){
    switch(tipo){
      case 'furat':
        this.documentosFurat.push(event.documento);
        this.documentosFurat = this.documentosFurat.slice();
        break;
      case 'invAt':
        this.documentosInvAt.push(event.documento);
        this.documentosInvAt = this.documentosInvAt.slice();
        break;
      case 'reporteEps':
        this.documentosRepEps.push(event.documento);
        this.documentosRepEps = this.documentosRepEps.slice();
        break;
      case 'evidenciasPA':
        this.documentoEvidenciasPA.push(event.documento);
        this.documentoEvidenciasPA = this.documentoEvidenciasPA.slice();
        break;
      case 'novedadSeg':
        this.documentosNovedadSeg.push(event.documento);
        this.documentosNovedadSeg = this.documentosNovedadSeg.slice();
        break;
      case 'otros':
        this.documentoOtros.push(event.documento);
        this.documentoOtros = this.documentoOtros.slice();
        break;
      default:
        console.error('El tipo proporcionado no existe');
        break;
    }
  }

}
