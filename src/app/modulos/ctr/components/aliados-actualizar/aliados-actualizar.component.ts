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
    colider: null
  }
  
  constructor(
    private rutaActiva: ActivatedRoute,
    private empresaService: EmpresaService,
  ) {}

  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params.id;
    this.loadData();
  }

  async loadData(){
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtro = new Filter();
    filtro.criteria = Criteria.EQUALS;
    filtro.field = 'id';
    filtro.value1 = this.id.toString();

    filterQuery.filterList.push(filtro);
    this.empresaService.findByFilter(filterQuery).then(
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

    this.saveInformacionAliado();
    if(this.aliadoInformacion.id == null){
      this.loadInformacionAliado();
    }
  }

  async saveInformacionAliado(){
    await this.empresaService.saveAliadoInformacion(this.aliadoInformacion).then((ele)=>{      
      console.log(ele);
      
    });
  }

  onReciveData(event: string, tipe: string){
    // this.loadInformacionAliado()
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
    
    this.saveInformacionAliado()
  }

  test(event: string){
    console.log(event);
    this.aliadoInformacion.actividad_contratada = event
   console.log(this.aliadoInformacion);
  //  this.aliadoInformacion.actividad_contratada = '["Almacenes Corona","Comercial Corona Colombia"]'
    
  }

}
