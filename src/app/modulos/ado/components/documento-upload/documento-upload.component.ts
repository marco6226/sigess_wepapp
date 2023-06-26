import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Checkbox} from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { PerfilService } from 'app/modulos/admin/services/perfil.service';
import { Perfil } from 'app/modulos/empresa/entities/perfil';
import { Message, SelectItem } from 'primeng/primeng';


@Component({
    selector: 's-documentoUpload',
    templateUrl: './documento-upload.component.html',
    styleUrls: ['./documento-upload.component.scss'],
    providers: [MessageService]

})
export class DocumentoUploadComponent implements OnInit {
    @Input('modParam') modParam: string;
    @Input('modulo') modulo: string;
    @Input('caseId') caseId: any;
    @Input('tipoEvidencia') tipoEvidencia: string;
    @Input('directorio') directorio: Directorio;
    @Input('visible') visibleDlg: boolean;
    @Input('contratistasFlag') contratistasFlag: boolean=false;
    @Input('temporalesFlag') temporalesFlag: boolean=false;
    @Input('privadoCheck') privadoCheck: boolean = true;
    @Output('visibleChange') visibleChange = new EventEmitter();
    @Output('onUpload') onUpload = new EventEmitter();
    @Input() scmDoc: boolean = false;
    perfiles: any =[];
    esPrivado: boolean;
    myGroup: any;
    perfilList: SelectItem[] = [];
    form
    doContratista= [
        { label: "--Seleccione--", value: null },
        { label: "Carta autorización", value: "Carta autorización" },
        { label: "Certificado ARL", value: "Certificado ARL" },
        { label: "Otros", value: "Otros" }
    ]
    doTemporales= [
        { label: "--Seleccione--", value: null },
        { label: "FURAT", value: "FURAT" },
        { label: "Investigación de AT", value: "Investigación de AT" },
        { label: "Reportes a EPS y/o entes territoriales", value: "Reportes a EPS y/o entes territoriales" },
        { label: "Evidencias plan de acción", value: "Evidencias plan de acción" },
        { label: "Otros", value: "Otros" }
    ]

    constructor(
        private directorioService: DirectorioService,
        private messageService: MessageService,
        private perfilService: PerfilService,
        
        ) {}

    ngOnInit() {
        this.perfilService.findAll().then((resp) => {
            (<Perfil[]>resp['data']).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
        });
        this.myGroup = new FormGroup({
            cbxNivelAcceso: new FormControl(),
        });

        this.form = new  FormGroup({
            descripcion: new FormControl("",Validators.required)
        })
    }

    onVisibleChange(event: boolean) {
        this.visibleChange.emit(event);
    }

    myfiles: any = [];
    upload(event) {
        let perfil
        this.perfiles.length==0?null:perfil=this.perfiles.toString()
        if((!this.form.invalid && !this.flagSCMPPrivado) ||(!this.form.invalid && this.flagSCMPPrivado && this.perfiles.length!=0)){
        // if(!this.form.invalid){
            event.files[0].descripcion=this.form.value.descripcion;
            if (this.caseId) {
                // this.directorio.caseId = this.caseId
            }
    
            let directorioPadre: string;
            if (this.directorio != null) {
                directorioPadre = this.directorio.toString();
            } else {
                directorioPadre = null;
            }
    
            let nivelAcceso: string = this.esPrivado ? 'PRIVADO' : 'PUBLICO';
            
            let fkPerfilId: string = JSON.stringify(this.form.value.perfilesId);
           

            if(this.tipoEvidencia != null){
                this.directorioService.uploadv6(event.files[0], directorioPadre, this.modulo, this.modParam, this.caseId,this.tipoEvidencia, nivelAcceso,fkPerfilId).then((resp) => {
                    let dir = <Directorio>resp;
                    this.onVisibleChange(false);
                    this.onUpload.emit(dir);
                });
            }
            else{
                this.directorioService.uploadv5(event.files[0], directorioPadre, this.modulo, this.modParam, this.caseId, nivelAcceso,perfil).then((resp) => {
                    let dir = <Directorio>resp;
                    this.onVisibleChange(false);
                    this.onUpload.emit(dir);
                });
            }

            this.myfiles = [];
            this.form.reset();
        }
        else{
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta ingresar la descripción o perfiles'});
            
        }
        
    }


    setNivelAcceso(checked: boolean) {
        this.esPrivado = checked;
    }
    flagSCMPPrivado:boolean=false;
    setNivelAccesoScm(checked: boolean) {
        this.flagSCMPPrivado=checked
    }

    myUploader(event) {
        //event.files == files to upload
    }
}
