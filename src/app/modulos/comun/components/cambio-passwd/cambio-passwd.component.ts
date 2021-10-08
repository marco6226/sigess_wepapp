import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CambioPasswdService } from 'app/modulos/comun/services/cambio-passwd.service'

import { UsuarioService } from '../../../admin/services/usuario.service';
import { PasswordValidator } from '../../validators/password-validator';


@Component({
  selector: 's-cambioPasswd',
  templateUrl: './cambio-passwd.component.html',
  styleUrls: ['./cambio-passwd.component.scss'],
  providers: [UsuarioService]
})
export class CambioPasswdComponent implements OnInit {

  form: FormGroup;
  visible: boolean;
  subscription: Subscription;

  password;
  passwordNew;
  passwordConfirm;
  show = false;
  showNew = false;
  showConfirm = false;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cambioPasswdService: CambioPasswdService
  ) {
    this.subscription = this.cambioPasswdService.getObservable().subscribe(visible => this.visible = visible);

    this.form = fb.group({
      'oldPasswd': [null, Validators.required],
      'newPasswd': [null, [Validators.required, PasswordValidator.validatePassword]],
      'newPasswdConfirm': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.password = 'password';
    this.passwordNew = 'password';
    this.passwordConfirm = 'password';
  }

  onSubmit(value: any) {
    this.usuarioService.cambiarPasswd(value.newPasswd, value.newPasswdConfirm, value.oldPasswd).then(
      resp => {
        this.form.reset();
        this.visible = false;
        this.cambioPasswdService.onSubmit(resp);
      }
    );
  }
  
  
  mostrar() {
		if (this.password === 'password') {
		  this.password = 'text';
		  this.show = true;
		  console.log(this.password);
		} else {
		  this.password = 'password';	
		  this.show = false;
		  console.log(this.password);
		}
	  }
    mostrarNueva() {
      if (this.passwordNew === 'password') {
        this.passwordNew = 'text';
        this.showNew = true;
        console.log(this.passwordNew);
      } else {
        this.passwordNew = 'password';	
        this.showNew = false;
        console.log(this.passwordNew);
      }
      }
      mostrarConfirm() {
        if (this.passwordConfirm === 'password') {
          this.passwordConfirm = 'text';
          this.showConfirm = true;
          console.log(this.passwordConfirm);
        } else {
          this.passwordConfirm = 'password';	
          this.showConfirm = false;
          console.log(this.passwordConfirm);
        }
        }


}
