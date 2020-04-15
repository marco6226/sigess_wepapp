import { Component, OnInit } from '@angular/core';
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'
import { IpecrService } from 'app/modulos/ipr/services/ipecr.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';

@Component({
  selector: 'app-consulta-ipecr',
  templateUrl: './consulta-ipecr.component.html',
  styleUrls: ['./consulta-ipecr.component.scss'],
  providers: [IpecrService]
})
export class ConsultaIpecrComponent implements OnInit {

  ipecrSelect: Ipecr;
  ipecrList: Ipecr[];

  constructor(
    private ipecrService: IpecrService,
    private paramNavService: ParametroNavegacionService,
  ) {

  }

  ngOnInit() {
    this.ipecrService.findAll().then(
      resp => {
        this.ipecrList = <Ipecr[]>resp['data'];
        this.ipecrList.forEach(
          ipecr => {
            ipecr.fechaElaboracionStr = new Date(ipecr.fechaElaboracion).toLocaleString();
            ipecr.areasStr = this.toCommaSeparated(ipecr.areaList, "nombre");
            ipecr.grupoExpSimilarStr = this.toCommaSeparated(ipecr.grupoExpSimilarList, null);
          }
        );
      }
    );
  }

  consultarDetalle() {
    this.paramNavService.setAccion('GET');
    this.paramNavService.setParametro(this.ipecrSelect);
    this.paramNavService.redirect('/app/ipr/formularioIpecr');
  }

  modificar() {
    this.paramNavService.setAccion('PUT');
    this.paramNavService.setParametro(this.ipecrSelect);
    this.paramNavService.redirect('/app/ipr/formularioIpecr');
  }

  toCommaSeparated(value: any[], field: string): string {
    if (value == null) {
      return "";
    }
    let str = "";
    value.forEach(element => {
      str += (field == null ? element : element[field]) + ", ";
    });
    return str;
  }

  navegar(){
    this.paramNavService.redirect('/app/ipr/formularioIpecr');
  }
}
