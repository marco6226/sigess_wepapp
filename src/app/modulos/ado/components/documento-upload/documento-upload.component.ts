import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Checkbox} from 'primeng/primeng';
import { MessageService } from 'primeng/api';


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

    @Input('directorio') directorio: Directorio;
    @Input('visible') visibleDlg: boolean;
    @Output('visibleChange') visibleChange = new EventEmitter();
    @Output('onUpload') onUpload = new EventEmitter();

    esPrivado: boolean;
    myGroup: any;
    form


    constructor(
        private directorioService: DirectorioService,
        private messageService: MessageService
        
        ) {}
    // descripcion: new FormControlName()


    ngOnInit() {
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

    upload(event) {
        console.log(this.form);
        

        if(!this.form.invalid){
            console.log(event);

            console.log('caso de id', this.caseId, this.directorio);
            event.files[0].descripcion=this.form.value.descripcion
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
    
            this.directorioService.uploadv5(event.files[0], directorioPadre, this.modulo, this.modParam, this.caseId, nivelAcceso).then((resp) => {
                let dir = <Directorio>resp;
                this.onVisibleChange(false);
                this.onUpload.emit(dir);
            });
        }
        else{
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta ingresar la descripción'});
            
        }
        
    }


    setNivelAcceso(checked: boolean) {
        this.esPrivado = checked;
    }

    myUploader(event) {
        //event.files == files to upload
    }

}
