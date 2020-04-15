import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { SistemaCausaAdministrativa } from 'app/modulos/sec/entities/sistema-causa-administrativa'

@Injectable()
export class SistemaCausaAdministrativaService extends ServiceCRUD<SistemaCausaAdministrativa>{

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "seleccionado/")
        .map(res => res)
        .subscribe(
          res => resolve(res),
          err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "SistemaCausaAdministrativaService";
  }

}
