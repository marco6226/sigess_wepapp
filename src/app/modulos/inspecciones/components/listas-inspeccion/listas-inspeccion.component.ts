import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { InspeccionService } from '../../services/inspeccion.service';
import { filter } from 'rxjs-compat/operator/filter';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';
import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-listas-inspeccion',
  templateUrl: './listas-inspeccion.component.html',
  styleUrls: ['./listas-inspeccion.component.scss']
})
export class ListasInspeccionComponent implements OnInit {

  listaInspeccionList: ListaInspeccion[];
  listaInpSelect: ListaInspeccion;
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'listaInspeccionPK_id',
    'listaInspeccionPK_version',
    'codigo',
    'nombre',
    'tipoLista',
    'descripcion',
    'estado',
    'fkPerfilId'
  ];

  visibleDlg: boolean;
  desde: Date;
  hasta: Date;
  downloading: boolean;

  constructor(
    private listaInspeccionService: ListaInspeccionService,
    private inspeccionService: InspeccionService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
    private userService: PerfilService,
    private confirmationService: ConfirmationService,
  ) { 
   

  }
    
  

  ngOnInit() {
    this.loading = true;
  }


  async lazyLoad(event: any) {
    let user:any = JSON.parse(localStorage.getItem('session'));
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
    let userParray:any = userP;    

    this.loading = true;

    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
   /*userParray.data.forEach(element => {
      filterQuery.filterList.push({
        field: 'fkPerfilId',
        criteria: Criteria.CONTAINS,
        value1: `%${element.id}%`,
         
      })
    });*/
    
    this.listaInspeccionService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.listaInspeccionList = [];
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
         try {
           for (const profile of userParray.data) {
            console.log(profile.id)

          //   if (obj.fkPerfilId.includes(`${profile.id}`)) {
          //     this.listaInspeccionList.push(obj);
          //     break;
          //  }
console.log(obj.fkPerfilId);

let perfilArray = JSON.parse(obj.fkPerfilId)

// a = a.split("[")
// a = a.split("]")


console.log(perfilArray);


          perfilArray.forEach(perfil => {
            console.log(perfil);
            if (perfil===profile.id) {
             this.listaInspeccionList.push(obj);
             // break;
           }
          });

          
           

           }
         } catch (error) {
           
         } 
            
          
        
        });
      }
    );
  }

  modificar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/inspecciones/elaboracionLista']
    );
  }


  consultar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/inspecciones/elaboracionLista']
    );
  }

  eliminar() {
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'La lista de inspección ' + this.listaInpSelect.nombre + ' será eliminada, no podrá deshacer esta acción, ¿Dese continuar?',
      accept: () =>
        this.listaInspeccionService.delete(this.listaInpSelect.codigo)
    });
  }


  
  
 async loadProfile(){
  
    }

  navegar() {
    this.paramNav.redirect('/app/inspecciones/elaboracionLista');
  }

  abrirDlg() {
    this.visibleDlg = true;
  }

  descargarInspecciones() {
    this.downloading = true;
    this.inspeccionService.consultarConsolidado(this.desde, this.hasta, this.listaInpSelect.listaInspeccionPK.id, this.listaInpSelect.listaInspeccionPK.version)
      .then(resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp], { type: 'text/csv;charset=utf-8;' });
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", "Consolidado inspecciones_" + new Date().getTime() + ".csv");
          dwldLink.click();
          this.downloading = false;
        }
      })
      .catch(err => {
        this.downloading = false;
      });
  }
}
