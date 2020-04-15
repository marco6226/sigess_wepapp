import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { ListaInspeccionPK } from 'app/modulos/inspecciones/entities/lista-inspeccion-pk'

@Injectable()
export class ListaInspeccionService extends ServiceCRUD<ListaInspeccion>{
  
  findByPK(pk:ListaInspeccionPK) {
    return super.find(("id;id=" + pk.id + ";version=" + pk.version));
  }

  getClassName(): string {
    return "ListaInspeccionService";
  }


}
