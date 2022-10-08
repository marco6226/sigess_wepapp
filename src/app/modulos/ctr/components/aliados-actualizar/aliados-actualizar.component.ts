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
    documentos: null
  }

  documentos: Directorio[]=[]
  
  constructor(
    private rutaActiva: ActivatedRoute,
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params.id;
    this.loadData();
  }

  async loadData(){
    console.log("---------------------------------");
    
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtro = new Filter();
    filtro.criteria = Criteria.EQUALS;
    filtro.field = 'id';
    filtro.value1 = this.id.toString();

    filterQuery.filterList.push(filtro);
    await this.empresaService.findByFilter(filterQuery).then(
        resp => {
          console.log(resp);
          resp['data'].forEach(element => {
            this.aliado = element;
          });
        }
    );
    this.loadInformacionAliado()
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
    // this.saveInformacionAliado()
  }

  loadDocumentos(){
    // debugger
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
    
      default:
        break;
    }
    console.log(this.aliadoInformacion);
    
    await this.saveInformacionAliado()
  }

  test(){
   
    let x = JSON.parse(this.aliadoInformacion.documentos)
    console.log(this.aliadoInformacion.documentos);    
    console.log(x);
    x.push(99)
    console.log(x);
    this.aliadoInformacion.documentos = JSON.stringify(x)
    console.log(this.aliadoInformacion.documentos);    
    
  //  this.aliadoInformacion.actividad_contratada = '["Almacenes Corona","Comercial Corona Colombia"]'
    
  }

  reciveIdDoc(event: string){
    console.log(event);
    let dataList = JSON.parse(this.aliadoInformacion.documentos)
    // console.log(this.aliadoInformacion.documentos);    
    // console.log(dataList);
    dataList.push(Number.parseInt(event))
    console.log(dataList);
    this.aliadoInformacion.documentos = JSON.stringify(dataList)
    console.log(this.aliadoInformacion.documentos);    
    this.saveInformacionAliado()
    
  }

  actualizarAliado(){
    this.aliado.fechaActualizacion = new Date();
    this.empresaService.update(this.aliado)
    this.usuarioService.emailAliadoActualizado(this.aliado.correoAliadoCreador, this.aliado.id);
  }

}
