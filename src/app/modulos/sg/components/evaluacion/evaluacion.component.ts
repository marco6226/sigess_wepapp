import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SistemaGestionService } from '../../../sg/services/sistema-gestion.service';
import { EvaluacionService } from 'app/modulos/sg/services/evaluacion.service';
import { ReporteSGEService } from 'app/modulos/sg/services/reporte-sge.service';
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

import { TabView, Message } from 'primeng/primeng';
import { endPoints } from 'environments/environment'

import { SistemaGestionPK } from 'app/modulos/sg/entities/sistema-gestion-pk';
import { SistemaGestion } from 'app/modulos/sg/entities/sistema-gestion';
import { Elemento } from 'app/modulos/sg/entities/elemento';
import { Sede } from 'app/modulos/empresa/entities/sede'
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.scss'],
})
export class EvaluacionComponent implements OnInit {

  @ViewChild('tabView', { static: false }) tabView: TabView;

  sistemaGestion: SistemaGestion;
  visibleSedeSelector: boolean;
  sitioSelected: any;
  disableCuestionario: boolean = true;
  evaluacion: Evaluacion;
  activeIndex: number;
  btnLabel: string = "--Sitio evaluación--";
  btnSaveLabel: string;
  form: FormGroup;
  msgs: Message[] = [];
  modificar: boolean = false;
  consultar: boolean = false;
  guardar: boolean = false;
  reporte: string;
  pending: boolean = false;
  visibleDocSelector: boolean;
  elementoDocSelect: Elemento;

  constructor(
    private route: ActivatedRoute,
    private sistemaGestionService: SistemaGestionService,
    private evaluacionService: EvaluacionService,
    private reporteSGEService: ReporteSGEService,
    private sesionService: SesionService,
    private fb: FormBuilder,
  ) {
    this.form = new FormGroup({
      'id': new FormControl(),
      'nombre': new FormControl(),
      'descripcion': new FormControl(),
      'codigo': new FormControl(),
      'nombreResponsable': new FormControl(null, Validators.required),
      'emailResponsable': new FormControl(null, Validators.required),
      'ciudad': new FormControl(),
      'direccion': new FormControl(),
      'telefono': new FormControl(),
      'actividadEconomica': new FormControl(),
      'numeroTrabajadores': new FormControl(null, Validators.required),
      'nombreEvaluador': new FormControl(null, Validators.required),
      'licenciaEvaluador': new FormControl(null, Validators.required),
      'sede': new FormControl(),
    });

  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id'] != null && params['version'] != null) {
          this.guardar = true;
          this.findSGE(params['id'], params['version']);
        } else if (params['evaluacionId'] != null && params['action'] != null) {
          this.inicializarEvaluacion(params['evaluacionId'], params['action']);
        } else {
          //ERROR
        }
        if (this.guardar) {
          this.btnSaveLabel = "Guardar evaluación";
        } else if (this.modificar) {
          this.btnSaveLabel = "Actualizar evaluación";
        }
      }
    );
  }

  inicializarEvaluacion(evaluacionId: string, action: string) {
    this.cargarReporte(evaluacionId);
    this.modificar = (action == 'PUT');
    this.consultar = (action == 'GET');

    let filterQuery = new FilterQuery();
    let filterId = new Filter();
    filterId.criteria = Criteria.EQUALS;
    filterId.field = "id";
    filterId.value1 = evaluacionId;
    filterQuery.filterList = [filterId];

    this.evaluacionService.findByFilter(filterQuery).then(
      resp => {
        this.evaluacion = (<Evaluacion[]>resp['data'])[0];
        this.form.patchValue({
          id: this.evaluacion.id,
          nombre: this.evaluacion.nombre,
          descripcion: this.evaluacion.descripcion,
          codigo: this.evaluacion.codigo,
          nombreResponsable: this.evaluacion.nombreResponsable,
          emailResponsable: this.evaluacion.emailResponsable,
          ciudad: this.evaluacion.ciudad,
          direccion: this.evaluacion.direccion,
          telefono: this.evaluacion.telefono,
          actividadEconomica: this.evaluacion.actividadEconomica,
          numeroTrabajadores: this.evaluacion.numeroTrabajadores,
          nombreEvaluador: this.evaluacion.nombreEvaluador,
          licenciaEvaluador: this.evaluacion.licenciaEvaluador,
          sede: this.evaluacion.sede,
          empresaId: this.evaluacion.empresa == null ? null : this.evaluacion.empresa.id
        });
        if (this.consultar) this.form.disable();
        this.tabView.tabs[1].disabled = false;
        this.findSGEByEvaluacion(this.evaluacion.id);
        if (this.evaluacion.fechaFinalizacion != null) {
          this.reporte = endPoints.sge_reporte + "evaluacion/" + this.evaluacion.id;
        }
      }
    );
  }

  findSGEByEvaluacion(evaluacionId: string) {
    this.sistemaGestionService.findByEvaluacion(evaluacionId).then(
      data => {
        this.sistemaGestion = <SistemaGestion>data;
      }
    );
  }

  findSGE(id: string, version: number) {let filterQuery = new FilterQuery();
    let filterId = new Filter();
    filterId.criteria = Criteria.EQUALS;
    filterId.field = "sistemaGestionPK.id";
    filterId.value1 = id;

    let filterVersion = new Filter();
    filterVersion.criteria = Criteria.EQUALS;
    filterVersion.field = "sistemaGestionPK.version";
    filterVersion.value1 = version.toString(); 

    let filterElem = new Filter();
    filterElem.criteria = Criteria.EQUALS;
    filterElem.field = "consultarElementos";
    filterElem.value1 = 'true'; 

    filterQuery.filterList = [filterId, filterVersion, filterElem];

    this.sistemaGestionService.findByFilter(filterQuery).then(
      data => {
        this.sistemaGestion = (<SistemaGestion[]>data)[0];
      }
    );
  }

  guardarEvaluacion() {
    let evaluacion = new Evaluacion();
    evaluacion.id = this.form.value.id;
    evaluacion.nombre = this.form.value.nombre;
    evaluacion.descripcion = this.form.value.descripcion;
    evaluacion.codigo = this.form.value.codigo;
    evaluacion.nombreResponsable = this.form.value.nombreResponsable;
    evaluacion.emailResponsable = this.form.value.emailResponsable;
    evaluacion.ciudad = this.form.value.ciudad;
    evaluacion.direccion = this.form.value.direccion;
    evaluacion.telefono = this.form.value.telefono;
    evaluacion.actividadEconomica = this.form.value.actividadEconomica;
    evaluacion.numeroTrabajadores = this.form.value.numeroTrabajadores;
    evaluacion.nombreEvaluador = this.form.value.nombreEvaluador;
    evaluacion.licenciaEvaluador = this.form.value.licenciaEvaluador;
    evaluacion.sistemaGestion = new SistemaGestion();
    evaluacion.sistemaGestion.sistemaGestionPK = this.sistemaGestion.sistemaGestionPK;
    evaluacion.empresa = new Empresa();
    evaluacion.empresa.id = this.sesionService.getEmpresa().id;
    evaluacion.sede = this.form.value.sede != null ? (new Sede().id = this.form.value.sede.id) : null;

    if (this.guardar) {
      this.evaluacionService.create(evaluacion).then(
        data => {
          this.manageResponse(<Evaluacion>data);
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Evaluación guardada',
            detail: 'Se ha guardado correctamente la nueva evaluación'
          });
        }
      );
    } else if (this.modificar) {
      this.evaluacionService.update(evaluacion).then(
        data => {
          this.evaluacion = <Evaluacion>data;
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Evaluación actualizada',
            detail: 'Se ha actualizado correctamente la evaluación'
          });
        }
      );
    }
  }

  manageResponse(evaluacion: Evaluacion) {
    this.evaluacion = evaluacion;
    this.tabView.tabs[0].selected = false;
    this.tabView.tabs[1].selected = true;
    this.tabView.tabs[1].disabled = false;
  }

  onRadioSelectEvent(ee: any) {
    if (ee.numeroRespuestas >= ee.numeroPreguntas) {
      this.cargarReporte(this.evaluacion.id);
      this.evaluacion.fechaFinalizacion = new Date();
      //this.tabView.tabs[2].disabled = false;
      //this.tabView.tabs[3].disabled = false;
    }
  }

  cargarReporte(evaluacionId: string) {
    this.reporteSGEService.find(evaluacionId, "html").then(
      resp => {
        var blb = new Blob([<any>resp], { type: "text/html" });
        let reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
          const text = (<any>e).srcElement.result;
          (<HTMLDivElement>document.getElementById('reportContainer')).innerHTML = text;
        });
        reader.readAsText(blb);
      }
    );
  }

  download() {
    this.reporteSGEService.find(this.evaluacion.id, "docx").then(
      resp => {
        var blob = new Blob([<any>resp], { type: 'application/docx' });
        let url = URL.createObjectURL(blob);
        let dwldLink = document.getElementById("dwldLink");
        dwldLink.setAttribute("href", url);
        dwldLink.click();
      }
    );
  }

  onRespUpdate(resp: any) {
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'Actividad registrada',
      detail: 'Se ha registrado correctamente la actividad'
    });
  }

  /* Métodos de documentos de elementos*/
  abrirDlgDocumento(elemento: Elemento) {
    this.visibleDocSelector = true;
    this.elementoDocSelect = elemento;
  }


}
