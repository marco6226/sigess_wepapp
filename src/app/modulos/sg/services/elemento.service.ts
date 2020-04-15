import { Injectable } from '@angular/core';

import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Elemento } from 'app/modulos/sg/entities/elemento'

@Injectable()
export class ElementoService extends ServiceCRUD<Elemento>{

  actualizarDocumentos(elemento: Elemento) {
    let body = JSON.stringify(elemento);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point, body)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "ElementoService";
  }

}
