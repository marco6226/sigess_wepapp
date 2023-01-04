import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { ConfirmationService } from 'primeng/primeng';
import { SesionService } from './../../../core/services/sesion.service';
import { Router } from '@angular/router';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { formatDate } from '@angular/common';
import { Component,Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Aliados } from '../../entities/aliados';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Criteria, Filter } from 'app/modulos/core/entities/filter';
import * as XLSX from 'xlsx';
import { FilterUtils } from 'primeng/api'

@Component({
  selector: 'app-aliados-list',
  templateUrl: './aliados-list.component.html',
  styleUrls: ['./aliados-list.component.scss']
})
export class AliadosListComponent implements OnInit {

  aliadosList: Empresa[]=[];
  
  caseSelect: boolean=false;
  loading: boolean = false;
  selectedList: any[]=[];
  fileName= 'ListadoAliados.xlsx';
  excel:any[];
  rangeDatesCreacion: any;
  rangeDatesActualizacion: any;
 
  
  constructor(
    private empresaService: EmpresaService,
    private sesionService: SesionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.loadData();

    this.filterUtils();
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
    let idAux = await this.sesionService.getEmpresa().idEmpresaAliada != null
                ? await this.sesionService.getEmpresa().idEmpresaAliada
                : await this.sesionService.getEmpresa().id;
    filterAliadoID.value1 = String(idAux);

    filterQuery.filterList.push(filtPadre);
    filterQuery.filterList.push(filterAliadoID);
    filterQuery.sortField = "id";
    filterQuery.sortOrder = 1;
    
    this.empresaService.findByFilter(filterQuery).then(
      // this.empresaService.findByFilter().then(
        resp => {
          // console.log(resp);
          let aliadosDivision;
          this.empresaService.obtenerDivisionesDeAliados(Number(idAux)).then(
            (respDiv: any) => {
              resp['data'].forEach(element => {
                try{
                  element.division = respDiv.filter(el => el.id == element.id)[0].division;
                }catch(e){}
                this.aliadosList.push(element) 
              });
          });
          console.log(this.aliadosList);
        }
    );
    
  }

  onEdit(event){
    console.log(event.id);
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}/${'edit'}`]);
  }

  onConsult(event){
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}/${'consultar'}`]);
  }
  async onSendMail(event){
    console.log(event);
    await this.usuarioService.sendMailAliadoActualizar(event.email,event.id);
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

  sendMultiplesEmails(){
    this.selectedList.forEach(element => {
      this.onSendMail(element)
    });
  }

  test(){
    console.log(this.caseSelect);
    console.log(this.selectedList);   
    
  }
  
  async exportexcel(): Promise<void> 
    {
       /* table id is passed over here */   
      await this.datosExcel()
      const readyToExport = this.excel;

      const workBook = XLSX.utils.book_new(); // create a new blank book

      const workSheet = XLSX.utils.json_to_sheet(readyToExport);

      XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book

      XLSX.writeFile(workBook, this.fileName); // initiate a file download in browser

      //  let element = document.getElementById('excel-table'); 
      //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
      //  XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
      //  /* save to file */
      //  XLSX.writeFile(wb, this.fileName);
			
    }

    async datosExcel(): Promise<void>{
      this.excel=[]
      this.aliadosList.forEach((resp)=>{
        this.excel.push({Nombre_o_razón_social:resp['nombreComercial'],Tipo_de_Persona:resp['tipoPersona'],Estado:resp['estado'],Impacto:resp['calificacion'],Fecha_Creación:new Date(resp['fechaCreacion']),Fecha_Modificación:(resp['fechaActualizacion']!=null)?new Date(resp['fechaActualizacion']):''})
      })
    }

    filterUtils(){
      FilterUtils['fechaCreacionFilter'] = (value, filter): boolean => {
        if (filter === undefined || filter === null) {
          return true;
        }
      
        if (value === undefined || value === null) {
          return false;
        }
        
        if (this.rangeDatesCreacion[0] <= value && this.rangeDatesCreacion[1] >= value) {
          return true;
        }
      }
  
      FilterUtils['FechaActualizacionFilter'] = (value, filter): boolean => {
        if (filter === undefined || filter === null) {
          return true;
        }
      
        if (value === undefined || value === null) {
          return false;
        }

        if (this.rangeDatesActualizacion[0] <= value && this.rangeDatesActualizacion[1] >= value) {
          return true;
        }
      }
    }

    getDivision(data: string){
      if(data == null) return '';
      let arreglo = JSON.parse(data);
      // if(arreglo.join(", ").length <= 30) return arreglo.join(", "); 
      return arreglo.join(", ");
    }

}
