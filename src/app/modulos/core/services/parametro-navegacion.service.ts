import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ParametroNavegacionService {

    constructor(
        private router: Router
    ) {

    }

    public accion: any;
    public parametro: any;

    setParametro<T>(param: T) {
        this.parametro = param;
    }

    getParametro<T>(): T {
        return this.parametro;
    }

    setAccion<T>(param: T) {
        this.accion = param;
    }

    getAccion<T>(): T {
        return this.accion;
    }

    redirect(url: string) {
        this.router.navigate(
            [url]
        );
    }

    reset() {
        this.accion = null;
        this.parametro = null;
    }
}
