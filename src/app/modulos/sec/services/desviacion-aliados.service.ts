import { Injectable } from '@angular/core';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { DesviacionAliados } from '../entities/desviacion-aliados';

@Injectable()
export class DesviacionAliadosService extends ServiceCRUD<DesviacionAliados>{
  
  getClassName(): string {
    return "DesviacionAliadosService";
  }

  getRepWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'reportesAliados/?' + this.buildUrlParams(filterQuery))
      .map(res => res)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

}
