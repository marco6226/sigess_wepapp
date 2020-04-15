import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Inspeccion } from 'app/modulos/inspecciones/entities/inspeccion'
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class InspeccionService extends ServiceCRUD<Inspeccion>{


  consultarConsolidado(desde: Date, hasta: Date, listaId: string, listaVersion: number) {
    let params = "?desde=" + encodeURIComponent(desde.toUTCString()) + "&hasta=" + encodeURIComponent(hasta.toUTCString()) + "&listaId=" + listaId + "&listaVersion=" + listaVersion;
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
      };
      this.httpInt.http.get(this.end_point + "consolidado/" + params, options)
        .map(res => res)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageBlobError(err)
          }
        )
    });
  }

  getClassName(): string {
    return "InspeccionService";
  }


}
