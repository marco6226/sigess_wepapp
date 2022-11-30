import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Reporte } from 'app/modulos/rai/entities/reporte'
import { ReporteService } from 'app/modulos/rai/services/reporte.service'
import { TestigoReporte } from 'app/modulos/rai/entities/testigo-reporte'
import { SelectItem } from 'primeng/primeng'
import { Area } from 'app/modulos/empresa/entities/area'
import {
    tipo_vinculacion,
    jornada_trabajo,
    tipo_identificacion,
    tipo_identificacion_empresa,
    sitio,
    tipo_lesion,
    parte_cuerpo,
    agente,
    mecanismo,
    lugar,
    tipoAccidente,
    locale_es,
    severidad,
} from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Criteria, Filter } from '../../../../core/entities/filter';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { TipoPeligroService } from "app/modulos/ipr/services/tipo-peligro.service";
import { PeligroService } from "app/modulos/ipr/services/peligro.service";
import { TipoPeligro } from "app/modulos/ipr/entities/tipo-peligro";
import { Peligro } from "app/modulos/ipr/entities/peligro";
import { AnalisisDesviacionService } from "app/modulos/sec/services/analisis-desviacion.service";
import { AnalisisDesviacion } from "app/modulos/sec/entities/analisis-desviacion";
import { DesviacionService } from 'app/modulos/sec/services/desviacion.service';
import { Desviacion } from "app/modulos/sec/entities/desviacion";
import { InformacionComplementaria} from 'app/modulos/sec/entities/informacion_complementaria';
import { Causa_Raiz, FactorCausal, Incapacidad, listFactores, listPlanAccion} from 'app/modulos/sec/entities/factor-causal';
import { ParametroNavegacionService } from "app/modulos/core/services/parametro-navegacion.service";


@Component({
  selector: 'app-formulario-accidente-temporal',
  templateUrl: './formulario-accidente-temporal.component.html',
  styleUrls: ['./formulario-accidente-temporal.component.scss'],
  providers: [

    TipoPeligroService, PeligroService
],
})
export class FormularioAccidenteTemporalComponent implements OnInit {

  @Input('reporte') reporte: Reporte;
  @Input('consultar') consultar: boolean;
  @Input('modificar') modificar: boolean;
  @Input('adicionar') adicionar: boolean;
  @Output('onSave') onSave = new EventEmitter<Reporte>();
  fechaActual = new Date();
  yearRange: string = '1900:' + this.fechaActual.getFullYear();
  tipoVinculacionList: SelectItem[];
  jornadaTrabajoList: SelectItem[];
  tipoIdentificacion: SelectItem[];
  tipoIdentificacionEmpresa: SelectItem[];
  sitioList: SelectItem[];
  tipoLesionList: SelectItem[];
  severidadList: SelectItem[];
  parteCuerpoList: SelectItem[];
  agenteList: SelectItem[];
  mecanismoList: SelectItem[];
  lugarList: SelectItem[];
  tipoAccidenteList: SelectItem[];
  localeES = locale_es;
  form: FormGroup;
  testigoReporteList: TestigoReporte[];
  visibleCamposAccidente: boolean=true;
  idEmpresa: string;
  fechaIngreso:Date;
  fechaAccidente:Date;
  deltaFecha:Date;
  deltaDia:number;
  deltaMes:number;
  empleadoSelect: Empleado;
  tipoPeligroItemList: SelectItem[];
  peligroItemList: SelectItem[];
  analisisPeligros: FormGroup;
  informacionComplementaria: InformacionComplementaria;
  analisisId: string;
  incapacidadesList: Incapacidad[];
  desviacionesList: Desviacion[];
  fields: string[] = [
    'modulo',
    'hashId',
    'area_nombre',
    'concepto',
    'fechaReporte',
    'aspectoCausante',
    'analisisId',
    'criticidad',
    'nombre'
  ];
  ejemplo1=[
    {label:'opcion 1',value:'opcion 1'},
    {label:'opcion 2',value:'opcion 2'},
    {label:'opcion 3',value:'opcion 3'}
  ]
  ejemplo2=[
    {label:'opcion 1',value:'opcion 1'},
    {label:'opcion 2',value:'opcion 2'},
    {label:'opcion 3',value:'opcion 3'}
  ]

  constructor(
      private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private reporteService: ReporteService,
      private empresaService: EmpresaService,
      private sesionService: SesionService,
      private empleadoService: EmpleadoService,
      private tipoPeligroService: TipoPeligroService,
      private peligroService: PeligroService,
      private analisisDesviacionService: AnalisisDesviacionService,
      private paramNav: ParametroNavegacionService,
      private desviacionService: DesviacionService,
  ) {
      let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
      this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);
      this.jornadaTrabajoList = defaultItem.concat(<SelectItem[]>jornada_trabajo);
      this.tipoIdentificacion = defaultItem.concat(<SelectItem[]>tipo_identificacion);
      this.tipoIdentificacionEmpresa = defaultItem.concat(<SelectItem[]>tipo_identificacion_empresa);
      this.severidadList = defaultItem.concat(<SelectItem[]>severidad);
      this.sitioList = defaultItem.concat(<SelectItem[]>sitio);
      this.tipoLesionList = defaultItem.concat(<SelectItem[]>tipo_lesion);
      this.parteCuerpoList = defaultItem.concat(<SelectItem[]>parte_cuerpo);
      this.agenteList = defaultItem.concat(<SelectItem[]>agente);
      this.mecanismoList = defaultItem.concat(<SelectItem[]>mecanismo);
      this.lugarList = defaultItem.concat(<SelectItem[]>lugar);
      this.tipoAccidenteList = defaultItem.concat(<SelectItem[]>tipoAccidente);

      this.analisisPeligros = fb.group({
        Peligro: [null, /*Validators.required*/],
        DescripcionPeligro: [null, /*Validators.required*/],
        EnventoARL: [null, /*Validators.required*/],
        ReporteControl: [null, /*Validators.required*/],
        FechaControl: [null, /*Validators.required*/],
        CopiaTrabajador: [null, /*Validators.required*/],
        FechaCopia: [null, /*Validators.required*/],
    });
  }
  areasPermiso: string;
  async ngOnInit() {

    this.areasPermiso = this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    // console.log(this.areasPermiso);

      this.idEmpresa = this.sesionService.getEmpresa().id;
      this.infoEmpresa()

        this.form = this.fb.group({
            id: null,
            tipo: 'ACCIDENTE',
            nombreEps: null,
            codigoEps: null,
            nombreAfp: null,
            codigoAfp: null,
            nombreArl: null,
            codigoArl: null,
            tipoVinculador: null,
            nombreCiiu: null,
            codigoCiiu: null,
            razonSocial: null,
            tipoIdentificacionEmpresa: null,
            identificacionEmpresa: null,
            direccionEmpresa: null,
            telefonoEmpresa: null,
            telefono2Empresa: null,
            emailEmpresa: null,
            zonaEmpresa: null,
            centrTrabIgualSedePrinc: null,
            nombreCentroTrabajo: null,
            codigoCentroTrabajo: null,
            nombreCiiuCentroTrabajo: null,
            ciiuCentroTrabajo: null,
            codCiiuCentroTrabajo: null,
            direccionCentroTrabajo: null,
            telefonoCentroTrabajo: null,
            zonaCentroTrabajo: null,
            tipoVinculacion: null,
            codigoTipoVinculacion: null,
            primerApellidoEmpleado: null,
            segundoApellidoEmpleado: null,
            primerNombreEmpleado: null,
            segundoNombreEmpleado: null,
            tipoIdentificacionEmpleado: null,
            numeroIdentificacionEmpleado: null,
            fechaNacimientoEmpleado: null,
            generoEmpleado: null,
            direccionEmpleado: null,
            emailEmpleado: null,//usuario.email
            telefonoEmpleado: null,
            telefono2Empleado: null,
            fechaIngresoEmpleado: null,
            zonaEmpleado: null,
            cargoEmpleado: null,
            ocupacionHabitual: null,
            codigoOcupacionHabitual: null,
            diasLaborHabitual:null,
            mesesLaborHabitual:null,
            salario: null,
            jornadaHabitual: null,
            fechaAccidente: null,
            horaAccidente: null,
            numerofurat:null,
            jornadaAccidente: null,
            realizandoLaborHabitual: null,
            nombreLaborHabitual: null,
            codigoLaborHabitual: null,
            horaInicioLabor: null,
            tipoAccidente: null,
            causoMuerte: null,
            zonaAccidente: null,
            lugarAccidente:null,
            huboTestigos: null,
            descripcion: null,
            sitio: null,
            cualSitio: null,
            tipoLesion: null,
            cualTipoLesion: null,
            parteCuerpo: null,
            agente: null,
            cualAgente: null,
            mecanismo: null,
            cualMecanismo: null,
            ciudadEmpresa: null,
            ciudadCentroTrabajo:null,
            ciudadEmpleado: null,
            ciudadAccidente: null,
            severidad:null,
            areaAccidente: null,
            usuarioReporta: null,
            empresa:null,
            nombresResponsable: null,
            apellidosResponsable: null,
            tipoIdentificacionResponsable: null,
            numeroIdentificacionResponsable: null,
            cargoResponsable:null,
            fechaReporte: null,
            temporal:'Temporaluno'
        });
        setTimeout(async () => {

            // this.informacionComplementaria = JSON.parse(resp["data"][0].complementaria);

            if(this.modificar || this.consultar){
                console.log('entre1')
                this.form.patchValue({
                    id: this.reporte.id,
                    tipo: this.reporte.tipo,
                    nombreEps: this.reporte.nombreEps,
                    codigoEps: this.reporte.codigoEps,
                    nombreAfp: this.reporte.nombreAfp,
                    codigoAfp: this.reporte.codigoAfp,
                    nombreArl: this.reporte.nombreArl,
                    codigoArl: this.reporte.codigoArl,
                    tipoVinculador: this.reporte.tipoVinculador,
                    nombreCiiu: this.reporte.nombreCiiu,
                    codigoCiiu: this.reporte.codigoCiiu,
                    razonSocial: this.reporte.razonSocial,
                    tipoIdentificacionEmpresa: this.reporte.tipoIdentificacionEmpresa,
                    identificacionEmpresa: this.reporte.identificacionEmpresa,
                    direccionEmpresa: this.reporte.direccionEmpresa,
                    telefonoEmpresa: this.reporte.telefonoEmpresa,
                    telefono2Empresa: this.reporte.telefono2Empresa,
                    emailEmpresa: this.reporte.emailEmpresa,
                    zonaEmpresa: this.reporte.zonaEmpresa,
                    centrTrabIgualSedePrinc: this.reporte.centrTrabIgualSedePrinc,
                    nombreCentroTrabajo: this.reporte.nombreCentroTrabajo,
                    codigoCentroTrabajo: this.reporte.codigoCentroTrabajo,
                    nombreCiiuCentroTrabajo: this.reporte.nombreCiiuCentroTrabajo,
                    ciiuCentroTrabajo: this.reporte.ciiuCentroTrabajo,
                    codCiiuCentroTrabajo: this.reporte.codCiiuCentroTrabajo,
                    direccionCentroTrabajo: this.reporte.direccionCentroTrabajo,
                    telefonoCentroTrabajo: this.reporte.telefonoCentroTrabajo,
                    zonaCentroTrabajo: this.reporte.zonaCentroTrabajo,
                    tipoVinculacion: this.reporte.tipoVinculacion,
                    codigoTipoVinculacion: this.reporte.codigoTipoVinculacion,
                    primerApellidoEmpleado: this.reporte.primerApellidoEmpleado,
                    segundoApellidoEmpleado: this.reporte.segundoApellidoEmpleado,
                    primerNombreEmpleado: this.reporte.primerNombreEmpleado,
                    segundoNombreEmpleado: this.reporte.segundoNombreEmpleado,
                    tipoIdentificacionEmpleado: this.reporte.tipoIdentificacionEmpleado,
                    numeroIdentificacionEmpleado: this.reporte.numeroIdentificacionEmpleado,
                    fechaNacimientoEmpleado: this.reporte.fechaNacimientoEmpleado == null ? null : new Date(this.reporte.fechaNacimientoEmpleado),
                    generoEmpleado: this.reporte.generoEmpleado,
                    direccionEmpleado: this.reporte.direccionEmpleado,
                    emailEmpleado: this.reporte.emailEmpleado,//usuario.email
                    telefonoEmpleado: this.reporte.telefonoEmpleado,
                    telefono2Empleado: this.reporte.telefono2Empleado,
                    fechaIngresoEmpleado: this.reporte.fechaIngresoEmpleado == null ? null : new Date(this.reporte.fechaIngresoEmpleado),
                    zonaEmpleado: this.reporte.zonaEmpleado,
                    cargoEmpleado: this.reporte.cargoEmpleado,
                    ocupacionHabitual: this.reporte.ocupacionHabitual,
                    codigoOcupacionHabitual: this.reporte.codigoOcupacionHabitual,
                    // diasLaborHabitual: this.deltaDia,
                    // mesesLaborHabitual: this.deltaMes,
                    diasLaborHabitual:this.reporte.diasLaborHabitual,
                    mesesLaborHabitual:this.reporte.mesesLaborHabitual,
                    salario: this.reporte.salario,
                    jornadaHabitual: this.reporte.jornadaHabitual,
                    fechaAccidente: this.reporte.fechaAccidente == null ? null : new Date(this.reporte.fechaAccidente),
                    horaAccidente: this.reporte.horaAccidente == null ? null : new Date(this.reporte.horaAccidente),
                    numerofurat: this.reporte.numerofurat,
                    jornadaAccidente: this.reporte.jornadaAccidente,
                    realizandoLaborHabitual: this.reporte.realizandoLaborHabitual,
                    nombreLaborHabitual: this.reporte.nombreLaborHabitual,
                    codigoLaborHabitual: this.reporte.codigoLaborHabitual,
                    horaInicioLabor:  this.reporte.horaInicioLabor == null ? null : new Date(this.reporte.horaInicioLabor),
                    tipoAccidente: this.reporte.tipoAccidente,
                    causoMuerte: this.reporte.causoMuerte,
                    zonaAccidente: this.reporte.zonaAccidente,
                    lugarAccidente: this.reporte.lugarAccidente,
                    huboTestigos: this.reporte.huboTestigos,
                    descripcion: this.reporte.descripcion,
                    sitio: this.reporte.sitio,
                    cualSitio: this.reporte.cualSitio,
                    tipoLesion: this.reporte.tipoLesion,
                    cualTipoLesion: this.reporte.cualTipoLesion,
                    parteCuerpo: this.reporte.parteCuerpo,
                    agente: this.reporte.agente,
                    cualAgente: this.reporte.cualAgente,
                    mecanismo: this.reporte.mecanismo,
                    cualMecanismo: this.reporte.cualMecanismo,
                    ciudadEmpresa: this.reporte.ciudadEmpresa,
                    ciudadCentroTrabajo: this.reporte.ciudadCentroTrabajo,
                    ciudadEmpleado: this.reporte.ciudadEmpleado,
                    ciudadAccidente: this.reporte.ciudadAccidente,
                    severidad:this.reporte.severidad,
                    areaAccidente: this.reporte.areaAccidente,
                    usuarioReporta: this.reporte.usuarioReporta,
                    empresa: this.reporte.empresa,
                    nombresResponsable: this.reporte.nombresResponsable,
                    apellidosResponsable: this.reporte.apellidosResponsable,
                    tipoIdentificacionResponsable: this.reporte.tipoIdentificacionResponsable,
                    numeroIdentificacionResponsable: this.reporte.numeroIdentificacionResponsable,
                    cargoResponsable: this.reporte.cargoResponsable,
                    fechaReporte: this.reporte.fechaReporte == null ? null : new Date(this.reporte.fechaReporte),
                
                });
                if(this.analisisId){
                  this.consultarAnalisis(this.analisisId)}
            }       
        }, 200);
      this.cdRef.detectChanges();
      await this.cargarTiposPeligro();
  }
  SelectPeligro(a: string){
    this.cargarPeligro(a)
}
  async cargarTiposPeligro() {
    await this.tipoPeligroService.findAll().then(
      resp => {
        // console.log(resp);
        this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
        (<TipoPeligro[]>resp['data']).forEach(
          data => this.tipoPeligroItemList.push({ label: data.nombre, value: data })
        )   
      }
    );
    console.log(this.tipoPeligroItemList)
  }
  async cargarPeligro(idtp) {

    //this.peligroService.findAll().then(
    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
    await this.peligroService.findByFilter(filter).then(
      resp => {
        // console.log(resp);
        this.peligroItemList = [{ label: '--Seleccione--', value: [null, null]}];
        (<Peligro[]>resp).forEach(
          data => 
            {
                this.peligroItemList.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
            }
        )
        // console.log(this.peligroItemList);
      }
    );
     }else{
        this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
     }
  }
  async infoEmpresa() {

      let empresa = await this.empresaService.findSelected() as Empresa;
      
      this.form.patchValue({
          //identificacionEmpresa: empresa.nit,
          tipoIdentificacionEmpresa: "NI",
          direccionEmpresa: empresa.direccion,
          telefonoEmpresa: empresa.telefono,
          emailEmpresa: empresa.email
      })

  }

  adicionarTestigo() {
      if (this.testigoReporteList == null) {
          this.testigoReporteList = [];
      }
      let testigo = new TestigoReporte();
      testigo.codigo = this.testigoReporteList.length;
      this.testigoReporteList.push(testigo);
      this.testigoReporteList = this.testigoReporteList.slice();
  }
  removerTestigo(testigo: TestigoReporte) {
      for (let i = 0; i < this.testigoReporteList.length; i++) {
          if (this.testigoReporteList[i].codigo === testigo.codigo) {
              this.testigoReporteList.splice(i, 1);
              this.testigoReporteList = this.testigoReporteList.slice();
              break;
          }
      }
  }

  async consultarAnalisis(analisisId: string){
    let fq = new FilterQuery();
    fq.filterList = [
        { criteria: Criteria.EQUALS, field: "id", value1: analisisId },
    ];
    await this.analisisDesviacionService.findByFilter(fq).then(async (resp) => {
      this.informacionComplementaria = JSON.parse(resp["data"][0].complementaria);
      this.incapacidadesList = JSON.parse(resp["data"][0].incapacidades)
    })
    if(this.informacionComplementaria!=null){
      this.analisisPeligros.patchValue({
          'Peligro': this.informacionComplementaria.Peligro,
          'DescripcionPeligro': this.informacionComplementaria.DescripcionPeligro,
          'EnventoARL': this.informacionComplementaria.EnventoARL,
          'ReporteControl': this.informacionComplementaria.ReporteControl,
          'FechaControl': this.informacionComplementaria.FechaControl == null ? null : new Date(this.informacionComplementaria.FechaControl),
          'CopiaTrabajador': this.informacionComplementaria.CopiaTrabajador,
          'FechaCopia':this.informacionComplementaria.FechaCopia == null ? null : new Date(this.informacionComplementaria.FechaCopia)
        });
        console.log(this.analisisPeligros.value['Peligro']);
      this.cargarPeligro(this.analisisPeligros.value['Peligro'])
    }
  }

  //botón guardar y modificar
  async submit1() {
      this.informacionComplementaria=this.analisisPeligros.value;
      let ad = new AnalisisDesviacion();
      
      ad.complementaria=JSON.stringify(this.informacionComplementaria);
      ad.incapacidades= JSON.stringify(this.incapacidadesList);




      if (this.adicionar) {

          // this.analisisDesviacionService.create(ad)
          // .then((data) => {
          //   let analisisDesviacion = <AnalisisDesviacion>data;
          //   this.analisisId = analisisDesviacion.id;
          // })
          let reporte = <Reporte>this.form.value;
          reporte.testigoReporteList = this.testigoReporteList;
          await this.reporteService.create(reporte).then(
              async data => {
                  this.onSave.emit(<Reporte>data)

                  let filterQuery = new FilterQuery();
                  filterQuery.fieldList = this.fields;
                  filterQuery.filterList = []
                  
                  filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
                  filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "hashId", value1: 'RAI-'+data.toString() });
                  await this.desviacionService.findByFilter(filterQuery).then(
                    resp => {
                      this.desviacionesList = resp['data'];
                      ad.desviacionesList=this.desviacionesList;
                      this.analisisDesviacionService.create(ad)
                      .then((data) => {
                        let analisisDesviacion = <AnalisisDesviacion>data;
                        this.analisisId = analisisDesviacion.id;
                      })
                    })

                  this.adicionar=false
                  this.modificar=true
              }

          );
      } else if (this.modificar) {
        // ad.desviacionesList=this.desviacionesList;
        // ad.id = this.analisisId;
        // this.analisisDesviacionService.update(ad)
        let reporte = <Reporte>this.form.value;
        reporte.testigoReporteList = this.testigoReporteList;
        this.reporteService.update(reporte).then(
            data => this.onSave.emit(<Reporte>data)
        );
      }
  }
  getListIncapacidades(event){
    // console.log(event);
    this.incapacidadesList = event;
  }
}
