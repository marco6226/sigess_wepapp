import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { OpcionCalificacion } from 'app/modulos/inspecciones/entities/opcion-calificacion'
import { ElementoInspeccion } from 'app/modulos/inspecciones/entities/elemento-inspeccion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Formulario } from 'app/modulos/comun/entities/formulario';
import { FormularioConstructorComponent } from 'app/modulos/comun/components/formulario-constructor/formulario-constructor.component';

import { ListaInspeccionService } from 'app/modulos/inspecciones/services/lista-inspeccion.service'

import { Message, SelectItem } from 'primeng/primeng';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { Perfil } from 'app/modulos/empresa/entities/perfil';

@Component({
  selector: 'app-elaboracion-lista',
  templateUrl: './elaboracion-lista.component.html',
  styleUrls: ['./elaboracion-lista.component.scss'],
})
export class ElaboracionListaComponent implements OnInit {

  @ViewChild("formularioConstructor", { static: false }) formularioConstructor: FormularioConstructorComponent;
  msgs: Message[] = [];
  form: FormGroup;
  opcionesCalifList: OpcionCalificacion[] = [];
  elementoInspeccionList: ElementoInspeccion[] = [];
  consultar: boolean = false;
  adicionar: boolean = false;
  modificar: boolean = false;
  finalizado: boolean = false;
  perfilList: SelectItem[] = [];
  tipoListaOpts: SelectItem[] = [
    { label: 'Maquinaria', value: 'Maquinaria' },
    { label: 'Instalaciones', value: 'Infraestructura' },
    { label: 'Emergencias', value: 'Emergencias' },
    { label: 'Equipos', value: 'Equipos' },
    { label: 'Transporte', value: 'Transporte' },
  ];

  constructor(
    private fb: FormBuilder,
    private listaInspeccionService: ListaInspeccionService,
    private paramNav: ParametroNavegacionService,
    private perfilService: PerfilService
  ) { }

  ngOnInit() {
    this.perfilService.findAll().then(
      resp => {
        //console.log(resp);
        (<Perfil[]>resp['data']).forEach(perfil => {
          this.perfilList.push({ label: perfil.nombre, value: perfil.id });
        });
      }
    );
    this.form = this.fb.group({
      'id': null,
      'codigo': [null, Validators.required],
      'nombre': [null, Validators.required],
      'tipoLista': [null, Validators.required],
      'descripcion': [null],
      'perfilesId':[null, Validators.required]
    });

    switch (this.paramNav.getAccion<string>()) {
      case 'GET':
        this.consultar = true;
        this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
        break;
      case 'PUT':
        this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
        this.modificar = true;
        break;
      default:
        this.adicionar = true;
        break;
    }
    this.paramNav.reset();
  }
  test(event){
    //console.log(event);
    
    //console.log(this.perfilList);
    
  }
  onClick(){
    //console.log(this.form.value);
  }
  buildPerfilesIdList(ids:Array<any>) {
    let perfilesIdList = [];
    //console.log(ids);
    ids.forEach(ue => {

      perfilesIdList.push({id: ue});
    });
    //console.log(perfilesIdList);
    return perfilesIdList;
  }
  consultarLista(listaInsp: ListaInspeccion) {
    let filterQuery = new FilterQuery();
    let filterId = new Filter();
    filterId.criteria = Criteria.EQUALS;
    filterId.field = "listaInspeccionPK.id";
    filterId.value1 = listaInsp.listaInspeccionPK.id;

    let filterVersion = new Filter();
    filterVersion.criteria = Criteria.EQUALS;
    filterVersion.field = "listaInspeccionPK.version";
    filterVersion.value1 = listaInsp.listaInspeccionPK.version.toString();

    filterQuery.filterList = [filterId, filterVersion];

    this.listaInspeccionService.findByFilter(filterQuery).then(
      data => {
        listaInsp = (<ListaInspeccion[]>data['data'])[0];
        this.opcionesCalifList = listaInsp.opcionCalificacionList;
        this.elementoInspeccionList = listaInsp.elementoInspeccionList;
        this.formularioConstructor.formulario = listaInsp.formulario;
        this.form.patchValue({'perfilesId' : JSON.parse(listaInsp.fkPerfilId)} )  
      }
    );
    this.form.patchValue({
      id: listaInsp.listaInspeccionPK,
      codigo: listaInsp.codigo,
      nombre: listaInsp.nombre,
      tipoLista: listaInsp.tipoLista,
      descripcion: listaInsp.descripcion
    });
    if (this.consultar) {
      this.form.disable();
    }
  }

  
  addOpcionRespuesta() {
    let opc = new OpcionCalificacion();
    opc.despreciable = false;
    opc.numeral = this.opcionesCalifList.length == 0 ? 1 : this.opcionesCalifList[this.opcionesCalifList.length - 1].numeral + 1;
    this.opcionesCalifList.push(opc);
    this.opcionesCalifList = this.opcionesCalifList.slice();
  }

 

  removeOpcionCalificacion(opc: OpcionCalificacion) {
    for (let i = 0; i < this.opcionesCalifList.length; i++) {
      if (this.opcionesCalifList[i].numeral == opc.numeral) {
        this.opcionesCalifList.splice(i, 1);
        this.opcionesCalifList = this.opcionesCalifList.slice();
        break;
      }
    }
  }

  guardar() {
    let listInp = new ListaInspeccion();
    listInp.nombre = this.form.value.nombre;
    listInp.codigo = this.form.value.codigo;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);
    listInp.descripcion = this.form.value.descripcion;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.opcionCalificacionList = this.opcionesCalifList;
    listInp.elementoInspeccionList = this.elementoInspeccionList;
    listInp.formulario = this.formularioConstructor.formulario;
    this.listaInspeccionService.create(listInp).then(
      data => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Lista de inspección creada', detail: 'Se ha creado correctamente la lista de inspección ' + listInp.nombre });
        this.finalizado = true;
        this.adicionar = false;
      }
    );
  }

  actualizar(actualizarVersion: boolean) {
    let listInp = new ListaInspeccion();
    listInp.listaInspeccionPK = this.form.value.id;
    listInp.nombre = this.form.value.nombre;
    listInp.codigo = this.form.value.codigo;
    listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);

    listInp.descripcion = this.form.value.descripcion;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.opcionCalificacionList = this.opcionesCalifList;
    listInp.elementoInspeccionList = this.elementoInspeccionList;
    listInp.formulario = this.formularioConstructor.formulario;
    let param = (actualizarVersion == false ? null : 'actualizarVersion=true');
    this.listaInspeccionService.update(listInp, param).then(
      data => {
        this.msgs = [];
        let detalle = actualizarVersion ? 'Se ha generado correctamente una nueva versión de la lista de inspección ' : 'Se ha actualizado correctamente la lista de inspección ';
        this.msgs.push({ severity: 'success', summary: 'Lista de inspección actualizada', detail: detalle + listInp.nombre });
      }
    );
  }

  resetAll() {
    this.adicionar = true;
    this.finalizado = false;
    this.opcionesCalifList = [];
    this.elementoInspeccionList = [];
    this.form.reset();
  }

}
