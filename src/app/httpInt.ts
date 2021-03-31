import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { SesionService } from 'app/modulos/core/services/sesion.service'

@Injectable()
export class HttpInt {

    constructor(public http: HttpClient, private sesionService: SesionService) { }

    get(url: string, headers?: HttpHeaders): Observable<Object> {
        return this.http.get(url, this.getRequestHeaders(headers));
    }

    post(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        return this.http.post(url, body, this.getRequestHeaders(headers));
    }

    postFile(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        headers = new HttpHeaders();
        return this.http.post(url, body, this.getRequestHeaders(headers));
    }

    put(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        return this.http.put(url, body, this.getRequestHeaders(headers));
    }

    delete(url: string, headers?: HttpHeaders): Observable<Object> {
        return this.http.delete(url, this.getRequestHeaders(headers));
    }

    getRequestHeaders(headers?: HttpHeaders): any {
        if (headers == null)
            headers = new HttpHeaders().set('Content-Type', 'application/json');

        //if (this.sesionService.getToken() != null)
        //headers = headers.set('Authorization', this.sesionService.getToken());

        headers = headers
            .set('Param-Emp', this.sesionService.getParamEmp())
            .set('app-version', this.sesionService.getAppVersion())
            .set('Authorization', this.sesionService.getBearerAuthToken());
        return { 'headers': headers };
    }

    getSesionService() {
        return this.sesionService;
    }
}
