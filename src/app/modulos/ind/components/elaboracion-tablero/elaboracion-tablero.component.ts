import { Component, OnInit, ViewChild } from '@angular/core';
import { IndicadorService } from '../../services/indicador.service';
import { Indicador } from '../../entities/indicador';
import { Util } from '../../../comun/util';
import { ModeloGrafica } from '../../entities/modelo-grafica';
import { SesionService } from '../../../core/services/sesion.service';
import { Area } from '../../../empresa/entities/area';
import { EditorHtmlComponent } from '../../../comun/components/editor-html/editor-html.component';
import { Kpi, RangoFechas, ParametroIndicador } from '../../entities/kpi';
import { Tablero } from '../../entities/tablero';
import { TableroService } from '../../services/tablero.service';
import { MensajeUsuarioService } from '../../../comun/services/mensaje-usuario.service';

@Component({
  selector: 's-elaboracionTablero',
  templateUrl: './elaboracion-tablero.component.html',
  styleUrls: ['./elaboracion-tablero.component.scss'],
  providers: [IndicadorService, TableroService]

})
export class ElaboracionTableroComponent implements OnInit {

  @ViewChild("editor", { static: false }) editor: EditorHtmlComponent;

  indicadoresList: Indicador[];
  visibleDlg: boolean;
  rangoFechas: RangoFechas[];
  grafica: ModeloGrafica;
  params: ParametroIndicador;
  kpis: Kpi[];

  nombre: string;
  descripcion: string;

  empresa_id: string;
  areaSelected: Area;
  indicadorSelected: Indicador;

  constructor(
    private sesionService: SesionService,
    private indicadorService: IndicadorService,
    private tableroService: TableroService,
    private msgService: MensajeUsuarioService,
  ) {
    this.empresa_id = this.sesionService.getEmpresa().id;
    this.indicadorService.findAll().then(
      resp => this.indicadoresList = <Indicador[]>resp['data']
    );
    let anioActual = new Date().getFullYear();
    this.rangoFechas = [{
      nombre:'',
      desde: new Date(anioActual - 1, 0, 1),
      hasta: new Date(anioActual - 1, 11, 31)
    },
    {
      nombre:'',
      desde: new Date(anioActual, 0, 1),
      hasta: new Date(anioActual, 11, 31)
    }];
  }

  ngOnInit() {
  }

  abrirDlg(ind: Indicador) {
    this.visibleDlg = true;
    this.indicadorSelected = ind;
  }

  actualizarGrafica() {
    this.params = <ParametroIndicador>{
      indicadorId: this.indicadorSelected.id,
      param: {
        empresa_id: this.empresa_id,
        area_id: this.areaSelected.id,
        rangos: this.rangoFechas
      }
    };
  }

  onImgExport(event: any) {
    if (this.kpis == null)
      this.kpis = [];
    this.kpis.push(event.kpi);
    this.editor.addImage(event.object);
  }

  guardar() {
    let tablero = <Tablero>{
      kpis: JSON.stringify(this.kpis),
      plantilla: this.editor.htmlString,
      nombre: this.nombre,
      descripcion: this.descripcion
    };
    this.tableroService.create(tablero).then(
      resp => this.msgService.showMessage({
        tipoMensaje: 'success',
        mensaje: 'Tablero creado',
        detalle: 'Se ha registrado correctamente el tablero ' + tablero.nombre
      })
    );
  }
}
