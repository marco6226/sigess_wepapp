import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Message } from 'primeng/primeng'

@Component({
  selector: 's-empresaDash',
  templateUrl: './empresa-dash.component.html',
  styleUrls: ['./empresa-dash.component.scss']
})
export class EmpresaDashComponent implements OnInit {

  grupoIconos: any = {
    'icon-aue': true,
    'icon-inp': false,
    'icon-aus': false,
    'icon-rai': false
  };

  @Input("empresa") empresa: Empresa;

  visible: boolean;
  msgs: Message[];

  constructor() {

  }

  ngOnInit() {

  }

  onIconClick(nombre: string) {
    this.grupoIconos = {
      'icon-aue': false,
      'icon-inp': false,
      'icon-aus': false,
      'icon-rai': false
    };
    this.grupoIconos[nombre] = true;
  }
}
