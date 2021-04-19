import { Component, OnInit, Input } from '@angular/core';

import { Documento } from 'app/modulos/ado/entities/documento'
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Router } from '@angular/router';

@Component({
  selector: 's-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.scss']
})
export class DocumentoFormComponent implements OnInit {

  @Input("documento") documento: Documento;
  localeES = locale_es;

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
