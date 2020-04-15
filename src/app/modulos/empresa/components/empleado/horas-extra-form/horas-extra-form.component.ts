import { Component, OnInit, Input } from '@angular/core';
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { HorasExtra } from 'app/modulos/empresa/entities/horas-extra'
import { HorasExtraService } from 'app/modulos/empresa/services/horas-extra.service'
import { Message, ConfirmationService } from 'primeng/primeng'


@Component({
  selector: 's-horasExtraForm',
  templateUrl: './horas-extra-form.component.html',
  styleUrls: ['./horas-extra-form.component.scss'],
  providers: [HorasExtraService]
})
export class HorasExtraFormComponent implements OnInit {

  @Input("value") empleado: Empleado;
  horasExtraList: HorasExtra[];
  msgs: Message[];

  constructor(
    private horasExtraService: HorasExtraService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.horasExtraList = [];
    if (this.empleado.horasExtraList != null) {
      this.empleado.horasExtraList.forEach(he => {
        let horasExtra = new HorasExtra();
        horasExtra.id = he.id;
        horasExtra.horas = he.horas;
        horasExtra.fecha = new Date(he.fecha);
        this.horasExtraList.push(horasExtra);
      });
    }
  }

  adicionarHorasExtra() {
    let he = new HorasExtra();
    he.codigo = new Date().getTime();
    this.horasExtraList.push(he);
    this.horasExtraList = this.horasExtraList.slice();
  }

  guardarHorasExtra(he: HorasExtra) {
    if (this.comprobarCampos(he)) {
      he.empleado = new Empleado();
      he.empleado.id = this.empleado.id;
      this.horasExtraService.create(he).then(
        data => {
          for (let i = 0; i < this.horasExtraList.length; i++) {
            if (this.horasExtraList[i].codigo == he.codigo) {
              this.horasExtraList[i].id = (<HorasExtra>data).id;
              break;
            }
          }
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Horas extra registradas', detail: 'Se han registrado correctamente las horas extra' });
        }
      );
    }
  }


  descartarHorasExtra(he: HorasExtra) {
    for (let i = 0; i < this.horasExtraList.length; i++) {
      if (this.horasExtraList[i].codigo == he.codigo) {
        this.horasExtraList.splice(i, 1);
        this.horasExtraList = this.horasExtraList.slice();
        break;
      }
    }
  }

  confirmarEliminar(he: HorasExtra) {
    this.confirmationService.confirm({
      header: '¿Esta seguro de continuar?',
      message: 'Esta acción eliminará permanentemente el registro',
      icon: 'fa fa-exclamation-triangle',
      accept: () => this.eliminarHorasExtra(he)
    });
  }

  eliminarHorasExtra(he: HorasExtra) {
    this.horasExtraService.delete(he.id).then(
      data => {
        he = <HorasExtra>data;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Registro eliminado', detail: 'Se han eliminado correctamente las horas extra' });
        this.descartarHorasExtra(he);
      }
    );
  }

  actualizarHorasExtra(he: HorasExtra) {
    if (this.comprobarCampos(he)) {
      he.empleado = new Empleado();
      he.empleado.id = this.empleado.id;
      this.horasExtraService.update(he).then(
        data => {
          he = <HorasExtra>data;
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Horas extra actualizadas', detail: 'Se han actualizado correctamente las horas extra' });
        }
      );
    }
  }

  comprobarCampos(he: HorasExtra): boolean {
    if (he.fecha == null) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Campo fecha requerido', detail: 'Debe establecer la fecha a la que corresponden las horas extra' });
      return false;
    }
    if (he.horas == null) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Campo horas requerido', detail: 'Debe establecer la cantidad de horas extra' });
      return false;
    }
    return true;
  }
}
