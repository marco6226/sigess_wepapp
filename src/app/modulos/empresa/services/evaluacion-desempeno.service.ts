import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { EvaluacionDesempeno } from '../entities/evaluacion-desempeno';

@Injectable()
export class EvaluacionDesempenoService extends ServiceCRUD<EvaluacionDesempeno>{


  getClassName(): string {
    return "EvaluacionDesempenoService";
  }
}
