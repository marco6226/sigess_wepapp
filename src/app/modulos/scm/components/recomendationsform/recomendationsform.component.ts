import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { locale_es } from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { SelectItem } from "primeng/api";
import { CasosMedicosService } from "../../services/casos-medicos.service";

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
    recomendation: FormGroup;
    tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
    ) {
        this.recomendation = fb.group({
            generateRecomendaciones: [null],
            entidadEmitRecomendaciones: [null],

            tipo: [null],

            fechaInicio: [null],

            fechaExpiracion: [null],

            status: [null],
            recomendaciones: [null],

        });
    }

    async ngOnInit() {

        console.log(await this.scmService.getRecomendations())
    }

    onSubmit() {
        console.log(this.recomendation.value);
    }
}
