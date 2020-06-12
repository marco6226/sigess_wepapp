import { Component, OnInit } from '@angular/core';

import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones'
import { Hht } from 'app/modulos/empresa/entities/hht'
import { SelectItem, Message } from 'primeng/primeng'
import { HhtService } from 'app/modulos/empresa/services/hht.service'

@Component({
  selector: 's-hht',
  templateUrl: './hht.component.html',
  styleUrls: ['./hht.component.scss'],
  providers: [HhtService]
})
export class HhtComponent implements OnInit {

  msgs: Message[];
  hhtList: Hht[];
  aniosList: SelectItem[];
  anioSelect = new Date().getFullYear();

  constructor(
    private hhtService: HhtService,
  ) {
    
  }

  ngOnInit() {
    this.cargarAnios(this.anioSelect);
    this.cargarHht(this.anioSelect);
  }

  cambiarAnio(event:any){
    //console.log(event);
    this.cargarAnios(this.anioSelect);
    this.cargarHht(this.anioSelect);
  }

  cargarAnios(anioSelect: number) {
    this.aniosList = [];
    for (let i = (anioSelect - 4); i < (anioSelect + 5); i++) {
      this.aniosList.push({ label: '' + i, value: i });
    }
  }

  cargarHht(anio: number) {
    this.hhtList = [];
    for (let i = 0; i < locale_es.monthNames.length; i++) {
      this.hhtList.push({ id: null, anio: this.anioSelect, mes: i + 1, nombreMes: locale_es.monthNames[i].toUpperCase(), valor: null });
    }

    this.hhtService.findByAnio(anio).then(
      data => {
        let resp = <Hht[]>data;
        if (resp != null && resp.length > 0) {
          resp.forEach(hht => {
            this.hhtList[hht.mes - 1].id = hht.id;
            this.hhtList[hht.mes - 1].valor = hht.valor;
          });
        }        
      }
    );


  }

  guardarHht(hht: Hht) {
    this.hhtService.create(hht).then(
      data => {
        hht = <Hht>data;
        for (let i = 0; i < this.hhtList.length; i++) {
          if (this.hhtList[i].mes == hht.mes) {
            this.hhtList[i].id = hht.id;
            break;
          }
        }
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Horas hombre trabajas registradas',
          detail: 'Se han registrado correctamente las horas horas hombre trabajadas'
        });

      }
    );
  }

  actualizarHht(hht: Hht) {
    this.hhtService.update(hht).then(
      data => {
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Horas hombre trabajas actualizadas',
          detail: 'Se han actualizado correctamente las horas horas hombre trabajadas'
        });
      }
    );
  }
}
