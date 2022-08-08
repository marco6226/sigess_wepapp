import { CasosMedicosService } from './../../../services/casos-medicos.service';
import { Component, Input, OnInit } from '@angular/core';
import { Reintegro } from 'app/modulos/scm/entities/reintegro.interface';

@Component({
  selector: 'app-reintegro-list',
  templateUrl: './reintegro-list.component.html',
  styleUrls: ['./reintegro-list.component.scss']
})
export class ReintegroListComponent implements OnInit {
  idCase=null;
  @Input('idCase') 
  set reintegroSet(idCasoMed){
    console.log(idCasoMed);
    
    this.idCase=idCasoMed
    this.casosMedicosService.getReintegroByCaseId(this.idCase).subscribe(data=>{
      this.reintegroList = data
    })
  }
  reintegroList: Reintegro[] =[]
  modalRetorno: boolean = false
  editRetorno: Reintegro = {
    id: 0,
    tipo_retorno: '',
    descripcion: '',
    permanencia: '',
    periodo_seguimiento: '',
    reintegro_exitoso: '',
    fecha_cierre: undefined,
    observacion: '',
    pk_case: ''
  };
  onEdit: boolean=false;

  constructor(
    private casosMedicosService: CasosMedicosService
  ) { }

  ngOnInit() {
  }

  createRetorno(){
    this.onEdit=false;
    this.modalRetorno = true
  }

  onRowEditInit(reintegro){
    this.onEdit=true;
    this.editRetorno = reintegro
    this.modalRetorno=true;
    console.log(reintegro);
    
  }

  reload(){
    console.log("ok");
    
    this.casosMedicosService.getReintegroByCaseId(this.idCase).subscribe(data=>{
      this.reintegroList = data
    })
    this.modalRetorno=false
  }

  onHideDialog(){
    this.editRetorno= {
      id: 0,
      tipo_retorno: '',
      descripcion: '',
      permanencia: '',
      periodo_seguimiento: '',
      reintegro_exitoso: '',
      fecha_cierre: undefined,
      observacion: '',
      pk_case: ''
    };
    this.onEdit=false;
    console.log(this.editRetorno);
    
  }
}
