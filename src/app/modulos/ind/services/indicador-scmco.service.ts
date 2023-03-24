import { Injectable } from '@angular/core';
import { Vwscmco } from 'app/modulos/ind/entities/vwscmco';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { endPoints } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewscmcoService extends ServiceCRUD<Vwscmco>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmcoService}empresaId`)
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
    return "ViewscmcoService";
  }
}