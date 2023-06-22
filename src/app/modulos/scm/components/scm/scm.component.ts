import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';
import { ViewscmInformeService } from '../../services/view-informescm.service';
import { Router } from '@angular/router';
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'
import { IpecrService } from 'app/modulos/ipr/services/ipecr.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Reintegro } from 'app/modulos/scm/entities/reintegro.interface';
import { SortOrder } from "app/modulos/core/entities/filter";
import * as XLSX from 'xlsx'; 

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
    excel:any=[]
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
        'diagnostico',
        'proximoseguimiento'
    ];
    estadosList: SelectItem[] = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' },
    ];
    es = {
        firstDayOfWeek: 1,
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: 'Hoy',
        clear: 'Limpiar'
      };
      rangeDatesInforme: any;
      visibleDlgInforme:boolean=false
      flagInforme:boolean=true

    constructor(
        private scmService: CasosMedicosService,
        private viewscmInformeService: ViewscmInformeService,
        private cargoService: CargoService,
        private router: Router,
        private sesionService: SesionService,
        private messageService: MessageService
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
        if(this.caseSelect.statusCaso=='1'){
            localStorage.setItem('scmShowCase', 'false');
            // this.consultar = false;
            // this.visibleForm = true;
            this.router.navigate(['/app/scm/case/', this.caseSelect.id])
            // this.paramNav.redirect('/app/scm/list/');
            // + this.caseSelect.id);
        }else{
            this.messageService.add({key: 'msg', severity: "warn", summary:"Opción no disponible.", detail:"Este caso se encuentra cerrado y no se puede editar.\nPuede intentar la opción de consulta.", life: 6000});
        }
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
         
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push(filterEliminado);       
        console.log(event.filters);
        try {
            
            let res: any = await this.scmService.findByFilter(filterQuery);
            this.casosList = res.data;
            this.totalRecords = res.count;
        } catch (error) {
            console.log(error)
        }


    }

    async exportexcel(): Promise<void> 
    {
       await this.datosExcel()
       this.excel.forEach(el => delete el.empresaId)
        console.log(this.excel)
        console.log(this.rangeDatesInforme[0],this.rangeDatesInforme[1])
        let excel=this.excel.filter(resp=>{ return new Date(resp.fechaCreacion)>=new Date(this.rangeDatesInforme[0]) && new Date(resp.fechaCreacion)<=new Date(this.rangeDatesInforme[1])})
        excel.map(resp=>{
            if(resp.estadoCaso==1){resp.estadoCaso='Abierto'}
            if(resp.estadoCaso==0){resp.estadoCaso='Cerrado'}
        })
        console.log(excel)
        const readyToExport = excel;
 
       const workBook = XLSX.utils.book_new(); // create a new blank book
 
       const workSheet = XLSX.utils.json_to_sheet(readyToExport);
 
       XLSX.utils.book_append_sheet(workBook, workSheet, 'Informe'); // add the worksheet to the book
 
       XLSX.writeFile(workBook, 'Informe casos medicos.xlsx'); // initiate a file download in browser
        
       this.cerrarDialogo();
    }


    async datosExcel(): Promise<void>{
        this.excel=[]
        await this.viewscmInformeService.findByEmpresaId().then((resp:any)=>{
            this.excel=resp
            this.excel.map(resp1=>{return resp1.fechaCreacion=new Date(resp1.fechaCreacion)})
        })
    }
    cerrarDialogo(){
    this.visibleDlgInforme = false;
    }

    abrirDialogo(){
    this.visibleDlgInforme = true;
    }
    habilitarindSCM(){
        if(this.rangeDatesInforme[0] && this.rangeDatesInforme[1]){this.flagInforme=false}
        else{this.flagInforme=true}
    }
    onResetDate(){
        this.flagInforme=true
    }
}