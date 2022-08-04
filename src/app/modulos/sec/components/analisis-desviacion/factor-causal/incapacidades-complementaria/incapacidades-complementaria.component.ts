import { locale_es } from './../../../../../rai/enumeraciones/reporte-enumeraciones';
import { ConfirmationService } from 'primeng/primeng';
import { Incapacidad } from './../../../../entities/factor-causal';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-incapacidades-complementaria',
  templateUrl: './incapacidades-complementaria.component.html',
  styleUrls: ['./incapacidades-complementaria.component.scss']
})
export class IncapacidadesComplementariaComponent implements OnInit {


  
  @Input() incapacidades: Incapacidad[] = [];
  @Output() listIncapacidades = new EventEmitter<Incapacidad[]>()
  productDialog: boolean;
  submitted: boolean;
  selectedProducts;
  GuardadoEdicion :boolean=false;

  incapacidadess: Incapacidad[];
  incapacidad: Incapacidad;
  tipo: string;
  cie10: any;
  diagnostico: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasAusencia: number;
  localeES: any = locale_es;
  id: number=0;

  tipoList = [
    // { label: 'Seleccione', value: null },
    { label: 'Inicial', value: 'Inicial' },
    { label: 'Prorroga', value: 'Prorroga' },
  ]

  constructor(
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {
    if (this.incapacidades==null) {
      this.incapacidades = [];
    }
    console.log(this.incapacidades)
    // else{
    // this.incapacidad.fechaInicio= new Date(this.incapacidad.fechaInicio);
    // this.incapacidad.fechaFin= new Date(this.incapacidad.fechaFin);}
  }

  
  get daysCount() {

   
    let fecha1 = moment(this.fechaInicio);

    let fecha2 = moment(this.fechaFin);

    this.diasAusencia =  Math.abs(fecha1.diff(fecha2, "days"));

    return this.diasAusencia;
}

  openNew(){
    this.GuardadoEdicion=true;
    this.incapacidad = {};    
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts(){
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.incapacidades = this.incapacidades.filter(val => !this.selectedProducts.includes(val));
          this.selectedProducts = null;
          // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      }
  });
  }

  hideDialog(){
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(){
    this.submitted = true;
    console.log("save");
    console.log(this.incapacidad);
    

    
    // this.tipo == null ? this.incapacidad.tipo:this.tipo
    // this.cie10.codigo == null ?  this.incapacidad.cie10: this.cie10.codigo
    // this.cie10.nombre == null ?  this.incapacidad.diagnostico:this.cie10.nombre
    // this.fechaInicio == null ?  this.incapacidad.fechaInicio:this.fechaInicio
    // this.fechaFin == null ?  this.incapacidad.fechaFin:this.fechaFin
    // this.diasAusencia == null ?  this.incapacidad.diasAusencia:this.diasAusencia

    this.incapacidad.tipo = this.tipo
    this.incapacidad.cie10 = (this.cie10)?this.cie10:null;
    this.incapacidad.diagnostico = this.cie10.nombre
    this.incapacidad.fechaInicio = this.fechaInicio
    this.incapacidad.fechaFin = this.fechaFin
    this.incapacidad.diasAusencia = this.diasAusencia;

    if(this.id){
      let x = this.incapacidades.find(ele=>{
          return ele.id == this.id
      })
      x.tipo = this.tipo;
      x.cie10=this.cie10;
      x.diagnostico=this.cie10.nombre;
      x.fechaInicio=this.fechaInicio;
      x.fechaFin=this.fechaFin;
      x.diasAusencia=this.diasAusencia;

      }else{
      this.id = this.incapacidades.length;
      this.id++;
      this.incapacidad.id = this.id; 
      // this.miembros.push(this.miembro);
      this.incapacidades.push(this.incapacidad)

  }

    this.listIncapacidades.emit(this.incapacidades);
    this.productDialog = false;
    this.incapacidad = {};
    this.id = null;
    this.borrarIncapcidad();
     
  }
  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.incapacidadess.length; i++) {
        if (this.incapacidadess[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

  private borrarIncapcidad(){
    this.tipo = null;
    this.cie10 = '';
    this.diagnostico = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.diasAusencia = null;
    }

  editProduct(product: Incapacidad) {
    this.GuardadoEdicion=false;
    console.log(product);
    
    this.tipo = product.tipo;
    this.cie10 = product.cie10;
    this.diagnostico = product.diagnostico;
    this.fechaInicio = new Date(product.fechaInicio);
    this.fechaFin = new Date(product.fechaFin);
    this.diasAusencia = product.diasAusencia;
    this.id = product.id  

    this.incapacidad = {...product};
    this.productDialog = true;
}

editarProduct(){
  this.submitted = true;
  console.log("save");
  console.log(this.cie10);
  

  
  this.tipo == null ? this.incapacidad.tipo:this.tipo
  this.cie10.codigo == null ?  this.incapacidad.cie10: this.cie10.codigo
  this.cie10.nombre == null ?  this.incapacidad.diagnostico:this.cie10.nombre
  this.fechaInicio == null ?  this.incapacidad.fechaInicio:this.fechaInicio
  this.fechaFin == null ?  this.incapacidad.fechaFin:this.fechaFin
  this.diasAusencia == null ?  this.incapacidad.diasAusencia:this.diasAusencia

  this.incapacidad.tipo = this.tipo
  this.incapacidad.cie10 = (this.cie10.codigo)?this.cie10.codigo:null;
  this.incapacidad.diagnostico = this.cie10.nombre
  this.incapacidad.fechaInicio = this.fechaInicio
  this.incapacidad.fechaFin = this.fechaFin
  this.incapacidad.diasAusencia = this.diasAusencia;

  this.incapacidades.push(this.incapacidad);

  this.listIncapacidades.emit(this.incapacidades);
  this.productDialog = false;
  this.incapacidad = {};

  this.borrarIncapcidad();
   
}

deleteProduct(product: Incapacidad) {
    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar ' + product.cie10 + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            // this.incapacidades = this.incapacidades.filter(val => val.cie10 !== product.cie10);
            // this.incapacidad = {};
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            this.incapacidades.splice((product.id-1),1)
            console.log(this.incapacidades);
            let tempid=0;
            this.incapacidades.forEach(element => {
                console.log(element);
                tempid++
                element.id = tempid;
            });
            console.log(this.incapacidades);
            this.incapacidad = {};
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'miembro Deleted', life: 3000});
        }
    });
}
  
}
