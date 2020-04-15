import { Injectable } from '@angular/core';
import { Perfil } from 'app/modulos/empresa/entities/perfil'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

export class PerfilService extends ServiceCRUD<Perfil> {
  getClassName(): string {
    return "PerfilService";
  }
}
