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
  editRetorno: Reintegro;


  constructor(
    private casosMedicosService: CasosMedicosService
  ) { }

  ngOnInit() {
  }

  createRetorno(){
    this.modalRetorno = true
  }

  onRowEditInit(reintegro){
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
}
