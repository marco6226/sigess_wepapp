import { Injectable } from '@angular/core';
import { Vwscmge } from 'app/modulos/ind/entities/vwscmge';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { endPoints } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewscmgeService extends ServiceCRUD<Vwscmge>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmgeService}empresaId`)
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
    return "ViewscmgeService";
  }
}