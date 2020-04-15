import { Component, OnInit } from '@angular/core';
import { ContextoOrganizacion } from '../../entities/contexto-organizacion';
import { ContextoOrganizacionService } from '../../services/contexto-organizacion.service';
import { Message } from 'primeng/api';

@Component({
  selector: 's-contextoOrganizacion',
  templateUrl: './contexto-organizacion.component.html',
  styleUrls: ['./contexto-organizacion.component.scss'],
  providers: [ContextoOrganizacionService]
})
export class ContextoOrganizacionComponent implements OnInit {

  ctxOrg: ContextoOrganizacion = new ContextoOrganizacion();
  accion: string;
  msgs: Message[];


  constructor(
    private ctxOrgService: ContextoOrganizacionService
  ) {
  }

  ngOnInit() {
    this.ctxOrgService.findDefault().then(
      resp => {
        console.log(resp);
        this.ctxOrg = <ContextoOrganizacion>resp;
        if (this.ctxOrg == null) {
          this.ctxOrg = new ContextoOrganizacion();
          this.accion = 'POST';
        } else if (resp['data'] != null) {
          this.ctxOrg.data = JSON.parse(resp['data']);
          this.accion = 'PUT';
        }
      }
    );
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  adicionar(field: string) {
    if (this.ctxOrg.data[field] == null) {
      this.ctxOrg.data[field] = [];
    }
    if (field == 'partesInteresadasExterno' || field == 'partesInteresadasInterno') {
      this.ctxOrg.data[field].push({ nombre: '', necesidades: '' });
    } else {
      this.ctxOrg.data[field].push("");
    }
  }

  eliminar(field: string, index: number) {
    (<any[]>this.ctxOrg.data[field]).splice(index, 1);
  }

  guardar() {
    let ctx = { data: JSON.stringify(this.ctxOrg.data) };
    this.ctxOrgService.create(<any>ctx).then(
      resp => {
        this.msgs = [{
          severity: 'success',
          summary: 'Datos guardados',
          detail: 'Se ha guardado correctamente la información de contexto organizacional'
        }];
      }
    );
  }

  modificar() {
    let ctx = { id: this.ctxOrg.id, data: JSON.stringify(this.ctxOrg.data) };
    this.ctxOrgService.update(<any>ctx).then(
      resp => {
        this.msgs = [{
          severity: 'success',
          summary: 'Datos actualizados',
          detail: 'Se ha actuailzado correctamente la información de contexto organizacional'
        }];
      }
    );
  }

}
