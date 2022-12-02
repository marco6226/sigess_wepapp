import { SST } from './../../entities/aliados';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Component, Input, OnInit } from '@angular/core';
import { EquipoSST, ResponsableSST } from '../../entities/aliados';

@Component({
  selector: 'app-equipo-sst-list',
  templateUrl: './equipo-sst-list.component.html',
  styleUrls: ['./equipo-sst-list.component.scss']
})
export class EquipoSstListComponent implements OnInit {
 
  @Input() alidadoId: number= -1;

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
    correo: '',
    telefono: '',
    division: '',
    localidad: '',
    cargo: '',
    licenciaSST: ''
  };


  constructor(
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.onLoad()
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

    let dataSST: SST={
      id_empresa: this.alidadoId,
      responsable: null,
      nombre: event.nombre,
      correo: event.correo,
      telefono: event.telefono,
      licenciasst: event.licenciaSST,
      documento: null,
      division: null,
      localidad: null,
      cargo: null,
      encargado: true
    };

    this.onCreateEquipo(dataSST);

    console.log(event);
  }

  agregarMiembroSST(event: EquipoSST){

    let dataSST: SST={
      id_empresa: this.alidadoId,
      responsable: null,
      nombre: event.nombre,
      correo: event.correo,
      telefono: event.telefono,
      licenciasst: event.licenciaSST,
      documento: event.documento,
      division: JSON.stringify(event.division),
      localidad: JSON.stringify(event.localidad),
      cargo: event.cargo,
      encargado: false
    };

    this.onCreateEquipo(dataSST);
    console.log(event);
  }


  onEdit(event: EquipoSST, action?: string){
    console.log(event, action);
  }

  onLoad(){
    this.responsableList = [];
    this.equipoList = [];
    this.empresaService.getEquipoSST(this.alidadoId).then((element: SST[]) =>{
      console.log(element);
      element.forEach(elem => {
        if(elem.encargado){
          let data: ResponsableSST={
            nombre: elem.nombre,
            correo: elem.correo,
            telefono: elem.telefono,
            licenciaSST: elem.licenciasst
          }
          this.responsableList.push(data);    
        }
        else{
          let data: EquipoSST={
            nombre: elem.nombre,
            documento: elem.documento,
            correo: elem.correo,
            telefono: elem.telefono,
            division: JSON.parse(elem.division),
            localidad: JSON.parse(elem.localidad),
            cargo: elem.cargo,
            licenciaSST: elem.licenciasst
          }
          this.equipoList.push(data);
        }
            
      });
      
      
    })
  }

  formatLocalidad(localidad: string){
    let localidadList: any[] = JSON.parse(localidad);
    return localidadList.join(', ');
  }

  async onCreateEquipo(dataSST: SST){
    await this.empresaService.createEquipoSST(dataSST)
    this.onLoad()
  }

}

