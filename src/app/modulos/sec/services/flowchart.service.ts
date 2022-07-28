import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';

@Injectable({
  providedIn: 'root'
})
export class FlowchartService {

  constructor() { }
  diagram: DiagramComponent

  setDiagram(diagram:DiagramComponent){
    this.diagram=diagram;
  }

  getDiagram(): DiagramComponent{

    return this.diagram;
  }
}
