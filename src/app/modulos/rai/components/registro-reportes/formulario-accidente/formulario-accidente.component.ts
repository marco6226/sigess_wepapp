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

@Component({
    selector: 's-form-accidente',
    templateUrl: './formulario-accidente.component.html',
    styleUrls: ['./formulario-accidente.component.scss']
})
export class FormularioAccidenteComponent implements OnInit {

    @Input('reporte') reporte: Reporte;
    @Input('consultar') consultar: boolean;
    @Input('modificar') modificar: boolean;
    @Input('adicionar') adicionar: boolean;
    @Output('onSave') onSave = new EventEmitter<Reporte>();


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
    visibleCamposAccidente: boolean;
    idEmpresa: string;
    fechaIngreso:Date;
    fechaAccidente:Date;
    deltaFecha:Date;
    deltaDia:number;
    deltaMes:number;
    constructor(
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private reporteService: ReporteService,
        private empresaService: EmpresaService,
        private sesionService: SesionService,
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
    }

    ngOnInit() {
        this.idEmpresa = this.sesionService.getEmpresa().id;
        console.log(this.idEmpresa)
        console.log(this.reporte)
        // console.log(this.reporte.fechaIngresoEmpleado)
        // console.log(this.reporte.fechaAccidente)
        if(this.reporte.fechaIngresoEmpleado != null && this.reporte.fechaAccidente != null){
            console.log('a')
            this.fechaIngreso=new Date(this.reporte.fechaIngresoEmpleado)
            this.fechaAccidente=new Date(this.reporte.fechaAccidente)
            this.deltaFecha=new Date(this.fechaAccidente.getTime()-this.fechaIngreso.getTime())
            // this.deltaDia=this.deltaFecha.getDate()
            // console.log(this.deltaDia)
            // this.deltaMes=this.deltaFecha.getMonth()+1
            // console.log(this.deltaMes)
            this.reporte.diasLaborHabitual=this.deltaFecha.getDate()
            this.reporte.mesesLaborHabitual=this.deltaFecha.getMonth()+1
        }else{
            console.log('b')
            // this.deltaMes=null
            // this.deltaDia=null
            this.reporte.diasLaborHabitual=null
            this.reporte.mesesLaborHabitual=null
        }

        this.infoEmpresa()
        this.form = this.fb.group({
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
            numero_furat: this.reporte.numero_furat,
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
            fechaReporte: this.reporte.fechaReporte == null ? null : new Date(this.reporte.fechaReporte)
            //console.log(empresa)
        });



        if (this.reporte.testigoReporteList != null) {
            this.testigoReporteList = [];
            for (let i = 0; i < this.reporte.testigoReporteList.length; i++) {
                let reporte = this.reporte.testigoReporteList[i];
                reporte.codigo = i;
                this.testigoReporteList.push(reporte);
            }
            this.testigoReporteList = this.testigoReporteList.slice();
        }

        this.visibleCamposAccidente = this.reporte.tipo.includes('ACCIDENTE');
        this.cdRef.detectChanges();

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

    onSubmit() {
        let reporte = <Reporte>this.form.value;
        reporte.testigoReporteList = this.testigoReporteList;

        if (this.adicionar) {
            this.reporteService.create(reporte).then(
                data => {
                    console.log(data);
                    this.onSave.emit(<Reporte>data)
                }

            );
        } else if (this.modificar) {
            this.reporteService.update(reporte).then(
                data => this.onSave.emit(<Reporte>data)
            );
        }
    }
}
