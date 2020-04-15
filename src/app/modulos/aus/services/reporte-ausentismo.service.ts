import { Injectable } from '@angular/core';
import { ReporteAusentismo } from 'app/modulos/aus/entities/reporte-ausentismo'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class ReporteAusentismoService extends ServiceCRUD<ReporteAusentismo>{

  getClassName() {
    return "ReporteAusentismoService";
  }

}
