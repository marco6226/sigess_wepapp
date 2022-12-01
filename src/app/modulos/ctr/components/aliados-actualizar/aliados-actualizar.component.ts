import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { FilterQuery } from './../../../core/entities/filter-query';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';
import { EmpresaService } from './../../../empresa/services/empresa.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AliadoInformacion } from '../../entities/aliados';
import { ComunService } from 'app/modulos/comun/services/comun.service';

@Component({
  selector: 'app-aliados-actualizar',
  templateUrl: './aliados-actualizar.component.html',
  styleUrls: ['./aliados-actualizar.component.scss']
})
export class AliadosActualizarComponent implements OnInit {

  id: number = -1;
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
    empresasContratistasList: []
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
    autoriza_subcontratacion: false
  }

  documentos: Directorio[]=[]
  onEdit: string = '';
  auxAutorizaSubcontratacion: boolean = false;
  
  constructor(
    private rutaActiva: ActivatedRoute,
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params.id;
    this.onEdit = this.rutaActiva.snapshot.params.onEdit;
    this.loadData();
  }

  async loadData(){
    console.log("--------------load data------------");
    
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
          resp['data'].forEach(element => {
            this.aliado = element;
          });
        }
    );

    this.loadInformacionAliado();
  }

  async loadInformacionAliado(){
    this.aliadoInformacion.id_empresa = this.id;
    await this.empresaService.getAliadoInformacion(this.id).then((ele: AliadoInformacion[])=>{
      if(ele[0] != undefined){
        this.aliadoInformacion = ele[0];
        console.log(this.aliadoInformacion);     
      }      
    });

    await this.loadDocumentos()

    await this.saveInformacionAliado();
    if(this.aliadoInformacion.id == null){
      this.loadInformacionAliado();
    }
  }

  async saveInformacionAliado(){
    await this.empresaService.saveAliadoInformacion(this.aliadoInformacion).then((ele)=>{      
      console.log(ele);
      
    });
  }

  loadDocumentos(){
    if(this.aliadoInformacion.documentos){
      JSON.parse(this.aliadoInformacion.documentos).forEach(async element => {
        await this.directorioService.buscarDocumentosById(element).then((elem: Directorio)=>{
          console.log(elem);      
          this.documentos.push(elem[0])
        })
      console.log(this.documentos);
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
    console.log(event);
    let dataList = []
    if(this.aliadoInformacion.documentos){
      dataList = JSON.parse(this.aliadoInformacion.documentos)
    }
    dataList.push(Number.parseInt(event))
    console.log(dataList);
    this.aliadoInformacion.documentos = JSON.stringify(dataList)
    console.log(this.aliadoInformacion.documentos);    
    this.saveInformacionAliado()
    
  }

  reciveFechaArl(event: Date){
    // console.log(event);
    this.aliadoInformacion.fecha_vencimiento_arl = event;
    this.saveInformacionAliado();
  }

  reciveFechaSst(event: Date){
    // console.log(event);
    this.aliadoInformacion.fecha_vencimiento_sst = event;
    this.saveInformacionAliado();
  }

  reciveFechaCertExterna(event: Date){
    this.aliadoInformacion.fecha_vencimiento_cert_ext = event;
    this.saveInformacionAliado();
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
    await this.saveInformacionAliado();
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

  async actualizarAliado(){
    this.aliadoInformacion.autoriza_subcontratacion = this.auxAutorizaSubcontratacion;
    this.saveInformacionAliado();

    this.aliado.fechaActualizacion = new Date();
    if(this.aliado.division !== null){
      this.aliado.division = JSON.stringify(this.aliado.division)
    }
    await this.empresaService.update(this.aliado)
    await this.usuarioService.emailAliadoActualizado(this.aliado.correoAliadoCreador, this.aliado.id);
    this.router.navigate(['/app/ctr/listadoAliados']);
  }

}
