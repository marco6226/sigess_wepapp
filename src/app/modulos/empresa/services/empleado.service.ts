import { Injectable } from '@angular/core';
import { endPoints } from 'environments/environment'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { HttpInt } from 'app/httpInt'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class EmpleadoService extends ServiceCRUD<Empleado> {

  httpInt;
  headers;

  constructor(
    httpInt: HttpInt,
    mensajeUsuarioService: MensajeUsuarioService,
    private http: HttpClient,
    public sesionService: SesionService,
    ) {
        super(httpInt, mensajeUsuarioService)
    }
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

  
  findempleadoByUsuario(parametro: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.EmpleadoService + "buscarempleado/" + parametro)
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

  public getFirma(empleado_id) {
    return this.http.get(`${this.end_point}images/${empleado_id}`, this.getRequestHeaders(this.headers)).toPromise();
  }

  getRequestHeaders(headers?: HttpHeaders): any {
    if (headers == null)
        headers = new HttpHeaders().set('Content-Type', 'application/json');

    headers = headers
        .set('Param-Emp', this.sesionService.getParamEmp())
        .set('app-version', this.sesionService.getAppVersion())
        .set('Authorization', this.sesionService.getBearerAuthToken());
    return { 'headers': headers };
}
}
