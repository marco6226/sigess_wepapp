import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit {

  val2: string = 'Option 2';
  val1: string;

  constructor() { }

  ngOnInit(): void {
  }

}
