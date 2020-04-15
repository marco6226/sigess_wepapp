import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MensajeUsuario } from 'app/modulos/comun/entities/mensaje-usuario'

@Injectable()
export class MensajeUsuarioService {

  private subject = new Subject<MensajeUsuario>();

  showMessage(message: MensajeUsuario) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<MensajeUsuario> {
    return this.subject.asObservable();
  }
}
