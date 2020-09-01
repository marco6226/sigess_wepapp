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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','January', 'February', 'March', 'April', 'May', 'June', 'July','January', 'February', 'March', 'April', 'May', 'June', 'July','January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,]
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#9CCC65',
                borderColor: '#7CB342',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }
    
   }

   actualizarArea(areas){
       console.log(areas);
   }
  async ngOnInit() {
      setTimeout(() => {
          this.show=true
      }, 1000);
      let arrtest = [1,2,4,5,4];
      
      this.indicadorService.findInpN([1,2,3,4,5],null,3)

    this.usuarioService.consultarHistoriaLogin().then(
      resp => this.evtLogList = resp['data']
    );
  }

}
