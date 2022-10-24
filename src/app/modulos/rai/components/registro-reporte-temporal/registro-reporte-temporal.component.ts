import { Component, OnInit } from '@angular/core';

import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { ReporteService } from 'app/modulos/rai/services/reporte.service'
import { Reporte } from 'app/modulos/rai/entities/reporte'
import { Message } from 'primeng/primeng';
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Criteria, Filter } from '../../../core/entities/filter';
import { ConsuModReporteService } from 'app/modulos/sec/services/consu-mod-reporte.service'
@Component({
  selector: 'app-registro-reporte-temporal',
  templateUrl: './registro-reporte-temporal.component.html',
  styleUrls: ['./registro-reporte-temporal.component.scss']
})
export class RegistroReporteTemporalComponent implements OnInit {

  tipoReporte: string;
  empleadosList: Empleado[];
  empleadoSelect: Empleado;
  reporteSelect: Reporte;
  msgs: Message[];
  consultar: boolean;
  modificar: boolean;
  adicionar: boolean;
  flagR:boolean=false;

  constructor(
    private empleadoService: EmpleadoService,
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService:ConsuModReporteService,
  ) { }

async  ngOnInit() {
  // this.reporteSelect = null;
  console.log(this.reporteSelect)
    this.flagR=this.ConsuModReporteService.getflagR();
    console.log( this.Zeller(24,9,1983));
    console.log( this.consultar, this.modificar);
    
    let repParam;
    repParam = (this.flagR)?this.paramNav.getParametro<Reporte>():null;
    
    console.log('repParam',repParam);
    if (repParam != null) {
      this.consultar = this.paramNav.getAccion<string>() == 'GET';
      this.modificar = this.paramNav.getAccion<string>() == 'PUT';

      let filterQuery = new FilterQuery();
      if (repParam.id != null) {
      filterQuery.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1:  repParam.id.toString(), value2: null }];
      }
    await  this.reporteService.findByFilter(filterQuery).then(
        resp => {
          this.reporteSelect = <Reporte>(resp['data'][0]);
          this.buscarEmpleado(this.reporteSelect.numeroIdentificacionEmpleado)
    
          this.tipoReporte = this.reporteSelect.tipo;
          // console.log(this.reporteSelect);
        }
      );
    } else {
      this.adicionar = true;
    }
    this.paramNav.reset();
    this.ConsuModReporteService.setflagR(false);
  }

  buscarEmpleado(empleadoIdentificacion: string) {
    console.log(empleadoIdentificacion)
    let fq = new FilterQuery();
    fq.fieldList = [
      'id',
      'numeroIdentificacion', 
      'primerApellido', 
      'primerNombre', 
      'segundoApellido', 
      'segundoNombre', 
      'cargo_id', 
      'cargo_nombre',
      'tipoIdentificacion',
      'usuario_id',
      'usuario_avatar'
    ];
    fq.filterList = [{ field: 'numeroIdentificacion', criteria: Criteria.EQUALS, value1: empleadoIdentificacion }];
    this.empleadoService.findByFilter(fq).then(
      resp => {
        let empleado = <Empleado>FilterQuery.dtoToObject((resp['data'])[0]);
        this.empleadoSelect = empleado;
          console.log(this.empleadoSelect.usuario.email)
        
      }
    );
  }

  inicializarReporte() {
    // console.log(this.empleadoSelect.usuario.email);
    // this.reporteService.inicializarReporte(this.empleadoSelect.id).then(
    //   data => {
    //     this.reporteSelect = <Reporte>data;
    //     this.reporteSelect.tipo = this.tipoReporte;
    //     this.reporteSelect.emailEmpleado=this.empleadoSelect.usuario.email;
    //   }
    // );
  }
  volver() {
    if (this.consultar || this.modificar) {
      this.paramNav.redirect('app/rai/consultaReportes')
    } else {
      this.reporteSelect = null;
    }
  }

  limpiarCampos() {
    this.reporteSelect = null;
    this.tipoReporte = null;
    this.empleadoSelect = null;
  } 

  onSave(reporte: Reporte) {
   
    this.msgs = [];
    console.log(reporte);
    if (this.adicionar) {
      this.msgs.push({
        severity: 'success',
        summary: 'Reporte realizado',
        detail: `Se ha registrado el reporte RAI-${reporte}`
      });
    } else if (this.modificar) {
      this.msgs.push({
        severity: 'success',
        summary: 'Reporte actualizado',
        detail: `Se ha actualizado correctamente el reporte de  ${this.reporteSelect.tipo} RAI-${reporte.id}`
        
      });
      console.log(reporte);
      console.log("id del at");
    }
    this.limpiarCampos();
  }
    /**
 * Función que implementa la congruencia de los zellers y devuelve según el resultado el día de la semana.
 * 
 * @param D {Int} Numero del dia (0-31)
 * @param M {Int} Número del mes (1-12)
 * @param Y {Year} Año completo e.g 2001
 */
Zeller(D, M, Y){    
  let Day = "";

  if (M < 3)
  {
      M = M + 12;
      Y = Y - 1;
  }
  
  let C = Math.floor(Y / 100);
let K = Y - (100 * C);

let S = Math.floor(2.6 * M - 5.39) + Math.floor(K / 4) + Math.floor(C / 4) + D + K - (2 * C);

  let ans = S - (7 * Math.floor(S / 7));
  
  if (ans == 0)
  {
      Day = "Domingo";
  }
  else if (ans == 1)
  {
      Day = "Lunes";
  }
  else if (ans == 2)
  {
      Day = "Martes";
  }
  else if (ans == 3)
  {
      Day = "Miercoles";
  }
  else if (ans == 4)
  {
      Day = "Jueves";
  }
  else if (ans == 5)
  {
      Day = "Viernes";
  }
  else
  {
      Day = "Sabado";
  }
  
  return Day;
}
}
