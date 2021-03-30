import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FilterQuery } from "app/modulos/core/entities/filter-query";
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
    updateRecomendation(recomendation) {
        return this.http.put(`${endPoints.scm}recomendation`, recomendation).toPromise();
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

    getSvelist() {
        return this.http.get<[]>(`${endPoints.scm}svelist/`).toPromise();
    }

    createSeguimiento(seg) {
        return this.http.post(`${endPoints.scm}seguimiento/`, seg).toPromise();

    }
    updateSeguimiento(seguimientoCase) {
        return this.http.put(`${endPoints.scm}seguimiento/`, seguimientoCase).toPromise();

    }

    getSeguimientos(documento) {
        return this.http.get<any[]>(`${endPoints.scm}seguimiento/${documento}`).toPromise();
    }

    findByFilter(filterQuery?: FilterQuery) {
        // console.log(filterQuery, "filtro linea 71");
        return this.http.get(`${endPoints.scm}` + '?' + this.buildUrlParams(filterQuery)).toPromise();


    }

    public buildUrlParams(filterQuery: FilterQuery): string {
        let urlParam = '';
        if (filterQuery == null) {
            return urlParam;
        }
        if (filterQuery.offset != null) {
            urlParam += 'offset=' + filterQuery.offset + '&';
        }
        if (filterQuery.groupBy != null) {
            urlParam += 'groupBy=' + filterQuery.groupBy + '&';
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

}
