import { Component, OnInit } from '@angular/core';

import { InspeccionService } from 'app/modulos/inspecciones/services/inspeccion.service'
import { Inspeccion } from 'app/modulos/inspecciones/entities/inspeccion'
import { Programacion } from 'app/modulos/inspecciones/entities/programacion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Message } from 'primeng/primeng'
import { SesionService } from '../../../core/services/sesion.service';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';


import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { filter } from 'rxjs/operators';
import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'

@Component({
    selector: 'app-consulta-inspecciones',
    templateUrl: './consulta-inspecciones.component.html',
    styleUrls: ['./consulta-inspecciones.component.scss']
})
export class ConsultaInspeccionesComponent implements OnInit {

    msgs: Message[];
    inspeccionesList: any[];
    inspeccionSelect: Inspeccion;
    totalRecords: number;
    loading: boolean = true;
    fields: string[] = [
        'id',
        'programacion_fecha',
        'fechaRealizada',
        'usuarioRegistra_email',
        'programacion_listaInspeccion_nombre',
        'programacion_area_id',
        'programacion_area_nombre',
        'fechaModificacion',
        'usuarioModifica_email',    
        'listaInspeccion'
    ];
    areasPermiso: string;
    userParray: any;
    // No programadas
    listaInspeccion: ListaInspeccion;
    inspeccionNoProgList: any[];
    inspeccionNoProgSelect: Inspeccion;
    totalRecordsNoProg: number;
    loadingNoProg: boolean = true;
    fieldsNoProg: string[] = [
        'id',
        'fechaRealizada',
        'usuarioRegistra_email',
        'listaInspeccion_nombre',
        'area_id',
        'area_nombre',
        'fechaModificacion',
        'usuarioModifica_email',    
        'listaInspeccion'
    ];

    constructor(
        private paramNav: ParametroNavegacionService,
        private inspeccionService: InspeccionService,
        private sesionService: SesionService,
        private userService: PerfilService,
        private listaInspeccionService: ListaInspeccionService,
    ) { }

    ngOnInit() {
        this.areasPermiso = this.sesionService.getPermisosMap()['INP_GET_INP'].areas;
        let areasPermiso =this.areasPermiso.replace('{','');
        areasPermiso =areasPermiso.replace('}','');
        let areasPermiso2=areasPermiso.split(',')
    
        const filteredArea = areasPermiso2.filter(function(ele , pos){
          return areasPermiso2.indexOf(ele) == pos;
        }) 
        this.areasPermiso='{'+filteredArea.toString()+'}';
        

    }

    async lazyLoadNoProg(event: any) {
        let user:any = JSON.parse(localStorage.getItem('session'));
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
        this.userParray = userP; 
        this.loadingNoProg = true;
        
        filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        // const userP =await this.userService.findByFilter(filterQuery);
        // let userParray:any = userP;   

        
        // console.log(this.userParray.data);
        

        filterQuery.fieldList = this.fieldsNoProg;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

var x:any[]=[];

        this.userParray.data.forEach(element => {
            console.log(element.id);
            x.push(element.id)
        });
        console.log("{"+x+"}");
        
        var y:string = "["+x+"]";
        let z : string ="{"+x+"}"
        console.log(y);
        console.log(z);
        
    //    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'listaInspeccion.fkPerfilId', value1: z });

        this.inspeccionService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecordsNoProg = resp['count'];
                console.log(resp);
                
                this.loadingNoProg = false;
                this.inspeccionNoProgList = [];
                (<any[]>resp['data']).forEach(dto => {
                    // this.inspeccionNoProgList.push(FilterQuery.dtoToObject(dto));
                    let obj = FilterQuery.dtoToObject(dto)
                     obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
                      try {
                        for (const profile of this.userParray.data) {
                        //  console.log(profile.id)
             
                         let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)
             
                         perfilArray.forEach(perfil => {
                        //    console.log(perfil);
                           if (perfil===profile.id) {
                            if(!this.inspeccionNoProgList.find(element=>element==obj)){
                              this.inspeccionNoProgList.push(obj);
                            }              
                        }
                         });
                       }
                       console.log(this.inspeccionNoProgList.length);
                       
                      } catch (error) {
                        
                      } 
                });
            }
        );
    }

    async lazyLoad(event: any) {
        this.loading = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        //filterQuery.filterList.push({criteria:Criteria.IS_NOT_NULL, field:'programacion'});
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "programacion.area.id", value1: this.areasPermiso });

        this.inspeccionService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecords = resp['count'];
                this.loading = false;
                this.inspeccionesList = [];
                
                (<any[]>resp['data']).forEach(dto => {
                    // this.inspeccionesList.push(FilterQuery.dtoToObject(dto));
                    let obj = FilterQuery.dtoToObject(dto)
                     obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
                      try {
                        for (const profile of this.userParray.data) {
                        //  console.log(profile.id)
             
                         let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)
             
                         perfilArray.forEach(perfil => {
                        //    console.log(perfil);
                           if (perfil===profile.id) {
                            if(!this.inspeccionesList.find(element=>element==obj)){
                              this.inspeccionesList.push(obj);
                            }              
                        }
                         });
                       }
                      } catch (error) {
                        
                      } 
                    });
                
            }
        );
    }



    redirect(consultar: boolean) {
        if (this.inspeccionSelect == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
        } else {
            this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
            this.paramNav.setParametro<Inspeccion>(this.inspeccionSelect);
            this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
        }
    }

    redirectNoProg(consultar: boolean) {
        if (this.inspeccionNoProgSelect == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
        } else {
            this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
            this.paramNav.setParametro<Inspeccion>(this.inspeccionNoProgSelect);
            this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
        }
    }

    navegar() {
        this.paramNav.redirect('/app/inspecciones/programacion');
    }

}
