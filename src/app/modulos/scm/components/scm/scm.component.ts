import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from '../../services/casos-medicos.service';

@Component({
    selector: 'app-scm',
    templateUrl: './scm.component.html',
    styleUrls: ['./scm.component.scss']
})
export class ScmComponent implements OnInit {

    empresaId: string;
    casosList: any;
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

    constructor(private scmService: CasosMedicosService) { }

    async ngOnInit() {
        this.casosList = await this.scmService.getAll();
    }


    onSubmit() { }

    abrirDlg(bolean) { }

    eliminar() {


    }
    lazyLoad(event) { }
}
