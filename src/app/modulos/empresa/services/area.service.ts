import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Area } from 'app/modulos/empresa/entities/area'

@Injectable()
export class AreaService extends ServiceCRUD<Area> {


  /*
  findByEmpresa(empresaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.area + "empresa/" + empresaId)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res.json());
        }
        ,
        err => console.log(err)
        )
    });
  }
  */

  findByAreapadre(areaPadreId) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.area + "areaPadre/" + areaPadreId)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

  getClassName() : string{
    return "AreaService";
  }

}
