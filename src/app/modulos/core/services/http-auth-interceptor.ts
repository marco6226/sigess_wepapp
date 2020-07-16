import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { MensajeUsuario } from '../entities/mensaje-usuario';
import { CambioPasswdService } from '../../comun/services/cambio-passwd.service';
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  inflightAuthRequest: Observable<HttpEvent<any>> = null;
 
  constructor(
    public sesionService: SesionService,
    public authService: AuthService,
    public cambioPasswdService: CambioPasswdService,
    public mensajeUsuarioService: MensajeUsuarioService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        let msg: MensajeUsuario;
        if (req.params != null && req.responseType == 'blob') {
          // Si el tipo de response es blob, se debe leer la respuesta como un blob
          var reader = new FileReader();
          // Se crea un nuevo observable debido a la naturaleza asincrona de la api FileReader
          let observ: Observable<HttpEvent<any>> = Observable.create(observer => {
            reader.onload = (): any => {
              try {
                msg = <MensajeUsuario>JSON.parse(<string>reader.result);
              } catch (error) {
                msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: <string>reader.result };
              }
              observer.next();
              observer.complete();
            }
          }).switchMap(resp => { return this.getObservable(msg, error, req, next) });

          reader.readAsText(error.error);
          return observ;
        } else {
          // Por defecto se asume la respuesta como json
          msg = error.error;
          return this.getObservable(msg, error, req, next);
        }
      })
    );

  }

  getObservable(msg: MensajeUsuario, error, req: HttpRequest<any>, next): Observable<HttpEvent<any>> {
    switch (msg.codigo) {
      case 1_001:
        console.log(msg);
        if (!this.inflightAuthRequest) {
          this.inflightAuthRequest = this.authService.refreshToken();
          if (!this.inflightAuthRequest) {
            return throwError(error);
          }
        }
        return <Observable<HttpEvent<any>>>this.inflightAuthRequest.pipe(
          switchMap(res => {
            // unset inflight request
            this.inflightAuthRequest = null;

            // clone the original request
            let paramEmp = req.headers.get('param-emp') != null ? '' + req.headers.get('param-emp') : '';
            let headers = new HttpHeaders({
              'authorization': this.sesionService.getBearerAuthToken(),
              'param-emp': paramEmp,
              'content-type': req.headers.get('content-type'),
              'app-version': this.sesionService.getAppVersion()
            });
            let authReqRepeat = req.clone({ headers });
            return next.handle(authReqRepeat);
          })
        );
      case 2_001:
        this.mensajeUsuarioService.showMessage({
          mensaje: 'Contraseña expirada',
          detalle: 'Su contraseña ha expirado, por favor realice el cambio',
          tipoMensaje: 'warn'
        });
        this.cambioPasswdService.setVisible(true);
        return <Observable<HttpEvent<any>>>this.cambioPasswdService.getSubmitObservable().pipe(
          switchMap(res => {
            // clone the original request
            const authReqRepeat = req.clone();
            return next.handle(authReqRepeat);
          })
        );;
      default:
        return throwError(error);
    }
  }
}
