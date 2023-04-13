import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { FilterQuery } from './../../../core/entities/filter-query';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';
import { EmpresaService } from './../../../empresa/services/empresa.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input,Output } from '@angular/core';
import { AliadoInformacion } from '../../entities/aliados';
import { ComunService } from 'app/modulos/comun/services/comun.service';
import { MessageService } from 'primeng/primeng';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Usuario } from './../../../empresa/entities/usuario';
import { UsuarioEmpresa } from './../../../empresa/entities/usuario-empresa';
import { Perfil } from './../../../empresa/entities/perfil';
import { Empleado } from 'app/modulos/empresa/entities/empleado';

@Component({
  selector: 'app-aliados-actualizar',
  templateUrl: './aliados-actualizar.component.html',
  styleUrls: ['./aliados-actualizar.component.scss'],
  providers: [MessageService]
})
export class AliadosActualizarComponent implements OnInit {
  idUsuarioAliado?:any;
  id: number = -1;
  idEmpresa?:string;
  idEmpresaAliada: number | null;
  aliado: Empresa={
    id: '',
    nombreComercial: '',
    razonSocial: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    numeroSedes: undefined,
    arl: null,
    ciiu: null,
    logo: '',
    tipo_persona: null,
    empresasContratistasList: [],
    estado:'',
    calificacion:''
  };

  aliadoInformacion: AliadoInformacion={
    // id: 0,
    id_empresa: 0,
    actividad_contratada: null,
    division: null,
    localidad: null,
    calificacion: null,
    colider: null,
    documentos: null,
    representante_legal: '',
    numero_trabajadores: 0,
    numero_trabajadores_asignados: 0,
    fecha_vencimiento_arl: null,
    fecha_vencimiento_sst: null,
    fecha_vencimiento_cert_ext: null,
    control_riesgo: null,
    email_comercial: null,
    telefono_contacto: null,
    puntaje_arl: null,
    calificacion_aliado: 0,
    fecha_calificacion_aliado: null,
    nombre_calificador: '',
    arl: null,
    autoriza_subcontratacion: null,
    istemporal:null,
    permitirReportes:null
  }

  documentos: Directorio[]=[]
  onEdit: string = '';
  auxAutorizaSubcontratacion: boolean;
  auxIsTemporal: boolean;
  impactoV:string='';

  tabIndex:number=0;

  flagPress: boolean=false;
  
  flagValid:boolean=false;

  flagConsult:boolean=false;

  teamSstIsComplete: boolean = false;

  constructor(
    private rutaActiva: ActivatedRoute,
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService,
    private sesionService: SesionService,
  ) {}
  
  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params.id;
    this.onEdit = this.rutaActiva.snapshot.params.onEdit;
    this.flagConsult=this.onEdit=='consultar'?true:false
    this.loadData().then();
  }

  async loadData(){
    console.log("--------------load data------------");
    let empresa: Empresa = this.sesionService.getEmpresa();
    this.idEmpresa = empresa.id;
    this.idEmpresaAliada = empresa.idEmpresaAliada;
    // console.log(this.idEmpresa)
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtro = new Filter();
    filtro.criteria = Criteria.EQUALS;
    filtro.field = 'id';
    filtro.value1 = this.id.toString();

    filterQuery.filterList.push(filtro);
    await this.empresaService.findByFilter(filterQuery).then(
        resp => {
          // console.log(resp);
          resp['data'].forEach(async element => {

            
            this.aliado = element;
            console.log(this.aliado.email)

          });
        }
    );

    this.loadInformacionAliado();
  }

  async loadInformacionAliado(){
    console.log(this.id)
    this.aliadoInformacion.id_empresa = this.id;
    await this.empresaService.getAliadoInformacion(this.id).then((ele: AliadoInformacion[])=>{
      if(ele[0] != undefined){
        console.log(ele[0])
        this.aliadoInformacion = ele[0];
      }      
    });
    this.auxAutorizaSubcontratacion = this.aliadoInformacion.autoriza_subcontratacion;
    this.auxIsTemporal=this.aliadoInformacion.istemporal;

    await this.loadDocumentos()

    // await this.saveInformacionAliado();
    if(this.aliadoInformacion.id == null){
      // this.loadInformacionAliado();
      this.messageService.add({key: 'msgActualizarAliado', severity:'error', summary: 'Error', detail: 'No se pudo leer información del aliado'});
    }
  }

  async saveInformacionAliado(){
    await this.empresaService.saveAliadoInformacion(this.aliadoInformacion).then((ele)=>{      
      console.log('saveInformacionAliado');
    });
  }

  loadDocumentos(){
    if(this.aliadoInformacion.documentos){
      JSON.parse(this.aliadoInformacion.documentos).forEach(async element => {
        await this.directorioService.buscarDocumentosById(element).then((elem: Directorio)=>{
          // console.log(elem);      
          this.documentos.push(elem[0])
        })
      // console.log(this.documentos);
      });      
    }
    
  }

  async onReciveData(event: string, tipe: string){
    
    switch (tipe) {
      case 'actividades':
        this.aliadoInformacion.actividad_contratada = event        
        break;
        
      case 'division':
        this.aliadoInformacion.division = event        
        break;

        
      case 'localidad':
        this.aliadoInformacion.localidad = event        
        break;

        
      case 'calificacion':
        this.aliadoInformacion.calificacion = event        
        break;

        
      case 'colider':
        this.aliadoInformacion.colider = event        
        break;

      case 'repLegal':
        this.aliadoInformacion.representante_legal = event        
        break;

      case 'numTrabajadores':
        this.aliadoInformacion.numero_trabajadores = Number.parseInt(event);    
        break;

      case 'numTrabajadoresAsig':
        this.aliadoInformacion.numero_trabajadores_asignados = Number.parseInt(event);        
        break;

      case 'control-riesgo':
        this.aliadoInformacion.control_riesgo = JSON.stringify(event);
        break;

      case 'emailComercial':
        this.aliadoInformacion.email_comercial = event;
        break;

      case 'telefonoContacto':
        this.aliadoInformacion.telefono_contacto = event;
        break;

      case 'arl':
        this.aliadoInformacion.arl = event;
      default:
        break;
    }
    // console.log(this.aliadoInformacion);
  }

  reciveIdDoc(event: string){
    // console.log(event);
    let dataList = []
    if(this.aliadoInformacion.documentos){
      dataList = JSON.parse(this.aliadoInformacion.documentos)
    }
    dataList.push(Number.parseInt(event))
    // console.log(dataList);
    this.aliadoInformacion.documentos = JSON.stringify(dataList)
    // console.log(this.aliadoInformacion.documentos);
  }

  reciveFechaArl(event: Date){
    // console.log(event);
    this.aliadoInformacion.fecha_vencimiento_arl = event;
  }

  reciveFechaSst(event: Date){
    // console.log(event);
    this.aliadoInformacion.fecha_vencimiento_sst = event;
  }

  reciveFechaCertExterna(event: Date){
    this.aliadoInformacion.fecha_vencimiento_cert_ext = event;
  }

  getFecha(docType: string){
    switch(docType){
      case 'arl':
        return this.aliadoInformacion.fecha_vencimiento_arl;
        break;
      case 'sst':
        return this.aliadoInformacion.fecha_vencimiento_sst;
      case 'certExt':
        return this.aliadoInformacion.fecha_vencimiento_cert_ext;
        break;
      default:
        return
    }
  }

  async onRecivePuntajeArl(data: number){
    this.aliadoInformacion.puntaje_arl = data;
  }

  onReciveCalificacionAliadoData(data: any, selector: string){
    switch (selector) {
      case 'puntaje':
        this.aliadoInformacion.calificacion_aliado = data;
        break;
      case 'fecha':
        this.aliadoInformacion.fecha_calificacion_aliado = data;
        break;
      case 'nombre':
        this.aliadoInformacion.nombre_calificador = data;
        break;
      default:
        break;
    }
  }

  onReciveAutorizaSubcontratacion(data: boolean){
    this.auxAutorizaSubcontratacion = data;
  }

  onReciveIsTemporal(data: boolean){
    this.auxIsTemporal = data;
  }

  onReceivePermitirRegistroAt(data: boolean){
    this.aliadoInformacion.permitirReportes = data;
  }

  async actualizarAliado(){
    this.mensajesDeValidacion();

    this.aliadoInformacion.autoriza_subcontratacion = this.auxAutorizaSubcontratacion;
    this.aliadoInformacion.istemporal = this.auxIsTemporal;
    this.aliadoInformacion.permitirReportes = this.auxIsTemporal ? false : this.aliadoInformacion.permitirReportes;
    // console.log(this.aliadoInformacion.calificacion)
    this.saveInformacionAliado();

    this.aliado.fechaActualizacion = new Date();
    //aca ajustar el estado
    if(this.idEmpresaAliada && this.aliadoDataIsValid()){
      this.aliado.estado = 'Actualizado';
    }else if(this.idEmpresaAliada){
      this.aliado.estado = 'En proceso';
    };

    this.aliado.calificacion=this.impactoV;
    if(this.aliado.division !== null){
      this.aliado.division = JSON.stringify(this.aliado.division)
    }
    await this.empresaService.update(this.aliado).then( () => {
      // this.messageService.add({key: 'msgActualizarAliado', severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      if(typeof this.onEdit == 'undefined' && this.aliadoDataIsValid()){
        this.usuarioService.emailAliadoActualizado(this.aliado.correoAliadoCreador, this.aliado.id);
        this.messageService.add({key: 'msgActualizarAliado', severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      }
      if(this.onEdit == 'edit' && this.gestorDataIsValid()){
        this.messageService.add({key: 'msgActualizarAliado', severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      }

      
    });
    this.flagPress=true;
  }

  impactoIn(event){
    this.impactoV=event
  }

  flagValidMetodo(e){
    this.flagValid=e;
  }

  gestorDataIsValid(): boolean{
    return (
        (this.aliadoInformacion.actividad_contratada != null && this.aliadoInformacion.actividad_contratada != '' && this.actividadContratadaIsValid(this.aliadoInformacion.actividad_contratada))
        && (this.aliadoInformacion.division != null && this.aliadoInformacion.division != '' && JSON.parse(this.aliadoInformacion.division).length > 0) 
        && (this.aliadoInformacion.localidad != null && this.aliadoInformacion.localidad != '' && JSON.parse(this.aliadoInformacion.localidad).length > 0)
        && (this.aliadoInformacion.colider != null && this.aliadoInformacion.colider != '')
        && (this.aliadoInformacion.control_riesgo != null && this.aliadoInformacion.control_riesgo != '' && JSON.parse(this.aliadoInformacion.control_riesgo).length > 0)
        && (
            this.flagValid
            // this.aliadoInformacion.calificacion != null 
            // && this.aliadoInformacion.calificacion != ''
            // && JSON.parse(this.aliadoInformacion.calificacion).length >= 9
           )
        && (this.auxAutorizaSubcontratacion != null)
      );
  }

  aliadoDataIsValid(): boolean{
    return (
      (this.aliadoInformacion.representante_legal != null)
      && (this.aliadoInformacion.numero_trabajadores != null)
      && (this.aliadoInformacion.numero_trabajadores_asignados != null)
      && (this.aliadoInformacion.email_comercial != null)
      && (this.aliadoInformacion.telefono_contacto != null)
      && (this.aliadoInformacion.arl != null)
      && (this.aliadoInformacion.documentos != null && this.validarDocumentos() == 2)
      && (this.aliadoInformacion.fecha_vencimiento_arl != null)
      && (this.aliadoInformacion.fecha_vencimiento_sst != null)
      && (this.aliadoInformacion.puntaje_arl != null)
      && (this.teamSstIsComplete)
    );
  }

  mensajesDeValidacion(){
    if(this.onEdit == 'edit' && !this.gestorDataIsValid()){
      this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'La información del aliado no está completa'});
      if(this.aliadoInformacion.actividad_contratada == null || this.aliadoInformacion.actividad_contratada == '' || !this.actividadContratadaIsValid(this.aliadoInformacion.actividad_contratada)){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado las actividades contratadas.', life:6000});
      }
      if(this.aliadoInformacion.division == null || this.aliadoInformacion.division == '' || JSON.parse(this.aliadoInformacion.division).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado la división de negocio.', life:6000});
      }
      if(this.aliadoInformacion.localidad == null || this.aliadoInformacion.localidad == '' || JSON.parse(this.aliadoInformacion.localidad).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado la localidad o las localidades.', life:6000});
      }
      if(this.aliadoInformacion.colider == null || this.aliadoInformacion.colider == ''){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado el gestor del contrato.', life:6000});
      }
      if(this.aliadoInformacion.control_riesgo == null || this.aliadoInformacion.control_riesgo == '' || JSON.parse(this.aliadoInformacion.control_riesgo).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado las actividades habilitadas.', life:6000});
      }
      if(!this.flagValid){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha completado la clasificación.', life:6000});
      }
      if(this.auxAutorizaSubcontratacion == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe indicar si autoriza la subcontratación en la pestaña de Información.', life:6000});
      }
    }
    
    if(typeof this.onEdit == 'undefined' && !this.aliadoDataIsValid()){
      this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'La información no está completa'});
      if(this.aliadoInformacion.representante_legal == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar nombre del representante legal.', life:6000});
      }
      if(this.aliadoInformacion.numero_trabajadores == null || this.aliadoInformacion.numero_trabajadores == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el número de trabajadores totales del aliado.', life:6000});
      }
      if(this.aliadoInformacion.numero_trabajadores_asignados == null || this.aliadoInformacion.numero_trabajadores_asignados == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el número de trabajadores del aliado en CORONA.', life:6000});
      }
      if(this.aliadoInformacion.email_comercial == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el email de comunicaciones.', life:6000});
      }
      if(this.aliadoInformacion.telefono_contacto == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el teléfono de contacto.', life:6000});
      }
      if(this.aliadoInformacion.arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe Seleccionar la ARL del aliado.', life:6000});
      }
      let VALIDACION_DOCUMENTOS_RESULT = this.validarDocumentos();
      if(this.aliadoInformacion.documentos == null || VALIDACION_DOCUMENTOS_RESULT != 2){
        if(VALIDACION_DOCUMENTOS_RESULT == 0){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha guardado el soporte de la licencia SST.', life:6000});
        }else if(VALIDACION_DOCUMENTOS_RESULT == 1){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha guardado el soporte la certificación de ARL.', life:6000});
        }else if(VALIDACION_DOCUMENTOS_RESULT == -1){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe guardar los soportes de los documentos de ARL y SST.', life:6000});
        }
      }
      if(this.aliadoInformacion.fecha_vencimiento_arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar la fecha de vencimiento del certificado de ARL', life:6000});
      }
      if(this.aliadoInformacion.fecha_vencimiento_sst == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar la fecha de vencimiento de la licencia SST.', life:6000});
      }
      if(this.aliadoInformacion.puntaje_arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el puntaje de su certificado de ARL.', life:6000});
      }
      if(!this.teamSstIsComplete){
        this.messageService.add({key: 'msgActualizarAliado', severity: 'warn', summary: 'Información faltante', detail: 'Debe completar el equipo SST.'})
      }
    }
  }

  actividadContratadaIsValid(data: string): boolean{
    let actividadList = JSON.parse(data);
    if(actividadList.length == 2 && actividadList[1].length == 0){
      return false;
    }
    return true;
  }

  validarDocumentos(): number{
    let contArl = 0, contSst = 0;
    this.documentos.forEach((doc: Directorio) => {
      if(doc.documento.proceso=='arl') contArl++;
      if(doc.documento.proceso=='licencia') contSst++;
    });
    /*
    Retornará
    -1 si no hay documentos para arl y sst
    0 si hay documentos para arl pero no para sst
    1 si no hay documento para arl pero si para sst
    2 si hay documentos para arl y sst
    */
    if(contArl == 0 && contSst == 0) return -1;
    if(contArl > 0 && contSst == 0) return 0;
    if(contArl == 0 && contSst > 0) return 1;
    return 2;
  }

  async deleteDocumento(documentos: string){
    this.aliadoInformacion.documentos = documentos;
    await this.saveInformacionAliado();
    this.loadDocumentos();
  }

  onTeamSstChange(event: boolean){
    this.teamSstIsComplete = event;
    // console.log(event);
  }
}
