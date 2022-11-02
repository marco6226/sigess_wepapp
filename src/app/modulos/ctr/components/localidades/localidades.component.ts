import { Localidades, _actividadesContratadasList, _divisionList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {

  visibleDlg: boolean =false;
  visibleDlgLocalidades: boolean =false;

  // actividadesContratadasList = _actividadesContratadasList
  
  @Input('selectDivision') 
  set actividadesIn(actividades: string){
    if(actividades != null){
      console.log(actividades);
      this.selectActividad = JSON.parse(actividades)
      this.agregarActividad()
    }
  }

  @Input('selectLocalidad') 
  set localidadesIn(localidades: string){
    this.loadLocalidades()
    if(localidades != null){
      console.log(localidades);
      this.selectLocalidades = JSON.parse(localidades)
      this.agregarLocalidad()
    }
  }

  @Output() data =new EventEmitter();
  @Output() dataLocalidad = new EventEmitter<string>();
  
  divisionList= _divisionList

  selectActividad: string[]=[]

  selectLocalidades: string[]=[]

  actividadesList: string[]=[]

  locadidadList: any[]=[]
  locadidadesList: string[]=[]

  constructor(
    private empresaService: EmpresaService,
  ) { }

  ngOnInit(): void {
    this.loadLocalidades()
  }
  
  agregarActividad(){
    this.actividadesList = this.selectActividad;
    this.cerrarDialogo();
    this.data.emit(JSON.stringify(this.actividadesList));

  }

  abrirDialogo(param: string =null){
    if (param) {
      this.selectActividad = []
    }
    this.visibleDlg = true;
  }

  cerrarDialogo(){
    this.visibleDlg = false;
  }

  onAddLocalidad(){
    console.log(this.locadidadesList);
    this.dataLocalidad.emit(JSON.stringify(this.locadidadesList))
    
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((element: Localidades[]) =>{


      element.forEach(elemen => {
        this.locadidadList.push({label: elemen.localidad, value: elemen.localidad})
    });
   });

    // if (this.valueEmpresa.localidad) {
    //   this.valueEmpresa.localidad = JSON.parse( this.valueEmpresa.localidad)      
    // }
    
  }

  abrirDialogoLocalidades(param: string =null){
    if (param) {
      this.selectLocalidades = []
    }
    this.visibleDlgLocalidades = true;
  }

  agregarLocalidad(){
    this.locadidadesList = this.selectLocalidades;
    this.onAddLocalidad()
    this.cerrarLocalidad()
  }

  cerrarLocalidad(){
    this.visibleDlgLocalidades = false;
  }
}
