import { ConfirmationService, MessageService } from 'primeng/primeng';
import { FactorCausal, listFactores, listPlanAccion } from './../../../entities/factor-causal';
import { Component, Injectable, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-listado-causas',
  templateUrl: './listado-causas.component.html',
  styleUrls: ['./listado-causas.component.scss'],
  providers: [MessageService]
})
export class ListadoCausasComponent implements OnInit {

  @Output() validacionPA = new EventEmitter<any>()
  @Output() tabIndex = new EventEmitter<number>()
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
      header:'Confirmar',
      message: '¿Desea realizar este plan de acción?',
      accept: () => {
        console.log("hola", this.causasListSelect);
        let tempnombreFC;
        let tempcausaRaiz;


        var sortedArray: listFactores[] = this.causasListSelect.sort((obj1, obj2) => {
          if (obj1.nombre > obj2.nombre) {
              return 1;
          }
      
          if (obj1.nombre < obj2.nombre) {
              return -1;
          }
      
          return 0;
      });
        
      console.log(sortedArray)

        this.causasListSelect.forEach(element => {
          console.log(element);
        
          
          var re = element.nombre; 
          if(tempnombreFC==undefined){
            tempnombreFC=""
          }
          var str = tempnombreFC
          console.log(str.search(re))
          if (str.search(re) == -1 ) { 
            if (tempnombreFC) {
              tempnombreFC = tempnombreFC + ', ' + element.nombre            
            } else {
              tempnombreFC = element.nombre            
            }
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
              ele.causaRaiz.push({ 
                causaRaiz: tempcausaRaiz, 
                especifico:{
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false
                }, 
                razonable:{
                  justificacion: null,
                  isComplete: false
                }, 
                eficaz:{
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false
                }, 
                medible:{
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})              
            }
          })
        }else{
          tempCausa.push({
            causaRaiz: tempcausaRaiz, 
                especifico:{
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false
                }, 
                razonable:{
                  justificacion: null
                }, 
                eficaz:{
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false
                }, 
                medible:{
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})
          this.planAccionList.push({nombreFC: tempnombreFC, causaRaiz:tempCausa})
        }
        this.validacionPA.emit();
        this.tabIndex.emit(9);
      }
    });
  }
}
