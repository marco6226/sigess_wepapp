import { SST } from './../../entities/aliados';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Component, Input, OnInit } from '@angular/core';
import { EquipoSST, ResponsableSST } from '../../entities/aliados';
import { ConfirmationService, MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-equipo-sst-list',
  templateUrl: './equipo-sst-list.component.html',
  styleUrls: ['./equipo-sst-list.component.scss']
})
export class EquipoSstListComponent implements OnInit {
 
  @Input() alidadoId: number= -1;
  @Input() flagConsult: boolean=false;

  visibleDlgResponsable: boolean = false;
  visibleDlg: boolean = false;

  equipoList: EquipoSST[]=[]

  responsableList: ResponsableSST[]=[]

  miembroToUpdate: any = null;

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
    private empresaService: EmpresaService,
    private confirmationService: ConfirmationService,
    private messageservice: MessageService
  ) { }

  ngOnInit(): void {
    this.onLoad()
  }

  crearMiembros(){
    this.miembroToUpdate = null;
    this.visibleDlg = true;
  }

  crearResponsableMiembros(){
    this.miembroToUpdate = null;
    this.visibleDlgResponsable = true;
  }

  closeDialog(){
    this.visibleDlg = false;
    this.visibleDlgResponsable = false;
    this.miembroToUpdate = null;
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


  onEdit(event: any, action?: string){
    // console.log(event, action);
    if(action && action == 'Eliminar'){
      this.confirmationService.confirm({
        message: 'Seguro que desea eliminar a este miembro? La acción no se puede deshacer.',
        accept: () => {
          this.empresaService.deleteMiembroSST(event.id)
          .then(res => {
            // console.log("Eliminado:", res);
            if(res){
              this.responsableList = this.responsableList.filter(el => el.id != event.id);
              this.equipoList = this.equipoList.filter(el => el.id != event.id);
              this.messageservice.add({severity:'success', summary:'Eliminado', detail:'Se eliminó el miembro exitosamente'});
            }else{
              this.messageservice.add({severity:'error', summary:'Error', detail:'Ocurrió un error al intentar eliminar'});
            }
          });            
        },
        reject: () => {},
        icon: "pi pi-exclamation-triangle"
      });
    }else if(action && action == 'Editar'){
      // console.log(event);
      if(event.encargado){
        let data: SST = {
          id: event.id,
          id_empresa: event.id_empresa,
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
        }
        // console.log(data);
        this.miembroToUpdate = data;
        this.visibleDlgResponsable = true;
      }else{
        let data: SST = {
          id: event.id,
          id_empresa: event.id_empresa,
          responsable: null,
          nombre: event.nombre,
          correo: event.correo,
          telefono: event.telefono,
          licenciasst: event.licenciaSST,
          documento: event.documento,
          division: JSON.stringify(event.division),
          localidad: event.localidad,
          cargo: event.cargo,
          encargado: false
        }
        // console.log(data);
        this.miembroToUpdate = data;
        this.visibleDlg = true;
      }
    }
  }

  onLoad(){
    this.responsableList = [];
    this.equipoList = [];
    this.empresaService.getEquipoSST(this.alidadoId).then((element: SST[]) =>{
      // console.log(element);
      element.forEach(elem => {
        if(elem.encargado){
          let data: ResponsableSST={
            id: elem.id,
            id_empresa: elem.id_empresa,
            nombre: elem.nombre,
            correo: elem.correo,
            telefono: elem.telefono,
            licenciaSST: elem.licenciasst,
            encargado: elem.encargado
          }
          this.responsableList.push(data);    
        }
        else{
          let data: EquipoSST={
            id: elem.id,
            id_empresa: elem.id_empresa,
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

  actualizarMiembro(sst: SST){
    console.log(sst);

    this.empresaService.updateEquipoSST(sst)
    .then((res: SST) => {
      this.messageservice.add({severity:'success', summary:'Miembro actualizado', detail:'Se actualizó el miembro: ' + res.nombre});
      this.onLoad();
    }).catch((err)=>{
      this.messageservice.add({severity:'error', summary:'Error', detail:'Ocurrió un error inesperado al actualizar datos'});
    });
  }

}

