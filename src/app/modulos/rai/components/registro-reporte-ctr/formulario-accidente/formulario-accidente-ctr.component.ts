import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Criteria, SortOrder } from 'app/modulos/core/entities/filter';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { interventorgestor } from 'app/modulos/ctr/entities/gestorinterventor';
import { Area } from 'app/modulos/empresa/entities/area';
import { AreaService } from 'app/modulos/empresa/services/area.service';
import { PlantasService } from 'app/modulos/ind/services/Plantas.service';
import { Peligro } from 'app/modulos/ipr/entities/peligro';
import { PeligroService } from 'app/modulos/ipr/services/peligro.service';
import { TipoPeligroService } from 'app/modulos/ipr/services/tipo-peligro.service';
import { Gestor } from 'app/modulos/rai/entities/gestor';
import { Reporte } from 'app/modulos/rai/entities/reporte';
// import { Router } from '@angular/router';
import { agente, jornada_trabajo, locale_es, lugar, mecanismo, parte_cuerpo, severidad, sitio, tipoAccidente, tipo_identificacion, tipo_lesion } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ReporteService } from 'app/modulos/rai/services/reporte.service';
import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion';
import { Desviacion } from 'app/modulos/sec/entities/desviacion';
import { DesviacionAliados } from 'app/modulos/sec/entities/desviacion-aliados';
import { Incapacidad } from 'app/modulos/sec/entities/factor-causal';
import { SistemaCausaInmediata } from 'app/modulos/sec/entities/sistema-causa-inmediata';
import { SistemaCausaRaiz } from 'app/modulos/sec/entities/sistema-causa-raiz';
import { AnalisisDesviacionService } from 'app/modulos/sec/services/analisis-desviacion.service';
import { DesviacionAliadosService } from 'app/modulos/sec/services/desviacion-aliados.service';
import { DesviacionService } from 'app/modulos/sec/services/desviacion.service';
import { SistemaCausaInmediataService } from 'app/modulos/sec/services/sistema-causa-inmediata.service';
import { SistemaCausaRaizService } from 'app/modulos/sec/services/sistema-causa-raiz.service';
import { ConfirmationService, MessageService, SelectItem, TreeNode } from 'primeng/primeng';

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
  reporteId: number = null;
  @Input('reporteId') set setReporteId(id: number){
    if (id) {
      this.reporteId = id;
      this.esNuevo = false;
    }
  }
  @Input() esConsulta: boolean;
  reporte: Reporte = new Reporte();
  analisisDesviacion: AnalisisDesviacion = new AnalisisDesviacion();
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
  formCausasInmediatas: FormGroup;
  formCausasRaiz: FormGroup;
  formPlanAccion: FormGroup;
  observaciones: string;
  selectedTipoPeligro: SelectItem = null;
  selectedPeligro: SelectItem = null;
  gestorData: Gestor = new Gestor();
  anioActual: number = new Date().getFullYear();
  incapacidades: Incapacidad[] = [];
  esNuevo: boolean = true;
  estadoEvento: string = null;
  idEmpresa = null;
  seguimiento: {
    estado: 'Aprobado' | 'Rechazado' | 'Sin gestión',
    fecha: Date
  } = null;

  fields: string[] = [
    'modulo',
    'hashId',
    'area_nombre',
    'concepto',
    'fechaReporte',
    'aspectoCausante',
    'analisisId',
    'criticidad',
    'nombre'
  ];
  estadoEventoList: {
    label: string;
    value: string;
  }[] = [
    {
      label: 'Objetado',
      value: 'Objetado'
    },
    {
      label: 'En firme',
      value: 'En firme'
    }
  ];
  areasPermiso: string;
  permisoSeguimiento: boolean;
  
  // Causas
  causaInmediataList: TreeNode[];
  causaInmediataSelect: any[] = [];
  causaBasicaList: TreeNode[];
  causaBasicaSelect: any[] = [];
  
  tipoIdentificacion: any[] = tipo_identificacion;
  locale: any = locale_es;
  flagSelectPlanta: boolean = false;
  analisisId: string;
  modulo: string = Modulo.SEC.value;

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
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private causaInmediataService: SistemaCausaInmediataService,
    private causaBasicaService: SistemaCausaRaizService,
    private reporteService: ReporteService,
    private desviacionService: DesviacionService,
    private analisisDeviacionService: AnalisisDesviacionService,
    private messageService: MessageService,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private desviacionAliadosService: DesviacionAliadosService
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
      ubicacion: new FormControl(null)
    });

    this.infAccidente = new FormGroup({
      fechaAccidente: new FormControl(null, Validators.required),
      horaAccidente: new FormControl(null, Validators.required),
      jornada: new FormControl(null, Validators.required),
      labores: new FormControl(null, Validators.required),
      horaInicioLabores: new FormControl(null, Validators.required),
      tipoAccidente: new FormControl(null, Validators.required),
      clasificacionEvento: new FormControl(null, Validators.required),
      lugarAccidente: new FormControl(null, Validators.required),
      sitioAccidente: new FormControl(null, Validators.required),
      tipoLesion: new FormControl(null, Validators.required),
      agenteAccidente: new FormControl(null, Validators.required),
      mecanismo: new FormControl(null, Validators.required),
      parteDelCuerpoAfectada: new FormControl(null, Validators.required),
      descripcionPreliminarAccidente: new FormControl(null, Validators.required)
    });

    this.formPlanAccion = new FormGroup({
      porcentajeAvance: new FormControl(null, Validators.required),
      fechaCierre: new FormControl(null, Validators.required),
      descripcionTarea: new FormControl(null, Validators.required)
    });

    this.reporte.tipo = 'ACCIDENTE';
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

  async ngOnInit() {

    // Còdigo necesario para leer los AnálisisDesciación
    this.areasPermiso = this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    let areasPermiso =this.areasPermiso.replace('{','');
    areasPermiso =areasPermiso.replace('}','');
    let areasPermiso2=areasPermiso.split(',');
    const filteredArea = areasPermiso2.filter(function(ele , pos){
      return areasPermiso2.indexOf(ele) == pos;
    })
    this.areasPermiso='{'+filteredArea.toString()+'}';

    this.permisoSeguimiento = (<Map<string, boolean>>this.sesionService.getPermisosMap())['RAI_PUT_REP_ALIADO_SEG'];

    let empresaId = this.sesionService.getEmpresa().idEmpresaAliada ?
    this.sesionService.getEmpresa().idEmpresaAliada : this.sesionService.getEmpresa().id;
    this.idEmpresa = this.sesionService.getEmpresa().idEmpresaAliada ? this.sesionService.getEmpresa().idEmpresaAliada : this.sesionService.getEmpresa().id;
    
    this.cargarTiposPeligro();
    this.cargarCausasInmediatas();
    this.cargarCausasBasicas();

    //Cargar información de accidente para modificar
    if (this.reporteId) {
      await this.cargarAccidente(this.reporteId)
      .then(() => {
        console.info('Accidente cargado');
      });
    }

    if(this.esConsulta){
      this.infPersonaAccidentada.disable();
      this.infAccidente.disable();
      this.formPlanAccion.disable();
    }
  }

  async cargarAccidente(reporteId: number){
    let filterQueryRep: FilterQuery = new FilterQuery();
    filterQueryRep.filterList = [
      {criteria: Criteria.EQUALS, field: 'id', value1: reporteId.toString()}
    ]
    await this.desviacionAliadosService.getRepWithFilter(filterQueryRep).then((res: any) => {
      let desviacionAliados: DesviacionAliados = res['data'][0];
      this.nombreEmpresa = desviacionAliados.razonSocial;
      this.nitEmpresa = desviacionAliados.nit;
      this.reporteService.find(desviacionAliados.id.toString()).then(res => {
        this.reporte = res[0];  
        this.infPersonaAccidentada.get('primerNombre').setValue(this.reporte.primerNombreEmpleado);
        this.infPersonaAccidentada.get('primerApellido').setValue(this.reporte.primerApellidoEmpleado);
        this.infPersonaAccidentada.get('segundoNombre').setValue(this.reporte.segundoNombreEmpleado);
        this.infPersonaAccidentada.get('segundoApellido').setValue(this.reporte.segundoApellidoEmpleado);
        this.infPersonaAccidentada.get('tipoIdentificacion').setValue(this.reporte.tipoIdentificacionEmpleado);
        this.infPersonaAccidentada.get('numeroIdentificacion').setValue(this.reporte.numeroIdentificacionEmpleado);
        this.infPersonaAccidentada.get('fechaNacimiento').setValue(new Date(this.reporte.fechaNacimientoEmpleado));
        this.infPersonaAccidentada.get('sexo').setValue(this.reporte.generoEmpleado);
        this.infPersonaAccidentada.get('fechaIngreso').setValue(new Date(this.reporte.fechaIngresoEmpleado));
        this.infPersonaAccidentada.get('cargo').setValue(this.reporte.cargoEmpleado);
        this.infPersonaAccidentada.get('jornada').setValue(this.reporte.jornadaHabitual);
        this.infPersonaAccidentada.get('ubicacion').setValue(this.reporte.areaAccidente);
        
        this.infAccidente.get('fechaAccidente').setValue(new Date(this.reporte.fechaAccidente));
        this.infAccidente.get('horaAccidente').setValue(new Date(this.reporte.horaAccidente));
        this.infAccidente.get('jornada').setValue(this.reporte.jornadaAccidente);
        this.infAccidente.get('labores').setValue(this.reporte.realizandoLaborHabitual);
        this.infAccidente.get('horaInicioLabores').setValue(new Date(this.reporte.horaInicioLabor));
        this.infAccidente.get('tipoAccidente').setValue(this.reporte.tipoAccidente);
        this.infAccidente.get('clasificacionEvento').setValue(this.reporte.severidad);
        this.infAccidente.get('lugarAccidente').setValue(this.reporte.lugarAccidente);
        this.infAccidente.get('sitioAccidente').setValue(this.reporte.sitio);
        this.infAccidente.get('tipoLesion').setValue(this.reporte.tipoLesion);
        this.infAccidente.get('agenteAccidente').setValue(this.reporte.agente);
        this.infAccidente.get('mecanismo').setValue(this.reporte.mecanismo);
        this.infAccidente.get('parteDelCuerpoAfectada').setValue(this.reporte.parteCuerpo);
        this.infAccidente.get('descripcionPreliminarAccidente').setValue(this.reporte.descripcion);
      });

      this.analisisDeviacionService.find(desviacionAliados.analisisDesviacionId.toString()).then(async (res: AnalisisDesviacion) => {
        this.analisisDesviacion = res;
        this.analisisId = this.analisisDesviacion.id;
        this.observaciones = this.analisisDesviacion.observacion;
        this.incapacidades = JSON.parse(this.analisisDesviacion.incapacidades);
        let complementaria: {
          Peligro: any,
          DescripcionPeligro: any,
          EventoArl: any
        } = JSON.parse(this.analisisDesviacion.complementaria);
        this.selectedTipoPeligro = complementaria.Peligro;
        await this.cargarPeligro(this.selectedTipoPeligro);
        this.selectedPeligro = complementaria.DescripcionPeligro;
        this.estadoEvento = complementaria.EventoArl;
        this.gestorData.gestor = JSON.parse(this.analisisDesviacion.gestor);
        let plan_accion: any = JSON.parse(this.analisisDesviacion.plan_accion);
        this.formPlanAccion.get('porcentajeAvance').setValue(plan_accion.porcentajeAvance);
        this.formPlanAccion.get('fechaCierre').setValue(new Date(plan_accion.fechaCierre));
        this.formPlanAccion.get('descripcionTarea').setValue(plan_accion.descripcionTarea);
        this.seguimiento = JSON.parse(this.analisisDesviacion.seguimiento);
        
        let idEmpresa = this.sesionService.getEmpresa().idEmpresaAliada ? this.sesionService.getEmpresa().idEmpresaAliada : this.sesionService.getEmpresa().id;
        await this.causaInmediataService.findDefault2(Number(idEmpresa))
          .then((src: SistemaCausaInmediata) => (
            this.causaInmediataList = this.buildTreeNode(
              src.causaInmediataList,
              null,
              "causaInmediataList",
              this.analisisDesviacion.causaInmediataList,
              this.causaInmediataSelect
            )
          ));
        this.onCausaInmediataSelected();
        await this.causaBasicaService.findDefault2(Number(idEmpresa))
          .then((src: SistemaCausaRaiz) => (
            this.causaBasicaList = this.buildTreeNode(
              src.causaRaizList,
              null,
              "causaRaizList",
              this.analisisDesviacion.causaRaizList,
              this.causaBasicaSelect
            )
          ));
        this.onCausaBasicaSelected();
        let observacion_causas: {
          formCausaRaiz: any;
          formCausaInmediata: any;
        } = JSON.parse(this.analisisDesviacion.observacion_causas);
        if(observacion_causas){
          if(observacion_causas.formCausaInmediata){
            this.formCausasInmediatas.setValue(observacion_causas.formCausaInmediata);
          }
          if(observacion_causas.formCausaRaiz){
            this.formCausasRaiz.setValue(observacion_causas.formCausaRaiz);
          }
        }
        this.documentosFurat = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadoFurat');
        this.documentosInvAt = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadoInvAt');
        
        this.documentosRepEps = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadoReporteEps');
        this.documentoEvidenciasPA = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadoEvidenciasPA');
        
        this.documentosNovedadSeg = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadosNovedadSeg');
        this.documentoOtros = this.analisisDesviacion.documentosList
        .filter(doc => doc.proceso === 'aliadoOtros');
        
        if(this.esConsulta){
          if(this.formCausasInmediatas) this.formCausasInmediatas.disable();
          if(this.formCausasRaiz) this.formCausasRaiz.disable();
        }
      });
    });
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
    let idEmpresa = this.sesionService.getEmpresa().idEmpresaAliada ? this.sesionService.getEmpresa().idEmpresaAliada : this.sesionService.getEmpresa().id;
    await this.causaInmediataService
    .findDefault2(Number(idEmpresa))
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
    let idEmpresa = this.sesionService.getEmpresa().idEmpresaAliada ? this.sesionService.getEmpresa().idEmpresaAliada : this.sesionService.getEmpresa().id;
    await this.causaBasicaService
    .findDefault2(Number(idEmpresa))
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

  buildList(list: any[]): any[] {
    if (list == null) {
        return null;
    }
    let crList: any[] = [];
    list.forEach((imp) => {
        let crEntity = { id: imp.id, nombre: imp.label };
        crList.push(crEntity);
    });
    return crList;
}

  onCausaInmediataSelected(){
    let formControls = {};
    let values = null;
    if(this.formCausasInmediatas) values = this.formCausasInmediatas.value; 
    this.causaInmediataSelect.forEach(ci => {
      formControls[ci.label] = new FormControl(null, Validators.required);
    });
    this.formCausasInmediatas = new FormGroup(formControls);
    if(values){
      let valuesAux = this.formCausasInmediatas.value;
      Object.keys(valuesAux).forEach(val => {
        valuesAux[val] = values[val] ? values[val] : null;
      });
      this.formCausasInmediatas.setValue(valuesAux);
    }
  }

  onCausaBasicaSelected(){
    let formControls = {};
    let values = null;
    if(this.formCausasRaiz) values = this.formCausasRaiz.value;
    this.causaBasicaSelect.forEach(cb => {
      formControls[cb.label] = new FormControl(null, Validators.required);
    });
    this.formCausasRaiz = new FormGroup(formControls);
    if(values){
      let valuesAux = this.formCausasRaiz.value;
      Object.keys(valuesAux).forEach(val => {
        valuesAux[val] = values[val] ? values[val] : null;
      });
      this.formCausasRaiz.setValue(valuesAux);
    }
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

  onGestorSelected(){}

  async submit(){

    //Almacenar datos del trabajador
    //   division: new FormControl(null, Validators.required),
    //   planta: new FormControl(null, Validators.required)
    this.reporte.identificacionEmpresa = this.nitEmpresa;
    this.reporte.razonSocial = this.nombreEmpresa;

    this.reporte.primerNombreEmpleado = this.infPersonaAccidentada.get('primerNombre').value;
    this.reporte.primerApellidoEmpleado = this.infPersonaAccidentada.get('primerApellido').value;
    this.reporte.segundoNombreEmpleado = this.infPersonaAccidentada.get('segundoNombre').value;
    this.reporte.segundoApellidoEmpleado = this.infPersonaAccidentada.get('segundoApellido').value;
    this.reporte.tipoIdentificacionEmpleado = this.infPersonaAccidentada.get('tipoIdentificacion').value;
    this.reporte.numeroIdentificacionEmpleado = this.infPersonaAccidentada.get('numeroIdentificacion').value;
    this.reporte.fechaNacimientoEmpleado = this.infPersonaAccidentada.get('fechaNacimiento').value;
    this.reporte.generoEmpleado = this.infPersonaAccidentada.get('sexo').value;
    this.reporte.fechaIngresoEmpleado = this.infPersonaAccidentada.get('fechaIngreso').value;
    this.reporte.cargoEmpleado = (this.infPersonaAccidentada.get('cargo').value).toUpperCase();
    this.reporte.jornadaHabitual = this.infPersonaAccidentada.get('jornada').value;
    this.reporte.areaAccidente = this.infPersonaAccidentada.get('ubicacion').value;

    // Almacenar datos del accidente
    this.reporte.fechaAccidente = this.infAccidente.get('fechaAccidente').value;
    this.reporte.horaAccidente = this.infAccidente.get('horaAccidente').value;
    this.reporte.jornadaAccidente = this.infAccidente.get('jornada').value;
    this.reporte.realizandoLaborHabitual = this.infAccidente.get('labores').value;
    this.reporte.horaInicioLabor = this.infAccidente.get('horaInicioLabores').value;
    this.reporte.tipoAccidente = this.infAccidente.get('tipoAccidente').value;
    this.reporte.severidad = this.infAccidente.get('clasificacionEvento').value;
    this.reporte.lugarAccidente = this.infAccidente.get('lugarAccidente').value;
    this.reporte.sitio = this.infAccidente.get('sitioAccidente').value;
    this.reporte.tipoLesion = this.infAccidente.get('tipoLesion').value;
    this.reporte.agente = this.infAccidente.get('agenteAccidente').value;
    this.reporte.mecanismo = this.infAccidente.get('mecanismo').value;
    this.reporte.parteCuerpo = this.infAccidente.get('parteDelCuerpoAfectada').value;
    this.reporte.descripcion = this.infAccidente.get('descripcionPreliminarAccidente').value;

    this.analisisDesviacion.incapacidades = JSON.stringify(this.incapacidades);
    let complementaria = {
      Peligro: this.selectedTipoPeligro,
      DescripcionPeligro: this.selectedPeligro,
      EventoArl: this.estadoEvento
    }
    this.analisisDesviacion.complementaria = JSON.stringify(complementaria);
    this.analisisDesviacion.gestor = JSON.stringify(this.gestorData.gestor);

    if(!this.esNuevo){
      if(this.seguimiento.estado === 'Rechazado'){
        await this.confirmationService.confirm({
          header: 'Reportar correcciones',
          message: 'Este reporte ha sido rechazado, ¿desea reportar que ha sido corregido?',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.seguimiento.estado = 'Sin gestión';
            this.seguimiento.fecha = null;
            this.analisisDesviacion.seguimiento = JSON.stringify(this.seguimiento);

            let documentos: Documento[] = this.documentosFurat
            .concat(this.documentosInvAt
              , this.documentosRepEps
              , this.documentoEvidenciasPA
              , this.documentosNovedadSeg
              , this.documentoOtros);

            this.analisisDesviacion.observacion_causas = JSON.stringify(
              {
                formCausaRaiz: this.formCausasRaiz ? this.formCausasRaiz.value : null,
                formCausaInmediata: this.formCausasInmediatas ? this.formCausasInmediatas.value : null
              }
            );
            this.analisisDesviacion.causaRaizList = this.buildList(this.causaBasicaSelect);
            this.analisisDesviacion.causaInmediataList = this.buildList(this.causaInmediataSelect);
            this.analisisDesviacion.plan_accion = JSON.stringify(this.formPlanAccion.value);
            this.analisisDesviacion.documentosList = documentos;

            this.reporteService.update(this.reporte).then(res => {
              this.analisisDeviacionService.update(this.analisisDesviacion).then(res => {
                this.messageService.add({severity: 'success', summary: 'Guardado', detail: 'Se guardó el reporte'});
              }).catch(err => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
                console.log('Error al guardar analisis desviación', err);
              });
            }).catch(err => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
              console.error('Error al actualizar reporte', err);
            });
          },
          reject: () => {
            this.analisisDesviacion.seguimiento = JSON.stringify(this.seguimiento);

            let documentos: Documento[] = this.documentosFurat
            .concat(this.documentosInvAt
              , this.documentosRepEps
              , this.documentoEvidenciasPA
              , this.documentosNovedadSeg
              , this.documentoOtros);

            this.analisisDesviacion.observacion_causas = JSON.stringify(
              {
                formCausaRaiz: this.formCausasRaiz ? this.formCausasRaiz.value : null,
                formCausaInmediata: this.formCausasInmediatas ? this.formCausasInmediatas.value : null
              }
            );
            this.analisisDesviacion.causaRaizList = this.buildList(this.causaBasicaSelect);
            this.analisisDesviacion.causaInmediataList = this.buildList(this.causaInmediataSelect);
            this.analisisDesviacion.plan_accion = JSON.stringify(this.formPlanAccion.value);
            this.analisisDesviacion.documentosList = documentos;

            this.reporteService.update(this.reporte).then(res => {
              this.analisisDeviacionService.update(this.analisisDesviacion).then(res => {
                this.messageService.add({severity: 'success', summary: 'Guardado', detail: 'Se guardó el reporte'});
              }).catch(err => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
                console.log('Error al guardar analisis desviación', err);
              });
            }).catch(err => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
              console.error('Error al actualizar reporte', err);
            });
          }
        });
      }else{
        this.analisisDesviacion.seguimiento = JSON.stringify(this.seguimiento);

        let documentos: Documento[] = this.documentosFurat
        .concat(this.documentosInvAt
          , this.documentosRepEps
          , this.documentoEvidenciasPA
          , this.documentosNovedadSeg
          , this.documentoOtros);

        this.analisisDesviacion.observacion_causas = JSON.stringify(
          {
            formCausaRaiz: this.formCausasRaiz ? this.formCausasRaiz.value : null,
            formCausaInmediata: this.formCausasInmediatas ? this.formCausasInmediatas.value : null
          }
        );
        this.analisisDesviacion.causaRaizList = this.buildList(this.causaBasicaSelect);
        this.analisisDesviacion.causaInmediataList = this.buildList(this.causaInmediataSelect);
        this.analisisDesviacion.plan_accion = JSON.stringify(this.formPlanAccion.value);
        this.analisisDesviacion.documentosList = documentos;

        this.reporteService.update(this.reporte).then(res => {
          this.analisisDeviacionService.update(this.analisisDesviacion).then(res => {
            this.messageService.add({severity: 'success', summary: 'Guardado', detail: 'Se guardó el reporte'});
          }).catch(err => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
            console.log('Error al guardar analisis desviación', err);
          });
        }).catch(err => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
          console.error('Error al actualizar reporte', err);
        });
      }
    }else{
      this.seguimiento = {
        estado: 'Sin gestión',
        fecha: null
      }
      this.analisisDesviacion.seguimiento = JSON.stringify(this.seguimiento);
      if(this.infoAccidenteIsValid()){
        // console.log(this.reporte);
        this.reporteService.create(this.reporte)
        .then((res: number) => {
          this.esNuevo = false;
          this.reporte.id = res;

          let filterQuery = new FilterQuery();
          filterQuery.fieldList = this.fields;
          filterQuery.filterList = [];
          filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
          filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "hashId", value1: 'RAI-'+res.toString() });
          this.desviacionService.findByFilter(filterQuery)
          .then(res2 => {
            this.analisisDesviacion.desviacionesList = res2['data'];
            
            this.analisisDeviacionService.create(this.analisisDesviacion)
            .then((res3: AnalisisDesviacion) => {
              this.analisisDesviacion.id = res3.id;
              this.analisisId = res3.id;
              this.analisisDeviacionService
              .sendGestoresEmail(
                this.reporte.id,
                Number(this.sesionService.getEmpresa().id),
                Number(this.analisisDesviacion.id))
                .then((res?: any) => {
                  this.messageService.add({severity: 'success', summary: 'Se envió correo a gestore e interventore.', detail: 'Se guardó el reporte'});
                  console.log('correo enviado');
                }).catch(err => {
                  this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo enviar correo a gestor e interventor.'});
                  console.error('Error al enviar correo');
                });
            }).catch(err => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar reporte'});
              console.error('Error al guardar Análisis Desviación', err);
            });
          });
        }).catch(err => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar el reporte'});
          console.error('Error al guardar reporte', err);
        });
      }
    }
  }

  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.messageService.add(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
          this.messageService.add({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }

  eliminarDocumento(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.directorioService.eliminarDocumento(doc.id).then(
          data => {
            switch (doc.proceso) {
              case 'aliadoFurat':
                this.documentosFurat = this.documentosFurat.filter(docF => docF.id !== doc.id);
                break;
              case 'aliadoInvAt':
                this.documentosInvAt = this.documentosInvAt.filter(docF => docF.id !== doc.id);
                break;
              case 'aliadoReporteEps':
                this.documentosRepEps = this.documentosRepEps.filter(docF => docF.id !== doc.id);
                break;
              case 'aliadoEvidenciasPA':
                this.documentoEvidenciasPA = this.documentoEvidenciasPA.filter(docF => docF.id !== doc.id);
                break;
              case 'aliadosNovedadSeg':
                this.documentosNovedadSeg = this.documentosNovedadSeg.filter(docF => docF.id !== doc.id);
                break;
              case 'aliadoOtros':
                this.documentoOtros = this.documentoOtros.filter(docF => docF.id !== doc.id);
                break;
            }
          }
        );
      }
    });
  }

  onClickSeguimientoReporte(aceptado: boolean){
    if (this.observaciones) {
      this.seguimiento.estado = aceptado ? 'Aprobado' : 'Rechazado';
      this.seguimiento.fecha = new Date();
      this.analisisDeviacionService.updateSeguimiento(Number(this.analisisDesviacion.id), JSON.stringify(this.seguimiento), this.observaciones)
      .then(res => {
        this.messageService.add({severity: 'success', summary: 'Actualizado', detail: 'Se guardó el estado.'})
      });
    }else{
      this.messageService.add({severity: 'error', summary: 'Falta información', detail: 'Debe agregar una observación'});
    }
  }

  infoAccidenteIsValid(): boolean {
    return this.infPersonaAccidentada.valid 
    && this.infAccidente.valid
    && this.incapacidades.length > 0
    && (this.selectedTipoPeligro ? true: false)
    && ((
      this.peligroList 
      && this.peligroList.length>0 
      && (this.selectedPeligro ? true : false)
      ) || (!this.peligroList))
    && (this.gestorData.gestor ? true : false);
  }

  infoInvestigacionIsValid(): boolean {
    return ((this.causaInmediataSelect && this.causaInmediataSelect.length > 0)
    || (this.causaBasicaSelect && this.causaBasicaSelect.length > 0))
    && (this.formCausasInmediatas && this.formCausasInmediatas.valid) 
    && (this.formCausasRaiz && this.formCausasRaiz.valid)
    && this.documentosFurat.length > 0 && this.documentosInvAt.length > 0
    && this.documentosRepEps.length > 0 && this.documentoEvidenciasPA.length > 0
    && this.documentosNovedadSeg.length > 0 && this.formPlanAccion.valid
    && (this.estadoEvento && this.estadoEvento.length > 0);
  }
}
