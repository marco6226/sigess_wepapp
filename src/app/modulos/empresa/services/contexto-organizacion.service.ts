import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ContextoOrganizacion } from '../entities/contexto-organizacion';

@Injectable()
export class ContextoOrganizacionService extends ServiceCRUD<ContextoOrganizacion>{

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "?")
        .map(res => res)
        .subscribe(
          res => {
            console.log((<any>res)._body);
            if ((<any>res)._body === undefined || (<any>res)._body == null || (<any>res)._body === "") {
              resolve(null);
            } else {
              resolve(res);
            }

          }
          ,
          err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "ContextoOrganizacionService";
  }
}
