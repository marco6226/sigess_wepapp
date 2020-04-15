import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { IndicadorAusentismo } from 'app/modulos/ind/entities/indicador-ausentismo'

@Injectable()
export class IndicadorEmpresaService extends ServiceCRUD<IndicadorAusentismo>{


  consultar(rangos: any[], empleadoId: string) {
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
      this.httpInt.get(this.end_point + 'evaluacionDesempeno' + '?' + 'rango=' + strRango+ (empleadoId != null ? ('&empleado_id=' + empleadoId) : ''))
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
    return "IndicadorEmpresaService";
  }

}
