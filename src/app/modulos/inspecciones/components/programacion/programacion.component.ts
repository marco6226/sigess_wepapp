import { ListaInspeccionPK } from './../../entities/lista-inspeccion-pk';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { Programacion } from 'app/modulos/inspecciones/entities/programacion'
import { ProgramacionService } from 'app/modulos/inspecciones/services/programacion.service'
import { Message } from 'primeng/primeng'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Router } from '@angular/router';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { SesionService } from '../../../core/services/sesion.service';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import {Observable} from 'rxjs/Rx'  

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent implements OnInit {


  localeES: any = locale_es;
  meses: SelectItem[] = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' }
  ];
  dias = [
    { numero: 0, nombre: 'Domingo' },
    { numero: 1, nombre: 'Lunes' },
    { numero: 2, nombre: 'Martes' },
    { numero: 3, nombre: 'Miercoles' },
    { numero: 4, nombre: 'Jueves' },
    { numero: 5, nombre: 'Viernes' },
    { numero: 6, nombre: 'Sabado' }
  ];
  periodicidadList: SelectItem[] = [
    { label: 'Dia(s)', value: 'diario' },
    { label: 'Semana(s)', value: 'semana' },
    { label: 'Mes(es)', value: 'mes' },
  ];

  anioSelect: number;
  mesSelect: number;
  matriz: any[][];
  aniosList: SelectItem[];
  listasInspeccionList: SelectItem[] = [{ label: '--Seleccione--', value: null }];
  msgs: Message[];
  visibleDlg: boolean;
  fechaSelect: Date;
  form: FormGroup;
  actualizar: boolean;
  adicionar: boolean;
  btnInspDisable: boolean;
  visibleProgMasiva: boolean;
  fechaMaxima: Date;
  semanaLaboral = ['1', '2', '3', '4', '5',];
  listaInspeccionList: ListaInspeccion[];
  areasPerm: string;
  loading: boolean = false;
  progLoading: boolean = false;
  permiso:boolean = false;;
  totalRecords: number;
  constructor(
    private sesionService: SesionService,
    private router: Router,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private programacionService: ProgramacionService,
    private listaInspeccionService: ListaInspeccionService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      id: null,
      numeroInspecciones: ['', Validators.required],
      listaInspeccionPK: ['', Validators.required],
      area: ['', Validators.required],
      unidadFrecuencia: null,
      valorFrecuencia: null,
      fechaHasta: null,
      semana: null
    }); 
  }


 async ngOnInit() {   
     let permiso = this.sesionService.getPermisosMap()['INP_PUT_PROG'];  
     let empresa = this.sesionService.getEmpresa();     

    if (permiso != null && permiso.valido == true) {
      this.permiso = true;
    }
    let user:any = JSON.parse(localStorage.getItem('session'));
    let filterQuery = new FilterQuery();


    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
     
const userP = await this.userService.findByFilter(filterQuery);
    console.log(userP);
    let userParray:any = userP;   
   
    this.areasPerm = this.sesionService.getPermisosMap()['INP_GET_PROG'].areas;

    this.fechaMaxima = new Date();
    this.fechaMaxima.setDate(31);
    this.fechaMaxima.setMonth(11);
    this.fechaMaxima.setFullYear(this.fechaMaxima.getFullYear() + 1);

     filterQuery = new FilterQuery();
     filterQuery.filterList= [{
      field: 'estado',
      criteria: Criteria.NOT_EQUALS,
      value1: 'inactivo',
      value2: null
    }];

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

            let perfilArray = JSON.parse(obj.fkPerfilId)

            perfilArray.forEach(perfil => {
              console.log(perfil);
              if (perfil===profile.id) {
                if(!this.listaInspeccionList.find(element=>element==obj)){
                  this.listaInspeccionList.push(obj);
                  this.listasInspeccionList.push({ label: obj.codigo + ' - ' + obj.nombre + ' v' + obj.listaInspeccionPK.version, value: obj.listaInspeccionPK } );
                }              
            }
            });
          }
         } catch (error) {            
          } 
        });
        console.log(this.listasInspeccionList);
        this.listasInspeccionList = this.listasInspeccionList.slice();
        //this.listasInspeccionList = this.listasInspeccionList[this.listasInspeccionList.length-1];
      });
    
    let fechaActual = new Date();
    this.actualizarFecha(fechaActual.getFullYear(), fechaActual.getMonth());
    this.form.controls.area.disabled
    
  }

  buildAniosList(anioSelect: number) {
    this.aniosList = [];
    for (let anio = (anioSelect - 5); anio < (anioSelect + 5); anio++) {
      this.aniosList.push({ label: '' + anio, value: anio });
    }
  }

  updateMonth(mes: SelectItem) {
    this.actualizarFecha(this.anioSelect, mes.value);
  }

  updateYear(anio: SelectItem) {
    this.actualizarFecha(anio.value, this.mesSelect);
  }

  actualizarFecha(anio: number, mes: number, ) {
    let ultimoDiaMes = 0;
    switch (mes) {
      case 0: case 2: case 4: case 6: case 7: case 9: case 11:
        ultimoDiaMes = 31;
        break;
      case 3: case 5: case 8: case 10:
        ultimoDiaMes = 30;
        break;
      case 1:
        ultimoDiaMes = this.esBisiesto(anio) ? 29 : 28;
        break;
    }

    let filterQuery = new FilterQuery();

    let filter = new Filter();
    filter.criteria = Criteria.BETWEEN;
    filter.field = "fecha";
    filter.value1 = new Date(anio + '-' + (mes + 1) + '-' + '01').toISOString();
    filter.value2 = new Date(anio + '-' + (mes + 1) + '-' + ultimoDiaMes).toISOString();

    filterQuery.filterList = [
      filter,
      { criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPerm }
    ];
    filterQuery.fieldList = [
      'id',
      'fecha',
      'listaInspeccion_listaInspeccionPK',
      'area_id',
      'area_nombre',
      'numeroInspecciones',
      'numeroRealizadas'
    ];
    this.progLoading = true;
    this.programacionService.findByFilter(filterQuery)
      .then(data => {
        let array = <any[]>data['data'];
        let objArray = [];
        array.forEach(dto => {
          objArray.push(FilterQuery.dtoToObject(dto));
        });
        this.buildUI(anio, mes, objArray);
        this.progLoading = false;
      })
      .catch(err => {
        this.progLoading = false;
      });
  }

  buildUI(anio: number, mes: number, programacionList: Programacion[]) {
    this.anioSelect = anio;
    this.mesSelect = mes;
    let ultimoDiaMes = 0;
    switch (this.mesSelect) {
      case 0: case 2: case 4: case 6: case 7: case 9: case 11:
        ultimoDiaMes = 31;
        break;
      case 3: case 5: case 8: case 10:
        ultimoDiaMes = 30;
        break;
      case 1:
        ultimoDiaMes = this.esBisiesto(this.anioSelect) ? 29 : 28;
        break;
    }
    this.matriz = [];
    let fechaPrimerDiaMes = new Date(this.anioSelect, this.mesSelect, 1);
    let contadorSemanas = 0;
    let contadorDias = fechaPrimerDiaMes.getDay();
    for (let i = 1; i <= ultimoDiaMes; i++) {
      if (contadorDias > 0 && contadorDias % 7 == 0) {
        // primer dia de la semana siguiente
        contadorSemanas++;
        contadorDias = 0;
      }
      if (this.matriz[contadorSemanas] == null) {
        this.matriz[contadorSemanas] = [];
      }
      let fechaDia = new Date(this.anioSelect, this.mesSelect, i);
      let progDiaList = this.findProgramacion(programacionList, fechaDia);
      this.matriz[contadorSemanas][contadorDias] = { dia: fechaDia, programacionList: progDiaList };
      contadorDias++;
    }
    this.buildAniosList(this.anioSelect);
  }

  findProgramacion(programacionList: Programacion[], dia: Date): Programacion[] {
    let progDiaList = []
    for (let i = 0; i < programacionList.length; i++) {
      let progDate = new Date(programacionList[i].fecha.valueOf());
      if (progDate.getDate() === dia.getDate()) {
        progDiaList.push(programacionList[i]);
      }
    }
    return progDiaList;
  }

  esBisiesto(year: number) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
  }

  openProg(prog: Programacion) {
    this.visibleDlg = true;
    this.actualizar = true;
    this.adicionar = false;
    this.fechaSelect = prog.fecha;
    this.form.patchValue({
      id: prog.id,
      numeroInspecciones: prog.numeroInspecciones,
      listaInspeccionPK: prog.listaInspeccion.listaInspeccionPK,
      area: prog.area
    });
    this.btnInspDisable = prog.numeroRealizadas == prog.numeroInspecciones;
    if (prog.numeroRealizadas > 0) {
      this.form.disable();
    } else {
      this.form.enable();
    }

    if(!this.permiso)this.form.disable();
  }
  openDlg(event: Date) {
    this.visibleDlg = true;
    this.actualizar = false;
    this.adicionar = true;
    this.fechaSelect = event;
    this.form.reset();
    this.form.enable();
    this.form.patchValue({
      fechaHasta: this.fechaSelect,
      unidadFrecuencia: 'diario',
      valorFrecuencia: 1,
      semana: this.semanaLaboral
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.adicionar) {
      if (this.form.value.unidadFrecuencia == null || this.form.value.valorFrecuencia == null || this.form.value.fechaHasta == null) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: 'Debe establecer la frecuencia de las inspecciones'
        });
        return;
      }
      let programacionList: Array<Programacion> = [];
      this.generarProgramaciones(
        programacionList,
        this.form.value.unidadFrecuencia,
        this.form.value.valorFrecuencia,
        this.fechaSelect,
        this.form.value.fechaHasta
      );
      if (programacionList.length == 0) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn',
          summary: 'Programacion no generada',
          detail: 'La programacion no ha sido generada, por favor revise la configuracion establecida'
        });
        this.loading = false;
        return;
      }
      let count = 1;
      programacionList.forEach(programacion => {
        this.programacionService.create(programacion)
          .then(data => {
            let ultimo = (programacionList.length <= count);
            this.manageResponse(<Programacion>data, ultimo);
            count++;
            if (ultimo) {
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
          });
      });
    } else {
      let programacion = this.crearProgramacion(this.fechaSelect);
      programacion.id = this.form.value.id;
      this.programacionService.update(programacion)
        .then(data => {
          this.loading = false;
          this.manageResponse(<Programacion>data, true);
        })
        .catch(err => {
          this.loading = false;
        });
    }

  }

  generarProgramaciones(list: Array<Programacion>, unidadFrecuencia: string, valorFrecuencia: number, fechaDesde: Date, fechaHasta: Date) {
    for (let fechaSiguiente = new Date(fechaDesde); fechaSiguiente.getTime() <= fechaHasta.getTime();) {

      /*
      let semana = this.form.value.semana == null ? [] : this.form.value.semana;

      let esSabadoODomingo = (fechaSiguiente.getDay() == 6 || fechaSiguiente.getDay() == 0);
      let incluirDia = semana.indexOf(fechaSiguiente.getDay().toString()) >= 0;
      if (esSabadoODomingo && !incluirDia) {
        fechaSiguiente.setDate(fechaSiguiente.getDate() + (fechaSiguiente.getDay() == 6 ? (semana.indexOf('0') >= 0 ? 1 : 2) : 1));
        //console.log("saltando dia " + fechaSiguiente.getDay());
      }
*/

      let semana = this.form.value.semana == null ? [] : this.form.value.semana;

      let incluirDia = semana.indexOf(fechaSiguiente.getDay().toString()) >= 0;
      if (!incluirDia) {
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);
        //console.log("saltando dia " + fechaSiguiente.getDay());
        continue;
      }

      let programacion = this.crearProgramacion(new Date(fechaSiguiente));
      list.push(programacion);

      switch (unidadFrecuencia) {
        case 'diario':
          fechaSiguiente.setDate(fechaSiguiente.getDate() + valorFrecuencia);
          break;
        case 'semana':
          fechaSiguiente.setDate(fechaSiguiente.getDate() + (valorFrecuencia * 7));
          break;
        case 'mes':
          fechaSiguiente.setMonth(fechaSiguiente.getMonth() + valorFrecuencia);
          break;
      }
    }
  }

  crearProgramacion(fecha: Date) {
    let programacion = new Programacion();
    programacion.fecha = fecha;
    programacion.area = this.form.value.area;
    if (this.form.value.listaInspeccionPK != null) {
      programacion.listaInspeccion = new ListaInspeccion();
      programacion.listaInspeccion.listaInspeccionPK = this.form.value.listaInspeccionPK;
    }
    programacion.numeroInspecciones = this.form.value.numeroInspecciones;
    return programacion;
    console.log(programacion);
    console.log(programacion.area);
  }


  findMatrizValue(fecha: Date) {
    for (let i = 0; i < this.matriz.length; i++) {
      for (let j = 0; j < this.matriz[i].length; j++) {
        if (this.matriz[i][j] != null && this.matriz[i][j].dia.valueOf() === fecha.valueOf()) {
          return this.matriz[i][j];
        }
      }
    }
  }

  manageResponse(prog: Programacion, mostrarMsg: boolean) {
    let matrizValue = this.findMatrizValue(prog.fecha);

    if (this.actualizar) {
      for (let i = 0; i < matrizValue.programacionList.length; i++) {
        if (matrizValue.programacionList[i].id = prog.id) {
          matrizValue.programacionList[i] = prog;
          break;
        }
      }
    } else if (matrizValue != null) {
      matrizValue.programacionList = matrizValue.programacionList == null ? [] : matrizValue.programacionList;
      matrizValue.programacionList.push(prog);
    }
    if (mostrarMsg) {
      this.msgs = [];
      this.msgs.push({
        severity: 'success',
        summary: 'Programación ' + (this.actualizar ? 'actualizada' : 'creada'),
        detail: 'Se ha ' + (this.actualizar ? 'actualizado' : 'creado') + ' correctamente la programacion'
      });
      this.visibleDlg = false;
    }

  }

  eliminarProgramacion() {
    this.loading = true;
    let programacionId = this.form.value.id;
    this.programacionService.delete(programacionId)
      .then(data => {
        let matrizValue = this.findMatrizValue(this.fechaSelect);
        for (let i = 0; i < matrizValue.programacionList.length; i++) {
          if (matrizValue.programacionList[i].id == programacionId) {
            matrizValue.programacionList.splice(i, 1);
            break;
          }
        }
        this.visibleDlg = false;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Programación eliminada',
          detail: 'Se ha eliminado correctamente la programacion'
        });
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  irInspeccion() {
    let programacionId = this.form.value.id;
    let matrizValue = this.findMatrizValue(this.fechaSelect);
    let programacion: Programacion;
    for (let i = 0; i < matrizValue.programacionList.length; i++) {
      if (matrizValue.programacionList[i].id == programacionId) {
        programacion = matrizValue.programacionList[i];
        break;
      }
    }
    this.paramNav.setParametro<Programacion>(programacion);
    this.paramNav.setAccion<string>('POST');
    this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
  }

  irInspeccion2() {
    let programacionId = this.form.value.id;    
    let matrizValue = this.findMatrizValue(this.fechaSelect);
    console.log(matrizValue)
    console.log( matrizValue.programacionList)
    console.log(this.fechaSelect)
    let programacion: Programacion;
    
    for (let i = 0; i < matrizValue.programacionList.length; i++) {
      if (matrizValue.programacionList[i].id == programacionId) {
        programacion = matrizValue.programacionList[i];
        break;
      }
    }
    let nId=programacion.listaInspeccion.listaInspeccionPK.id;
    let nVersion=programacion.listaInspeccion.listaInspeccionPK.version;
    this.paramNav.setParametro<Programacion>(programacion);
    this.paramNav.setAccion<string>('POST');
    this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones/' + nId + "/" + nVersion);
    //this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones/' + 'filterList: [{"criteria":"eq","field":"listaInspeccionPK.id","value1":4}, {"criteria":"eq","field":"listaInspeccionPK.version","value1":"1"}]');
    console.log(Date.now())
    let fecha : Date;
            fecha= new Date;
            console.log(fecha)
  }

}
