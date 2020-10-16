import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endPoints } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CasosMedicosService {

  constructor(private http:HttpClient) { }


  create(casoMedico){
    return this.http.post(`${endPoints.scm}`,casoMedico).toPromise()
}


  getAll(){
      return this.http.get(`${endPoints.scm}all`).toPromise()
  }


}
