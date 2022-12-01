import { Component, Input, OnInit } from '@angular/core';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Subcontratista } from '../../entities/aliados';

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

  @Input() aliadoId: number = null;
  subcontratistasList: Subcontratista[] = [];
  selectedSubcontratista: Subcontratista;

  displayDialog: boolean = false;

  dialogCarta: boolean = false;
  modulo: String = Modulo.EMP.value;
  directoriosSubcontratistas: object = {};
  documentosSubcontratistas: object = {};

  constructor(
    private empresaService: EmpresaService,
    private directorioService: DirectorioService
  ) {}

  ngOnInit() {
    this.fetchSubcontratistasList().then(()=>{
      // console.log(this.subcontratistasList);
    });
  }

  openFormSubcontratista(){
    this.displayDialog = true;
  }

  closeFormSubcontratista(update?: boolean){
    this.displayDialog = false;
    this.selectedSubcontratista = null;
    if(update) this.fetchSubcontratistasList().then();
  }

  async fetchSubcontratistasList(){
    await this.empresaService.getSubcontratistas(this.aliadoId)
      .then(
        (res: Subcontratista[]) => {
          this.subcontratistasList = res;
          this.loadDocumentos();
        }
      );
  }

  getActividadesAltoRiesgoFromObject(data: string){
    let aux: string[] = [];

    let dataAux = JSON.parse(data)
    dataAux.forEach( (element:any) => {
      aux.push(element.value);
    });

    return aux.join(', ');
  }

  getEstadoFromObject(data: string){
    let aux = JSON.parse(data);
    return aux.value;
  }

  showDialogCarta(){
    this.dialogCarta= true;
  }

  onUpload(event: Directorio, id: number){
    if(!this.documentosSubcontratistas['doc_'+id]){
      this.documentosSubcontratistas['doc_'+id] = [];
    }
    if(!this.directoriosSubcontratistas['dir_'+id]){
      this.directoriosSubcontratistas['dir_'+id] = [];
    }

    this.directoriosSubcontratistas['dir_'+id].push(event);
    this.documentosSubcontratistas['doc_'+id].push(event.documento)
    this.documentosSubcontratistas['doc_'+id] = this.documentosSubcontratistas['doc_'+id].slice();
    // console.log(this.directoriosSubcontratistas['dir_'+id]);
    // console.log(this.directoriosSubcontratistas);

    let subc: Subcontratista = this.subcontratistasList
                .filter((item: Subcontratista) => item.id == id)
                .map((item2: Subcontratista) => {
                  let carta = JSON.parse(item2.carta_autorizacion);
                  if(carta == null) carta = [];
                  carta.push(event.id);
                  return {
                    id: item2.id,
                    nit: item2.nit,
                    nombre: item2.nombre,
                    actividades_riesgo: item2.actividades_riesgo,
                    porcentaje_arl: item2.porcentaje_arl,
                    estado: item2.estado,
                    carta_autorizacion: JSON.stringify(carta),
                    id_aliado_creador: item2.id_aliado_creador,
                  }
                })[0];
    // console.log(subc);
    this.empresaService.updateSubcontratista(subc)
                          .then(()=>{
                            this.fetchSubcontratistasList().then();
                          });
  }

  loadDocumentos(){
    // if(this.subcontratistaData.carta_autorizacion){
    //   JSON.parse(this.subcontratistaData.carta_autorizacion).forEach(async element => {
    //     await this.directorioService.buscarDocumentosById(element).then((elem: Directorio)=>{
    //       console.log(elem);
    //       this.directorios.push(elem[0]);
    //     })
    //   console.log(this.directorios);
    //   });
    // }
    this.subcontratistasList.forEach(subcontratista => {
      if(subcontratista.carta_autorizacion != null){
        JSON.parse(subcontratista.carta_autorizacion)
          .forEach(async element => {
            await this.directorioService.buscarDocumentosById(element).then((elem: Directorio)=>{
              // console.log(elem);
              this.directoriosSubcontratistas['dir_'+subcontratista.id].push(elem[0]);
            })
            // console.log(this.directorios);
          });
      }
    });
  }

  descargarDocumento(doc: Documento){
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
        }
      }
    );
  }

  testFunction(data){
    console.log(data);
  }
}
