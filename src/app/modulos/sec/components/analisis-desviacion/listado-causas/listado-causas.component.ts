import { ConfirmationService, MessageService } from 'primeng/primeng';
import { FactorCausal, listFactores, listPlanAccion } from './../../../entities/factor-causal';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-listado-causas',
  templateUrl: './listado-causas.component.html',
  styleUrls: ['./listado-causas.component.scss'],
  providers: [MessageService]
})
export class ListadoCausasComponent implements OnInit {

  @Input() factores: listFactores[];
  @Input() planAccionList: listPlanAccion[]=[];

  causasListSelect: listFactores[];


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
  }

  test(){
    console.log(this.factores);
    
  }

  crearPlanAccion(){
    this.confirmationService.confirm({
      message: '¿Desea realizar este plan de acción?',
      accept: () => {
        console.log("hola", this.causasListSelect);
        let tempnombreFC;
        let tempcausaRaiz;

        

        this.causasListSelect.forEach(element => {
          if (tempnombreFC) {
            tempnombreFC = tempnombreFC + ', ' + element.nombre            
          } else {
            tempnombreFC = element.nombre            
          }

          if (tempcausaRaiz) {
            tempcausaRaiz = tempcausaRaiz + ', ' + element.metodologia            
          } else {
            tempcausaRaiz = element.metodologia            
          }
        });

        let isExist = this.planAccionList.find(ele=>{
          return ele.nombreFC == tempnombreFC || ele.causaRaiz == tempcausaRaiz
        })
        console.log(isExist);
        let tempCausa=[]
        let x =this.planAccionList.find(ele=>{ return ele.nombreFC == tempnombreFC})

        if (x) {
          console.log(x);
          this.planAccionList.forEach(ele=>{
            if (tempnombreFC == ele.nombreFC) {
              ele.causaRaiz.push({ causaRaiz: tempcausaRaiz, especifico:null, razonable:null, eficaz:null, medible:null, revisado:null})              
            }
          })
        }else{
          tempCausa.push({ causaRaiz: tempcausaRaiz, especifico:null, razonable:null, eficaz:null, medible:null, revisado:null})
          this.planAccionList.push({nombreFC: tempnombreFC, causaRaiz:tempCausa})
        }

        // if(isExist==undefined){
          // this.planAccionList.push({nombreFC: tempnombreFC, causaRaiz: tempcausaRaiz, especifico:null, razonable:null, eficaz:null, medible:null, revisado:null})
          // console.log(this.planAccionList);
          // this.messageService.add({severity:'success', summary: 'Exito', detail: 'Se agrego el plan de acción'});
        // }
        // else{
        //   this.messageService.add({severity:'error', summary: 'Error', detail: 'Ya existe este plan de acción'});
        // }
      }
    });

  }


}
