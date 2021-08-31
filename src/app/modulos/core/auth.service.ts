import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt';
import { JwtHelper } from 'angular2-jwt';
import * as CryptoJS from 'crypto-js';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { endPoints } from './../../../environments/environment';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { Subject } from 'rxjs/Subject';
import { timeout } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';



@Injectable()
export class AuthService {

    private loginSubject = new Subject<any>();
    private loginSubmitSubject = new Subject<any>();
    msgs: Message[];
    jwtHelper: JwtHelper = new JwtHelper();
    authEndPoint = endPoints.auth;
    // store the URL so we can redirect after logging in
    redirectUrl: string = '/app/home';

    constructor(
        public httpInt: HttpInt,
        public sesionService: SesionService,
        private router: Router
    ) {

    }

    public isLoggedIn(): boolean {
        return this.sesionService.isLoggedIn();
    }

    login(login: string, passwd: string, recordar: boolean, pin: string) {
        let body = login + ":" + this.createHash(passwd);
        return new Promise((resolve, reject) => {
            this.httpInt.post(this.authEndPoint + '?r=' + recordar + (pin != null ? ("&pin=" + pin) : ''), body)
                .pipe(timeout(20000))
                .map(res => res)
                .subscribe(
                    res => {
                        this.setSession(res, recordar);
                        resolve(res);
                    },
                    err => reject(err)
                );
        });
    }

    checkisLoginExist(login: string, passwd: string) {
        let body = login + ":" + this.createHash(passwd)
        return this.httpInt.post(this.authEndPoint + 'activetokens' + '?r=' + false + (false != null ? ("&pin=" + false) : ''), body).toPromise();
    }

    logout() {
        let refresh = this.sesionService.getRefreshToken();
        let auth = this.sesionService.getAuthToken();
        return new Promise((resolve, reject) => {
            this.httpInt.post(this.authEndPoint + 'logout', { 'refresh': refresh, 'Authorization': auth })
                .map(res => res)
                .subscribe(
                    res => {
                        this.sesionService.setLoggedIn(false);
                        resolve(res);
                    },
                    err => reject(err)
                );
        });
    }

    resetPasswd(email: string) {
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.authEndPoint + 'recuperarPasswd/' + email)
                .map(res => res)
                .subscribe(
                    res => resolve(res),
                    err => reject(err)
                );
        });
    }

    sendNotification(email: string) {
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.authEndPoint + 'enviarCorreo/' + email)
                .map(res => res)
                .subscribe(
                    res => resolve(res),
                    err => reject(err)
                );
        });
        console.log(email)
    }

    requestRefresh(token: string) {
        let body = token;
        console.log("paso por aca");
        let endpoint = this.authEndPoint + 'refrescarToken';
        return new Promise((resolve, reject) => {
            this.httpInt.post(endpoint, body)
                .map(res => res)
                .subscribe(
                    res => {
                        this.setSession(res, false);
                        resolve(res);
                    },
                    err => reject(err)
                );
        });
    }

    setSession(res: any, recordar?: boolean) {
        this.sesionService.setLoggedIn(true);
        this.sesionService.setUsuario(res['usuario']);
        this.sesionService.setAuthToken(res['Authorization']);
        if (recordar != null && recordar == true && res['refresh'] != null) {
            this.sesionService.setRefreshToken(res['refresh']);
        }
    }



    /**
     * Genera un hash SHA-256 de la cadena de texto recibida como parametro
     * @param passw 
     */
    createHash(value: string) {
        try {
            return CryptoJS.SHA256(value, "");
        } catch (e) {
            //console.log(e);
            return "";
        }
    }

    /**
     * Método que intenta solicitar un nuevo token si se poseen las credenciales para hacerlo, si no,
     * emite un evento para visualizar el formulario de login para solicitar el ingreso al usuario
     */
    refreshToken(): Observable<any> {
        // Verifica si se posee el refresh_token para refrescar el token de acceso
        let refreshToken = this.sesionService.getRefreshToken();
        if (refreshToken != null && refreshToken != 'undefined') {
            this.requestRefresh(refreshToken).then(
                resp => this.onLogin(resp)
            ).catch(error => {
                this.setLoginFormVisible(true);
            })

            return this.loginSubmitSubject.asObservable();
        } else {
            // Si no se posee passwd, visualiza el formulario de login
            this.setLoginFormVisible(true);
            return this.loginSubmitSubject.asObservable();
        }
    }


    /**
     *  Devuelve el observable que indica cuando visualizar el formulario de login
     */
    getLoginObservable(): Observable<boolean> {
        return this.loginSubject.asObservable();
    }

    /**
     * Emite el evento para visualizar o esconder el formulario de login
     * @param visible 
     */
    setLoginFormVisible(visible: boolean) {
        this.loginSubject.next(visible);
    }

    /**
     * Emite el evento que indica que el usuario se ha logueado correctamente
     * a través del formulario de login
     * @param res 
     */
    onLogin(res: any) {
        this.loginSubmitSubject.next(res);
    }
}