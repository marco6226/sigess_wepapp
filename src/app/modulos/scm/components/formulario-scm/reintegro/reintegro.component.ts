import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reintegro',
  templateUrl: './reintegro.component.html',
  styleUrls: ['./reintegro.component.scss']
})
export class ReintegroComponent implements OnInit {

  selectedValue

  reintegroTipos=[
    {label: 'Reintegro', value:1},
    {label: 'Reubicación', value:2},
    {label: 'Reconversión', value:3},
  ]
  reintegroTipo

  temporals=[
    {label: 'Temporal', value:1},
    {label: 'Permanente', value:2},
  ]
  temporal

  periocidadesTemp=[
    {label: 'Mensual', value:1},
    {label: 'Bimestral', value:2},
    {label: 'Trimestral', value:3},
    {label: 'Semestral', value:4},
    {label: 'Anual', value:5},

  ]

  periocidadTemp

  periocidadesPerm=[
    {label: 'Semestral', value:1},
    {label: 'Anual', value:2},

  ]

  periocidadPerm

  constructor() { }

  ngOnInit() {
  }

  test(){
    console.log(this.reintegroTipo);
    
  }

}

export interface drop{
  label: string,
  value: number
}