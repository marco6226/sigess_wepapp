import { ConfirmationService, MessageService } from 'primeng/primeng';
import { FactorCausal, listFactores, listPlanAccion } from './../../../entities/factor-causal';
import { Component, Injectable, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
// import { element } from 'protractor';


@Component({
  selector: 'app-listado-causas',
  templateUrl: './listado-causas.component.html',
  styleUrls: ['./listado-causas.component.scss'],
  providers: [MessageService]
})
export class ListadoCausasComponent implements OnInit {

  @Output() validacionPA = new EventEmitter<any>()
  @Output() tabIndex = new EventEmitter<number>()

  factores: listFactores[];
  @Input("factores")
  set factores2(factores: listFactores[]){
    this.factores=factores
}

  @Input() planAccionList: listPlanAccion[]=[];
  // @Input() planAccionList2: listPlanAccion[]=[];

  causasListSelect: listFactores[];


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
  }

  test(){
    console.log(this.factores);
    this.causasListSelect=[]
  }

  crearPlanAccion(){
    this.confirmationService.confirm({
      header:'Confirmar',
      message: '¿Desea realizar este plan de acción?',
      accept: () => {
        console.log("hola", this.causasListSelect);
        let tempnombreFC;
        let tempnombreFC2;
        let tempcausaRaiz;
        let preguntas;

        tempnombreFC=""
        tempnombreFC2=""
        tempcausaRaiz=""
        preguntas=""

        var sortedArray: listFactores[] = this.causasListSelect.sort((obj1, obj2) => {
          if (obj1.nombre > obj2.nombre) {
              return 1;
          }
      
          if (obj1.nombre < obj2.nombre) {
              return -1;
          }
      
          return 0;
        });

        this.causasListSelect.forEach(element => {
          console.log(element);
        
          
          var re = element.nombre; 
          // if(tempnombreFC==undefined){
          //   tempnombreFC=""
          // }
          // if(tempnombreFC2==undefined){
          //   tempnombreFC2=""
          // }
          // if(tempcausaRaiz==undefined){
          //   tempcausaRaiz=""
          // }
          var str = tempnombreFC
          console.log(str.search(re))
          if (str.search(re) == -1 ) { 
            if (tempnombreFC) {
              tempnombreFC = tempnombreFC + '**' + element.nombre            
            } else {
              tempnombreFC = element.nombre            
            }
          }
          if (tempnombreFC2) {
            tempnombreFC2 = tempnombreFC2 + '**' + element.nombre           
          } else {
            tempnombreFC2 = element.nombre        
          }
          
          if (tempcausaRaiz) {
            tempcausaRaiz = tempcausaRaiz + '**' + element.metodologia            
          } else {
            tempcausaRaiz = element.metodologia            
          }

          if (preguntas) {
            preguntas = preguntas + '**' + element.pregunta            
          } else {
            preguntas = element.pregunta
          }
        });
        // console.log(element)
        
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
              // ele.preguntas.
              // ele.preguntas=preguntas
              // ele.causaRaiz2=tempcausaRaiz
              // ele.nombreFC2=tempnombreFC2
              ele.causaRaiz.push({ 
                // id:1,
                nombreFC2:tempnombreFC2,
                preguntas: preguntas,
                causaRaiz: tempcausaRaiz, 
                especifico:{
                  id: null,
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false,
                  email: false
                }, 
                razonable:{
                  justificacion: null,
                  isComplete: false
                }, 
                eficaz:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false,
                  email: false
                }, 
                medible:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false,
                  email: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})              
            }
          })
        }else{
          // preguntas.push(preguntas)
          tempCausa.push({
            nombreFC2:tempnombreFC2,
            preguntas:preguntas,
            causaRaiz: tempcausaRaiz, 
                especifico:{
                  id: null,
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false,
                  email: false
                }, 
                razonable:{
                  justificacion: null
                }, 
                eficaz:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false,
                  email: false
                }, 
                medible:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false,
                  email: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})
          this.planAccionList.push({nombreFC: tempnombreFC, causaRaiz:tempCausa})
        }
        this.validacionPA.emit();
        this.tabIndex.emit();
        // console.log(this.factores)
        this.causasListSelect=[]
      }
      
    });
    // setTimeout(() => {
    //   this.causasListSelect=[]
    // }, 5000);
  }
}
