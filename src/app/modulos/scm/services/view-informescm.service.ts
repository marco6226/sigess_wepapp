import { Injectable } from '@angular/core';
import { viewscm } from 'app/modulos/scm/entities/viewscm';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { endPoints } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewscmInformeService extends ServiceCRUD<viewscm>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmInformeService}empresaId`)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => {
            this.manageError(err);
            reject(err);
         }
        )
    });
  }

  getClassName(): string {
    return "ViewscmInformeService";
  }
}