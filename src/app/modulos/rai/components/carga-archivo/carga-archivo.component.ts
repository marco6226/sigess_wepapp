import { SesionService } from 'app/modulos/core/services/sesion.service';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { Message } from 'primeng/api';

import { DiagramComponent, SymbolPaletteComponent, SymbolPalette, NodeModel, ConnectorModel, PaletteModel } from '@syncfusion/ej2-angular-diagrams';

import {
  Diagram,ImageElement,NativeModel,  UndoRedo,  PointPortModel, Connector, FlowShapeModel,
  SymbolInfo, IDragEnterEventArgs, SnapSettingsModel, MarginModel, TextStyleModel, StrokeStyleModel,
  OrthogonalSegmentModel, Node, PathModel, SymbolPreviewModel, DecoratorModel, DiagramConstraints, PathAnnotationModel, PointModel, SnapConstraints
} from '@syncfusion/ej2-diagrams';

import { ExpandMode } from '@syncfusion/ej2-navigations';
// import { paletteIconClick } from './script/diagram-common';
Diagram.Inject(UndoRedo);


export type NestedData = {
  nested: any
}

@Component({
  selector: 's-cargaArchivo', 
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss'],
  // template: `<ejs-symbolpalette id="symbolpalette"width="50%" height="700px">
  // </ejs-symbolpalette>`,
  encapsulation: ViewEncapsulation.None

})
export class CargaArchivoComponent implements OnInit {
  
  @ViewChild('diagram',{static: false})
  public diagram?: DiagramComponent;

 
  file: File;
  tipoReporte: string;
  cargando: boolean;
  msgs: Message[];
  idEmpresa: string;

 

  constructor(
    public repService: ReporteService,
    private sesionService: SesionService
  ) { }

  ngOnInit() {
    this.idEmpresa = this.sesionService.getEmpresa().id;
  }

  

  onFileSelect(files: FileList) {
    this.cargando = true;
    this.file = files[0];
    this.repService.cargarArchivo(this.file, this.tipoReporte)
      .then(resp => {
        this.cargando = false;
        this.msgs = [{
          severity: 'success',
          summary: 'Carga de reportes realizada',
          detail: 'El archivo de reportes ha sido cargado correctamente'
        }];
        this.file = null;
      })
      .catch(err => {
        this.cargando = false;
        this.file = null;
      });
  }

  



}