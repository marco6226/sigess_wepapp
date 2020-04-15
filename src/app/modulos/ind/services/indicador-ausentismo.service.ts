import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { IndicadorAusentismo } from 'app/modulos/ind/entities/indicador-ausentismo'

@Injectable()
export class IndicadorAusentismoService extends ServiceCRUD<IndicadorAusentismo>{

  findByAnioCausa<T>(anio: number, causaId: string, empresaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + anio + "/" + causaId + "/" + (empresaId == null ? 0 : empresaId))
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

  indCaract(rangos: any[], empresaId: string) {
    let strRango: string = '{';
    rangos.forEach(rango => {
      strRango += '"[';
      strRango += rango.desde.toISOString();
      strRango += ',';
      strRango += rango.hasta.toISOString();
      strRango += ']",';
    });
    strRango = strRango.substring(0, strRango.length == 1 ? 1 : strRango.length - 1);
    strRango += '}';

    return new Promise(resolve => {
      this.httpInt.get(this.end_point + '?' + 'empresa_id=' + empresaId + '&rango=' + strRango)
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

  getClassName() {
    return "IndicadorAusentismoService";
  }

}
