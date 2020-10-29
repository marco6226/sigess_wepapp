import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cargo } from 'app/modulos/empresa/entities/cargo';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { CargoService } from 'app/modulos/empresa/services/cargo.service';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';

@Component({
  selector: 'app-scm',
  templateUrl: './scm.component.html',
  styleUrls: ['./scm.component.scss'],
})
export class ScmComponent implements OnInit {
  empresaId: string;
  casosList: any;
  usuarioSelect: Usuario;
  perfilList: SelectItem[] = [];
  visibleDlg: boolean;
  caseSelect;
  cargoList  = [];
  msgs: Message[] = [];
  isUpdate: boolean;
  form: FormGroup;
  visibleForm: boolean;
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
    'numeroMovil',
    // 'usuarioEmpresaList_perfil_id'
  ];
  estadosList: SelectItem[] = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  constructor(private scmService: CasosMedicosService,
    private cargoService: CargoService,
    ) {}

  async ngOnInit() {
   
  await  this.cargoService.findAll().then(
        resp => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach(cargo => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
            //this.cargoList = this.cargoList.slice();
        }
    );
    this.casosList = await this.scmService.getAll();
    this.casosList.forEach(element => {
        let cargo = this.cargoList.find(cargo => cargo.id == element.cargo)
        console.log(cargo.nombre);
        if (cargo.nombre) {
            element.cargo = cargo.nombre;
        }else{
            element.cargo = "Sin definir";
        }
       
    });
  }

  onSubmit() {}

  openCase() {
      this.visibleForm = true;
      console.log(54,this.caseSelect);
  }

  onCancel() {
    this.visibleForm = false;
    console.log("close form");
  }

  eliminar() {}
  lazyLoad(event) {
    console.log(event);

  }
}
