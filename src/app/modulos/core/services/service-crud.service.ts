import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service'
import { MensajeUsuario } from 'app/modulos/core/entities/mensaje-usuario'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Observable } from 'rxjs/Rx';
import { CambioPasswdService } from '../../comun/services/cambio-passwd.service';
import { retryWhen } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export abstract class ServiceCRUD<T> {

  end_point: string = endPoints[this.getClassName()];

  protected retryFunction = error => {
    return error.flatMap((error: any) => {
      return Observable.throw(error);
    }).take(5).concat(Observable.throw({ error: 'Sorry, there was an error (after 5 retries)' }));
  };

  constructor(
    public httpInt: HttpInt,
    public mensajeUsuarioService: MensajeUsuarioService
  ) {

  }

  abstract getClassName(): string;

  public buildUrlParams(filterQuery: FilterQuery): string {
    let urlParam = '';
    if (filterQuery == null) {
      return urlParam;
    }
    if (filterQuery.offset != null) {
      urlParam += 'offset=' + filterQuery.offset + '&';
    }
    if (filterQuery.rows != null) {
      urlParam += 'rows=' + filterQuery.rows + '&';
    }
    if (filterQuery.count != null) {
      urlParam += 'count=' + filterQuery.count + '&';
    }
    if (filterQuery.sortField != null) {
      urlParam += 'sortField=' + filterQuery.sortField + '&';
    }
    if (filterQuery.sortOrder != null) {
      urlParam += 'sortOrder=' + filterQuery.sortOrder + '&';
    }
    if (filterQuery.filterList != null) {
      urlParam += 'filterList=' + encodeURIComponent(JSON.stringify(filterQuery.filterList)) + '&';
    }
    if (filterQuery.fieldList != null) {
      let fieldParam = 'fieldList=';
      filterQuery.fieldList.forEach(field => {
        fieldParam += field + ',';
      });
      fieldParam.slice(0, fieldParam.length - 1);
      urlParam += fieldParam;
    }
    if (urlParam[urlParam.length - 1] === '&') {
      urlParam = urlParam.slice(0, urlParam.length - 1);
    }
    return urlParam;
  }

  findByFilter(filterQuery?: FilterQuery) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + '?' + this.buildUrlParams(filterQuery))
        .retryWhen(this.retryFunction)
        .map(res => res)
        .subscribe(
          res => {
            //console.log(res);
            resolve(res);
          }
          ,
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  // count<T>(filterQuery?: FilterQuery) {
  //   return new Promise(resolve => {
  //     this.httpInt.get(this.end_point + "count?" + this.buildUrlParams(filterQuery))
  //       .map(res => res)
  //       .subscribe(
  //         res => {
  //           resolve((<any>res)._body);
  //         },
  //         err => this.manageError(err)
  //       )
  //   });
  // }

  find(id: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + id)
        .retryWhen(this.retryFunction)
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



  findAll<T>() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point)
        .retryWhen(this.retryFunction)
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

  create(entity: T) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point, body)
        .retryWhen(this.retryFunction)
        .map(res => res)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => {
            reject(err);
            this.manageError(err);
          }
        )
    });
  }

  update(entity: T, params?: string) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + (params == null ? '' : '?'.concat(params)), body)
        .retryWhen(this.retryFunction)
        .map(res => res)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => {
            reject(err);
            this.manageError(err);
          }
        )
    });
  }


  delete(id: string) {
    return new Promise((resolve, reject) => {
      let end_point =
        this.httpInt.delete(this.end_point + id)
          .retryWhen(this.retryFunction)
          .map(res => res)
          .subscribe(
            res => {
              resolve(res);
            }
            ,
            err => {
              reject(err);
              this.manageError(err);
            }
          )
    });
  }

  manageError(errResp: any) {

    //console.log("managing error...");
    let msg: MensajeUsuario;
    try {
      msg = <MensajeUsuario>errResp.error;
    } catch (error) {
      msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: errResp };
    }
    this.mensajeUsuarioService.showMessage({
      mensaje: msg.mensaje,
      detalle: msg.detalle,
      tipoMensaje: msg.tipoMensaje
    });
  }

  manageBlobError(err: any) {
    let usrMsgService = this.mensajeUsuarioService;

    var reader = new FileReader();
    reader.onload = function () {
      let msg: MensajeUsuario;
      try {
        msg = <MensajeUsuario>JSON.parse(<string>reader.result);
      } catch (error) {
        msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: <string>reader.result };
      }
      usrMsgService.showMessage({
        mensaje: msg.mensaje,
        detalle: msg.detalle,
        tipoMensaje: msg.tipoMensaje
      });
    }
    reader.readAsText(err.error);
  }

}
