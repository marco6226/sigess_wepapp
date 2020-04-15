import { Injectable } from '@angular/core';
import { Hht } from 'app/modulos/empresa/entities/hht'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class HhtService extends ServiceCRUD<Hht>{

  findByAnio(anio: number) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "anio/" + anio)
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
    return "HhtService";
  }
}
