import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ComunService } from 'app/modulos/comun/services/comun.service';

@Component({
  selector: 'app-informacion-general',
  templateUrl: './informacion-general.component.html',
  styleUrls: ['./informacion-general.component.scss']
})
export class InformacionGeneralComponent implements OnInit {

  @Output() dataRepLegal =new EventEmitter<string>();
  @Output() dataNumTrabajadores =new EventEmitter<number>();
  @Output() dataNumTrabajadoresAsig =new EventEmitter<number>();
  @Output() dataEmailComercial =new EventEmitter<string>();
  @Output() dataTelefonoContacto =new EventEmitter<string>();
  @Output() dataArl =new EventEmitter<string>();
  @Output() dataAutorizaSubcontratacion =new EventEmitter<boolean>();

  @Input() repLegal:string='';
  @Input() numTrabajadores=0;
  @Input() numTrabajadoresAsig=0;
  @Input() emailComercial:string='';
  @Input() telefonoContacto:string='';
  @Input('selectedArl')
  set setSelectedArl(data: string){
    if(data){
      this.selectedArl = {name: data, value: data};
    }
  } 
  @Input('autorizaSubcontratacion')
  set setAutorizaSubcontratacion(data: boolean){
    if(data){
      this.autorizaSubcontratacion = 'Si';
    }else{
      this.autorizaSubcontratacion = 'No';
    }
  }
  @Input() onEdit: string = '';

  arlList: Array<object>;
  selectedArl: any;
  autorizaSubcontratacion: string;

  constructor(
    private comunService: ComunService,
  ) { }

  ngOnInit() {
    this.loadArlList();
  }

  onRepLegal(){
    this.dataRepLegal.emit(this.repLegal);
  }

  onNumTrabajadores(){
    this.dataNumTrabajadores.emit(this.numTrabajadores);
  }

  onNumTrabajadoresAsig(){
    this.dataNumTrabajadoresAsig.emit(this.numTrabajadoresAsig);
  }

  onEmailComercial(){
    this.dataEmailComercial.emit(this.emailComercial);
  }

  onTelefonoContacto(){
    this.dataTelefonoContacto.emit(this.telefonoContacto);
  }

  onSelectArl(){
    this.dataArl.emit(this.selectedArl.value);
  }

  onAutorizaSubcontratacion(){
    if(this.autorizaSubcontratacion && this.autorizaSubcontratacion == 'Si'){
      this.dataAutorizaSubcontratacion.emit(true);
    }else{
      this.dataAutorizaSubcontratacion.emit(false);
    }
  }

  async loadArlList(){
    await this.comunService.findAllArl().then(
      resp => {
        // console.table(resp);
        let data: any = resp;
        this.arlList = data.map(item => {
          return {name: item.nombre, value: item.nombre}
        });
      }
    );
    console.log(this.arlList);
  }
}
