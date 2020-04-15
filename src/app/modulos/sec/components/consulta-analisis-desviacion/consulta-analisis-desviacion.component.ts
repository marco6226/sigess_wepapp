import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion'
import { AnalisisDesviacionService } from 'app/modulos/sec/services/analisis-desviacion.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';

import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-consulta-analisis-desviacion',
  templateUrl: './consulta-analisis-desviacion.component.html',
  styleUrls: ['./consulta-analisis-desviacion.component.scss']
})
export class ConsultaAnalisisDesviacionComponent implements OnInit {

  analisisDesviacionesList: AnalisisDesviacion[];
  anDesvListSelect: AnalisisDesviacion[] = [];
  msgs: Message[] = [];

  constructor(
    private analisisDesviacionService: AnalisisDesviacionService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.analisisDesviacionService.findAll().then(
      data => this.analisisDesviacionesList = <AnalisisDesviacion[]>data
    );
  }

  select(anDesv: AnalisisDesviacion) {
    for (let i = 0; i < this.anDesvListSelect.length; i++) {
      if (this.anDesvListSelect[i].id === anDesv.id) {
        this.anDesvListSelect.splice(i, 1);
        return;
      }
    }
    this.anDesvListSelect.push(anDesv);
  }

  generarTareas() {
    if (this.anDesvListSelect == null || this.anDesvListSelect.length == 0) {
      this.msgs.push({ severity: 'warn', detail: 'Seleccione uno o mas análisis para generar las tareas' });
    } else {
      this.paramNav.setParametro<AnalisisDesviacion[]>(this.anDesvListSelect);
      this.paramNav.setAccion<string>('POST');
      this.router.navigate(
        ['/app/sec/tareas']
      );
    }
  }

  consultarTareas(ad: AnalisisDesviacion) {
    this.paramNav.setParametro<AnalisisDesviacion[]>([ad]);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/sec/tareas']
    );
  }

  modificarTareas(ad: AnalisisDesviacion) {
    this.paramNav.setParametro<AnalisisDesviacion[]>([ad]);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/sec/tareas']
    );
  }

  navegar(){
    this.paramNav.redirect('/app/sec/desviaciones');
  }

}
