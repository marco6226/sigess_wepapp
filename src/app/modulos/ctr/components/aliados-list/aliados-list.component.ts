import { Router } from '@angular/router';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Aliados } from '../../entities/aliados';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';

@Component({
  selector: 'app-aliados-list',
  templateUrl: './aliados-list.component.html',
  styleUrls: ['./aliados-list.component.scss']
})
export class AliadosListComponent implements OnInit {

  aliadosList: Empresa[]=[]

  caseSelect: boolean=false
  loading: boolean = false;
  selectedList: any[]=[];


  constructor(
    private empresaService: EmpresaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
 
    this.aliadosList=[]
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtPadre = new Filter();
    filtPadre.criteria = Criteria.IS_NOT_NULL;
    filtPadre.field = 'tipoPersona';
    filterQuery.filterList.push(filtPadre);
    this.empresaService.findByFilter(filterQuery).then(
        resp => {
          console.log(resp);
          resp['data'].forEach(element => {
            // if (!element.fechaActualizacion) {
            //   element.fechaActualizacion="-"
            // }
            this.aliadosList.push(element) 
          });
          console.log(this.aliadosList);
        }
    );
        
    this.empresaService.findAll().then(ele=>{
      console.log(ele);
      
    })
    
  }

  onEdit(event){
    console.log(event.id);
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}`])
    
  }

  onRowSelect(event){
    if (this.selectedList.length>0) {
      this.caseSelect=true;      
    } else {
      this.caseSelect=false;      
    }
  }
}
