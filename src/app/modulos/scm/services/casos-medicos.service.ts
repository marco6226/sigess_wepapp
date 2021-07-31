import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FilterQuery } from "app/modulos/core/entities/filter-query";
import { SesionService } from "app/modulos/core/services/sesion.service";
import { endPoints } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class CasosMedicosService {
    headers;
    constructor(private http: HttpClient, private sesionService: SesionService) {

    }

    create(casoMedico) {
        return this.http.post(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    edit(casoMedico) {
        return this.http.put(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCase(id) {
        return this.http.get(`${endPoints.scm}case/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCaseList(document): any {
        return this.http.get<any[]>(`${endPoints.scm}validate/${document}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getAll() {
        return this.http.get(`${endPoints.scm}all`, this.getRequestHeaders(this.headers)).toPromise();
    }


    ausentismos(documento): any {
        return this.http.get<[]>(`${endPoints.scm}scmausentismo/${documento}`, this.getRequestHeaders(this.headers)).toPromise();

    }

    //Recomendations APis
    getRecomendations(documento): any {
        return this.http.get<[]>(`${endPoints.scm}recomendation/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    createRecomendation(recomendation) {
        return this.http.post(`${endPoints.scm}recomendation`, recomendation, this.getRequestHeaders(this.headers)).toPromise();
    }
    updateRecomendation(recomendation) {
        return this.http.put(`${endPoints.scm}recomendation`, recomendation, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteRecomendation(id) {
        return this.http.put(`${endPoints.scm}recomendation/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }
    //DiagnosticoApi

    deleteDiagnosticos(id) {
        return this.http.put(`${endPoints.scm}diagnosticos/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }
    getDiagnosticos(documento): any {
        return this.http.get<[]>(`${endPoints.scm}diagnosticos/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    createDiagnosticos(diagnosticos) {
        return this.http.post(`${endPoints.scm}diagnosticos`, diagnosticos, this.getRequestHeaders(this.headers)).toPromise();
    }
    updateDiagnosticos(diagnosticos) {
        return this.http.put(`${endPoints.scm}diagnosticos`, diagnosticos, this.getRequestHeaders(this.headers)).toPromise();
    }

    getLogs(documento): any {
        return this.http.get<[]>(`${endPoints.scm}logs/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }


    getSistemasAFectados(): any {
        return this.http.get<[]>(`${endPoints.scm}sistemaafectado/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getSvelist(): any {
        return this.http.get<[]>(`${endPoints.scm}svelist/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    createSeguimiento(seg) {
        return this.http.post(`${endPoints.scm}seguimiento/`, seg, this.getRequestHeaders(this.headers)).toPromise();

    }
    updateSeguimiento(seguimientoCase) {
        return this.http.put(`${endPoints.scm}seguimiento/`, seguimientoCase, this.getRequestHeaders(this.headers)).toPromise();

    }

    deleteSeguimiento(id) {
        return this.http.put(`${endPoints.scm}seguimiento/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }


    getSeguimientos(documento): any {
        return this.http.get<any[]>(`${endPoints.scm}seguimiento/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    /// Tratamientos
    createTratamiento(seg) {
        return this.http.post(`${endPoints.scm}tratamiento/`, seg, this.getRequestHeaders(this.headers)).toPromise();

    }
    updateTratamiento(seguimientoCase) {
        return this.http.put(`${endPoints.scm}tratamiento/`, seguimientoCase, this.getRequestHeaders(this.headers)).toPromise();

    }

    getTratamientos(documento): any {
        return this.http.get<any[]>(`${endPoints.scm}tratamiento/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    //pcl
    createPcl(pcl): any {
        return this.http.post<[]>(`${endPoints.scm}pcl/`, pcl, this.getRequestHeaders(this.headers)).toPromise();
    }

    getListPcl(pkcase): any {
        return this.http.get<[]>(`${endPoints.scm}pcl/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    updatePcl(Pcl) {
        return this.http.put(`${endPoints.scm}pcl/`, Pcl, this.getRequestHeaders(this.headers)).toPromise();
    }
    deletePcl(pcl) {
        return this.http.put(`${endPoints.scm}pcl/delete`, pcl, this.getRequestHeaders(this.headers)).toPromise();
    }


    findByFilter(filterQuery?: FilterQuery) {
        // console.log(filterQuery, "filtro linea 71");
        return this.http.get(`${endPoints.scm}` + '?' + this.buildUrlParams(filterQuery), this.getRequestHeaders(this.headers)).toPromise();


    }
    //aon
    getTokenAon() {
        return this.http.get<[]>(`${endPoints.scm}aon/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getRegistersAon(token, cc?, fechai?, fechafi?,) {
        return this.http.get<[]>(`${endPoints.scm}aon/registers/${token}/${cc}/${fechai}/${fechafi}`, this.getRequestHeaders(this.headers)).toPromise();
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
