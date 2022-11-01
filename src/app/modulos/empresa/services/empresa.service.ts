import { AliadoInformacion, EquipoSST, ResponsableSST, SST } from './../../ctr/entities/aliados';
import { Injectable } from '@angular/core';
import { Empresa } from './../entities/empresa'

import { endPoints } from 'environments/environment'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class EmpresaService extends ServiceCRUD<Empresa>{

    obtenerContratistas<Empresa>(empresaId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + "contratistas/" + empresaId)
                .map(res => res)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    vincularContratista(contratista: Empresa) {
        let entity = new Empresa();
        entity.id = contratista.id;
        let body = JSON.stringify(entity);
        return new Promise(resolve => {
            this.httpInt.put(this.end_point + "contratistas", body)
                .map(res => res)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findByUsuario(usuarioId: string) {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.EmpresaService + "usuario/" + usuarioId)
                .map(res => res)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findSelected() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.EmpresaService + "selected")
                .map(res => res)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    getClassName(): string {
        return "EmpresaService";
    }

    createEquipoSST(equipoSST: SST){
     
        let body = JSON.stringify(equipoSST);
        
        return new Promise(resolve =>{
            this.httpInt.post(endPoints.EmpresaService + "createEquipoSST",body)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
        })
    }

    getEquipoSST(aliadoId: number){
       
        return new Promise(resolve =>{
            this.httpInt.get(endPoints.EmpresaService + "getEquipoSST/"+aliadoId)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
        })
    }


    saveAliadoInformacion(aliadoInformacion: AliadoInformacion){
     
        let body = JSON.stringify(aliadoInformacion);
        
        return new Promise(resolve =>{
            this.httpInt.put(endPoints.EmpresaService + "saveAliadoInformacion",body)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
        })
    }

    getAliadoInformacion(aliadoId: number){
       
        return new Promise(resolve =>{
            this.httpInt.get(endPoints.EmpresaService + "getAliadoInformacion/"+aliadoId)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
        })
    }

    getActividadesContratadas(aliadoId: number =1){
       
        return new Promise(resolve =>{
            this.httpInt.get(endPoints.EmpresaService + "getActividadesContratadas/"+aliadoId)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
        })
    }
}
