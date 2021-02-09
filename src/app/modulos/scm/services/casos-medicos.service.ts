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

    getRecomendations(documento) {
        return this.http.get<[]>(`${endPoints.scm}recomendation/${documento}`).toPromise();
    }

    ausentismos(documento) {
        return this.http.get<[]>(`${endPoints.scm}scmausentismo/${documento}`).toPromise();

    }


    createRecomendation(recomendation) {
        return this.http.post(`${endPoints.scm}recomendation`, recomendation).toPromise();
    }

    getLogs(documento) {
        return this.http.get<[]>(`${endPoints.scm}logs/${documento}`).toPromise();
    }


}
