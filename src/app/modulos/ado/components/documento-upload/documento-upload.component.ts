import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Directorio } from 'app/modulos/ado/entities/directorio'
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'

@Component({
    selector: 's-documentoUpload',
    templateUrl: './documento-upload.component.html',
    styleUrls: ['./documento-upload.component.scss']
})
export class DocumentoUploadComponent implements OnInit {

    @Input("modParam") modParam: string;
    @Input("modulo") modulo: string;
    @Input("caseId") caseId: any;

    @Input("directorio") directorio: Directorio;
    @Input("visible") visibleDlg: boolean;
    @Output("visibleChange") visibleChange = new EventEmitter();
    @Output("onUpload") onUpload = new EventEmitter();

    constructor(
        private directorioService: DirectorioService
    ) { }

    ngOnInit() {

    }

    onVisibleChange(event: boolean) {
        this.visibleChange.emit(event);
    }

    upload(event) {
        console.log("caso de id", this.caseId, this.directorio);
        if (this.caseId) {
            // this.directorio.caseId = this.caseId

        }
        this.directorioService.upload(
            event.files[0],
            (this.directorio == null ? null : this.directorio.id),
            this.modulo,
            this.modParam,
            this.caseId
        ).then(
            resp => {
                let dir = <Directorio>resp;
                this.onVisibleChange(false);
                this.onUpload.emit(dir);
            }
        );
    }
}
