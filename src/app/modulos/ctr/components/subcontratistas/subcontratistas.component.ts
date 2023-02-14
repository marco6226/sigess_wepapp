import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Directorio } from 'app/modulos/ado/entities/directorio';
import { Documento } from 'app/modulos/ado/entities/documento';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service';
import { Modulo } from 'app/modulos/core/enums/enumeraciones';
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { MessageService } from 'primeng/primeng';
import { Subcontratista } from '../../entities/aliados';
import { ConfirmationService, Message } from 'primeng/primeng';

@Component({
  selector: 'app-subcontratistas',
  templateUrl: './subcontratistas.component.html',
  styleUrls: ['./subcontratistas.component.scss'],
  providers: [MessageService]
})
export class SubcontratistasComponent implements OnInit {
  @Input() flagConsult: boolean=false;
  @Input() onEdit: string= null;
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
  modulo: String = Modulo.EMPRESA.value;
  directoriosSubcontratistas: object = {};
  documentosSubcontratistas: object = {};
  contratistasFlag: boolean=true;

  constructor(
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchSubcontratistasList().then(()=>{
      // console.log(this.subcontratistasList);
    });
    console.log('h')
  }

  createSubcontratista(){
    this.displayDialog = true;
  }

  editSubcontratista(){
    this.displayDialog = true;
  }

  closeFormSubcontratista(onCancelar: boolean){
    // console.log('onCancelar: '+ onCancelar);
    // this.selectedSubcontratista = null;
    if(onCancelar){
      this.displayDialog = false;
    }else{
      this.displayDialog = false;
      this.fetchSubcontratistasList().then(()=>{
        this.messageService.add({key: 'msg', severity:'success', summary: 'Guardado', detail: 'Se guardó subcontratista'});
      });
      setTimeout(()=>{
        this.messageService.clear();
      }, 4000);
    }
  }

  async fetchSubcontratistasList(){
    await this.empresaService.getSubcontratistas(this.activatedRoute.snapshot.params.id)
      .then(
        (res: Subcontratista[]) => {
          this.subcontratistasList = res.reverse();
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
                    tipo_persona: item2.tipo_persona,
                    porcentaje_arl: item2.porcentaje_arl,
                    estado: item2.estado,
                    carta_autorizacion: JSON.stringify(carta),
                    id_aliado_creador: item2.id_aliado_creador,
                  }
                })[0];
    // console.log(subc);
    this.empresaService
      .updateSubcontratista(subc)
      .then(()=>{
        this.fetchSubcontratistasList().then();
        this.messageService.add({key: 'msg', severity:'success', summary: 'Guardado', detail: 'Se guardó su soprte'});
      });
    setTimeout(()=>{
      this.messageService.clear();
    }, 4000);
  }

  loadDocumentos(){
    this.subcontratistasList.forEach(subcontratista => {
      if(subcontratista.carta_autorizacion != null){
        this.directoriosSubcontratistas['dir_'+subcontratista.id] = [];
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

  eliminarDocument(doc: Documento, id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.directorioService.eliminarDocumento(doc.id)
          .then(
            data => {
              this.directoriosSubcontratistas['dir_'+id]=this.directoriosSubcontratistas['dir_'+id].filter(val => val.id !== doc.id);
              let subc: Subcontratista = this.subcontratistasList
              .filter((item: Subcontratista) => item.id == id)
              .map((item2: Subcontratista) => {
                let carta = JSON.parse(item2.carta_autorizacion);
                if(carta == null) carta = [];
                carta=carta.filter(val => val !== doc.id);
                return {
                  id: item2.id,
                  nit: item2.nit,
                  nombre: item2.nombre,
                  actividades_riesgo: item2.actividades_riesgo,
                  tipo_persona: item2.tipo_persona,
                  porcentaje_arl: item2.porcentaje_arl,
                  estado: item2.estado,
                  carta_autorizacion: JSON.stringify(carta),
                  id_aliado_creador: item2.id_aliado_creador,
                }
              })[0];
              this.empresaService
              .updateSubcontratista(subc)
              .then(()=>{
                this.fetchSubcontratistasList().then();
                this.messageService.add({key: 'msg', severity:'success', summary: 'Eliminado', detail: 'Se elimino el soprte'});
                });
              setTimeout(()=>{
                this.messageService.clear();
              }, 4000);         
            })
      }
  });
  }
}
