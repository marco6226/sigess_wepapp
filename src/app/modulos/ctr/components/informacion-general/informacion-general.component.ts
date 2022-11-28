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

  @Input() autorizacionSubcontratacion: string = 'No';
  @Input() subcontratacionList: object[] = [
    {
      nit: '1123546',
      razonSocial: 'abcdef',
      tareasAltoRiesgo: 'Si',
      certificado: 'www.cert.pdf'
    },
    {
      nit: '4652122',
      razonSocial: 'qweasd',
      tareasAltoRiesgo: 'No',
      certificado: 'www.cert.pdf'
    }
  ];
  selectedSubcontratacion: object;
  arlList: object[] = [
    {
      name: 'arl 1',
      value: 'arl 1',
    },
    {
      name: 'arl 2',
      value: 'arl 2',
    },
    {
      name: 'arl 3',
      value: 'arl 3',
    }
  ]
  selectedArl: string;

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
