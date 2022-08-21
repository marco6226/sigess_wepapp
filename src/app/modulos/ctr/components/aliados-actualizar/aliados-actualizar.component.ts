import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aliados-actualizar',
  templateUrl: './aliados-actualizar.component.html',
  styleUrls: ['./aliados-actualizar.component.scss']
})
export class AliadosActualizarComponent implements OnInit {

  id: number = -1;

  constructor(
    private rutaActiva: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params.id;
  }

  test(){
    console.log(this.rutaActiva.snapshot.params.id);
    
    
  }

}
