import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit {

  val1: string;
  val2: string;
  val3: string;
  val4: string;
  val5: string;

  constructor() { }

  ngOnInit(): void {
  }

}
