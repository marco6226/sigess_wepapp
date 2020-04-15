import { Injectable } from '@angular/core';
import { Competencia } from 'app/modulos/empresa/entities/competencia'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class CompetenciaService extends ServiceCRUD<Competencia>{

  getClassName(): string {
    return "CompetenciaService";
  }
}
