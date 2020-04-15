import { Component, OnInit, Input } from '@angular/core';
import { Jornada } from 'app/modulos/empresa/entities/jornada'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { ConfiguracionJornada } from 'app/modulos/empresa/entities/configuracion-jornada'
import { ConfiguracionJornadaService } from 'app/modulos/empresa/services/configuracion-jornada.service'
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Message } from 'primeng/primeng'

@Component({
  selector: 's-jornadaForm',
  templateUrl: './jornada-form.component.html',
  styleUrls: ['./jornada-form.component.scss'],
  providers: [ConfiguracionJornadaService]
})
export class JornadaFormComponent implements OnInit {

  @Input("value") empleado: Empleado;
  configuracionJornadaList: ConfiguracionJornada[];
  fechaActual = new Date();
  msgs: Message[];

  constructor(
    private configuracionJornadaService: ConfiguracionJornadaService,
  ) { }

  ngOnInit() {
    this.configuracionJornadaList = [];
    if (this.empleado.configuracionJornadaList != null) {
      this.empleado.configuracionJornadaList.forEach(conf => {
        let jornadaList: Jornada[] = [];
        conf.jornadaList.forEach(jornada => {
          let je = new Jornada();
          je.id = jornada.id;
          je.dia = jornada.dia;
          je.horaInicio = jornada.horaInicio == null ? null : new Date(jornada.horaInicio);
          je.horaFin = jornada.horaFin == null ? null : new Date(jornada.horaFin);
          je.labora = jornada.labora;
          je.receso = jornada.receso == null ? null : new Date(jornada.receso);
          jornadaList.push(je);
        });
        conf.fechaEntradaVigencia = conf.fechaEntradaVigencia == null ? null : new Date(conf.fechaEntradaVigencia);
        conf.jornadaList = jornadaList;
        this.configuracionJornadaList.push(conf)
      });
    }
  }

  addFormulario() {
    if (this.comprobarConfiguracion()) {
      let conf = new ConfiguracionJornada();
      conf.fechaEntradaVigencia = this.fechaActual;
      let jornadaList: Jornada[] = [];
      locale_es.dayNamesCod.forEach(dia => {
        let je = new Jornada();
        je.dia = dia;
        jornadaList.push(je);
      });
      conf.fechaEntradaVigencia = conf.fechaEntradaVigencia == null ? null : new Date(conf.fechaEntradaVigencia);
      conf.jornadaList = jornadaList;
      this.configuracionJornadaList.push(conf);
    }
  }
  comprobarConfiguracion(): boolean {
    for (let i = 0; i < this.configuracionJornadaList.length; i++) {
      if (this.configuracionJornadaList[i].fechaEntradaVigencia.getTime() == this.fechaActual.getTime()) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'No es posible adicionar la configuración', detail: 'No pueden existir dos configuraciones con la misma fecha' });
        return false;
      }
    }
    return true;
  }

  adicionarConfiguracion(conf: ConfiguracionJornada) {
    conf.empleado = new Empleado();
    conf.empleado.id = this.empleado.id;
    this.configuracionJornadaService.create(conf).then(
      data => {
        conf.id = (<ConfiguracionJornada>data).id;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Configuracion creada', detail: 'Se ha creado correctamente la configuración' });
      }
    );
  }

  actualizarConfiguracion(conf: ConfiguracionJornada) {
    conf.empleado = new Empleado();
    conf.empleado.id = this.empleado.id;
    this.configuracionJornadaService.update(conf).then(
      data => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Configuracion actualizada', detail: 'Se ha actualizado correctamente la configuración' });
      }
    );
  }

  removerConfiguracion(conf: ConfiguracionJornada) {
    for (let i = 0; i < this.configuracionJornadaList.length; i++) {
      if (this.configuracionJornadaList[i].fechaEntradaVigencia.getTime() == conf.fechaEntradaVigencia.getTime()) {
        this.configuracionJornadaList.splice(i, 1);
        break;
      }
    }
  }

}
