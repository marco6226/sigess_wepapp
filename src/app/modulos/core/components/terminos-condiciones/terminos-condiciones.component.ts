import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss'],
  providers: [UsuarioService]
})
export class TerminosCondicionesComponent implements OnInit {

  visible = true;
  acepta: boolean;

  constructor(
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  
  marcarAceptacion(acepta) {
    this.usuarioService.aceptarTerminos(acepta)
      .then(() => {
        if (acepta == true) {
          this.router.navigate(['/app/home'])
        } else {
          this.logout();
        }
      })
  }

  logout() {
    this.authService.logout()
      .then(resp => this.router.navigate(['']))
      .catch(err => alert("Se produjo un error al cerrar sesión"));
  }
}
