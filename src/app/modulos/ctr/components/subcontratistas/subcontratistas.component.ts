import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subcontratistas',
  templateUrl: './subcontratistas.component.html',
  styleUrls: ['./subcontratistas.component.scss']
})
export class SubcontratistasComponent implements OnInit {

  nit: number;
  nombre: string;
  actividadesRiesgo: object[] = [
    {
      label: 'Trabajo en alturas',
      value: 'Trabajo en alturas'
    },
    {
      label: 'Trabajo en espacios confinados',
      value: 'Trabajo en espacios confinados'
    },
    {
      label: 'Trabajo con energías peligrosas',
      value: 'Trabajo con energías peligrosas'
    },
    {
      label: 'Izaje de cargas',
      value: 'Izaje de cargas'
    },
    {
      label: 'Trabajos en caliente',
      value: 'Trabajos en caliente'
    },
  ];
  selectedActividades: string[] = [];
  porcentajeCertArl: number;
  estado: string;
  cartaAutorizacion: string;
  subcontratistasForm;

  subcontratistasList: object[] = [

  ]
  selectedSubcontratista: object;

  constructor() {}

  ngOnInit() {
  }

}
