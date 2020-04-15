import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Area } from 'app/modulos/empresa/entities/area'
import { AreaSelectorComponent } from './../area-selector/area-selector.component'
import { Message } from 'primeng/primeng';

@Component({
  selector: 'multi-area-selector',
  templateUrl: './multi-area-selector.component.html',
  styleUrls: ['./multi-area-selector.component.scss']
})
export class MultiAreaSelectorComponent implements OnInit {

  @Input() selecteds: Area[] = [];
  @ViewChild('areaSelector', { static: false }) areaSelector: AreaSelectorComponent;
  msgs: Message[] = [];

  areaDataTableSelect: Area;
  areaSelected: Area;

  constructor() { }

  ngOnInit() {

  }


  addArea(areaRec: Area) {
    for (var i = 0; i < this.selecteds.length; i++) {
      let area: Area = this.selecteds[i];
      if (area.id == areaRec.id) {
        //this.areaSelector.showMessage(null, "El area seleccionada ya se encuentra en la lista");
        return;
      }
    }
    this.areaSelected = areaRec;
    this.areaSelected.numero = this.selecteds.length + 1;
    this.selecteds.push(this.areaSelected);
  }


  removeArea() {
    if (this.areaDataTableSelect == null) {
      this.msgs.push({ severity: 'warn', summary: null, detail: "Debe seleccionar un area para eliminar de la lista" });
    } else {
      let index = this.areaDataTableSelect.numero - 1;
      this.selecteds.splice(index, 1);

      for (var i = index; i < this.selecteds.length; i++) {
        this.selecteds[i].numero = i + 1;
      }
      this.areaDataTableSelect = null;
    }
  }

  showDialog() {
    this.areaSelector.showDialog();
  }

}
