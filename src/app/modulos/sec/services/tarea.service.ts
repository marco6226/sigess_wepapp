import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Tarea } from 'app/modulos/sec/entities/tarea'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SesionService } from 'app/modulos/core/services/sesion.service';

@Injectable()
export class TareaService extends ServiceCRUD<Tarea>{

    httpInt;
    headers;

    constructor(
        httpInt: HttpInt,
        mensajeUsuarioService: MensajeUsuarioService,
        private http: HttpClient,
        public sesionService: SesionService,
    ) {
        super(httpInt, mensajeUsuarioService);
    }

    reportarCumplimiento(tarea: Tarea) {
        let body = JSON.stringify(tarea);
        return new Promise(resolve => {
            this.httpInt.put(this.end_point + "reportarCumplimiento", body)
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

    reportarVerificacion(tarea: Tarea) {
        let body = JSON.stringify(tarea);
        return new Promise(resolve => {
            this.httpInt.put(this.end_point + "reportarVerificacion", body)
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

    findByUsuario(usuarioId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'usuario/' + usuarioId)
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

    public findByDetailId(tareaId: string) {
        return this.http.get(`${this.end_point}detail/${tareaId}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public findByDetails() {
        return this.http.get(`${this.end_point}details`, this.getRequestHeaders(this.headers)).toPromise();
    }

    findByAnalisis(analisisId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'analisis/' + analisisId)
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
        return "TareaService";
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
