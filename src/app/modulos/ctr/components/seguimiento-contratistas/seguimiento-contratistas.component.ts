import { Component, OnInit,Input } from '@angular/core';

import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { Message } from 'primeng/primeng'

@Component({
  selector: 's-seguimientoContratistas',
  templateUrl: './seguimiento-contratistas.component.html',
  styleUrls: ['./seguimiento-contratistas.component.scss'],
  providers: [EmpresaService]
})
export class SeguimientoContratistasComponent implements OnInit {

  msgs: Message[];
  empresasList: Empresa[];
  empresa: Empresa;
  visibleDash:boolean;
  @Input() flagConsult: boolean=false;

  constructor(
    private sesionService: SesionService,
    private empresaService: EmpresaService,
  ) {
    this.empresa = this.sesionService.getEmpresa();
    this.empresaService.obtenerContratistas(this.empresa.id).then(
      data => this.empresasList = <Empresa[]>data
    );
  }

  ngOnInit() {

  }

}
