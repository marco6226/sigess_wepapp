import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { ListaInspeccionPK } from 'app/modulos/inspecciones/entities/lista-inspeccion-pk'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service';
import { SesionService } from 'app/modulos/core/services/sesion.service';

@Injectable()
export class ListaInspeccionService extends ServiceCRUD<ListaInspeccion>{
  
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

  findByPK(pk:ListaInspeccionPK) {
    return super.find(("id;id=" + pk.id + ";version=" + pk.version));
  }

  getClassName(): string {
    return "ListaInspeccionService";
  }

  public getInspeccionImagen(lista_id, version_id) {
    return this.http.get(`${this.end_point}images/${lista_id}/${version_id}`, this.getRequestHeaders(this.headers)).toPromise();
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
