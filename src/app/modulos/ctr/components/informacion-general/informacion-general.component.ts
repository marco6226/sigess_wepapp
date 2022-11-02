import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-informacion-general',
  templateUrl: './informacion-general.component.html',
  styleUrls: ['./informacion-general.component.scss']
})
export class InformacionGeneralComponent implements OnInit {

  @Output() dataRepLegal =new EventEmitter<string>();
  @Output() dataNumTrabajadores =new EventEmitter<number>();
  @Output() dataNumTrabajadoresAsig =new EventEmitter<number>();

  @Input() repLegal:string='';
  @Input() numTrabajadores=0;
  @Input() numTrabajadoresAsig=0;

  constructor() { }

  ngOnInit() {
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
}
