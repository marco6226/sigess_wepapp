import { Component, OnInit } from '@angular/core';
import { EvaluacionDesempeno } from '../../entities/evaluacion-desempeno';
import { Message } from 'primeng/api';
import { FilterQuery } from '../../../core/entities/filter-query';
import { EvaluacionDesempenoService } from '../../services/evaluacion-desempeno.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';

@Component({
  selector: 's-evaluacionDesempeno',
  templateUrl: './evaluacion-desempeno.component.html',
  styleUrls: ['./evaluacion-desempeno.component.scss'],
  providers: [EvaluacionDesempenoService]
})
export class EvaluacionDesempenoComponent implements OnInit {


  msgs: Message[] = [];
  evalDesempList: EvaluacionDesempeno[];
  evalDesempSelect: EvaluacionDesempeno;
  visibleForm: boolean;
  isUpdate: boolean;

  loading: boolean = true;
  totalRecords: number;
  fields: string[] = [
    'id',
    'fechaElaboracion',
    'empleado_id',
    'empleado_primerNombre',
    'empleado_primerApellido',
    'empleado_numeroIdentificacion',
    'cargo_id',
    'cargo_nombre',
    'empleado_usuario_id',
    'empleado_usuario_icon',
  ];

  constructor(
    private paramNavService: ParametroNavegacionService,
    private evalDesempService: EvaluacionDesempenoService,
  ) { }

  ngOnInit() {
  }


  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.evalDesempService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.evalDesempList = [];
        (<any[]>resp['data']).forEach(dto => this.evalDesempList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  redireccionarForm(accion: string) {
    this.paramNavService.setAccion(accion);
    if (accion == 'POST') {
      this.paramNavService.redirect('app/empresa/evaluacionDesempenoForm');
    } else {
      this.paramNavService.setParametro(this.evalDesempSelect);
      this.paramNavService.redirect('app/empresa/evaluacionDesempenoForm');
    }
  }


}
