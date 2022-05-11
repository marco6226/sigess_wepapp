import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { MiembroEquipo } from './miembro-equipo';

@Component({
  selector: 'app-miembros-equipo',
  templateUrl: './miembros-equipo.component.html',
  styleUrls: ['./miembros-equipo.component.scss'],
  providers: [MessageService]
})
export class MiembrosEquipoComponent implements OnInit {

  productDialog: boolean;
  submitted: boolean;

  selectedProducts;

  miembros: MiembroEquipo[]
  miembro: MiembroEquipo;
  nombre: string;
  cargo: string;
  division: string;
  localidad: string;
  id: number=0;
  constructor(
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

  ngOnInit(): void {
    // this.productService.getProducts().then(data => this.products = data);
    this.miembros = [];
  }

  openNew() {
    this.miembro = {};    
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.miembros = this.miembros.filter(val => !this.selectedProducts.includes(val));
            this.selectedProducts = null;
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        }
    });
}

editProduct(product: MiembroEquipo) {
    console.log(product);
    
    this.miembro = {...product};
    this.productDialog = true;
}

deleteProduct(product: MiembroEquipo) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.nombre + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.miembros = this.miembros.filter(val => val.id !== product.id);
            this.miembro = {};
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
        }
    });
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}

saveProduct() {
    this.submitted = true;
console.log("save");

this.miembro.nombre = this.nombre;
this.miembro.cargo = this.cargo;
this.miembro.division = this.division;
this.miembro.localidad = this.localidad;

    // if (this.miembro.nombre.trim()) {
        // if (this.miembro.id) {
            this.id++;
            this.miembro.id = this.id; 
            this.miembros.push(this.miembro);
            // this.miembros[this.findIndexById(this.miembro.id)] = this.miembro;                
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        // }
        // else {
        //   this.miembro.id=1;
        //     // this.miembro.id = this.createId();
        //     // this.product.image = 'product-placeholder.svg';
        //     this.miembros.push(this.miembro);
        //     // this.miembros.push()
        //     // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        // }

        // this.miembros = [...this.miembros];
        this.productDialog = false;
        this.miembro = {};
        this.borrarMiembro();
        if(this.miembros.length%2==0){
            this.showError();
        }
    // }
}

findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.miembros.length; i++) {
        if (this.miembros[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

private borrarMiembro(){
this.nombre = '';
this.cargo = '';
this.division = '';
this.localidad = '';
}

showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'La cantidad de los miembros del equipo deben ser impares'});
}

}
