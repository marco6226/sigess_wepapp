
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SistemaGestion } from 'app/modulos/sg/entities/sistema-gestion'
import { SistemaGestionService } from 'app/modulos/sg/services/sistema-gestion.service';
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'


@Component({
  selector: 'app-sistema-gestion',
  templateUrl: './sistema-gestion.component.html',
  styleUrls: ['./sistema-gestion.component.scss'],
})
export class SistemaGestionComponent implements OnInit {

  sistemaGestionList: SistemaGestion[] = [];

  constructor(
    private sistemaGestionService: SistemaGestionService,
    private sesionService: SesionService,
    private router: Router,
  ) { }

  ngOnInit() {
    let filterQuery = new FilterQuery();

    this.sistemaGestionService.findByFilter(filterQuery).then(
      data => this.sistemaGestionList = <SistemaGestion[]>data
    );
  }

  gotoSGEForm(sge: SistemaGestion, action: string) {
    this.router.navigate(['/app/sg/sgeForm',
      { id: sge.sistemaGestionPK.id, version: sge.sistemaGestionPK.version, action: action }]);
  }

  realizarEvaluacion(sge: SistemaGestion){
    this.router.navigate(['/app/sg/evaluacion',
      { id: sge.sistemaGestionPK.id, version: sge.sistemaGestionPK.version}]);
  }

  navegar(){
    this.router.navigate(['/app/sg/sgeForm']);
  }
}
