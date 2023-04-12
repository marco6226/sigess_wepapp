import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { HttpHeaders } from '@angular/common/http'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { SistemaCausaInmediata } from 'app/modulos/sec/entities/sistema-causa-inmediata'
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service';

@Injectable()
export class SistemaCausaInmediataService extends ServiceCRUD<SistemaCausaInmediata>{

  headers: HttpHeaders = new HttpHeaders();

  constructor(
    httpInt: HttpInt,
    private sessionService: SesionService,
    messageUsuarioService: MensajeUsuarioService
  ){
    super(httpInt, messageUsuarioService);
  }

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "seleccionado/")
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

  findDefault2(idEmpresa: number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + "seleccionado2/" + idEmpresa)
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
    })
  }

  getClassName(): string {
    return "SistemaCausaInmediataService";
  }

}
