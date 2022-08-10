import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Aliados } from '../../entities/aliados';

@Component({
  selector: 'app-aliados-list',
  templateUrl: './aliados-list.component.html',
  styleUrls: ['./aliados-list.component.scss']
})
export class AliadosListComponent implements OnInit {

  aliadosList: Aliados[]=[
    {
      nit: '901057670-9',
      nombre: 'Hydraulic Force SAS',
      tipo: 'Juridica',
      fecha: new Date(),
      estado: 'Actualizado',
      calificacion: '100%',
      vigencia: 'Activo'
    }
  ]

  caseSelect: boolean=false
  totalRecords: number;
  loading: boolean = false;
  val

  cols = [
    { field: 'nit', header: 'NIT' },
    { field: 'nombre', header: 'Nombre/Razón Social' },
    { field: 'tipo', header: 'Tipo de Persona' },
    { field: 'fecha', formatDate:'dd/MM/yy' , header: 'Fecha Actualización' },
    { field: 'estado', header: 'Estado' },
    { field: 'calificacion', header: 'Calificación' },
    { field: 'vigencia', header: 'Vigencia' },  
  ];

  constructor() { }

  ngOnInit() {
  }

  test(){

  }
  DecodificacionEstado(valor){

  }
  DecodificacionSiNo(valor){

  }
  lazyLoad(valor){

  }
}
