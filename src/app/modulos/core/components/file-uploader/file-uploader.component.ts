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
    disable = false;
    msgs: Message[] = [];
    numMaxImg = 3;
    mimeType = {
        'U': {
            head: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ext: 'xlsx',
        },
        'J': {
            head: 'application/pdf',
            ext: 'pdf'
        },
        '/': {
            head: 'image/jpeg',
            ext: 'jpeg'
        },
        'i': {
            head: 'image/png',
            ext: 'png'
        }
    }

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
        if (this.img) {
            
            if (this.img.split(',').length > 1) this.img = this.img.split(',')[1];

            let type = this.mimeType[this.img.charAt(0)];

            if (!type) {
                this.disable = true; return this.imgURL = '../../../../../assets/images/notfound.png';
            }

            if (type.ext !== 'png' && type.ext !== 'jpeg') return this.imgURL = '../../../../../assets/images/file.png';
            this.imgURL = 'data:image/png;base64,' + this.img;

        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.clear) this.removeImg(); this.clear = false;
    }

    async preview(files) {
       
        if (files.length === 0) return;

        let mimeType = files[0].type;

        /* TODO: Se necesita validar diferente para cargar archivos */
        if (mimeType.match('image.*|application.*') == null) {
           
            return;
        }

        

        let reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
       
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
        if (file.type != "image/jpeg" &&
            file.type != "image/png" &&
            file.type != "application/pdf" &&
            file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.msgs.push({
                severity: 'warn',
                summary: 'Mensaje del sistema',
                detail: 'El tipo de archivo suministrado es inválido'
            });
            return;
        }
        if (file.size > 30_500_000) {
            this.msgs.push({ severity: 'warn', summary: 'Mensaje del sistema', detail: 'La imágen supera el tamaño máximo permitido de 30.5MB' });
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
          
        }
    }

    download() {
        
        if (this.img) {
            this.downloadImage(this.img, "evidence" + this.index);
        }
    }

    downloadImage(base64String, fileName) {
        let type = this.mimeType[base64String.charAt(0)];
        
        const source = `data:${type.head};base64,${base64String}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `${fileName}.${type.ext}`
        link.click();
    }

    removeImg() {
        this.input.nativeElement.value = "";
        this.imgURL = '';
        this.removeImage.emit(this.index);
    }
}
