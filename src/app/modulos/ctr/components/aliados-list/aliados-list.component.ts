import { ConfirmationService } from 'primeng/primeng';
import { SesionService } from './../../../core/services/sesion.service';
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
    private sesionService: SesionService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData(){
 
    this.aliadosList=[]
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtPadre = new Filter();
    filtPadre.criteria = Criteria.IS_NOT_NULL;
    filtPadre.field = 'tipoPersona';

    let filterAliadoID = new Filter();
    filterAliadoID.criteria = Criteria.EQUALS;
    filterAliadoID.field = 'idEmpresaAliada';
    filterAliadoID.value1 = await this.sesionService.getEmpresa().id

    filterQuery.filterList.push(filtPadre);
    filterQuery.filterList.push(filterAliadoID);
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
    
  }

  onEdit(event){
    console.log(event.id);
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}`])
    
  }

  onChangeStatusAliado(row, tipo){
    console.log(row);
    
    if (tipo=='Activar') {
      this.confirmationService.confirm({
        header: 'Confirmar acción',
        message: 'Esta seguro que desea Activar este Aliado:',
        accept: () =>{
          row.activo = true
          this.empresaService.update(row)
        },})
        
    } else {
      this.confirmationService.confirm({
        header: 'Confirmar acción',
        message: 'Esta seguro que desea Desactivar este Aliado:',
        accept: () =>{
          row.activo = false
          this.empresaService.update(row)
        },})
    }
  }

  onRowSelect(event){
    if (this.selectedList.length>0) {
      this.caseSelect=true;      
    } else {
      this.caseSelect=false;      
    }
  }

  test(){
    console.log(this.sesionService.getEmpresa());
  }
}
