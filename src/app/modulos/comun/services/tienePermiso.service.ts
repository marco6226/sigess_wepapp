import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class tienePermiso {

  constructor() { }
  flagPermiso: boolean

  setPermisoFlag(flagPermiso:boolean){
    this.flagPermiso=flagPermiso;
  }

  getPermisoFlag(): boolean{

    return this.flagPermiso;
  }
}