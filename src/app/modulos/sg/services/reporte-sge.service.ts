import { Injectable } from '@angular/core';

import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ReporteSGE } from 'app/modulos/sg/entities/reporte-sge'
import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service'
import { MensajeUsuario } from 'app/modulos/core/entities/mensaje-usuario'

import { SesionService } from 'app/modulos/core/services/sesion.service'

@Injectable()
export class ReporteSGEService {

  end_point = endPoints.ReporteSGEService;

  constructor(
    private mensajeUsuarioService: MensajeUsuarioService,
    private sesionService: SesionService,
  ) {

  }

  find(evaluacionId: string, type: string) {

    return new Promise((resolve, reject) => {

      // Create the Xhr request object
      let xhr = new XMLHttpRequest();
      let url = this.end_point + "evaluacion/" + evaluacionId + "?type=" + type;
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader("Param-Emp", this.sesionService.getEmpresa() == null ? null : this.sesionService.getEmpresa().id);
      xhr.setRequestHeader("Authorization", this.sesionService.getToken() == null ? null : this.sesionService.getToken());

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response)
          } else {
            reject(xhr.response)
          }
        }
      }
      xhr.send();
    }).catch(
      err => this.manageBlobError(err)
      );

  }

  manageBlobError(err: any) {
    let usrMsgService = this.mensajeUsuarioService;

    var reader = new FileReader();
    reader.onload = function () {
      let msg: MensajeUsuario;
      try {
        msg = <MensajeUsuario>JSON.parse(<string>reader.result);
      } catch (error) {
        msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: <string>reader.result };
      }
      usrMsgService.showMessage({
        mensaje: msg.mensaje,
        detalle: msg.detalle,
        tipoMensaje: msg.tipoMensaje
      });
    }
    reader.readAsText(err);
  }

}
