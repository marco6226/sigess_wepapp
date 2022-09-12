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
    casosList2: any;
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

        await this.cargoService.findAll().then(
            resp => {
                this.cargoList = [];
                this.cargoList.push({ label: '--Seleccione--', value: null });
                (<Cargo[]>resp['data']).forEach(cargo => {
                    this.cargoList.push({ label: cargo.nombre, value: cargo.id });
                });
                //this.cargoList = this.cargoList.slice();
            }
        );
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
            // console.log(res)
            this.List2()

        } catch (error) {
            console.log(error)
        }


    }
    async List2(){
        this.casosList2=[]
        console.log(this.casosList)
        let cont1=0;
        let cont2=0;
        await this.casosList.forEach(async element => {
            cont1++
                await this.scmService.getReintegroByCaseId2(element.id).subscribe(data=>{
                    console.log(data)
                    this.reintegroList = (data.length!=0)?data:null;
                    console.log(this.reintegroList)
                    if(this.reintegroList!=null){
                    this.reintegroList.sort((a, b) => {
                        if(a.id == b.id) {
                        return 0; 
                        }
                        if(a.id > b.id) {
                        return -1;
                        }
                        return 1;
                    });
                    }
                    this.casosList2.push({
                        id:element.id, 
                        fechaCreacion:element.fechaCreacion, 
                        region:element.region, 
                        ciudad:element.ciudad, 
                        primerApellido: element.pkUser.primerApellido, 
                        primerNombre: element.pkUser.primerNombre, 
                        documento: element.documento, 
                        statusCaso:element.statusCaso, 
                        prioridadCaso: element.prioridadCaso, 
                        tipoCaso: element.tipoCaso, 
                        casoMedicoLaboral:element.casoMedicoLaboral,
                        tipoReporte:(this.reintegroList==null)?null:this.reintegroList[0].tipo_retorno,
                        nombrePadre:element.pkUser.area.padreNombre
                    })
                  })
             });
    }
}

// SELECT id, tipo_retorno, descripcion, permanencia, periodo_seguimiento, reintegro_exitoso, observacion, pk_case, fecha_cierre
// 	FROM scm.reintegros where pk_case=65
//     SELECT pk_user, status_caso, observaciones, origen, codigo_cie10, sistema_afectado, diagnostico, caso_medico_laboral, razon, pcl, porcentaje_pcl, emision_pcl_fecha, pcl_emit_entidad, status_de_calificacion, fecha_calificacion, entidad_emite_calificacion, concept_rehabilitacion, fecha_concept_rehabilitacion, entidad_emite_concepto, requiere_intervencion, sve, professional_area, justification, id, region, ciudad, names, salud_status, cargo, fecha_creacion, documento, descripcion_cargo, fk_empresa_id, entidad_emitida, entidad_emitidatwo, fecha_concept_rehabilitaciontwo, concept_rehabilitaciontwo, entidad_emite_conceptotwo, eliminado, prioridad_caso, tipo_caso, fecha_final
// 	FROM scm.casos_medicos where id =65