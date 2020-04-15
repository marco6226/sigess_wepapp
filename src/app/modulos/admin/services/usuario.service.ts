import { Injectable } from '@angular/core';

import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class UsuarioService extends ServiceCRUD<Usuario>{
  
  
  aceptarTerminos(acepta: boolean): any {
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'terminos/' + acepta, null)
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

  consultarHistoriaLogin(){
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'historiaLogin/')
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


  cambiarPasswd(newPasswd: string, newPasswdConfirm: string, oldPasswd: string) {
    let body = { 'passwdAnterior': oldPasswd, 'passwdNuevo': newPasswd, 'passwdNuevoConfirm': newPasswdConfirm };
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'cambiarPasswd', JSON.stringify(body))
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

  /**
   * Modifica los datos de usuario por parte del mismo usuario.
   * No es permitido que un usuario modifique datos de otro a través
   * éste servicio
   * @param entity 
   */
  edit(entity: Usuario) {
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


  getClassName(): string {
    return "UsuarioService";
  }
}
