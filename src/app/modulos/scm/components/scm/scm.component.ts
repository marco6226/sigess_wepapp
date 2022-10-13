import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';
import { Router } from '@angular/router';
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'
import { IpecrService } from 'app/modulos/ipr/services/ipecr.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Reintegro } from 'app/modulos/scm/entities/reintegro.interface';
import { SortOrder } from "app/modulos/core/entities/filter";

@Component({
    selector: 'app-scm',
    templateUrl: './scm.component.html',
    styleUrls: ['./scm.component.scss'],
})

export class ScmComponent implements OnInit {
    reintegroList: Reintegro[] =[]
    idEmpresa: string;
    valor2: string;
    valor3: string;
    empresaId: string;
    casosList: any;
    usuarioSelect: Usuario;
    perfilList: SelectItem[] = [];
    visibleDlg: boolean;
    caseSelect: any;
    cargoList = [];
    msgs: Message[] = [];
    consultar = false;
    isUpdate: boolean;
    form: FormGroup;
    visibleForm: boolean;
    solicitando: boolean = false;
    loading: boolean = false;;
    totalRecords: number;
    fields: string[] = [
        'id',
        'fechaCreacion',
        'region',
        'ciudad',
        'names',
        'documento',
        'cargo',
        'statusCaso',
        'casoMedicoLaboral',
        'razon',
        'pkUser',
        'sve',
        'eliminado',
        'prioridadCaso',
        'tipoCaso',
        'tipoReporte',
        'diagnostico'
    ];
    estadosList: SelectItem[] = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' },
    ];

    constructor(
        private scmService: CasosMedicosService,
        private cargoService: CargoService,
        private router: Router,
        private sesionService: SesionService
    ) { }

    async ngOnInit() {

        // await this.cargoService.findAll().then(
        //     resp => {
        //         this.cargoList = [];
        //         this.cargoList.push({ label: '--Seleccione--', value: null });
        //         (<Cargo[]>resp['data']).forEach(cargo => {
        //             this.cargoList.push({ label: cargo.nombre, value: cargo.id });
        //         });
        //         //this.cargoList = this.cargoList.slice();
        //     }
        // );
        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
        });
        this.idEmpresa = this.sesionService.getEmpresa().id;
        setTimeout(() => {
            console.log(this.idEmpresa)
        }, 2000);
    }

    onSubmit() { 

    }

    openCase() {
        localStorage.setItem('scmShowCase', 'false');
        // this.consultar = false;
        // this.visibleForm = true;
        this.router.navigate(['/app/scm/case/', this.caseSelect.id])
        // this.paramNav.redirect('/app/scm/list/');
        // + this.caseSelect.id);
    }

    openCaseConsultar() {
        localStorage.setItem('scmShowCase', 'true');
        // this.consultar = true;
        // this.visibleForm = true;
        this.router.navigate(['/app/scm/case/', this.caseSelect.id])
    }

    eliminar() { }

    DecodificacionSiNo(valor){
        this.valor2=valor.toLowerCase() ;
        if(this.valor2.length==0){return null}else if(-1!='si'.search(this.valor2)){return '1'}else if(-1!='no'.search(this.valor2)){return'0'}else if(-1!='en seguimiento'.search(this.valor2)){return '2'}else if(-1!='no aplica'.search(this.valor2)){return '3'}else{return '4'}
        //if(-1!='si'.search(this.valor2)){return '1'}else if(-1!='no'.search(this.valor2)){return '0'}else{return null}
    }
    DecodificacionEstado(valor){
        this.valor3=valor.toLowerCase() ;
        if(this.valor3.length==0){return null}else if(-1!='abierto'.search(this.valor3)){return '1'}else if(-1!='cerrado'.search(this.valor3)){return '0'}else{return '2'}
        // if(this.valor3=='Abierto'){return '1'}else if(this.valor3=='Cerrado'){return '0'}else if(this.valor2!=''){return '3'}
    }

    async lazyLoad(event: any) {
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        let filterEliminado = new Filter();
        filterEliminado.criteria = Criteria.EQUALS;
        filterEliminado.field = 'eliminado';
        filterEliminado.value1 = 'false';

        filterQuery.fieldList = this.fields;
        filterQuery.filterList = [filterEliminado];        
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        console.log(event.filters);
        try {
            
            let res: any = await this.scmService.findByFilter(filterQuery);
            this.casosList = res.data;
            this.totalRecords = res.count;
        } catch (error) {
            console.log(error)
        }


    }
}

// SELECT id, tipo_retorno, descripcion, permanencia, periodo_seguimiento, reintegro_exitoso, observacion, pk_case, fecha_cierre
// 	FROM scm.reintegros where pk_case=65
//     SELECT pk_user, status_caso, observaciones, origen, codigo_cie10, sistema_afectado, diagnostico, caso_medico_laboral, razon, pcl, porcentaje_pcl, emision_pcl_fecha, pcl_emit_entidad, status_de_calificacion, fecha_calificacion, entidad_emite_calificacion, concept_rehabilitacion, fecha_concept_rehabilitacion, entidad_emite_concepto, requiere_intervencion, sve, professional_area, justification, id, region, ciudad, names, salud_status, cargo, fecha_creacion, documento, descripcion_cargo, fk_empresa_id, entidad_emitida, entidad_emitidatwo, fecha_concept_rehabilitaciontwo, concept_rehabilitaciontwo, entidad_emite_conceptotwo, eliminado, prioridad_caso, tipo_caso, fecha_final
// 	FROM scm.casos_medicos where id =65