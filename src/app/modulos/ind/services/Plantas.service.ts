import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { Plantas } from '../entities/Plantas';

@Injectable({
  providedIn: 'root'
})
export class PlantasService extends ServiceCRUD<Plantas>{

  getClassName(): string {
    return 'Plantas';
  }

  getPlantasByEmpresaId(empresaId: number): Promise<Plantas[]>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+`${empresaId}`).subscribe(
        (res: Plantas[]) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

}
