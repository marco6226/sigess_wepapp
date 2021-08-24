import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { endPoints } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SeguimientosService {

    headers;

    constructor(
        private http: HttpClient,
        public sesionService: SesionService,) { }

    public getSegByTareaID(id) {
        return this.http.get(`${endPoints.tareaService}follow/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public createSeg(seg) {
        return this.http.post(`${endPoints.tareaService}follow`, seg, this.getRequestHeaders(this.headers)).toPromise();
    }

    public getEvidences(id) {
        return this.http.get(`${endPoints.tareaService}follow/download/${id}`, this.getRequestHeaders(this.headers)).toPromise();
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
}
