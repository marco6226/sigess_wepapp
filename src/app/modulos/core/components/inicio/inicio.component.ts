import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeAnimation } from 'app/modulos/comun/animations/animation'
import { ParametroNavegacionService } from '../../services/parametro-navegacion.service';

@Component({
    selector: 'app-inicio',
    animations: [fadeAnimation],
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

    constructor(private activateRoute: ActivatedRoute,
        private paramNav: ParametroNavegacionService,
    ) { }

    ngOnInit() {

        this.activateRoute.queryParams
            .subscribe(params => {
                console.log(params); // { orderby: "price" }
                if (params.redirect) {
                    localStorage.setItem('url', params.redirect);
                }


            })
    }

    ngAfterViewInit() {

    }
}
