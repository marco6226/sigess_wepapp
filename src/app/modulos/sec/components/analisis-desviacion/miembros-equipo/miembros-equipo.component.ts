import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/primeng';
import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { MiembroEquipo } from './miembro-equipo';

@Component({
  selector: 'app-miembros-equipo',
  templateUrl: './miembros-equipo.component.html',
  styleUrls: ['./miembros-equipo.component.scss'],
  providers: [MessageService]
})
export class MiembrosEquipoComponent implements OnInit {
  @Output()miembrosOut=new EventEmitter<MiembroEquipo[]>();
  @Output()selectedProductsOUT= new EventEmitter<any[]>();
  @Input()miembrosList: MiembroEquipo[] = []
  @Output() disable = new EventEmitter<boolean>();

  productDialog: boolean;
  submitted: boolean;

  selectedProducts;
//   disable:boolean=false;
  miembros: MiembroEquipo[]
  miembro: MiembroEquipo;
  cedula: number;
  nombre: string;
  cargo: string;
  division: string;
  localidad: string;
  id: number=0;

  DivisionList= [
    { label: "--Seleccione--", value: null },
    { label: "Almacenes Corona", value: "Almacenes Corona" },
    { label: "Bathrooms and Kitchen", value: "Bathrooms and Kitchen" },
    { label: "Comercial Corona Colombia", value: "Comercial Corona Colombia" },
    { label: "Funciones Transversales", value: "Funciones Transversales" },
    { label: "Insumos Industriales y Energias", value: "Insumos Industriales y Energias" },
    { label: "Mesa Servida", value: "Mesa Servida" },
    { label: "Superficies, materiales y pinturas", value: "Superficies, materiales y pinturas" },

]
  constructor(
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

  ngOnInit(): void {
    // this.productService.getProducts().then(data => this.products = data);
    // this.miembros = [];
    // this.salida();
    this.disable.emit(false)
  }

  openNew() {
    this.miembro = {};    
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar los productos seleccionados?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.miembrosList = this.miembrosList.filter(val => !this.selectedProducts.includes(val));
            this.selectedProducts = null;
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        }
    });
}
salida(){
    this.miembrosOut.emit(this.miembros);
    this.selectedProductsOUT.emit(this.selectedProducts);
}
editProduct(product: MiembroEquipo) {
    console.log(product);
    this.cedula = product.cedula;
    this.nombre = product.nombre;
    this.cargo = product.cargo;
    this.division = product.division;
    this.localidad = product.localidad;
    this.id = product.id

    // let x = this.miembrosList.find(ele=>{
    //     return ele.id == product.id
    // })

    // console.log(x);
    
    this.miembro = {...product};
    console.log(this.miembro);
    
    this.productDialog = true;
}

deleteProduct(product: MiembroEquipo) {
    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar ' + product.nombre + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            // this.miembrosList = this.miembrosList.filter(val => val.id !== product.id);
            this.miembrosList.splice((product.id-1),1)
            console.log(this.miembrosList);
            let tempid=0;
            this.miembrosList.forEach(element => {
                console.log(element);
                tempid++
                element.id = tempid;
            });
            console.log(this.miembrosList);
            this.miembro = {};
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'miembro Deleted', life: 3000});
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

    this.miembro.cedula=this.cedula;
    this.miembro.nombre = this.nombre;
    this.miembro.cargo = this.cargo;
    this.miembro.division = this.division;
    this.miembro.localidad = this.localidad;

    if(this.id){
        let x = this.miembrosList.find(ele=>{
            return ele.id == this.id
        })
        x.nombre = this.nombre;
        x.cargo=this.cargo;
        x.cedula=this.cedula;
        x.localidad=this.localidad;
        x.division=this.division;
        }else{
        this.id = this.miembrosList.length;
        this.id++;
        this.miembro.id = this.id; 
        // this.miembros.push(this.miembro);
        this.miembrosList.push(this.miembro)

    }

    // if (this.miembro.nombre.trim()) {
        // if (this.miembro.id) {
            
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
        this.id = null;
        this.borrarMiembro();
        if(this.miembrosList.length%2==0){
            this.disable.emit(true)
            // this.disable=true;
            this.showError();
        }else{
            this.disable.emit(false)
            // this.disable=false;
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

// createId(): string {
//     let id = '';
//     var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for ( var i = 0; i < 5; i++ ) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// }

private borrarMiembro(){
this.cedula=null;
this.nombre = '';
this.cargo = '';
this.division = '';
this.localidad = '';
}

showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'La cantidad de los miembros del equipo deben ser impares'});
}

}
