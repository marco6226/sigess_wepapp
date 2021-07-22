import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {


    /* Variables */
    public imagePath;
    imgURL: any;
    @Input() file = false;
    @Input() fileRoute = '';

    @Input() index: number;
    @Output() loadedImage: EventEmitter<any> = new EventEmitter();

    constructor() { }

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

    download() {
        if (this.file) {
            /* TODO: Acción para ir a la url externa */
        }
    }
}
