import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng'
import { AuthService } from './../../auth.service';
import { Subscription } from 'rxjs';
import { MensajeUsuario } from '../../../comun/entities/mensaje-usuario';
import { SesionService } from '../../services/sesion.service';


@Component({
	selector: 's-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@Input("modal") modal: boolean;
	@Input("visible") visible: boolean = true;
	subscription: Subscription;

	password;

	show = false;

	logueando = false;
	userform: FormGroup;
	msgs: Message[] = [];
	visibleLnkResetPasswd = true;

	contadorFallas = 0;
	relojText: string;
	intentosMax = 5;
	visiblePinForm = false;

	constructor(
		@Inject(FormBuilder) fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private sesionService: SesionService,
	) {
		this.subscription = this.authService.getLoginObservable().subscribe(visible => this.setVisible(visible));
		this.userform = fb.group({
			'username': ['', Validators.required],
			'passwd': ['', Validators.compose([Validators.required])],
			'pin': [null],
			'recordar': [true]
		});
	}

	ngOnInit() {
		this.password = 'password';
		if (this.sesionService.getEmpresa() != null && this.sesionService.getUsuario() != null) {
			this.router.navigate([this.authService.redirectUrl]);
		} else {
			let countDown = Number(localStorage.getItem('countDown'));
			if (countDown != null && countDown > 0) {
				this.contadorFallas = 5;
				this.iniciarContador(countDown);
			}
		}
	}

	setVisible(visible: boolean) {
		this.msgs = [];
        this.msgs.push({ severity: 'warn', detail: "Se cerro su sesion inicie de nuevo por favor" });
        
		this.visible = visible; 
	} 
	async validate(value){
		let res:any;
		try {
		 res = await this.authService.checkisLoginExist(value.username, value.passwd);

		
		if(res.exit == "true"){
			if (confirm('Se perderan los cambios no guardados de sus otras sesiones')) {
				// Save it!
				this.onSubmit(value);
			  }
		}else{
			this.onSubmit(value);
        }
    } catch (error) {
        if(error.status ===400) res = {exit:"false"}
    }
	}
	onSubmit(value: any) {
		this.logueando = true;
		//console.log(value);
		this.authService.login(value.username, value.passwd, value.recordar, value.pin)
			.then(res => {
				let aceptaTerm = this.authService.sesionService.getUsuario().fechaAceptaTerminos != null;
				this.logueando = false;
				this.visible = false;
				if (this.modal) {
					this.authService.onLogin(res);
				} else {
					this.router.navigate([(aceptaTerm ? '/app/home' : '/app/terminos')]);
				}
			}).catch(
				err => {
					this.logueando = false;
					this.msgs = [];
					if (err['name'] != null && err['name'] == 'TimeoutError') {
						this.msgs.push({ severity: 'warn', summary: 'CONEXIÓN DEFICIENTE', detail: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intente mas tarde.' });
						return;
					}
					switch (err.status) {
						case 403:
							this.msgs.push({ severity: 'warn', summary: 'CREDENCIALES INCORRECTAS', detail: 'El usuario o contraseña especificada no son correctas' });
							break;
						case 401:
							let msg: MensajeUsuario = err.error;
							if (msg.codigo == 2_007) {
								this.visiblePinForm = true;
							}
							if (msg.codigo == 2_009) {
								this.contadorFallas = this.intentosMax;
							}
							this.msgs.push({ severity: msg.tipoMensaje, summary: msg.mensaje, detail: msg.detalle });
							break;
						case 400:
							this.msgs.push({ severity: msg.tipoMensaje, summary: msg.mensaje, detail: msg.detalle });
							break;
						default:
							this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'Se ha generado un error no esperado' });
							break;
					}
					this.contadorFallas += 1;
					if (this.contadorFallas >= this.intentosMax) {
						this.iniciarContador(new Date().getTime() + (2 * 60 * 1000));
					}
				}
			);
	}

	solicitarReset() {
		this.msgs = [];
		this.msgs.push({ severity: 'info', detail: 'Ha solicitado restaurar su contraseña, por favor espere ', summary: 'Solicitando...' });
		let email = this.userform.value.username;
		if (email == null || email == '') {
			this.msgs = [];
			this.msgs.push({ severity: 'warn', summary: 'Correo electrónico requerido', detail: 'Debe especificar el correo electrónico de la cuenta de usuario' });
			return;
		}
		this.visibleLnkResetPasswd = false;
		this.authService.resetPasswd(email).then(
			resp => {
				this.msgs = [];
				this.msgs.push({ severity: resp['tipoMensaje'], detail: resp['detalle'], summary: resp['mensaje'] });
				this.visibleLnkResetPasswd = true;
			}
		).catch(err => {
			this.msgs = [];
			this.msgs.push({ severity: err.error['tipoMensaje'], detail: err.error['detalle'], summary: err.error['mensaje'] });
			this.visibleLnkResetPasswd = true;
		});
	}
	mostrar() {
		if (this.password === 'password') {
		  this.password = 'text';
		  this.show = true;
		} else {
		  this.password = 'password';
		  this.show = false;
		}
	  }

	iniciarContador(countDown: number) {
		localStorage.setItem('countDown', '' + countDown);
		let interval = window.setInterval(() => {
			let now = new Date().getTime();
			let distance = countDown - now;
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((distance % (1000 * 60)) / 1000);
			this.relojText = minutes + "m " + seconds + "s ";
			// If the count down is over, write some text 
			if (distance < 0) {
				clearInterval(interval);
				this.contadorFallas = 0;
				localStorage.removeItem('countDown');
			}
		}, 1000);
	}

}


