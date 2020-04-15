import { Injectable } from '@angular/core';
import { Recurso } from 'app/modulos/empresa/entities/recurso'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

export class RecursoService extends ServiceCRUD<Recurso> {
  getClassName(): string {
    return "RecursoService";
  }
}
