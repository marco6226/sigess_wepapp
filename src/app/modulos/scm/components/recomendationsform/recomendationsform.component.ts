import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem } from "primeng/api";

@Component({
    selector: "app-recomendationsform",
    templateUrl: "./recomendationsform.component.html",
    styleUrls: ["./recomendationsform.component.scss"],
})
export class RecomendationsformComponent implements OnInit {
    epsList: SelectItem[];
    afpList: SelectItem[];
    cargoList: SelectItem[];
    fechaActual = new Date();
    recomendations: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    constructor(fb: FormBuilder) {
        this.recomendations = fb.group({


        });
    }

    ngOnInit() { }
}
