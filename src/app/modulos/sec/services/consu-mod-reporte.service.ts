import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsuModReporteService {

  constructor() { }
  floarReporte:boolean;
  setflagR(floarReporte:boolean){
    this.floarReporte=floarReporte;
  }

  getflagR(): boolean{

    return this.floarReporte;
  }
}
