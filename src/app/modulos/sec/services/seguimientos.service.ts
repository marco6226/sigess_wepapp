import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { endPoints } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SeguimientosService {

    constructor(
        private http: HttpClient,
        public sesionService: SesionService,) { }

    public getSegByTareaID(id) {
        return this.http.get(`${endPoints.tareaService}follow/${id}`, {
            headers: {
                'authorization': this.sesionService.getBearerAuthToken(),
                'param-emp': '3',
                'app-version': this.sesionService.getAppVersion()
            }
        }).toPromise();
    }

    public createSeg(seg) {
        return this.http.post(`${endPoints.tareaService}follow`, seg, {
            headers: {
                'authorization': this.sesionService.getBearerAuthToken(),
                'param-emp': '3',
                'content-type': 'application/json',
                'app-version': this.sesionService.getAppVersion()
            }
        }).toPromise();
    }
}
