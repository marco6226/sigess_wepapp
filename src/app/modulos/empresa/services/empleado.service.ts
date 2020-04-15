import { Injectable } from '@angular/core';
import { endPoints } from 'environments/environment'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class EmpleadoService extends ServiceCRUD<Empleado> {


  /**
 * Modifica los datos de usuario por parte del mismo empleado.
 * No es permitido que un usuario modifique datos de otro a través
 * éste servicio
 * @param entity 
 */
  edit(entity: Empleado) {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'update', body)
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

  loadAll(list: Empleado[]) {
    let body = JSON.stringify(list);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "loadAll", body)
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

  buscar(parametro: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.EmpleadoService + "buscar/" + parametro)
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
    return "EmpleadoService";
  }
}
