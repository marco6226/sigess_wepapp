import { Component, OnInit, Input } from '@angular/core';

import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { Message } from 'primeng/primeng'

@Component({
  selector: 's-adminContratistas',
  templateUrl: './admin-contratistas.component.html',
  styleUrls: ['./admin-contratistas.component.scss'],
  providers: [EmpresaService]
})
export class AdminContratistasComponent implements OnInit {

  msgs: Message[];
  empresasList: Empresa[];
  dlgVisible: boolean;
  empresa: Empresa;
  styleMap: { [key: string]: string } = {};
  @Input() flagConsult: boolean=false;

  constructor(
    private sesionService: SesionService,
    private empresaService: EmpresaService,
  ) {
    this.empresa = this.sesionService.getEmpresa();
    let filterQuery = new FilterQuery();
    let filter = new Filter();
    filter.criteria = Criteria.NOT_EQUALS;
    filter.field = "id";
    filter.value1 = this.empresa.id;;
    filterQuery.filterList = [filter];
    this.empresaService.findByFilter(filterQuery).then(
      resp => this.cargarEmpresas(<any[]>resp['data'])
    );
  }

  cargarEmpresas(data: Empresa[]) {
    this.empresasList = data;
    this.empresaService.obtenerContratistas(this.empresa.id).then(
      resp => {
        let empresasContratistasList = <Empresa[]>resp;
        this.empresasList.forEach((emp) =>
          empresasContratistasList.forEach(
            empCont => {
              if (emp.id == empCont.id) emp['vinculado'] = true
            }
          )
        );
        this.styleMap['true'] = 'active-no-hover';
      }
    );
  }

  ngOnInit() {

  }

  actualizarVinculacion(empresa: any) {
    this.empresaService.vincularContratista(empresa).then(
      data => {
        let vinculado = <boolean>data;
        let resultado = (vinculado ? 'vinculado' : 'desvinculado');
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Contratista ' + resultado,
          detail: 'Se ha ' + resultado + ' correctamente la empresa ' + empresa.razonSocial + ' como contratista'
        });
      }
    );
  }

}
