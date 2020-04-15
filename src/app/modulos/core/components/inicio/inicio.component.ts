import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeAnimation } from 'app/modulos/comun/animations/animation'

@Component({
	selector: 'app-inicio',
  animations: [ fadeAnimation ],
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

	constructor() { }

	ngOnInit() {
	}

	ngAfterViewInit() {

	}
}
