import { Injectable } from '@angular/core';

import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Permiso } from 'app/modulos/empresa/entities/permiso';

import { Session } from 'app/modulos/core/entities/session';
import { Router } from '@angular/router';

import { config } from 'app/config'
import { Empleado } from 'app/modulos/empresa/entities/empleado';

@Injectable()
export class SesionService {

    private session: Session;

    constructor(
        private router: Router,
    ) {

    }

    public getUsuario(): Usuario {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.usuario;
    }

    public setUsuario(usuario: Usuario) {
        this.session.usuario = usuario;
        localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    public getEmpleado(): Empleado {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.empleado;
    }
    public setEmpleado(empleado: Empleado) {
        this.session.empleado = empleado;
        localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    

    

    public getEmpresa(): Empresa {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.empresa;
    }

    public async setEmpresa(empresa: Empresa) {
        this.session.empresa = empresa;
        await localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    public getParamEmp(): string {
        let empParam = this.getEmpresa();
        return empParam == null ? '' : '' + empParam.id;
    }
        
    public getToken(): string {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.token;
    }

    public getRefreshToken(): string {
        return localStorage.getItem('refresh');
    }

    public setRefreshToken(refreshToken: string) {
        localStorage.setItem('refresh', refreshToken);
    }

    public getAuthToken(): string {
        return localStorage.getItem(config.token_id);
    }

    public setAuthToken(token: string) {
        localStorage.setItem(config.token_id, token);
    }

    public getBearerAuthToken(): string {
        let token = this.getAuthToken();
        return token == null ? '' : 'Bearer ' + token;
    }
    //**********

    public setToken(token: string) {
        this.session.token = token;
        localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    public setLoggedIn(isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.session = this.session == null ? new Session() : this.session;
            this.session.isLoggedIn = true;
            localStorage.setItem(config.session_id, JSON.stringify(this.session));
        } else {
            this.session = null;
            localStorage.removeItem(config.session_id);
            localStorage.removeItem('refresh');
            localStorage.removeItem(config.token_id);

        }
    }

    public isLoggedIn(): boolean {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return false;
        }
        return this.session.isLoggedIn;
    }

    /*
    public setPermisosList(permisosList: Permiso[]) {
      this.session.permisosList = permisosList;
      localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }
  
    public getPermisosList(): Permiso[] {
      if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
        if (this.session == null) return null;
      }
      return this.session.permisosList;
    }
    */

    public setPermisosMap(permisosMapa: any) {
        this.session.permisosMap = permisosMapa;
        localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    public getPermisosMap(): any {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.permisosMap;
    }


    public setConfiguracionMap(configMap: any) {
        this.session.configuracion = configMap;
        localStorage.setItem(config.session_id, JSON.stringify(this.session));
    }

    public getConfiguracionMap(): any {
        if (this.session == null) {
            this.session = <Session>JSON.parse(localStorage.getItem(config.session_id));
            if (this.session == null) return null;
        }
        return this.session.configuracion;
    }

    public getConfigParam(codigo: string) {
        let map = this.getConfiguracionMap();
        if (map == null || this.getConfiguracionMap()[codigo] == null) {
            switch (codigo) {
                case 'APROB_INVEST_OBSERV': return 'true';
                case 'FORM_PART_INVST': return 'true';
                case 'FORM_COSTOS_INVST': return 'true';
                case 'NOMB_MOD_INP': return 'Inspecciones';
                case 'NOMB_MOD_AUC': return 'Observaciones';
                case 'NOMB_MOD_COP': return 'COPASST';
                case 'NOMB_MOD_SEC': return 'Seguimiento y control';
                case 'NOMB_MOD_IND': return 'Indicadores';
                case 'NUM_MAX_FOTO_INP': return '3';
            }
            return null;
        } else {
            return this.getConfiguracionMap()[codigo].valor;
        }

    }

    getAppVersion(): any {
        //if (this.app_version == null)
        //this.app_version = localStorage.getItem("app_version");

        return "1.0.237";
    }
}
