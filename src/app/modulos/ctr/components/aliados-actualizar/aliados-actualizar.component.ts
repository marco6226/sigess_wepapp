import { FilterQuery } from './../../../core/entities/filter-query';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';
import { EmpresaService } from './../../../empresa/services/empresa.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
  }

  test(){
    console.log(this.rutaActiva.snapshot.params.id);
    this.loadData();
    // console.log(this.empresasList);
    
  }

}
