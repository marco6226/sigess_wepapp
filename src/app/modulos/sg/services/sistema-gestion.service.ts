import { Injectable } from '@angular/core';

import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

import { SistemaGestion } from 'app/modulos/sg/entities/sistema-gestion'

@Injectable()
export class SistemaGestionService extends ServiceCRUD<SistemaGestion>{

  findById(id: string, version: number) {
    return super.find(("id;id=" + id + ";version=" + version));
  }

  findByEvaluacion(evaluacionId: string) {
    return super.find("evaluacion/" + evaluacionId);
  }

  getClassName(): string {
    return "SistemaGestionService";
  }
}
