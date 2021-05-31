import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../entities/usuario';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { SesionService } from '../../../core/services/sesion.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from '../../entities/empleado';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria } from '../../../core/entities/filter';
import { tipo_identificacion, tipo_vinculacion, locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { SelectItem, Message } from 'primeng/api';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CambioPasswdService } from '../../../comun/services/cambio-passwd.service';



@Component({
  selector: 's-usuarioPreferencias',
  templateUrl: './usuario-preferencias.component.html',
  styleUrls: ['./usuario-preferencias.component.scss'],
  providers: [UsuarioService]
})
export class UsuarioPreferenciasComponent implements OnInit {

  msgs: Message[];

  @ViewChild('imgAvatar', { static: false }) imgAvatar: HTMLImageElement;
  @ViewChild('inputFile', { static: false }) inputFile: HTMLInputElement;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  visibleDlg: boolean;
  fechaActual = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  localeES: any = locale_es;
  tipoIdentificacionList: SelectItem[];

  usuario: Usuario;
  empleado: Empleado;
  form: FormGroup;

  canvas: any;

  constructor(
    private usuarioService: UsuarioService,
    private empleadoService: EmpleadoService,
    private sessionService: SesionService,
    private cambioPasswdService: CambioPasswdService,
    private fb: FormBuilder,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 48;
    this.canvas.height = 48;

    let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
    this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);

    this.usuario = new Usuario();
    this.usuario.id = this.sessionService.getUsuario().id;
    this.usuario.email = this.sessionService.getUsuario().email;
    this.usuario.avatar = this.sessionService.getUsuario().avatar;

    let fq = new FilterQuery();
    fq.filterList = [{ field: 'usuario.id', value1: this.usuario.id, criteria: Criteria.EQUALS, value2: null }];
    this.empleadoService.findByFilter(fq).then(
      resp => {
        let empleado = (<Empleado[]>resp['data'])[0];
        if (empleado != null) {
          this.form = fb.group({
            'id': [empleado.id],
            'primerNombre': [empleado.primerNombre, Validators.required],
            'segundoNombre': empleado.segundoNombre,
            'primerApellido': [empleado.primerApellido, Validators.required],
            'segundoApellido': empleado.segundoApellido,
            'direccion': [empleado.direccion],
            'fechaNacimiento': [new Date(empleado.fechaNacimiento)],
            'genero': [empleado.genero],
            'numeroIdentificacion': [empleado.numeroIdentificacion, Validators.required],
            'telefono1': [empleado.telefono1],
            'telefono2': [empleado.telefono2],
            'ciudad': [empleado.ciudad],
            'tipoIdentificacion': [empleado.tipoIdentificacion.id, Validators.required],
            'zonaResidencia': [empleado.zonaResidencia]
          });
        }
      }
    );
  }

  ngOnInit() {
  }

  abrirDlg() {
    this.visibleDlg = true;
    setTimeout(() => {
      console.log(this.inputFile);
    }, 1000);
    (<any>this.inputFile).nativeElement.click();
  }

  aceptarImg() {
    this.visibleDlg = false;
    this.usuario.avatar = this.croppedImage;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  actualizarUsuario() {
    let ctx = this.canvas.getContext("2d");
    ctx.drawImage((<any>this.imgAvatar).nativeElement, 0, 0, 48, 48);
    this.usuario.icon = this.canvas.toDataURL();

    this.usuarioService.edit(this.usuario).then(
      resp => {
        let usuario = this.sessionService.getUsuario();
        usuario.email = this.usuario.email;
        usuario.avatar = this.usuario.avatar;
        usuario.icon = this.usuario.icon;
        this.sessionService.setUsuario(usuario);
        this.msgs = [];
        this.msgs.push({ summary: 'Usuario actualizado', detail: 'Se han actualizado correctamente los datos de usuario', severity: 'success' });
      }
    );
  }

  actualizarEmpleado() {
    let empleado = new Empleado();
    empleado.id = this.form.value.id;
    empleado.primerNombre = this.form.value.primerNombre;
    empleado.segundoNombre = this.form.value.segundoNombre;
    empleado.primerApellido = this.form.value.primerApellido;
    empleado.segundoApellido = this.form.value.segundoApellido;
    empleado.direccion = this.form.value.direccion;
    empleado.fechaNacimiento = this.form.value.fechaNacimiento;
    empleado.genero = this.form.value.genero;
    empleado.numeroIdentificacion = this.form.value.numeroIdentificacion;
    empleado.telefono1 = this.form.value.telefono1;
    empleado.telefono2 = this.form.value.telefono2;
    empleado.ciudad = this.form.value.ciudad;
    empleado.tipoIdentificacion = this.form.value.tipoIdentificacion;
    empleado.zonaResidencia = this.form.value.zonaResidencia;
    this.msgs = [];
    this.empleadoService.edit(empleado).then(
      resp => this.msgs.push({ summary: 'Empleado actualizado', detail: 'Se han actualizado correctamente los datos de empleado', severity: 'success' })
    );
  }


  abrirCambioPasswd(){
    this.cambioPasswdService.setVisible(true);
  }

}
