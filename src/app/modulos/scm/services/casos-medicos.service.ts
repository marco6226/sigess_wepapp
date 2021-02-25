import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endPoints } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class CasosMedicosService {
    headers;
    constructor(private http: HttpClient) {

    }

    create(casoMedico) {
        return this.http.post(`${endPoints.scm}`, casoMedico).toPromise();
    }

    edit(casoMedico) {
        return this.http.put(`${endPoints.scm}`, casoMedico).toPromise();
    }

    getCaseList(document) {
        return this.http.get<any[]>(`${endPoints.scm}validate/${document}`).toPromise();
    }

    getAll() {
        return this.http.get(`${endPoints.scm}all`).toPromise();
    }


    ausentismos(documento) {
        return this.http.get<[]>(`${endPoints.scm}scmausentismo/${documento}`).toPromise();

    }

    //Recomendations APis
    getRecomendations(documento) {
        return this.http.get<[]>(`${endPoints.scm}recomendation/${documento}`).toPromise();
    }
    createRecomendation(recomendation) {
        return this.http.post(`${endPoints.scm}recomendation`, recomendation).toPromise();
    }
    //DiagnosticoApi

    getDiagnosticos(documento) {
        return this.http.get<[]>(`${endPoints.scm}diagnosticos/${documento}`).toPromise();
    }
    createDiagnosticos(diagnosticos) {
        return this.http.post(`${endPoints.scm}diagnosticos`, diagnosticos).toPromise();
    }

    getLogs(documento) {
        return this.http.get<[]>(`${endPoints.scm}logs/${documento}`).toPromise();
    }


    getSistemasAFectados() {
        return this.http.get<[]>(`${endPoints.scm}sistemaafectado/`).toPromise();
    }

    createSeguimiento(pkCase) {
        return this.http.post(`${endPoints.scm}seguimiento/`, { pkCase }).toPromise();

    }
    updateSeguimiento(seguimientoCase) {
        return this.http.put(`${endPoints.scm}seguimiento/`, seguimientoCase).toPromise();

    }

    getSeguimientos(documento) {
        return this.http.get<any[]>(`${endPoints.scm}seguimiento/${documento}`).toPromise();
    }

}
