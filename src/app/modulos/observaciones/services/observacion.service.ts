import { Injectable } from "@angular/core";
import { HttpInt } from "app/httpInt";
import { endPoints } from "environments/environment";

import { ServiceCRUD } from "app/modulos/core/services/service-crud.service";
import { Observacion } from "app/modulos/observaciones/entities/observacion";
import { AuthService } from "app/modulos/core/auth.service";

@Injectable()
export class ObservacionService extends ServiceCRUD<Observacion> {
    /*
  findAllByUsuario() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "usuario")
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
*/
    private authService: AuthService;
    msgs = [];

    aceptarObservacion(observacion: Observacion) {
        let body = JSON.stringify(observacion);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + "aceptar", body)
                .map((res) => res)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    denegarObservacion(observacion: Observacion) {
        console.log(
            "denegarObservacion(" + observacion.usuarioReporta.email + ")"
        );

        let body = JSON.stringify(observacion);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + "denegar", body)
                .map((res) => res)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        }).then((param) => {});
    }

    getClassName(): string {
        return "ObservacionService";
    }
}
