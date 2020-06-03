import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/modulos/admin/services/usuario.service';
import { PerfilService } from './../../services/perfil.service';
import { UsuarioEmpresa } from 'app/modulos/empresa/entities/usuario-empresa'
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { Perfil } from 'app/modulos/empresa/entities/perfil'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Criteria } from '../../../core/entities/filter';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [UsuarioService, PerfilService],
})
export class UsuarioComponent implements OnInit {


  empresaId: string;
  usuarioList: Usuario[];
  usuarioSelect: Usuario;
  perfilList: SelectItem[] = [];
  visibleDlg: boolean;
  msgs: Message[] = [];
  isUpdate: boolean;
  form: FormGroup;

  solicitando: boolean = false;
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'id',
    'email',
    'icon',
    'estado',
    'fechaModificacion',
    'fechaCreacion',
    'ultimoLogin',
    'ipPermitida',
    'mfa',
    'numeroMovil'
    //'usuarioEmpresaList_perfil_id'
  ];
  estadosList: SelectItem[] = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' }
  ];

  constructor(
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
  ) {
    let mfaField = new FormControl();
    let numMovField = new FormControl();
    mfaField.valueChanges
      .subscribe(check => {
        if (check) {
          numMovField.setValidators([Validators.required, Validators.minLength(17), Validators.maxLength(17)]);
        } else {
          numMovField.setValidators(null);
        }
        numMovField.updateValueAndValidity();
      });
    this.form = fb.group({
      'id': [null],
      'email': [null, Validators.required],
      'perfilesId': [null, Validators.required],
      'ipPermitida': [null, Validators.required],
      'mfa': mfaField,
      'numeroMovil': numMovField,
      'estado': [null]
    });
  }

  ngOnInit() {
    this.perfilService.findAll()
      .then(resp => {
        (<Perfil[]>resp['data']).forEach(perfil => {
          this.perfilList.push({ label: perfil.nombre, value: perfil.id })
        })
      });
    this.loading = true;
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.usuarioService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.usuarioList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.usuarioList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }
onClick(){
    console.log(this.form.value);
  }
  abrirDlg(isUpdate: boolean) {
    this.isUpdate = isUpdate;
    if (this.isUpdate) {
      this.form.get('email').disable();
      let filterQuery = new FilterQuery();
      filterQuery.filterList = [{
        field: 'usuarioEmpresaList.usuario.id',
        criteria: Criteria.EQUALS,
        value1: this.usuarioSelect.id,
        value2: null
      }];
      filterQuery.fieldList = ["id"];
      this.perfilService.findByFilter(filterQuery).then(
        resp => {
          let perfilesId = [];
          resp['data'].forEach(ident => perfilesId.push(ident.id));
          console.log(resp['data']);
          this.form.patchValue({
            'id': this.usuarioSelect.id,
            'email': this.usuarioSelect.email,
            'perfilesId': perfilesId,
            'estado': this.usuarioSelect.estado,
            'ipPermitida': this.usuarioSelect.ipPermitida,
            'mfa': this.usuarioSelect.mfa,
            'numeroMovil': this.usuarioSelect.numeroMovil
          });
        }
      );
      this.visibleDlg = true;
    } else {
      this.form.reset();
      this.form.get('email').enable();
      this.visibleDlg = true;
    }
  }

  buildPerfilesIdList(usuario: Usuario) {
    let perfilesIdList = [];
    usuario.usuarioEmpresaList.forEach(ue => {
      console.log(ue);
      perfilesIdList.push(ue.perfil.id);
    });
    return perfilesIdList;
  }

  eliminar() {
    if (this.usuarioSelect.estado == 'BLOQUEADO') {
      this.msgs = [{ severity: 'warn', summary: 'CAMBIO DE ESTADO NO VALIDO', detail: 'El usuario se encuentra BLOQUEADO' }];
      return;
    }
    if (this.usuarioSelect.estado == 'ELIMINADO') {
      this.msgs = [{ severity: 'info', summary: 'USUARIO ELIMINADO', detail: 'El usuario ya se encuentra ELIMINADO' }];
      return;
    }
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'El usuario ' + this.usuarioSelect.email + ' será eliminado, no podrá deshacer esta acción, ¿Dese continuar?',
      accept: () =>
        this.usuarioService.delete(this.usuarioSelect.id).then(data => this.manageOnDelete())
    });
  }

  manageOnDelete() {
    this.usuarioSelect.fechaModificacion = new Date();
    this.msgs = [{ severity: 'success', summary: 'Usuario eliminado', detail: 'Se ha eliminado el usuario ' + this.usuarioSelect.email }];
    this.usuarioSelect.estado = 'ELIMINADO';
  }

  onSubmit() {
    if (this.form.value.estado == 'BLOQUEADO' || this.form.value.estado == 'ELIMINADO') {
      this.msgs = [{
        severity: 'warn',
        summary: 'MODIFICACION NO PERMITIDA',
        detail: 'No es posible modificar usuarios en estado BLOQUEADO o ELIMINADO'
      }];
      return;
    }
    let usuario = new Usuario();
    usuario.id = this.form.value.id;
    usuario.email = this.form.value.email;
    usuario.usuarioEmpresaList = [];
    usuario.ipPermitida = this.form.value.ipPermitida;
    usuario.mfa = this.form.value.mfa;
    usuario.numeroMovil = this.form.value.numeroMovil;
    if (this.form.value.estado == 'ACTIVO' || this.form.value.estado == 'INACTIVO') {
      usuario.estado = this.form.value.estado;
    }
    this.form.value.perfilesId.forEach(perfilId => {
      let ue = new UsuarioEmpresa();
      ue.perfil = new Perfil();
      ue.perfil.id = perfilId;
      usuario.usuarioEmpresaList.push(ue);
    });

    this.solicitando = true;
    if (this.isUpdate) {
      this.usuarioService.update(usuario)
        .then(resp => {
          this.manageResponse(<Usuario>resp, true);
          this.solicitando = false;
        })
        .catch(err => {
          this.solicitando = false;
        });;
    } else {
      this.usuarioService.create(usuario)
        .then(resp => {
          this.manageResponse(<Usuario>resp, false);
          this.solicitando = false;
        })
        .catch(err => {
          this.solicitando = false;
        });
    }
  }


  manageResponse(usuario: Usuario, isUpdate: boolean) {
    if (isUpdate) {
      this.usuarioSelect.email = usuario.email;
      this.usuarioSelect.usuarioEmpresaList = usuario.usuarioEmpresaList;
      this.usuarioSelect.fechaModificacion = usuario.fechaModificacion;
      this.usuarioSelect.estado = usuario.estado;
      this.usuarioSelect.ipPermitida = usuario.ipPermitida;
      this.usuarioSelect.mfa = usuario.mfa;
      this.usuarioSelect.numeroMovil = usuario.numeroMovil;
    } else {
      this.usuarioList.push(usuario);
      this.usuarioList = this.usuarioList.slice();
    }
    this.msgs = [{
      severity: 'success',
      summary: 'USUARIO ' + (isUpdate ? 'ACTUALIZADO' : 'CREADO'),
      detail: 'Se ha ' + (isUpdate ? 'actualizado' : 'creado') + ' correctamente el usuario ' + usuario.email
    }];
    this.visibleDlg = false;
    this.form.reset();
  }

}
