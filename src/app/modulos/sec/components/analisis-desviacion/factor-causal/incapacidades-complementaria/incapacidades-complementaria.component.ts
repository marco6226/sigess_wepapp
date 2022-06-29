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


  
  @Input() incapacidades: Incapacidad[];
  @Output() listIncapacidades = new EventEmitter<Incapacidad[]>()
  productDialog: boolean;
  submitted: boolean;
  selectedProducts;

  // incapacidades: Incapacidad[];
  incapacidad: Incapacidad;
  tipo: string;
  cie10: any;
  diagnostico: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasAusencia: number;
  localeES: any = locale_es;

  tipoList = [
    // { label: 'Seleccione', value: null },
    { label: 'Inicial', value: 'Inicial' },
    { label: 'Prorroga', value: 'Prorroga' },
  ];

  constructor(
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {
    if (this.incapacidades==null) {
      this.incapacidades = [];
    }
  }

  test(){
    console.log(this.incapacidades);
    
  }
  get daysCount() {

   
    let fecha1 = moment(this.fechaInicio);

    let fecha2 = moment(this.fechaFin);

    this.diasAusencia =  Math.abs(fecha1.diff(fecha2, "days"));

    return this.diasAusencia;
}

  openNew(){
    this.incapacidad = {};    
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
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
    console.log(this.cie10);
    

    this.incapacidad.tipo = this.tipo
    this.incapacidad.cie10 = this.cie10.codigo
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

  private borrarIncapcidad(){
    this.tipo = null;
    this.cie10 = '';
    this.diagnostico = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.diasAusencia = null;
    }

  editProduct(product: Incapacidad) {
    console.log(product);
    
    this.tipo = product.tipo;
    this.cie10 = product.cie10;
    this.diagnostico = product.diagnostico;
    this.fechaInicio = product.fechaInicio;
    this.fechaFin = product.fechaFin;
    this.diasAusencia = product.diasAusencia;

    this.incapacidad = {...product};
    this.productDialog = true;
}

deleteProduct(product: Incapacidad) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.cie10 + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.incapacidades = this.incapacidades.filter(val => val.cie10 !== product.cie10);
            this.incapacidad = {};
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
        }
    });
}
  
}
