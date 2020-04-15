import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { Message } from 'primeng/api';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  msgs: Message[];
  end_point: string = endPoints['ContactoService'];
  userform: FormGroup;
  visibleEnviar:boolean = true;

  constructor(
    public httpInt: HttpInt,
    public fb: FormBuilder,
  ) {
    this.userform = fb.group({
      'email': ['', Validators.required],
      'nombres': ['', Validators.required],
      'mensaje': ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  onSubmit(value: any) {
    this.visibleEnviar = false;
    this.msgs = [{
      severity: 'info',
      summary: 'Enviando mensaje...',
      detail: 'Tu mensaje se está enviando, por favor espera.'
    }];
    this.httpInt.post(this.end_point, value)
      .subscribe(
        res => {
          this.visibleEnviar = true;
          this.msgs = [{
            severity: 'success',
            summary: 'Mensaje enviado',
            detail: 'Tu mensaje se ha entregado correctamente. Pronto nos comunicaremos.'
          }];
        }
        ,
        err => {
          this.visibleEnviar = true;
          this.msgs = [{
            severity: 'error',
            summary: 'El mensaje no se ha podido entregar',
            detail: 'Un error inesperado ha ocurrido al enviar el mensaje, por favor vuelve a intentar.'
          }];
        }
      );
  }

}
