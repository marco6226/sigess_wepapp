import { Component, OnInit } from '@angular/core';
import { EquipoSST, ResponsableSST } from '../../entities/aliados';

@Component({
  selector: 'app-equipo-sst-list',
  templateUrl: './equipo-sst-list.component.html',
  styleUrls: ['./equipo-sst-list.component.scss']
})
export class EquipoSstListComponent implements OnInit {
 
  visibleDlgResponsable: boolean = false;
  visibleDlg: boolean = false;

  equipoList: EquipoSST[]=[]

  responsableList: ResponsableSST[]=[]


  selectedResponsableList: ResponsableSST={
    nombre: '',
    correo: '',
    telefono: '',
    licenciaSST: ''
  };

  selectedList: EquipoSST={
    nombre: '',
    documento: '',
    division: '',
    localidad: '',
    cargo: '',
    licenciaSST: ''
  };


  constructor() { }

  ngOnInit(): void {
  }

  onRowSelect(){

  }

  crearMiembros(){
    this.visibleDlg = true
  }

  crearResponsableMiembros(){
    this.visibleDlgResponsable = true
  }

  closeDialog(){
    this.visibleDlg = false
    this.visibleDlgResponsable = false

  }

  agregarResponsableSST(event: ResponsableSST){
    console.log(event);
    this.responsableList.push(event);
  }

  agregarMiembroSST(event: EquipoSST){
    console.log(event);
    this.equipoList.push(event);
  }


  onEdit(event){

  }
}

