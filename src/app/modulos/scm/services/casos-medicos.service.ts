import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endPoints } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class CasosMedicosService {
    constructor(private http: HttpClient) { }

    create(casoMedico) {
        return this.http.post(`${endPoints.scm}`, casoMedico).toPromise();
    }

    edit(casoMedico) {
        return this.http.put(`${endPoints.scm}`, casoMedico).toPromise();
    }

    validate(document) {
        return this.http.get(`${endPoints.scm}validate/${document}`).toPromise();
    }

    getAll() {
        return this.http.get(`${endPoints.scm}all`).toPromise();
    }

    getRecomendations() {
        return this.http.get(`${endPoints.scm}recomendation`).toPromise();
    }




    createRecomendation(recomendation) {
        return this.http.post(`${endPoints.scm}recomendation`, recomendation).toPromise();
    }
}
