import { Component, OnInit } from '@angular/core';
import { EquipoSST } from '../../entities/aliados';

@Component({
  selector: 'app-equipo-sst-list',
  templateUrl: './equipo-sst-list.component.html',
  styleUrls: ['./equipo-sst-list.component.scss']
})
export class EquipoSstListComponent implements OnInit {
  
  aliadosList: any[] =[{
    razonSocial:'a',
    tipo_persona:'s',
    estado:'x',
    calificacion:'s'
  }]

  visibleDlg: boolean = false;

  equipoList: EquipoSST[]=[]

  selectedList: EquipoSST={
    nombre: '',
    correo: '',
    telefono: '',
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
  display: boolean = false;

  showDialog() {
      this.display = true;
  }

  closeDialog(){
    this.visibleDlg = false
  }

  agregarMiembroSST(event: EquipoSST){
    console.log(event);
    this.equipoList.push(event);
  }

  onEdit(event){

  }
}

