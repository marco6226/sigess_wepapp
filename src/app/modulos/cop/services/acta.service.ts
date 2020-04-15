import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Directorio } from '../../ado/entities/directorio';
import { Acta } from '../entities/acta';
import { DirectorioService } from '../../ado/services/directorio.service';
import { HttpInt } from '../../../httpInt';
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';

@Injectable()
export class ActaService extends ServiceCRUD<Acta> {
  
  constructor(
    public dirService: DirectorioService,
    public httpInt: HttpInt,
    public mensajeUsuarioService: MensajeUsuarioService
  ) {
    super(httpInt, mensajeUsuarioService);
  }

  getClassName(): string {
    return "ActaService";
  }

}
