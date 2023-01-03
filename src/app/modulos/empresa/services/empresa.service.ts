import { AliadoInformacion, EquipoSST, ResponsableSST, SST, Subcontratista } from './../../ctr/entities/aliados';
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

    obtenerDivisionesDeAliados(empresaId: number){
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + "getAliadoDivision/" + empresaId)
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

    createEmpresaAliada(empresaAliada: Empresa){
        let body = JSON.stringify(empresaAliada);
        return new Promise((resolve, reject) => {
            this.httpInt
                .post(endPoints.EmpresaService+"createEmpresaAliada", body)
                .retryWhen(this.retryFunction)
                .map((res) => res)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                        this.manageError(err);
                    }
                );
        });
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

    getLocalidades(){       
        return new Promise(resolve =>{
            this.httpInt.get(endPoints.EmpresaService + "getActividadesContratadas")
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

    saveSubcontratista(subcontratista: Subcontratista){
        let body = JSON.stringify(subcontratista);
        return new Promise(resolve =>{
            this.httpInt.post(endPoints.EmpresaService + "saveSubcontratista", body)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                },
                err => this.manageError(err)
            );
        });
    }

    updateSubcontratista(subcontratista: Subcontratista){
        let body = JSON.stringify(subcontratista);
        return new Promise(resolve =>{
            this.httpInt.put(endPoints.EmpresaService + "updateSubcontratista", body)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                },
                err => this.manageError(err)
            );
        });
    }

    getSubcontratistas(aliadoId: number){
        return new Promise(resolve => {
            this.httpInt.get(endPoints.EmpresaService + `getSubcontratistas/${aliadoId}`)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                },
                err => this.manageError(err)
            );
        });
    }
}
