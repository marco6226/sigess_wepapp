import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {


    /* Variables */
    public imagePath;
    numMaxImg = 1;
    imgURL: any;
    @Input() file = false;
    @Input() fileRoute = '';
    imagenesList: any[] = [];
    imgMap: any = {};
    msgs: Message[] = [];
    @Input() index: number;
    @Output() loadedImage: EventEmitter<any> = new EventEmitter();

    constructor(private directorioService: DirectorioService,

        private domSanitizer: DomSanitizer,

    ) { }

    ngOnInit() {
    }

    async preview(files) {
        console.log(files);
        if (files.length === 0) return;

        let mimeType = files[0].type;

        /* TODO: Se necesita validar diferente para cargar archivos */
        if (mimeType.match('image.*|application.*') == null) {
            console.log("Only images or doc are supported.");
            return;
        }

        let reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        console.log(reader.onload);
        reader.onload = async (_event) => {
            /* TODO: Aquí realizar el evento de carga */
            if (mimeType.match('image.*')) {
                this.imgURL = reader.result;
            } else {
                this.file = false;
                /* TODO: fileRoute servirá para colocar la URL del archivo en cuestión */
                this.fileRoute = '';
                this.imgURL = '../../../../../assets/images/file.png';
            }
        }

    };

    async onArchivoSelect(event) {
        let file = event.target.files[0];
        if (file.type != "image/jpeg" && file.type != "image/png") {
            this.msgs.push({ severity: 'warn', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg' });
            return;
        }
        if (file.size > 1_500_000) {
            this.msgs.push({ severity: 'warn', summary: 'Tamaño máximo superado 1.5MB', detail: 'La imágen supera el tamaño máximo permitido' });
            return;
        }
        this.msgs = [];

        if (this.imagenesList == null)
            this.imagenesList = [];

        if (this.imagenesList.length >= this.numMaxImg) {
            this.msgs.push({
                severity: 'warn',
                summary: 'Número maximo de fotografias alcanzado',
                detail: 'Ha alcanzado el número máximo de fotografias (' + this.numMaxImg + ') que puede adjuntar para este hallazgo'
            });
            return;
        }
        let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.imgURL = urlData;

        console.log(await this.directorioService.uploadv2(file, "Test"));

    }


    download() {
        if (this.file) {
            /* TODO: Acción para ir a la url externa */
        }
    }
}
