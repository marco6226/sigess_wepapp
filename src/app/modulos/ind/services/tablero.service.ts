import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Tablero } from '../entities/tablero';

@Injectable()
export class TableroService extends ServiceCRUD<Tablero>{

  getClassName() {
    return "TableroService";
  }

}

