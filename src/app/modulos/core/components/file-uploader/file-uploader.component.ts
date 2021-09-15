import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit, OnChanges {


    /* Variables */
    imagePath;
    imagenesList: any[] = [];
    imgURL: any;
    imgMap: any = {};
    loading = false;
    msgs: Message[] = [];
    numMaxImg = 3;

    @Input() img: any;
    @Input() file = false;
    @Input() fileRoute = '';
    @Input() index: number;
    @Input() show: boolean = false;
    @Input() clear: boolean = false;

    @Output() loadedImage: EventEmitter<any> = new EventEmitter();
    @Output() removeImage: EventEmitter<any> = new EventEmitter();

    @ViewChild('file', { static: false }) input: ElementRef;

    constructor(
        private directorioService: DirectorioService,
        private domSanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        if (this.img) this.imgURL = 'data:image/png;base64,' + this.img;

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.clear) this.removeImg(); this.clear = false;
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

        console.log('Está cargando')

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

    }

    async onArchivoSelect(event) {
        let file = event.target.files[0];
        if (file.type != "image/jpeg" && file.type != "image/png" && file.type != "application/pdf" && file.type != "application/vnd.ms-excel" && file.type != "application/msword") {
            this.msgs.push({
                severity: 'warn',
                summary: 'Mensaje del sistema',
                detail: 'El tipo de archivo suministrado es inválido'
            });
            return;
        }
        if (file.size > 1_500_000) {
            this.msgs.push({ severity: 'warn', summary: 'Mensaje del sistema', detail: 'La imágen supera el tamaño máximo permitido de 1.5MB' });
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
        this.loading = true;

        try {
            // console.log(await this.directorioService.uploadv2(file, "Test"));
            let res = await this.directorioService.uploadv2(file, "Test");

            if (res) {
                this.loading = false;
                if (file.type.match('image.*')) {
                    this.imgURL = urlData;
                } else {
                    this.imgURL = '../../../../../assets/images/file.png';
                }
                this.loadedImage.emit(res);
            }

        } catch (e) {
            console.log(e);
        }
    }

    download() {
        // console.log('Inicia la descarga')
        // console.log(this.img);
        if (this.img) {
            this.downloadImage(this.img, "evidence" + this.index);
        }
    }

    downloadImage(base64String, fileName) {
        const source = `data:application/png;base64,${base64String}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `${fileName}.png`
        link.click();
    }

    removeImg() {
        this.input.nativeElement.value = "";
        this.imgURL = '';
        this.removeImage.emit(this.index);
    }
}
