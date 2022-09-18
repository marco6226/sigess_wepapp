import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit {

  @Input('selectCalificacion') 
  set actividadesIn(actividades: string){
    console.log(actividades);
    
    if (actividades != null) {
      let dataIn = JSON.parse(actividades)
      this.val1 = dataIn[0];
      this.val2 = dataIn[1];
      this.val3 = dataIn[2];
      this.val4 = dataIn[3];
      this.val5 = dataIn[4];
    }    
  }

  @Output() data = new EventEmitter<String>();

  values: string[]=[]

  val1: string;
  val2: string;
  val3: string;
  val4: string;
  val5: string;

  constructor() { }

  ngOnInit(): void {
  }

  onSaveData(){
    this.values = []
    this.values.push(this.val1)
    this.values.push(this.val2)
    this.values.push(this.val3)
    this.values.push(this.val4)
    this.values.push(this.val5)
    console.log(this.values);
    this.data.emit(JSON.stringify(this.values))
  }

}
