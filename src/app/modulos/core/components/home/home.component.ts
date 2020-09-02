import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Area } from 'app/modulos/empresa/entities/area';
import { ModeloGraficaService } from 'app/modulos/ind/services/modelo-grafica.service';
import { range } from 'rxjs';
//import { setTimeout } from 'timers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UsuarioService]
})
export class HomeComponent implements OnInit {
    data: any;
    data2: any;
    data3: any;
  evtLogList: any[];
  cities1:any [];
  areaSelected: any;
    cities2:any [];
    show=false;
  constructor(
    private usuarioService: UsuarioService,
    private indicadorService: ModeloGraficaService,
  ) {
    this.cities1 = [
        {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
        {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
        {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
        {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
        {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
    ];

    //An array of cities
    this.cities2 = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
    ];
    this.data = {
        labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO','ORINOQUIA'],
        datasets: [
            {
                label: 'Inspecciones programadas',
                backgroundColor: '#e09076',
                borderColor: '#1E88E5',
                data: [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,]
            },
            {
                label: 'Inspecciones realizadas',
                backgroundColor: '#7790d9',
                borderColor: '#7CB342',
                data: [28, 48, 40, 19, 56, 27, 19,60]
            }
        ]
    };
    this.data2 = {
      labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO','ORINOQUIA'],
      datasets: [
          {
              label: 'Inspecciones programadas',
              backgroundColor: '#b7a6eb',
              borderColor: '#1E88E5',
              data: [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,]
          },
          {
              label: 'Inspecciones realizadas',
              backgroundColor: '#a6ebb7',
              borderColor: '#7CB342',
              data: [28, 48, 40, 19, 56, 27, 19,60]
          }
      ]
  };
  this.data3 = {
    labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO','ORINOQUIA'],
    options: {
      title: {
          display: true,
          text: 'Custom Chart Title'
      }
  },
    datasets: [
        {
            label: 'Inspecciones programadas',
            backgroundColor: '#d9c077',
            borderColor: '#1E88E5',
            data: [65, 59, 80, 81, 56, 55, 40,65]
        },
        {
            label: 'Inspecciones realizadas',
            backgroundColor: '#7790d9',
            borderColor: '#7CB342',
            data: [28, 48, 40, 19, 56, 27, 19,60]
        }
    ]
}
    
   }

   actualizarArea(areas){
    let arrayIds = [];
   for (const area of areas) {
    arrayIds.push(area.id)
   }
     this.indicadorService.findInpN(arrayIds,null,3)

   }
  async ngOnInit() {
      setTimeout(() => {
          this.show=true
      }, 1000);
      let arrtest = [1,2,4,5,4];
  

    this.usuarioService.consultarHistoriaLogin().then(
      resp => this.evtLogList = resp['data']
    );
  }

}
