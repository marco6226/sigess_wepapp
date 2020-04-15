import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ParticipanteIpecr } from 'app/modulos/ipr/entities/participante-ipecr'

@Injectable()
export class ParticipanteIpecrService extends ServiceCRUD<ParticipanteIpecr>{

  getClassName(): string {
    return "ParticipanteIpecrService";
  }

}
