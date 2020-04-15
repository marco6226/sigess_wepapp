import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UsuarioService]
})
export class HomeComponent implements OnInit {

  evtLogList: any[];

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioService.consultarHistoriaLogin().then(
      resp => this.evtLogList = resp['data']
    );
  }

}
