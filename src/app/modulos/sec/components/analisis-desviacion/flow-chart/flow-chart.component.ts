import { NgxCaptureService } from 'ngx-capture';
import { FactorCausal } from './../../../entities/factor-causal';
import { Component, ViewEncapsulation, ViewChild, Inject, Output, EventEmitter, Input,AfterViewInit, OnDestroy } from '@angular/core';
import {
    FileFormats, DiagramComponent, Diagram, PrintAndExport, IExportOptions,BasicShapeModel,NodeModel, UndoRedo, ConnectorModel, PointPortModel, Node, FlowShapeModel, MarginModel, PaletteModel,
    SymbolInfo, DiagramContextMenu, GridlinesModel, SnapSettingsModel, ShapeStyleModel, TextStyleModel, BpmnShape, HtmlModel, IDragEnterEventArgs, SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { AsyncSettingsModel } from '@syncfusion/ej2-inputs';
import { ClickEventArgs, ExpandMode, MenuEventArgs} from '@syncfusion/ej2-navigations';
import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';

// import {Canvg} from "canvg";
import { Variable } from '@angular/compiler/src/render3/r3_ast';
// import { showPaletteIcon } from './script/diagram-common';
Diagram.Inject(UndoRedo, DiagramContextMenu,PrintAndExport);

@Component({
  selector: 'app-flow-chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.scss']
})
export class FlowChartComponent {

//   @Output()imgDF=new EventEmitter<string>();
  @Output() datosFC = new EventEmitter<FactorCausal[]>();
  listFC: FactorCausal[]=[];
  @Input() dataFlowChart:AnalisisDesviacion;
  @Output() diagramSave = new EventEmitter<string>();
  @Output() imgDF = new EventEmitter<string>()
  
  precarga: boolean=false;
  public terminator: FlowShapeModel = { type: 'Flow', shape: 'Terminator' };
  public process: FlowShapeModel = { type: 'Flow', shape: 'Process' };
  public decision: FlowShapeModel = { type: 'Flow', shape: 'Decision' };
  public delay: FlowShapeModel = { type: 'Flow', shape: 'Delay' };
  public margin: MarginModel = { top: 10, left: 10, right: 10, bottom: 10 };

  public terminatorStyle: ShapeStyleModel = { fill: '#d0f0f1', strokeColor: '#797979' };
  public processStyle: ShapeStyleModel = { fill: '#fbfdc5', strokeColor: '#797979' };
  public decisionStyle: ShapeStyleModel = { fill: '#c5efaf', strokeColor: '#797979' };
  public delayStyle: ShapeStyleModel = { fill: '#f8eee5', strokeColor: '#797979' };
  public connectorTextStyle: TextStyleModel = { fill: 'white' };
  public asyncSettings: AsyncSettingsModel = {
      saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
      removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
  };

  @ViewChild('screen', { static: true }) screen: any;



  @ViewChild('diagram',{static: false})

  public diagram: DiagramComponent;

  
  styleFC: TextStyleModel = { color: 'black',bold:false,  whiteSpace:'CollapseSpace', strokeWidth: 1, fontSize:15, textWrapping:'NoWrap'};
  styleFC2: TextStyleModel = { color: 'black',bold:false,  whiteSpace:'CollapseSpace', strokeWidth: 1, fontSize:15,};
  svg2:string;
  timeoutID;
  
  constructor(
    private captureService: NgxCaptureService
  ) {​​​​​​​
      
  }

  ngOnInit() {
    
    setTimeout(() => {
        this.precarga=true;
        
        setTimeout(() => {
        this.diagram.loadDiagram(this.dataFlowChart.flow_chart);
        console.log(JSON.parse(this.dataFlowChart.flow_chart));
        
        this.loadFC();
        // this.startTimer();
        }, 600);

        
    }, 600); 
     
    
  }
  ​​​​​​​  public nodeDefaults(node: NodeModel): NodeModel {
    let obj: NodeModel = {};
    obj.width = 100;
    obj.height = 100;
    if (obj.style) {
      obj.style.fill = 'none';
      obj.style.strokeColor = 'none';
      (obj.style as TextStyleModel).color = 'black';
      (obj.style as TextStyleModel).textAlign = 'Center';
    }
    return obj;
  }
  public create(args: Object): void {
      this.diagram.fitToPage();
      this.diagram.dataBind();
  }

  private interval: number[] = [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
      9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75];
  private horizontalGridlines: GridlinesModel = { lineColor: '#e0e0e0', lineIntervals: this.interval };
  private verticalGridlines: GridlinesModel = { lineColor: '#e0e0e0', lineIntervals: this.interval };
  public snapSettings: SnapSettingsModel = { horizontalGridlines: this.horizontalGridlines, verticalGridlines: this.verticalGridlines };

  public getConnectorDefaults(args: ConnectorModel, diagram: Diagram): ConnectorModel {
      args.targetDecorator!.height = 5;
      args.targetDecorator!.width = 5;
      args.style!.strokeColor = '#797979';
      args.targetDecorator!.style = { fill: '#797979', strokeColor: '#797979' };
      return args;
  };

  public getPorts(obj: Node): PointPortModel[] {
      if (obj.id === 'Data') {
          return [
              { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
              { id: 'port4', shape: 'Circle', offset: { x: .5, y: 0 } }
          ];
      } else {
          return [
              { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
              { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
              { id: 'port3', shape: 'Circle', offset: { x: 1, y: .5 } },
              { id: 'port4', shape: 'Circle', offset: { x: .5, y: 0 } }
          ];;
      }
  }

  

  //SymbolPalette Properties
  public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };
  public expandMode: ExpandMode = 'Multiple';
  public enableAnimation: any = true;
  ele:string;
  //Initialize the flowshapes for the symbol palatte
  private flowshapes: NodeModel[] = [
      { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' } },
      { id: 'Process', shape: { type: 'Flow', shape: 'Process' } },
      { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' } },
      { id: 'Document', shape: { type: 'Flow', shape: 'Document' } },
      { id: 'PreDefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' } },
      { id: 'PaperTap', shape: { type: 'Flow', shape: 'PaperTap' } },
      { id: 'DirectData', shape: { type: 'Flow', shape: 'DirectData' } },
      { id: 'SequentialData', shape: { type: 'Flow', shape: 'SequentialData' } },
      { id: 'Sort', shape: { type: 'Flow', shape: 'Sort' } },
      { id: 'MultiDocument', shape: { type: 'Flow', shape: 'MultiDocument' } },
      { id: 'Collate', shape: { type: 'Flow', shape: 'Collate' } },
      { id: 'SummingJunction', shape: { type: 'Flow', shape: 'SummingJunction' } },
      { id: 'Or', shape: { type: 'Flow', shape: 'Or' } },
      { id: 'InternalStorage', shape: { type: 'Flow', shape: 'InternalStorage' } },
      { id: 'Extract', shape: { type: 'Flow', shape: 'Extract' } },
      { id: 'ManualOperation', shape: { type: 'Flow', shape: 'ManualOperation' } },
      { id: 'Merge', shape: { type: 'Flow', shape: 'Merge' } },
      { id: 'OffPageReference', shape: { type: 'Flow', shape: 'OffPageReference' } },
      { id: 'SequentialAccessStorage', shape: { type: 'Flow', shape: 'SequentialAccessStorage' } },
      { id: 'Annotation', shape: { type: 'Flow', shape: 'Annotation' } },
      { id: 'Annotation2', shape: { type: 'Flow', shape: 'Annotation2' } },
      { id: 'Data', shape: { type: 'Flow', shape: 'Data' } },
      { id: 'Card', shape: { type: 'Flow', shape: 'Card' } },
      { id: 'Delay', shape: { type: 'Flow', shape: 'Delay' } }
  ];
  //Initializes connector symbols for the symbol palette
  private connectorSymbols: ConnectorModel[] = [
      {
          id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
          targetDecorator: { shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'} }, style: { strokeWidth: 2, strokeColor: '#757575' }
      },
      {
          id: 'link3', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
          style: { strokeWidth: 2, strokeColor: '#757575' }, targetDecorator: { shape: 'None' }
      },
      {
          id: 'Link21', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
          targetDecorator: { shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'} }, style: { strokeWidth: 2, strokeColor: '#757575' }
      },
      {
          id: 'link23', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
          style: { strokeWidth: 2, strokeColor: '#757575' }, targetDecorator: { shape: 'None' }
      },
      {
          id: 'link33', type: 'Bezier', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
          style: { strokeWidth: 2, strokeColor: '#757575' }, targetDecorator: { shape: 'None' }
      }
  ];
  public getNodeDefaults(node: NodeModel): NodeModel {
    node.height = 100;
    node.width = 100;
    node.style.fill = "#6BA5D7";
    node.style.strokeColor = "White";
    // Flip the node in Horizontal Direction
    node.flip = 'Horizontal';
    return node;
  }


  public bpmnShapes: NodeModel[] = [
      
          {id:'muroAzul' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAxMAAAGLCAYAAAC88M9XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAArnSURBVHhe7dsxblNZGIbh60PiFAk1FRRQkw2wAMQOQMw6SEHjCimsYxDsgA3ABjw1FKSiJ8QocTwOOQxEGYnL1xwd+Xkkk//QBln35b9nslob1p4/fz68ePHiYgQAAPitslgshovP+fl5/SsAAIDfu7H+zB4+fDi8e/fu8m8AAABGKDduXPQEAADAn5nMZrPV+lOPw3DvyWGdgE314fVBnYZh787+cOvB03oCNtHn96+GL5/m9eRZAfj5rPC/MbF7e7+egE00f/moTpcxcfexBwfYZB/fHFyJif1nb+sEbKLjo/l/MVG+/wkAAPCHxAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQKQsFos6AgAAjFdOTk7qCAAAMF65efNmHQEAAMYrW1tbdQQAABjPBWwAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAIuXk5KSOAAAA45WdnZ06AgAAjFfW6ggAADCekgAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgUlarVR0BAADGK6enp3UEAAAYr0wmkzoCAACMV7a3t+sIAAAwngvYAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEJnMZrPV+lOPw3DrwdM6AZvq8/tXdRqGvTv7w+7t+/UEbKLjo3+GL5/m9eRZAfj5rHAtJgAAAMbwmhMAABAREwAAQERMAAAAkWt3Ju49ORx2b+/XE2TmLx/V6fIC793Hh/UEbKKPbw6uXODdf/a2TsAmOj6aDx9eH9TTxaX+v1zs78ivvz+bCQAAICImAACAiJgAAAAiYgIAgMZW9Se9ERMAADQ2qT/pjZgAAKAxm4leiQkAABqzmeiVmAAAoDGbiV6JCQAAGrOZ6JWYAACgMZuJXokJAAAas5nolZgAAAAiYgIAAIiICQAAGnNnoldiAgCAxtyZ6JWYAACgMZuJXokJAAAas5nolZgAAKAxm4leiQkAABqzmeiVmAAAoDGbiV6JCQAAGrOZ6JWYAACgMZuJXpXlcllHAABowWaiV2ICAIDGbCZ6VabTaR0BAKAFm4leuTMBAEBjNhO9EhMAADRmM9ErMQEAQGM2E70SEwAANGYz0SsxAQBAYzYTvRITAAA0ZjPRKzEBAEBjNhO9EhMAAEBETAAAABExAQBAY+5M9EpMAADQmDsTvRITAAA0ZjPRKzEBAEBjNhO9EhMAADRmM9ErMQEAQGM2E70SEwAANGYz0SsxAQBAYzYTvRITAAA0ZjPRKzEBAEBjNhO9EhMAAEBETAAAABExAQBAY+5M9EpMAADQmDsTvRITAAA0ZjPRKzEBAEBjNhO9EhMAADRmM9ErMQEAQGM2E70SEwAANGYz0SsxAQBAYzYTvRITAAA0ZjPRKzEBAEBjNhO9EhMAAEBETAAAABExAQBAY+5M9EpMAADQmDsTvRITAAA0ZjPRq3J2dlZHAABowWaiV+X8/LyOAAAA45Wtra06AgAAjFfW6ggAADCekgAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAIBI+fbtWx0BAADGK1+/fq0jAADAeGVvb6+OAAAA45Xt7e06AgAAjOcCNgAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAEQms9lstf7U4zDs3dmvE+S+fJrXyb8p4JLvBeBXvhP69uP3dy0mAAAAxvCaEwAAEBETAABA5NprTrcePK0Tm21Sf7KJPr//u06X77Hu3r5fT2wu3wmb7PhofuX9ds8K+E7gx7PCtZi49+Rw/eDgEgxssvnLR3W6jIm7jw/rCdhEH98cXImJ/Wdv6wRsoov/YPjw+uD77DUnAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgUhaLRR0BAADGK9PptI4AAADjlbU6AgAAjKckAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiU1WpVRwAAgPHK6elpHQEAAMbzmhMAABAp0+m0jgAAAOPZTAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAECkLJfLOgIAAIxXzs7O6ggAADBe2dnZqSMAAMB47kwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEBETAABAREwAAAARMQEAAETEBAAAEJnMZrPV+lOPAAAA45TlcllHAACA8cQEAAAQGIZ/AeP08WOdq/1UAAAAAElFTkSuQmCC',
          type:'Image'
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom',}]},
        {id:'muroRojo' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAxMAAAGLCAYAAAC88M9XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAr2SURBVHhe7d0/btRaGMZh+7hg6AIVggaJVeSKYhbBSmAdsBIWMQW6WQUSDYiKm45ImT83JKcYCPZ1Xl0sxX4eCc1nWhLLP74cp93tdofmStd1Pz4AAABGaV++fHkdEx8+fLj+CwAAgDHKj42EkAAAAO6qXa/Xh81mUy+b5vXjkzoBS/Xu23md3BOAn+8Jpw9X13+A5Tq+J9yKic8vntcJWKKz7xfNqy9f69VNTLx5JChgyZ59/FSnm5h4//RJvQKW6PieUOonwG+19RMA4FdiAhh0/YYGAIDfEBMAAEBETAAAABExAQAARMQEAAAQERPAIG9zAgD6iAlgkLc5AQB9xAQAABAREwAAQERMAAAAETEBAABExAQwyNucAIA+YgIY5G1OAEAfMQEAAETEBAAAEBETwCBnJgCAPmICGOTMBADQR0wAAAARMQEAAETEBAAAEBETAABAREwAg7zNCQDoIyaAQd7mBAD0ERPAIJsJAKCPmAAG2UwAAH3EBAAAEBETAABAREwAg5yZAAD6iAlgkDMTAEAfMQEAAETEBAAAEBETAABAREwAAACRcjg4XgkAANxd2e/3dQQAABivtK23yAMAAHdXrtQRAABgPCUBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAkbLb7eoIAAAwns0EAAAQKV3X1REAAGA8mwkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgIiYAAAAImICAACIlN1uV0cAAIDxbCYAAIBIuVJHAACA8UrbtnUEAAAYz1oCAACIiAkAACAiJgAAgIiYAAAAImICAACIiAkAACAiJgAAgEi7Xq8Pm82mXjbN+6dP6gQs1asvX+vUNK8fnzR/rVb1Clii43vC6cNV8+bRSb0Cluj4nnArJgAAAMbwY04AAEBETAAAABExAQAARBzA5n93dnHRvP12Xq98TQEO8AI/+/vqWeGdZ4V7a/AA9ucXz+sEmXf/nN+KiR8PD8ByPfv4qU43MeHBAZbt7dWzwq8x4Vnh/ji+p/sxJwAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACASNlut3UEAAAYr1xeXtYRAABgvLJareoIAAAwXmnbto4AAADjOYANAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQKRst9s6AgDAn9fWT+6/0nVdHQEA4M871E/uv9K22hAAgOl4+pwPZyYAAJiUzcR8iAkAACZlMzEfYgIAgEnZTMyHmAAAYFI2E/MhJgAAmJTNxHyICQAAJmUzMR9iAgCASdlMzIeYAABgUjYT8yEmAACYlM3EfIgJAAAmZTMxH2ICAIBJ2UzMh5gAAGBSNhPzISYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiJTD4VBHAACA8cp+v68jAADAeKVt2zoCAACMV67UEQAAYDwlAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAACT8iuT50NMAAAwKb/lbD7EBAAAk7KZmA8xAQDApGwm5kNMAAAwKZuJ+RATAABMymZiPsQEAACTspmYDzEBAMCkbCbmQ0wAADApm4n5EBMAAEzKZmI+xAQAAJOymZgPMQEAwKRsJuZDTAAAMCmbifkQEwAATMpmYj7EBAAAk7KZmA8xAQDApGwm5qNdr9eHzWZTL5vm9eOTOtHHN8B/e/vtvE6+prjh+2bZju8Jpw9X139YNvcElvKsMMev9eN/u1sxAQAAMIYfcwIAACJiAgAAiIgJAAAgcuvMxOcXz+sELNHZ94vm1Zev9ermUNybRw7Rw5I9+/ipTjcH6N8/fVKvgCU6vifYTAAAABExAQzy+kYAoI+YAAb5LaUAQB8xAQAARMQEAAAQERPAIGcmAIA+YgIY5MwEANBHTACDbCYAgD5iAhhkMwEA9Cn7/b6OAAAA45XDwf87AgAAd1e6rqsjwG3OTAAAfZyZAAbZXQIAfcQEAAAQERMAAEBETAAAABExAQAARMQEMMjbnACAPmICGORtTgBAHzEBDLKZAAD6iAlgkM0EANBHTAAAABExAQAARMQEMMiZCQCgj5gABjkzAQD0ERMAAEBETAAAABExAQAARMQEAAAQERPAIG9zAgD6iAlgkLc5AQB9xAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAp+/2+jgAAAOPZTAAAAJHStm0dAQAAxhMTAABAxI85AQAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQERMAAAAETEBAABExAQAABAREwAAQKRst9s6AgAAjFcuLy/rCAAAMF558OBBHQEAAMYrV+oIAAAwnpIAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAi7Xq9Pmw2m3rZNKcPV3UClurs+0Wd3BMA9wTgZ8f3hFsxAQAAMEbZbrd1BAAAGK90XVdHAACAsZrmX86e51C3gFOOAAAAAElFTkSuQmCC',
            type:'Image'
        },
        annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]},
          {id:'muroVerde' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAxMAAAGLCAYAAAC88M9XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAuESURBVHhe7dvPapRZHsfhkzdJFcbEleDCbUu7bNfiBTgbr8HZmxtwUwUiruN++hrcTF+AuHaWPTiXEFAUTOVPpcbSE7DBbivfAc8c6nlAOb/aKi/vh997NhaflOrx48fl6dOndQIAAPhzw2w2Kxd/zs/P688AAAB/bVguJp48eVKuXLlSnj17Vn8GAAD4a8NoNCqbm5t1BAAAWM3nOxPT6bRMJpP6Uyn7B3frCVhXB/uv6qmUW3eul/sPf64TsI5++/Xf5c3rwzp5V4B1d/Ge8KcxsXx5ANbXo3sv6ulLTHhxgPW2fHH4Oiaev3xQT8C6WT4LLmJi+Pw3AADAJYkJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAIDI8P79+zKbzeoIAACwmuHw8LAcHR3VEQAAYDXDzZs3y97eXh0BAABWM4zH47K1tVVHAACA1biADQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBkePv2bTk6OqojAADAaoZr166V8XhcRwAAgNUMm5ubZRh87QQAAFyOigAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgMpyfn5fFYlFHAACA1Qyz2aycnp7WEQAAYDXDxsZGWf4BAAC4jOHKlStle3u7jgAAAKtxARsAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiG4tPptNpmUwm9adS7j+8XU/Auvrt19/rqZRbd66Xn365XidgHf3nX4flzevDOnlXgHV38Z7wzZgAAAD4Hp85AQAAETEBAABExAQAABD55p2J/YO7ny9cwv/i0b0X9fTlAu/y/xWwvg72X/3hAu/zlw/qCVhHy+fB8rlw4W9/v13uP/y5Tvw/+/rfzmYCAACIiAkAACAiJgAAgIiYAACgucWiHuiKmAAAoLmNjXqgK2ICAIDmbCb6JCYAAGjOZqJPYgIAgOZsJvokJgAAaM5mok9iAgCA5mwm+iQmAABozmaiT2ICAACIiAkAACAiJgAAaM6diT6JCQAAmnNnok9iAgCA5mwm+iQmAABozmaiT2ICAIDmbCb6JCYAAGjOZqJPYgIAgOZsJvokJgAAaM5mok9iAgCA5mwm+jScnJyU+XxeRwAA+PFsJvo0nJ6eigkAAJqymejTcPXq1TIajeoIAAA/ns1En9yZAACgOZuJPokJAACas5nok5gAAKA5m4k+iQkAAJqzmeiTmAAAoDmbiT6JCQAAmrOZ6JOYAACgOZuJPokJAAAgIiYAAICImAAAoDl3JvokJgAAaM6diT6JCQAAmrOZ6JOYAACgOZuJPokJAACas5nok5gAAKA5m4k+iQkAAJqzmeiTmAAAoDmbiT6JCQAAmrOZ6JOYAACgOZuJPokJAAAgIiYAAICImAAAoDl3JvokJgAAaM6diT6JCQAAmrOZ6JOYAACgOZuJPokJAACas5nok5gAAKA5m4k+iQkAAJqzmeiTmAAAoDmbiT6JCQAAmrOZ6JOYAACgOZuJPokJAAAgIiYAAICImAAAoDl3JvokJgAAaM6diT6JCQAAmrOZ6NNwfHxczs7O6ggAAD+ezUSfhvl8Xs7Pz+sIAACwmmE8Hpetra06AgAArGbY3Nwsw+DqBAAAcDkqAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACLDhw8fyvHxcR0BAABWMxweHpaPHz/WEQAAYDXDjRs3yu7ubh0BAABWM+zs7JTt7e06AgAArMYFbAAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIiICQAAICImAACAiJgAAAAiYgIAAIhsLD6ZTqdlMpnUn0q5ded6PUHuzevDevJ/CvjCcwH4mmdCvy7+7b4ZEwAAAN/jMycAACAiJgAAgMg3P3O6//B2PbHONjbqgbX0z3/8Xk9fvmP96Rffsq47z4T1tvw++uvv270r4Jmw3i7eE74ZE/sHd12CgTX36N6LevoSE8vnArC+DvZf/SEmnr98UE/Aulk+C5bPhCWfOQEAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAAJHh3bt3ZTab1REAAGA1w+7ubhmNRnUEAABYzbC1tVWGwddOAADA5agIAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACLDYrEoyz8AAACXMRwdHZXT09M6AgAArMZnTgAAQGTY2dkpo9GojgAAAKuxmQAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAICImAAAACJiAgAAiIgJAAAgIiYAAIDIcHp6WubzeR0BAABWM8xms3J2dlZHAACA1Qx7e3tlPB7XEQAAYDXuTAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQERMAAEBETAAAABExAQAARMQEAAAQ2Vh8Mp1Oy2QyqT8BAAB833ByclLm83kdAQAAVjOcnZ2JCQAA4JJK+S+9AmTnKtDPWAAAAABJRU5ErkJggg==',  
            type:'Image'
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]},
          {id:'ovalo' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAwEAAAGKCAYAAAEj8H2xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEo3SURBVHhe7d2JexTXme9xZ//TrI3kZpY8yczc3Jk7ubmzJTcyIBYBYt8XAc7iJBPbcWIn2EYLQkISWvBujI0XwLawMQYM3gADklCrJZ1bb6sKSq23uqu6q7qrqr+/5/k8BtxLdS2nzqk6dc4DkomJCZP7AykpU1NT0/Yfk51fnlhpfvHsgxWzuf9fanfH01ZIEKu6601rT71Ze7TerO9tMBv7GnL/XWf9fY3176uP1KvvC+L9z94oewMZY75l/7H60X6km6y8h59bUjXbBhrV5XJbfeTvknfUaD9EaCshrlZ01am/Qdg/M57JX1jtxyXV0g59o9g/vbrJXyjtB6SNnHvyf/fs7KznBpH/5/x/58/ufys57gXQFrRWuNeDsFdP9HG+UFuoWuXeEMJeVeHH+QJtITAvsg3hfOiW/gb1i7GYs84Ov/nL8jeG82HaF6EwZ90Je3UGDxugfGVtCDZAeB4qZUOwAcLnbAgr37ZXs3fYANFx1q29qvWwAaLnuSGcmzryP6t9VbMWqBtB4mwh7U0Il7Ou7VV/P/KPu4Ya1TchfIs2wvCZTo6CClt0NDj/oL0Y0XCqrPYmmN8IO49TFFXaoo2gvQjRkvU+Njf2HTZCFcl6z85m548GNkJ1zG+EDBuhmmS9UxxVmaz33AaQyF/YEJW1pX++05m9CR54YHnnd9kIFebs+PYmmA8bobJkfS+6t+BsGe0NCJezru1VvzBshMqQ9TyVnfTeCGyIaDnr2F7letgQ0XG64Re9z3zojf25F+4dblI/CKVzdnB7VReO82Ltg1CaQBvAifOmXUMcEeUqaQM4cd4stA9HYVtdj2LZq7S0sCFK46yzTPZueRvAHedDl3awMQrZbRXfzrqyV124cT5c7KH2tIizbkLd+73i3hhS7mkLVEvc68NeRZV7jtn95UJbwLRqPnz/d1dshReLe2MIbcGTrqVz4WO09k+PZ9wLKmTYA+1HxZ2c9/J/i/0Tk5X8H+GIW8djr+EV7J9RMIkc5UX7sfmkzJUVo62woKSP7fK8okRj5Rv2ItZutBUTBStft7+SuHP79u1klrdJyOTk4jtI1p74NfuPgXLlypVUbai5ubn5PkfVzpmrr6hFRpQOHTqUrLLfOvOHsvdpK8MvuV4lI3rJ6CptVq1qQ19DTltvvVlr/Vur9f/8nHiLsRc1HdF+oJtWg6kkbZnyTc9OJ2ujaD8iSc87HDzhvWE63noknhsjf0HTdvct//eJU6dOVef6kHtkKvcCaQueRu7fLJ56bW/Bo0LWl5VcTwpG9wrRpmMNCzZEzzt/iL54cr4sqRfdouLeEPaqCjfOh8v1Gm0BsCRX0YhkQzgfqH0pFgt1I8iHrOyuU78I3vaP3t8Q9qoMFufN2ofDv5I2Ais/XF4bQb0Yx8qPhtdGWBRWfnSKbgTnBdqbUb5FT1y6w8qvDGc926v9fuQfdwzSC64SFm0AZ6toL0b4nPVtr342QDUs2gDaixAdWee5nta37l5n768CWee5o8D5g/YiRIcNUGUr7N4bbIAqkW40bIAqujdUZs+ZR9kAVeDs+FRDq0TW+d2sPRuv/IWn6Cvr3t4vkb9wFFSOs77t1T8fNkDlyLq+V/w4cbaK9gaEx1nP9mpfGPkfPCUfLVnHDHtWJc76tVe3HjZCNHytfCdshHAFWvlO2AjhcNaj0z09UNgI5XHWn706S4vzIcxxFkwoK9+J82FC+zLc515X9uoLL+4P1768lrnXjb26oov7y7SFqSXudWGvnsrF/eW11oJ2/3Z7dVQv7oUR+0bSuTHcv9H+6fGLeyEd2o9JgvzfYf/EZCX/Rzi0H1xN2jLem8YqTdF+qEYG5DhwQl9ZQckjtdp35LMXsTbzi2fq5rSVEgX7KwlJSbRRubSUOlJXfiYz43OvXuw3j7y4Rj3CKsFKTY5/Z/3ueAygm+S8fml0bnmnXvHBg+bwW7+WA4zRPJMcbcOWY1V3XW5I2bAqxpUkQ9jKqHra7yrX+t5/NCMjI9+0VzupdLSNUszmfgY6CkIu7Mlwldq69OP0J8/R8Aoj2srN12xJYimdFmuPBjvTvH3tJQ4Or2grzPEQo6Ylkgx2rG3PfBe/fLc2DwxtZYi03l/DfUs7Co/4ffj0r5N/UGjDr2s/lh5gEO5RDzWzs9nkHhT5P0YeWtZWAuBWaFT7Vz46Fv8DIn+htR8JBCFtwvz9Shw6cyj40wBh5c6dOwuOxvyF034IEAZtBqGlHY3VOzu4F0RbYCBK7v3PYe+a0Sb/S7WFAyopf58U9u5aMIFnO8z/Em1hgGpyBitz5EYPLZBAB4H7g7UvB+LEvb8KezcuLe4P2thH3xski3v/tVL6uBJC+wIgCdz7sefAWvn5+Mb7C96ofTCQJKu7719W9XUgcAAgjdrsIdbFooFG3eEAQJq5rx6pBwIHAGqBez+fmxtbeInU/T+1NwNp4ezna3p+cP9s0D7yCw4A1AxnXxf2IcBZALXF3TYYG+udrxJxEKCWbHANhTftjC/IQYBassw1isaY0zjmIEAtce/vuQPAifOP9BFC2jn7uufsfEJ7I5AG7v38XlXIyY0bNxa8QPsAIMl2Hm+8t387Z4EpK7kDwMnO4/9+70UruurUDwKSytm3hb3L63G/kJHfkBbu/dre1QvH/QahfSiQBDIyt3tftndxf3n69MEFb9a+AIiz/GeO7V07eNwfIkN1a18GxI17vy32wL2vuD9QaF8KxEH+vmrvwuEl/wu0hQCqIX/fLOnB+iDJ/0KZqEFbMCBq+fti5Dt/fvIXQGgLCoRJ2+/sXbK60RZM+wFAKbSBeCte6gdJ/sKKHccb1R8HeNH2IyvJm8dY+yGinWmZkEfbT4S9K6Un2o8UK7vpq1RLdg01qftBJrt4qq+aiLYyHNoKRLKsPuI9i6W9CxAt2gpz4+GfeNk7rJfsDivMfh9WtBXsRU652gZDcKu6i89JzI4ek2gbx4/mww+aDdbZpRZmx98+2Jh7XkRbD4VY+Ya9mkPP1NTUtP1HUkomJ30Oue2KtVHn8jdyLUr0HMGk9GQy9lgzIUTbsarFXqTAkfURZSlPYpL8aWcrEWvH+pr9R1Iks7OzFd0+ExMFhmdPY8I8AN775LTpevt3ZmPfj9XSuBLsRampjI+P02aIKl9NXp/rPfu4aT3y9+oOlxa/f2FjTR48xM4fX92m7hiQ+y0/Nuc/f5MDJC3RNnIltXTW5e6OtlrW9NTnnrNYZ2nrbTDrLXIJVm7yyX/l3+T/yWvktfIeee+q7rrcKB/a51fK41ahEYeGMlWgItE2XjmaLbJz7k7gDbb20Sazpb+0a/9+vPxRjynlMjQJOdrG8UsGCKjlrtxyA7DVNXFdOY69+0cOhkpF2wCFSClYC3d7wyRnPm1d+rG1/1+lykQ3iTCjrWiN1J+1DYrySZVKW+fFcDCUGG1l5ltvlVTaxkL09hTpFZpv3dEfeVaTZmZmaOBKtBXnJldFtI2B6ts64P8M0XPmUdoM7mgrySGnXm2FI772W20ubVvmkxuP9i5Qm9FWith0jKpNWsgFCG0b58uW2EPVqj5lpC+Rw/7nRf/uZr+ketFWANWb9JPLztq2dzPmVPJGh/Ab7QfLTCDaykK6afuCm5X0HAjaD9RWCmpPobvVq7r/NtltBO1HaSsBkGFztP1FXL7xfrIOBO1HaD8ayKcNl+iwd694J3+h6YaAUuTvR46bk1/E80DIX1Dp0qv9MCCI/P1KyLML9m4Xj+QvoPZDgFKt9ei1aqX6I0m7F0ge9NB+ABAG977mqNoQL/kLoi0wELb8/U5kZsMb7sZX8hdAW1AgKpv7Fz+vEMpMkn7i/lKmXUW1aH2MIj8I3F/GqM2IA/c+KSJrGLu/hP47iBP3vilCPwjcHy4PPmgLAVSTex8V9q5bftwfSj99xJl7XxX2Llx63B8m4+lrXwrEiXufLatR7P4goX0ZEDc7Bhc+dFNSe6Dt6D8s+BDti4C4esi17wp7t/Yf95u1LwDizr0PB6oKud8otA8HksC9H9u7d+Fcn/h0wZu0DwWSwl0Vmsr6GMzXvfNv43o/UsC9T9u7uZ6z115d8GLtw4CkWXPk/rMEBc8C7p2fSaeRJu59297dF8f9Iu1DgKRa53qi7G5WmSFyeed3771AHj/TPgRIMmf/FvZufz/u/6m9GUg69z6+6O6w+39qbwaSbtfQ/S4Se4Z/fv8sMHr+8L3/sZnenkgxZz8X9u5P6Y/a4d7X5+bGvsMBgJrinnM564wkwQGAWuGen+CtT17iAEDtcfb1ls7vLTwAZKp+7Q1Amjj7u1hwAGwbpPMb0m/BAXD1qwv3/rJ/VH8DkCYLDgD3GUAmPtbeAKSJ5wEg4y1qbwDSxPMAWM2EFqgBngeA0N4ApImzr9/rFs0BgFohE7g4+/oYXSFQa9wPyed2fgkHAGqFe1+3d/8HHhjP3Lr3j8s66tQ3AmmgHgAS9//Q3ggknfu5YJ4IQ81x7+P2bn8/x9//64IXaB8AJJl7/7Z3+4Vxv0D7ACCpml379qLqjxP3AbC8k8Yw0sO9b9u7ux73C7UPApLGvU8XHSDX/WKhfSCQJO792d7NC8f9Bu0DgaRw78u+hkeXuN8ktA8G4m6ta1RoYe/e/uJ+Y1sv3aSRPO592PPKj1c+/nJswQdoXwDElXvfFfZuHSz5H6J9ERA3+futvTuXlvwP074QiIv8en/gqo8W9wcK7YuBatt47P7DLqKsWeLdef+zNxZ8sNAWAKiWjX0R7fxOfv3C6gVfILQFASotv+QX9m4bblZ0fX/RF2kLBFTKMtdozw57d40m+V8mtAUDoqbti/ZuGm20L9YWEIhK/v4Xep3fT/IXoqWLLtSIVvto04J9TlRl53eSvzBCW3CgXEs76hbta/ZuWN3kL5RYy1wDCJG2j9m7X3yiLaT2YwC/tH3KyrfsXS5+0RZYaD8O8JJ/Y8th72bxj7bwQvuxgGNL//1J7Nzs3Sp50X6MTFWp/XjUru2D+o4f6+pOkGg/TmgrA7WjzTVas5u244+Pj0/bf0xutB8rDpzQVxDSqVnpwiDs3ST90X68WMHNtNTaNqBXc4S9W9RetJXhkCsB2opEcrSPLL5z69CqObdu3Up+NafUaCvJsaaHG2tJ4dWgFdnZjFraz87O1tZZIJvNev5gbcXlo80QL3LnX9tODnvTEieFDgB3tJWp4YCorFbXWPsar5Ke2PF7AORHW9madfRFCk2hxqubvYmIn5R6ALijbYRClnY8aHYeb1Q3MpbkzqLFSnY3ezOEEtoAIUXbUH6s6q6viYNDrsp43Xwqxl7FkYQDIKJoG7Iccp9iQ1+D2T3UpO5g1SAPiUgfmta8MXHKYa++gpmc9DnYbAwzPj6esf9YnVTqAPCKttFrkb06ai4TE/Ys8WRxtB0l6eyfRuyYMEaMS2oymXAu0Wk7WrVY+bq9WIEi6yKs9RG31PROXmqslfY1+4+pzI0bNzgbkPglzAblnTt35IwQuwPZaniG8hsz2am5dy+8ba7c/MCMff6mOXftpHn7kxfN65dGzKsXB8yLF3rM6PnDRqb+PXbuCdNz5g+m463fmKdPHzRtbW0lnSlJbWRqamq65q5IElJqPr39sTn58WCugP3186tMW+8/qk0UhM8KJzNCSGm5ePHi3KvnRs2TL7Wbjb3/rBYyqB37BptN92uPU/slJOl59JVN6kEOhGl553fNs2/+0ly++QEnDkIqGe2ATJrlnXVm9ZF6s763wWzpb8j1xt073GT2j+qd/tJs/2iT2WP99h3WOth8rCH3PMuq7jp1QOCkksuEb1wekctX37B3Y0KIV7SDqJpWdtXlCmt55l16YGsFGeJLTq5bBxpzJ5cW6+SrbeNqW9vzQzN6/hkzNzdDq4JUJnG4868dDFGSwnyTVdOUQkErLIB8u4aachUAablp+1SlPPLSWvPJrQucIEgyo+3UYZEHm7dZNXTtAAYqSS5rSSWj0ieMgfeeNMaMfDMrz5wa8037sCOk8tF20HJIDYwBwJA2u62WaJgDOnh57sMuuQfBSYFEE22nC0ImzpEBsSnkgYXkcqXcv9COm3LtGfmZufwVvZlIwGg7k19tvfUU9EBIZJg66TmlHWul+tULq8ypU4+kY4Y6omdqasoI+68Fo+0kxUitXnrOaDstgMpY7zHpdCkGzx0yMoSL33KDJDjaDlAIcxIAySHPX0ivOO1YDuLpNw6aU+YUrYU0RNvAXqSng7ZjAUi2tQHmidF0vfU7YzgpJCPaBtTI1BjSxU3bYQCkmzyxrpULfp282M9lo7hE20AamQtJ2xkAQMiwJlrZUcyzpx+Wrqm0EioZbUPk41o+gHLI1QKtbClk/4mHzJ2JO7QSooi2wt3kYRRtQwJAuWSgw2UBB/hrP9FMC6HcaCvWbdsA3TQBVF7Qh9t6z/6RE4LfaCvQjZu5AOJEnhnSyiovF748x+Wi/GgrytFs0VY8AMSNPKeglWOa9tFfmDNnznzbLgZrL9pKcds3Qo0fQHLJc0da2abJzmbT1TqYmJjw/EHaCnBwjR9AGskQ8FqZly+TvZvOS0Xaj3XTVhoApM0On/cPUnMy0H6cQx7M0FYSANQCrVzMl9iTgfZjHPK4trZCAKAWPaSUk/mshHIDeW5u7jv2H6OJtvAOhl4GAG/FTgZhtAoiOwloC+zY0s+YPQDgV5Qng9BPAtoCOhi7BwBKV+hkEIt7BdqCObQfBAAITitjHWHdK1Bz8+ZN9UyjLYhj1xAPeAFA2NoKjFWktQqk/I7kBKEtgGjpqlMXHAAQHq38FZFfHjp4Yqn6xWIzN34BoGKWHdbLYhFJ7X9j34/VLxMHTugLCQCIzsYC4xKFeiJo6fye+iVCWzAAQGVIJVwrm0UoJwLtgx3aAgEAKk8ro0VZJ4LmZ72nUdMWAgBQPVpZLUo6Efzx5Db1w4T25QCA6tPKbBHoRHDm6svqhwjtSwEA8XCw3HsEMhGM9mahfSEAIF5krDatDL+b9Z7o61629f8f9c1bme0LABJjZZd+T7foiUB7k9C+BAAQX1pZLsbmxvRRRJd26FOeaR8OAIi39b36ZaG+c08YdThp7cVrexgKGgCSymso6rGx3oUngdHzh9UXah8KAEgGr5FHFw02p71IaB8KAEgOrWz/88kdCy8JaS9a1c3Q0ACQdN6XhFw3iLUXbDrG8NAAkHRLOxaX72J2Njt/SWhy+o76gt3MEAYAibfmiH5fIDubmT8JnP5AHyaCeQIAIPk2eHQVzWSn7t8c1l6wY5CnhAEg6VZ5PD2cdS4HSbQXtFlnD+0DAQDJ4Xlj2P3ksPaCZov2gQCA5NDK90VjCG0+9s/qC7UPBAAkw57hJrVsX3QS+OSrD9UXygdoHwwAiL+WDv1+gDqInPZCoX0wACD+tDLdczjpZ9/8pfoGegkBQPIs93hIzHMoaYn2BqF9AQAgnvaN+LwXkJ+jb/9RfeOyDsYRAoCk0MpxUXSe4UJzDG9kLCEAiL3lHjeDi7YC3NE+QLSP0lsIAOJqQ18Zk8y789nty+oHCcYUAoD42dyvnwBE0ctAWo6de0L9MEGLAADiY6NHC0CUdAJw8vyH3eqHir08SAYAVec1obwo6wTg5PSV59QPF1sHeIYAAKpltccIoSKUE4CT81+8pX6JWMk0lABQcVp57Aj1BOBkeiajfplDW0gAQLjkUrxWBotM9m6wXkClRPtiBwPOAUB01npMFSkqcgKQZLNZ86vnV6kL4dAWHgBQmoMngl/+ieSSkDvvXH1JXRjH2qP16o8BAPjnNTOYI/LCvlg2Hftf6oI5tB8FAChMhurRylRH1Qv//GgL6ab9SADAQsUK/4pd+y8l3e/8Tl1oN+1HA0CtK1b4i9jV/r2yffD/qD/AjTGIAGCJae32fuDLkZjCPz/aj8kngx5pKwYA0kwrD/MltvDPj/bj8rV08eQxgHSTwTe18i9fagr//Kzo+p76g/Nt6WdMIgDpIcPraGWdW1Vu+E5OTkb6pYU+X1sJGp5CBpBEhYZ3dkttrT9ItBWjkafmtJUNAHGw83ijWnbli3U3z2pGW1ledgxyyQhA9a33WeOn4A8YbSV6aetliAoAlSMdWbSyKB8Ff4jRVrCXXUPcRwAQns0+HuRyWPmWXWyRqKKteC/Nlr0jnBQA+LdtwN+1fUFtPwbRNoyXhw4/aHbT4wiAi0yVq5UXXorV9sfHx6dpEVQx2kYrhHsKQO2QIWv89Nt3o0BPeLSNWkiz1VrYTu8jIBU2BbieLzLZKS7vpD3ahvdjTU89A98BMSUdQpZ3BqvhZ2YziSjwz5w5wwNlUUfbQfySJwO1nRJA+KSjR6tVIdOOxUKmE1Lgk4gjcyTbfywabUcKQmolXFYCShP0Mo6blW/ahzEhCxPkJOAVbacLSu47bLBaEFxeQq2SccFkLnLt+PAjS82elJIwTgKFou2spVrf28AzDkisHccbzaru0gt5B7V6EmqiPgl4Rdu5w9J6pJ6xlFARMojjlv4Gs8LnsAl+lFOjt47n7PT0NC0C4j/VOgkUi3ZwRGW1ddKQA1kmuNAOdNQOuSQjc9uGWajns/INezePdaampqZnZ2c5oaQ9cT0J+Il2gFWaPHEtLQ+5abdrqJHhvato/+iSXAtQ7i2tCvjwU1iSUsD7SS2cBMbHxzP2H2s3cTwJhD25j3VwzuUfrEm1tKMuV0uV1su6o/W5Ak9aMdLrSvqF77ZJjVbsFSNNZp9NWjv7c+afFBVy4jroKkxzf7f/335hvV7eJ5zPkc+Uz3a+R75Tvl9OhNusZZG5suUejtzolOvgLZ111rLrvynusrPJrSiRwpmYmGDb1sJJoJT84pm61Jw4sNAshTqxY7XceOiMRJNmTiIVYeXr9ionRM1XX30l+wmFPUl/tEIy7ijESdDcvn07c+vWrehbc3KZJJPh4YtqZHx8PJT1PjMzM5f2bTgxMTF3/fp19lMSeuQ4tJLa0UKnpqYyVhnhfexwAqhO0n4CmJycnLMOrK/Zfy0rX976zIxdPmMufHnWvPfZ6+bM1ZfN6SvPmdc+Pm5e/qjPPP9Blxkee8YMvPuk6T37uOl6+3fm2Td/Zf76Rjv7NimYtJ8AioYTQLIT1xPAJ9cvmjPXXjFD7x8yfz61y+wd/plp6fyeepkkrbgpW1uJQyePwOEEQPxkInNn7v3P3jCD7/3FPHFyu9k19B9mWUeTWvAhXJxICCGR5fLN8+bFCz3mydf2mJ2D/6YWQoi/ls7vmoMnluUugdmblhBS6zl/4T3T98ZfzMPDK03zs9V5ohTxsPbIj8xjz+8whw4dSs0TvoQQO8fOPZG7PKMd/EAhv3mh1bz4YY+5dZceVyQlkQcl7D+mLpuO/bN6IANh2j/abF756Jj0lqHVQKJPWF0k0xbt4KwFzZZlnXVmZVddbgweGTNIyKB1MsezWCuOzo8lJNp6xfzYPev7GnLjC8mUn0L+LOTf5f/L6+T1znvlc5zPlSkL5Xuc75Tvl3GLZPwibVlrxdaBf8318BrPVOCBpYQkkb2A4hhOAOko7GVkUSkspXCWYYllcDcZYK19pKnmRhmVQehkwDkZXG7rwPwIn3JykQHl5ASnrb+kaT3y96b7nd+b6xNXKQgJCRrtoIoTmRdZascyKqbMDCUFmlbYITxyopSRSeXkKUN0S2skSSOQPnFym7l264KxasfZkZERZgEjxIl2wFTLso663CUPKdyllq4VRogvaWHstE7KcolLLlXJHNXadq62x17dZD66fkbuJ3AyILUX7aCoFJlURAp4au61SU7sculJLjtp+0c1/PbFVvPupyc5IZB0RtvpoyTX3eUyjVwy0AoBIJ9MjiP3JaTloO1TlbK887tm5Pyz1rmAS0UkwdF27ihIQS83FbWDGgiDVCSqdWL46+n9ZmL6DjeUSfyj7cBhkVq9dFmUKQu1gxSoJLnXIPeLtH01Kg8/32I+uvFu7mRAL0ESi2g7armkp4309pBmuXbwAXEk9xfkGQptnw7b1v6fmA++fIeTAKl8tB2yHNJPfgfX65FCm62KjLRetf0+LL9+YZW5PvkpJwMSbbSdrxTSE4cCH7VoS39j7olu7bgIw1Nv7CvpBrL1ptqdEIZ4R9vJgpIbaHLNVDsggFomPY+i6pJ67N0/0bWUlBZthwpCHsbRdngAOhkeRIYM0Y6ncmw89r/Mta8+5hIRKRxt5/FLbtzS7x4Ij4wdpR1r5Th5cZATAVkYbUfxQ7rB8UQtED2pXEklSzsOS/HM6V+aU6dOcd0/bZmamvJ9htd2jGLkwauDyg4KoDLkwcewTgZ7hn9urn5x2Ui5wY3gBGd2dtZXwa/tBMWs7K7jASwghrYNNIYy6N2yjiZz8Yv3jJQjlTwRyPd5sV+yINrrirHybfvttRttoxcik33IcMfaTgcgfuThSe1YDmJpR6O5cvND7hOkJdpGLkRGytR2LgDJUe4TyS2d3zXXbtFzKLHRNqqXlq46086wC0DqyPM32jHv16ruvzGf3/6EE0FSom1EL3JDV9tpAKSLVPCkoqeVA36s6fmBuT7OcBOxjbbRvHCZB6hdUvHTygU/tg/+xJwydB+NPEGGe9U2VD6ZdHvXEDd1AcyTiqBWVvgx+O5TFe0tVHPxcwLQNky+pYcf5Po+AE8yMKNWdvhxa/JLLgtVOtqGyCd9g3lKF4Bf20o8ETz68mZaA5WItvI1e4Yp+AGURkYo1cqVYs588hIngqiirfB8zI0LICyl3CPY1PdjbhKHGW0l52OsfQBRKWVU0vOfv5WcewOZTCaWC6utWDfG3AdQKau6g3Uf/dPJncm4JBS3E4C2Mt1kBiFtAwFAlKRjiVYmFTIzm413ayBOJwBtBbrt5jo/gCoLOvDcyY+PJ+eSUDWirTS39b1c7gEQLysDDC9x8Lnl5syZMwzNnB9tZTmWdXC5B0B8Sbdzrezyko37JaFKRVs5bozZAyApVh/xf5P4szuX0n8SuHPnjueP1FaK28ET+koGgLiSuYu18kwz8m6n9BKqvUtC2spwyETr2ooFgKTQyjbNX07trZ2TgLYC3BitE0Ba+J2VbOfQv6f/JKD9cAc3egGkkXRb18o8TWpPAtqPdbTRvRNAymllnyZ1JwHtRzpk1D1tZQFA2sjcJFo5mC81JwHtxzkYshlArVnl48Gx5Z3fTf5JQPthDm3FAEAtWNdT/ObwloH/ndyTgPaDHNoKAYBa4mfSmUz2bmgPi2Wz2Sn7j9FF+xFu2ooAgFq0f7T4zeGwTgJVPwFoKwAAap1WXrqFcRKI/ASgLbhD+9EAgHlauelW7v2ASE8A2gI7tB8LAFhIKz/dyjkJRHYC0BbUof1IAIBOK0fdSj0JRHIC0BbQof04AEBhWnnqCLNnUFnRFs6h/SgAQHEHThQ+CZRzKSiUaAvl0H4QAMC/YnMOV+0koC2Mgxm8ACAcLZ3ew0ZU5VKQtiAOmQ5N+xEAgNI8pJS1jshOAjdv3lQ/WFsI0XyYSz8AEAWtzHXkXwq6ceNGxqv8Livalzu0hQYAlG9XgUllKnIpSPtix34mbweASLUVmF4y0hvCnW//Vv1SsdZaKG1hAQDhalbKYEdkJwHtyxzaQgIAwieTaGnlsJjKToZ/KWj74E/VLxNyXUpbSABANNYcqeClIO1LxIquOnXhAADR0spkUVIrIJvNqm9a0/MD9UuEtlAAgOjtPO49m1jgVoB2Arh266L64WILT/sCQFV5TS4fyr0A7YMd2sIAACpLK59FWfcCzn/+lvqhYvtgo7ogAIDKau3WbwiX1QrQPtChLQQAoDq0clqU1Ar49PbH6ocJufGgLQAAoDrW9eitgLvZieCtgB3H/039MKF9OQCgurTyWgRuBWgfInbz0BcAxNJ6j3GCArUCBt97Sv0QoX0pACAetHJb+G4FaG8Wm4/R7x8A4sxr9jBfrYBrNy+pbxbalwEA4kMu02vltyjaCtg7/HP1jcuts4r2ZQCAePEaLrroCUB7k5DhR7UvAgDEi9ekMQUvA8lYQNqbhPYlAIB40spxMTY39h27yF+Ylz7sVd+wpofZvgAgSR5SynLhOXfw2p4fqm/YN8LlHwBIkragTwZrLxbahwMA4ksq7lp5vu7oj8ycdhlIe7H0KdU+HAAQb1qZLrKzeXO/PP9ht/pC5vsFgGRadnhxmS4W3Qc4cGKp+kLtQwEA8bd1QJ8y8szVVxaeALQXCe1DAQDJoJXrT53aY+bm5u7fB9Be1Gw1H7QPBAAkg1a2r+r+m4U3grUX0f8fAJLN63mA3rHe+RPAjYnP1BdsG2DmLwBIsmUdi8t2kZ3NzN8HGH7/afUFB07oHwgASAavSWLuTRj/1zfa1RdoHwYASA7pyq+V71/cuTJ/AnjkhVb1BdqHAQCSo31UPwGMfXZ6/gSwffCn6gu0DwMAJItWvp+6dHz+BLCy6/vqC7QPAgAki1a+y9zvuROA9j+F9kEAgGTRyvenTx/kBAAAaaeV779/sY0TAACknVa+7x9exgkAANJOK9+fen3v/AlgaYfeTUj7IABAsmjle9+5J+ZPAJuP/Yv6Au2DAADJopXv96aGfPi5FvUF2gcBAJJj/2iRE8CfX9ulvkD7MABAcuz2GAri3gng6NnH1BdoHwYASI6NfQ1q+T7mzAdw6caY+oKdxxkOGgCSbEVnnVq+3zsBSLQXtPUyIQwAJJnXhDBFTwDLOurUDwQAJINWtt+7/u9Ee5HQPhAAkAxaub7oBLB14CfqC7UPBADEn9dkMAsu/0j6zv1RfaFMJqB9MAAg3lZ2+bgBLLk5+bn6wtYj3AgGgCRqVsp0segEINFeKLQPBgDEm1aeL7r+70R7sdA+GAAQXxs8HgDzPAH0nnlcfYN8kPYFAIB48tX/352JqXH1DUL7AgBAPGnluGftXzI1NaW+SRw4oX8JACBeNh0LePlHMj4+btYd/ZH6xtYeegMBQBJ4Xf6x8m27uNfz1uUX1DcK7YsAAPHhNf6/KHoCyGQy6hvFDkYHBYBYW3OkXi2/C17+cSIngCdO7lA/4KHDtAIAIM60slsUrf27o32AOKh8IQCg+rb0N6rltq/avzsPHdabES2dDBENAHGkldki8AngzSvPqx8k5CaD9uUAgOrw6vopAl3+caJ9kGCiGACIF62sFoFr/06G3n9a/UCxb4RhogEgDrzG/REl1f6daB8omukRBACxoJXRYio7WVrt38mrFwfUDxZ7hmkFAEA1rT+qd9gRZdX+nWgf7NAWCAAQvYMnIqz9Ozl77VX1C0RbL0NFA0A1eI35I0Kp/TvRvsChLRgAIDqFun2GVvt38vGN99UvEtwQBoDK0spiR6i1fyd7h3+mfpnYOsBAcQBQCcs79HJYRFL4O9G+0KEtKAAgPFLZ1spfkcneDffST35evdivfrFYap2VtAUGAIRDK3sdkdb+JTJc9Kruv1W/XKxh5jAAiEShXj+R1/6dZLNZdQEcm/vpGgoAYVrZWaeWt0Ir/KenpzP2H8PP0bOPqQvi0H4AACA4qVRr5awj8ks/WrQFcdN+CADAv/2jTWr56qjYpR8t2gK5aT8IAOCPVq46qlr4Sz69fUldMEezRftRAIDCtDLVUfXC38mJDzrVBXQwmTwABKOVpW5Vue7vld++uFZdSAeziAGAP1oZ6harwt/J0g7vJ9TEciaUB4CCtLLTLZaFvxNtgd1WdHESAACNVma6xea6v1eyMxl1wd1WdXMSAAA3rax0i33h7+Tm5OfqD3Bj3CAAmKeVkW6JKfydXPjsnPpD8mkrAwBqwb6Rwg95icQV/k7OXj2p/qB82ooBgDQrNryDSGzh7+TUpSH1h+WTyY21lQQAaSNzqWvloFviC393tB+Yb/dQk7qyACAtVh+pV8s/t1QV/k60H5pvQx9DSQNIJ+n8opV7brHu519utB+cj6EjAKTJrqHiN3tFqgt/J9oP1+w4zkTzAJJt7dHil3xEVQr/ycnJyK413blzx/OztRWgketl2koFgLjTyrR8qbzeL5GpI+0/ekZbIZr9o/oKBoC42TZQeFw0R01c8ikWbcVoNnKDGEDMrez2nrvXjcLfFW0Fedk7THdRAPGypd9frT+1l3zCiLbCNHKW1TYCAFSSXJ7WyiiNlW/ZRR3xirbivGw+xmUhANXR2uOvhw+1/hKirUgvMqiStoEAIGx+b/IKav1lRlupGrqMAojS/tEm03xYL3/yUesPMdoK9rLGapZpGw8ASnHgxJLclLZaeZOPgj/CaCvcy7qjnAgAlKely1/BL7jcU6FoK9+LDL2qbVgA8OK3P7+g4K9CtA1RCCONAijGz3DNDi73xCDahimEFgEAN5mQalWAGr+fgj/KcdaIEm1DFSIbnJnIgNolk1DJ8PNa+aAJUuPnBFClaBuuENkBmI0MqB1+h21wcKkngdE2ZDFb+rk8BKSV9AzUjnsv3NxNQbQNW4xM4nBQ2YEAJMue4SazIkBXTkHBn9JoG7uYjYw3BCSKPLglD4Rqx7OXzEyGyzy1Em0HKEYeAd82yDSVQFyt72tQj91CklDbv3z5csb+Iwkz2g7hhzQppWmp7YQAKkfu22nHaCGZWf+1fS4H1Ui0HcUP6U4qs/5rOyeA8EmhH6T7psPKN+3DnRA92o7jl+yU0sVM22kBlEau6csDnNoxV0yQQv/OnTvT1PjJvWg7VBBtvfW5nVfbqQF42z3cZLWug93IdWQDXOIhdrLZLCutQLQdLQi5VLTzOK0DwMvWgUazrCNYl00HhX6Z4QTgP9oOGJScEHbQqwg1TC6X+h1nX8M1/RDDCaC0aDtmKVZ2cUJAum3ubzBLO/T93y8K/YjCCaD8aDtsqaSrKc8dIKnaR5tyD1E2K/t2EFzaqVA4AYQbbWcul5wUpBbFjWXEyd7hJrO+t7Sumfko8KsUTgDRRtvZwyA3zTb2NZh9IzyLgOjJyLlBB1UrppzLOuPj41wWCiOcACob7UAIk9xkltYCJwaUQrphyix6LWXcpPUS1wLbPpnU5nMAnACqG+1AiYK0GOShml10Sa15MiHS9sHG3MBpMtaVtr+UKzs7nZhyhRMAiU20gylq0iVPhsKW/thyXVcrNJAscslm07EG02oV8ktL7GMfRHY2ueVITZ8ASPyjHXCVJjei5QnnbdZJgstL1SUDEsq4OGutwn1ZBJdqiklyYa+lFk4AY2Nj37H/SNIQ7cCMC7ncJI/zt1mtCrkfseM4Jw2NXIqRwlwux0htXVphK7vrQulVE5YwC/vJycnsyMgIN26rEE4ANRDtAE4iKQDlspTc0Jbr1HLvQgpIuUQlw2rIKKxyiUNuWEoBKpet9lonGDnJiHYx2mT258wPKiakwL1X+NoFsPP/5HXyenmfvF8+Rz5TPlu+Q+S+0yLfLyc1eaJV+rzLia71iFV4W60kqZGX2we+Wqx8w96VSIoyNTWV4QQQw0jT0/5jpNEOdtQuCvraCieAmKZSJ4BC0QoIpAMFPZHICcD+IyH+oxUqiJfZlN2QJeGHEwCJLFqhhHBRyJNiuXnzZuarr75iPyHzsc76c5lMRi4DfM3+p6qn+Zm6Oa2Aq3WVLuCtfWNG9g2H/c8k5qEmT2o+v0jgSYQaPCklly5dkgrct+2/EhJ9pqen52ZnZymwEpyZmZlZq+D4uv1XQvxHhoaYmJigaUhqJpOTkyYOPbLcsQrxuTt37uSOwzhdxiPBYpWlc1euXDHXr19nOxJSpchDqFLO8yBq8UxNTU3L+VAaglYYIqdWQyOA1EpoBCQ/1jack23oZ11lZ6bn7k6Pm1t3r5svxq+aq7c+Mhevv2vOf/6mOXvtVXP6ynPm5MeD5oUPe8zI2DOm/90/m54zfzCH3/y1+cvr7eaJk9vNf7+8wfzmhdXmwOhSs3vov8y2gZ+YDX3/06zp+YFp6fyeaX628sM0laKt7QGuFhJCCFkYGgGEVC/SCKjVyv9k5s7cF3c+MR9dP2feufqyefmjY+b4e38xnW8/Yv702k6r8t2aq3iv7/0ns7xziVq5BcIk/fms0GAipEoZHx+flgt2Vrg7UYnQCCCE5Ef6C9++fdu5Vfy16ZnM3PXxa+bCl2fM6csnzOj5w6br7d/lrpY//Nxys6X/f5uWru+pFSsA9607+iOzZ/hnps200dgghBBCSPi5detWriL/0afvm5MfDpvet58wT53cZ377/Dqz+/h/WZWRfzDNh5PRnQXAYq1H/t5sH/i/5lcnVplDh/6eEYIJIYSQtOby5xfmTl98wQye/at58uRec2BkqVnb80O1ggAAGnmeZefgf5hHX9psjrz1qHnlgwHzwbWz5pA5REOCEEIIqWSeef2Xc9IHfmPfj9WTNgBU08qu75u9wz/PPa8z8O6T5vl3j5pT516i4UAISX9kRJKpqSmenyCBI32AtZMqAKTV7qH/ME+9vtc8/0GXufDlWTM9MyXPF9FgIIQkLzQCiBbt5Id4a7Ys7XjQLOusMy2WlV11ZlV3vWk9Um/WHq03bZb1vQ1mY1+D2dzfYLb0N5ptg41mx/FGs2uo0arcNJm9w02mfaTJ7B9dYg6eWGIefg5BHbDW2/7RJrPPWo97rPW5y1qvO611vN1a11sHGq313mA2HWswG6zt0GZtj3XWdlnTU29WW9tpVXedWWFtt+XW9lvaUWceOqxva8Tfhr5/Mr9/ab3pO/eEeefqS+bm5Oc0FgghhMQj2okL4ZEKea4yblXspCIulb31VsVPKoBSGdxhVQqlgigVb6k0HlQqlEC5pFHiNEikMbLN2vekESiNQWmEOA0QaXxIA5KGR2XJ/Bx/fm2HeeVir/nizmUaCoQQQsqPdsKBt2Ud8xV2qRRJZV0qSnL1VipPUknXKlhArZM7RtLI2GU1MKRxu9Fq5EqDVxoWLVbDgkZFeaTb5aMvbTQj7z1jLt18n1mDCSGEzEc7adQa6QYjlQ252i5XNuVKu3RzkavsUjnhCjsQf9IFTRrc0j1NuqpJdynpxiZdpKRrlHbs40HT2vMD898vt5nj7z9lzn9x2kzP3JW7CTQUCCEkDdEK/jST/tBSoZer8XJlUfqqSwVBqzgAwF6rsS/d6+QCgNyFkDt63IGYJzOT/+nUTnPy0qD56u6XNBAIISSO0QrwpJMuNtItQK7Qy9U9eQC1na41AKpIujDJXQfp7ifdl9b2zD8T0VxjDYf2kf9nes4+asa+eNOMGLoZEUJI5NEK4ySRE6VcaWvrrc9dqZeTqXaiBYA0kAsXcqdBHqaWu5RycUMrG9NCZmx+9NXN5oWPeszn459w94AQQoJGK1zjTE5scoKTE52c8KQ/vXZCBAAsJiMxybNIMqiAPM8gzyppZW2S7Rr6N9Px9m/M21dfNrfHb5vp6WkaCYSQ2o1WUMaN3OqWMeKlci8nKu0EBgCoDGksyDMM0l0yDd2Q9o783PS/96T55NYFGgWEkHRGK/ziQLrnUMkHgHSQbpYysZwMWZzU0ZFaOr+b61Z08tJxM5G9U5HGwdTU1LRMgjo7Oyvf9y37nwkhxH+0Aq1a5CqRzPwqQ+ZRyQcAzDcSGnOjIcmIatq5I662DvzEdL7ziDn/xVsVaRgQQohntEKq0qQQlwdtZbQKKvkAgHJII8HpbqSdc+Lol8+vMM992G0mM+M0Dggh0UQrfCpBxq2WW7ty9YaHbgEAlSYXmWRCNuk+2hLzOwjLOprMn1/bbd779A1z6tQpuvYQQoJFK1iiJjNcygg78uCXVggDABA3cnFKLlLJxaq4Tra28/hPzeC7fzE3Jj43pwwNA0KIHa3AiArddwAAtUImepTn0lbGcNjTP7y80bx15YXc3QLnwWArNBAIiUPkgHTY/xRKtMIgCjJ2vkyKtZ+ZbgEAuEe6FsnDyXEawWj90X8yh08/Yi589q5V77h9r/5Bw4CQhEY70MMm/SPlSsduuvEAAFCS9ly3ovg8lNx8uN789fX95vKN83QhIiQJ0Q7ksDRbpM+jXN2nKw8AANGT5+TW9zVUfUhTeeD4mdO/NFe/+sgYGgWEVD/agRqGpR0P5kZB2D3M1X0AAOJELsTJBTmZC0c7h1fCiq7/YTrefMR8dusyjQJCKhHtQAyD3H6UAkUrbAAAQLzJHAdy8U4u4mnn+aitPvJ3pvvt/zZf3rnGcwSEhBHtQCuXPIgktxalwNAKEgAAkHzbBhqr9ozB2qM/NEfPPGbu3L1Bo4CkL1NTU6GO2uNEO5jKIQXAtkGu8gMAUMv2DjflBvJYVoVRiR5/Zav55OZ5GgQk+ZFhs8JqBGgHS6nkwJYDfC8z6wIAgCJk3h4Z0lurU0TlwHPLzLlrrzLqEKm9aAdEqWR2Qqn0y4yF2sENAADglzQKKvnA8daBfzGvfNRHg4CkN9qOX6q23obcLT3t4AUAAAiLDBpSqRmPV3Z/3wyc+7OZnc3SbYgkO9oOXoq1R+uZiAsAAFTVQYtMaNZSoUbBUyf3mmvXL9EgIPGPtgOXQibk2jXEg7wAACC+ZL6CTccazLIKTGT2zOmD5m52kgZBlMlkMpGMeJPWaDtqUCusFjWj9wAAgCRrH23KdVnW6jphaen8nhkee5YuQ1GERkDxaDtlUHK1n9l4AQBAWm3ul8nLortLsP34T83bV1+22gI8VBxKaATo0Xa+oGQUn/0n9AMFAAAgrXYcbzQru6NrEPz+xfXm6q2L5syZM9+2q24kaGgE3I+2kwWxvLMu91S9djAAAADUIpnLSAY90epOYeh86zdmenZaugvRICD+o+1MQcjsvDzUCwAAUNzBE0vMxmMNuXmPtHpVOVZ1/6157oMu5/kBGgREj7bz+CX9+5msCwAAoDzSgyKKBsGjL2822dkMjQEyH20n8Uv6te1i7H4AAIBIyLOUWh2sHBuP/U/z3meneHagFqPtEH7JOLgM5QkAAFA50ttCel1odbNydL/1B5Olq1D6o218v2QiDG2nBAAAQOXsPN6Ym19Jq6+V6pEX1tJVKM6ZmZkJPGqRtqH9kskuZCY8bQcEAABAdW3pD/f5gbU9PzSZ7F0aA0mOtmH9aO2pzw1bpe1oAAAAiJ+DlvUhz1RMYyBB0TagX3T3AQAASD4ZXUir65WKxkCMo20wv6RfmbYDAQAAILn2DDeZFZ3hPTtAYyBG0TaQH/Iwyf5RuvwAAADUgjVHwhlZaN3RH9EYqGa0jeLHuqP16o4BAACA9Atr3oFdQ/9pMjOMJlSxaBvBD+kbpu0IAAAAqD27h5rMQ0qdMag43hXIZrNTc3Nz37H/mtxoK9wv+vsDAACgkLQ1BlLRCNBWsh87qPwDAAAggLQ0BhLdCNBWqh/bBqn8AwAAoHTlNgaq3RBIZCNAW5F+0OcfAAAAYUpqYyBRjQBtxfmxuZ8JvgAAABCdchoDcXxwOBbRVpYfG5ndFwAAABVEYyCEaCvHj+WddepGAQAAAKK2a6ix5MZAzTcEtJXih0z9rG0MAAAAoJLW9ZQ+A3HNNQa0leAHs/wCAAAgbvaNlD7hWE00BJZ3LlF/fDF0/QEAAEDcbTrWoNZli0lUQ2BmZsYI+69Fo/1gPxjyEwAAAEmxf7TJrOqqU+u1xfhpDGSz2YxTD499w0H7kcXQ9QcAAABJtaW/wTQrddxiUtE9aMfg/1V/XDHM9gsAAICkk2cFWjqC3xVIdENA+0HFLO140Oy1Vpa2EgEAAIAkKmUEocQ1BJ7/sFv9IcWsPkL3HwAAAKTT5hIeGp7KTiajITD0/tPqDyhmQx+z/gIAACDddg+VNpRorBsDx849oS50Mdvp/w8AAIAasro7+HMCFWsIZLNZMzEx4WsI0O53fqcubCFLO+pyD0toKwYAAABIs/V9Me0eJI0A+48F88zph9WFLGRlF5N/AQAAoLbJfFhBuwfFomvQk6d2qwtXyKpuGgAAAACA2Ja0hsBjr2xWF6oQRgACAAAAFpJnZBPREHjslS3qwhTSSgMAAAAAUO04HrwhcDc7UbmGQP+7f1IXopA1PTQAAAAAgEJ2xrUh8NYnL6hfXsjaozQAAAAAAD92lTCXQKQNgc/vXDFLOxrVL/ayjgYAAAAAEMie4Rg1BHYP/af6hV5WMgoQAAAAUJJtAR8WDr0RkMlkzJ9e26l+mZfmww8yERgAAABQhvW9wSYUC60hIDMGD5x7Sv2SQmSYI+2HAAAAAPCvtbterW97CaUhcOnzD9UPL2RDX4P6AwAAAAAE0z7aZJYd1uvdXspqCGSzWfOX19rVD/bCZGAAAABAuILOIbC+9x9MJnvXzM2Nfceu2vvPJzc/Uj/Uy0NWC2X/qL7gAAAAAEq38Vjw5wPGSmkEPHFyh/qBXrYO8BwAAAAAEJWWjjq1Hu4lcEPgylcfqB/khW5AAAAAQLS29DeaZqUu7uXxVzab7GzGzM3N+WsIPPLiGvWDvMiEBtqCAgAAAAjPqq5gdwM+/OIdMzbm427A+c/fUj/Ay3pGAwIAAAAqYtdQsIeED4wuNZnsVPGHhJ8+fVD9AI08DKwtHAAAAIBorO0JNnfAl+PXit8NWH3k79Q3a7b0cxcAAAAAqKS9I02B7gYMjx0y2dms97MB73/2hvpGL+3WAmgLBgAAACA6QZ4N2Df6i8LzBvzl9X3qGzUrrC/WFggAAABAtDYFnDfgs9uXvbsErej6vvomzUYeCAYAAACqQnrkBOkSNPjeU3qXoHPXTqpv8MKwoAAAAED1rO723yVo9/B/6V2Cut7+nfoGzbIOugIBAAAA1SSD9AS5G3D77o3FXYIef3Wr+mJNaw8zBAMAAADVJD1zgjQCLt0YW9wIaB9pVl+sWd/L8wAAAABANR04sSQ3b5dWX9e8/cnLViOgd2EjYH3vP6ov1mzpb1QXBAAAAEDlLO/Q6+ua5z/sMrOzWWNX/+ejvdDLzuM0AgAAAIBqC/Jw8JEzf8iNEGRX/x944MbEZ+oLvexjkjAAAACg6tp66tX6uuZPJ3dYjYDM/UbA2Kdvqi/0clBZAAAAAACVtaHP/6RhB0eXmUx26n4j4MyHr6sv9NI+yp0AAAAAoNrWH/V/J+DXo2usRoDrToBEe6GXXUM0AgAAAIBqaw3wTEDHW48s7A4kWdPzA/XFmq0DPBgMAAAAVFtLh/9GwN3shBnLnzF499B/qi/WSN8jbSEAAAAAVIY8p/tQgCFC1UbAf7+8QX2xZi0zBgMAAABVJSN2BpkxWG0EPPvmr9QXa1q66tQFAQAAAFAZ2wcby28EnLw4oL7YC3MFAAAAANUjvXO0erpGbQA40d7gZXM/zwUAAAAA1XDwxBLz0GG9nq4p2Aj4/Utt6ps0q7p5LgAAAACoBhmts+yuQE5OXRpW3+TlgNUC0RYKAAAAQHTWHAmpK5Bkdm5GfaOXbYPMFwAAAABU0v7RJeHdBXDy6Cub1DdrVjBKEAAAAFBRMmeXVjfX+GoASE5fOaF+gBdmDwYAAAAqo300hLkBvLJ14F/VD/HCswEAAABA9NaFNSyolneuvqR+kJe2XkYKAgAAAKK083iIIwJ5pX2kWf0wL7uG6BYEAAAARGV1d51aD9eU1ACQnL16Uv1ALzwkDAAAAEQj1HkBCiWbzZrfPL9G/VAv63uZRRgAAAAI076RJrNUqXt7kQaAlW/b1fpguX37tjl9IdizAWIbowUBAAAAoVndFawbUMkNACcTExPmiVd3ql9QyN7hJvUHAAAAAPBvfa//0YBEaI2ATCZj9gz/l/olXng+AAAAAChPKc8BlN0AcCKNgC/Gr5plHU3ql3lZd5RhQwEAAIBS7BkOPilYaA0Ad4LOHSC29POgMAAAABDUyk7/zwGIyBoBkoF3n1S/tBAaAgAAAIA/B09YDYAADwKLSBsATh5/dav65YVsOkZDAAAAACjkgNUAWBGnOwD52T74U3UhCtlIQwAAAABQ7R9tMi0dMW4ASO5MfWU29v1YXZhCNvTREAAAAADc2keazPIOvf7sZSo7WdkGgJPMzF1Tyh0BZhUGAAAA5u21GgDLDuv1Zi9VawC4s3f4Z+rCFdJGQwAAAAA1ToYBXarUlQuJRQPAycMnlqsLWciaHuYRAAAAQG3acTzYRGAiVg0AJ799ca26sIUs76wz7aNN6ooBAAAA0kiek9XqxoXEsgHg5LFXNqsLXYy0hLQVBAAAAKRJa3e9Wh8uJNYNACdPntqtLnwxDCEKAACAtNot/f8DPgAsEtEAcHL07GPqjyimlecEAAAAkDKb+4N3/xGJagA4eefqS+qPKWYZzwkAAAAgJdb1BO/+IzLZu8lrADj56u6XZvOxf1Z/WDHbB3lOAAAAAMm0b6TJtHQGmwHYkegGgDuPv7pN/YHFrOiqMwdP6CsWAAAAiKNSRv8Rqan8SyYmJozoP/uU+mP9YJZhAAAAxJ1M/hV07H9HqhoA+fngi3fUH+3X7iGeFQAAAED8tB0tre+/SHUDwMn0TMbsHf6ZugL8kC5C2ooHAAAAKm3XUPCZfx01UfnPz9D7T6srw68t/Tw4DAAAgOpZ3lHag7+iJhsATmZms+ZXz69UV4xf2gYBAAAAorKxxAd/RU1X/vNz9tqr6kryq/kwjQEAAABEa+Ox0iv/ggaARw6/+St1hfm1tIPnBQAAABAuKv8VyJfj18y2gZ+oK9Cv5Z00BgAAAFCecrr9CCr/JeTFC0fVlRlECyMJAQAAIKByK/+CBkCZefSVzeqKDWJlN40BAAAAFEblP2aZyNw2+0b+n7qig2COAQAAAORbV8ZEXw4q/xHms9uXTdvRf1BXfFD7Rph9GAAAoJat6Cx9nH8Hlf8K5tyVU+pGKMX2QSYdAwAAqBU7j5c+w68blf8q5u1PXlQ3Sik29DWoOwoAAACST+p6Wh0wKCr/McpLF3rVjVSK1Ufq6SoEAACQEut6yu/vL6j8xzzaRivF0g66CgEAACTRnuGm3IAwWh0vCCr+CYy2IUsldwdkZ9J2MgAAAFTfgRNLTFsvXX6IK9rGLZUMIbV/lAYBAABAHGzubzDNSp2tFFT+E5CZmRlj/9F3tI1dDplQQtsZAQAAEJ0dxxtNSwjDewoq/gnL+Pi4uXv3bo79T4Gi7QSlWnr4QbN1gOcHAAAAorJ3uMm0HgnnIV9B5T+hKeVOgBZtpyiHPIQi489qOy8AAAD8O3hiiVkfUj9/QcWfqNF2lnJIg4ARhgAAAPxrH22i4k+qF20nKsdDhx80m47xDAEAAEC+XUORdPX5ll2tI6S0aDtXuWSUISYlAwAAtUqep1we0sO9Dir/JLJoO1y5VnXzHAEAAEg3Gcd/Q1943XwcVPxJxaPtiOVa1lFntvTTbQgAACSfTLa6pie8bj6CSj+JVbSdNAyt1oHDXQIAAJAE+08syT0DKRc1tXpNqaj4k8RE24HDsPZovdk9xLMEAACg+mQIT5mxN6yJu9yo+JPER9uxw9LWW5+71aYdmAAAAGGTB3plGHStXlIOKv0k1dF2+rA0H34wN64uow4BAICwyJxHMoiJVvcoB5V+UtPRDoqwLO140Gzsa8hNuqEd1AAAAPl2HG80q0Mcs9+t3Ir/xMTENA0HEquMj48b+49lRTtgwiRP6MvBrR30AACgtkjvgY3HGkIfr98R5tV+q641PTk5GdrnERLraAdUmOSgl4OfLkQAAKTfjsHG0IfsdKOLDyERRTvgwibDkkr/P63wAAAAyZC7yt8X3VV+QaWfkCpFOyDDtswqPGSGv73cLQAAILbkAl5rRH35RSY7RYWfkLhGO2ijIFcVZCSiXUPcMQAAoJLaR5rMlv6GyB7eFZmZDBV+QpIe7eCOihRIUjAxIhEAAOWTwTzWHa03S0OegTcflX5CaiDawR8lmTpcJjXbyahEAACoZOLPTccazMoIJuHKl5mlwh92Ll26lDlz5sy37b8SkpxohUTUVnXX56YaZ2QiAECt2D/aZLYNzI/QI5N8aufHMEVR4c9kMozV78rNmzdlJYfSALDWbWZ6WlZvOJ9HSEnRCpNKkOcN5M6BPOB04IReiAIAEGe7huZH5lkZwUy7mun5yv437VM4IYSEH63wqRSZtlwKVSlctUIXAIBKkTvZW+2r+jJLv3beClu2ApX9qampaZkEdXZ2Vr6LK/61lmw2G8oMuKT6qcS21AqqSnro8PxsyFv6G+leBAAIzcETS3LPtMmIeCsq0F/frRIVfkIWhUZAelLNbakVapUmDYRVR+pzcx3IKAt0MQIAuO0dnr+iL6PwtEQ4sZaGij6JXWgEpCdx3JZaQVhN0mdTrvLIdOo0EgAgXWTkHblTvLanPjdinXYeiBqVfZKY0AhIT5K0LbWCMw7kFjCNBACIp91D88Nrylw1cvdXK8crgYo+SUVoBKQnadmWWoEbFzLMm9xNkFGN5JayXHXSTlQAAP/kGS8ZKU66c0oFP+oJs/ygok9SHxoB6UktbEutoI4rGQJVHmKWq1bysJmMGa2d/AAgreRCiVwwkQsncgGlWSkrq4mKPqnp0AhIT2p9W2oFfBLkHmjurjfr+xpyJ0u53b2frkgAYkqu2svgC3KBQ/reV/oB2yCo5BNSIDQC0hO2ZeFoJ4gkkitpLV3zdxlkLoVtg/PdkniGAUBQ7VaFXu5UyqzucrVeLkhU64HaUmRnczOufsMu5knAME9AjYeKY3rCtiwv2gkmLeRugzz0vPbofPck6XsrDYf9o3rFAECyyBj3coVeJljcMjA/1r30rZduiVqZkATZ2SwV/IhDI4CQlIRGQPTRTlS1QBoRcstfKhUyvvZGqyEhXZfkCuJeq+LBXQigdO2jTblugNI4lyvyUoGXO33Shz5JV+WDoIIfj9AIICQloREQn2gnPcw3JuTKpNyVkAaF9CeWCo80KrZYlR+pBEnDQu5SSDcFGheIE7lzJo1eqbBLn3hpCG+29l0Z0UYax63W/rzKqrhLg1lGt4nbQ7CVQOU+WXEaATQAkh1rG2bGxsa+Y/+V1GJoBCQv1klzLv8kinAs7Zi/eyFXU6XBIVdWpaLWZjU6pNIm3aKk4SEVOafxIV0ppAEi3SpkNCcaIfEh3V2kEi6NQ5n1VSriu4Yac5VxeS5GJoiSq+jynIw0LNusbS3d31qtbS/93KXhuczaH6o5tnxSUbEnJL6xGnKZiYkJQyOgxkMjwF8mJyeNXPmw/5qYWCdjGgwAQkHFnpB0hEYAyYVGgL8ktREQNNaJnkYDUCNmqdQTUpORRoB17H/b/ishhJSXXzxTRwMCqCK7Uv91+5AkhBA1NAIIIbEKjQhgHpV5QkiUoRFACEl1mmlUoIrSWpH/6KOPZg4dOkQXIkIIIYQQ7mKkD1fjCSGEEEIIIYnKzMzM7I0bN2jIkJrJ+Pj4tAziYYX5CwghhBBCCCHEfx544P8DDJptN8zdIvkAAAAASUVORK5CYII=',
            type:'Image'
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]},
          {id:'pentagono' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,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',  
            type:'Image'
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]},
          {id:'RecAmarillo' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAxsAAAGSCAYAAACL/tzwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAoGSURBVHhe7d09bl3HGYBhnhF/YAlWlyqNkS6VN+dleBfZToxYjVzxGl6BAAkWJfGSJzIyVQpeXmDeSs/TzHe5gxffnOG2f3Xxf+7v7y9+/fU/F+/fv59/AQAAOM+YJwAAwFJiAwAASIgNAAAgITYAAICE2AAAABLb27dv9w8fPsyf//PXA1Xb/ubiw5//mH8BAAA4z/bLL//e3717N38CAACsMb7//vUcAQAA1hmXly/mCAAAsI4PxAEAgITYAAAAEtvhcLsfDof582mvX76ZEwDAN2ybJ3yj3v/545yednZs/POHn+YvAADgW/NXaPz2x8/z19NcowIAABJiAwAASJwXG+4nAgAAz2SzAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEDivNjY5wkAAHCCzQYAAJAQGwAAQEJsAAAAifNiY5snAADACTYbAABAQmwAAAAJsQEAACTEBgAAkBAbAABAQmwAAAAJsQEAACTOi419ngAAACfYbAAAAAmxAQAAJMQGAACQOC82tnkCAACcYLMBAAAkxAYAAJAQGwAAQEJsAAAAiXF392mOAAAA64ybm5s5AgAArDPG8J4tAACw3nnfbOzzBAAAOMEH4gAAQEJsAAAACbEBAAAkzosN35IDAADPZLMBAAAkxAYAAJAQGwAAQEJsAAAACbEBAAAkxAYAAJAQGwAAQOK82NjnCQAAcILNBgAAkBAbAABAQmwAAACJ82JjmycAAMAJNhsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJM6LjX2eAAAAJ9hsAAAACbEBAAAkxAYAAJA4Lza2eQIAAJxgswEAACTEBgAAkBAbAABAQmwAAAAJsQEAACTEBgAAkBj7vs8RAABgnXF/f5zjM+gSAADgmcbmH/UBAACBcXV1NUcAAIB1fCAOAAAkzosNV64AAIBnstkAAAASYgMAAEiIDQAAICE2AACAhNgAAAASYgMAAEiIDQAAIHFebOzzBAAAOMFmAwAASIgNAAAgITYAAIDEebGxzRMAAOAEmw0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgMR5sbHPEwAA4ASbDQAAICE2AACAhNgAAAASYgMAAEiIDQAAICE2AACAhNgAAAASYgMAAEiIDQAAICE2AACAhNgAAAASYgMAAEiIDQAAICE2AACAhNgAAAAS4+HhYY4AAADriA0AACAxrq+v5wgAALCObzYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgITYAAICE2AAAABJiAwAASIgNAAAgMY7HhzkCAACsMx4fH+cIAACwzri8vJwjAADAOmOMbY4AAADr+EAcAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEuPz589zBAAAWGd8/Hg3RwAAgHXGq1ev5ggAALDOuL6+miMAAMA6Y9/nBAAAsJDXqAAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEuPTp09zBAAAWGdcX1/PEQAAYJ3x1RwBAADWURoAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJMQGAACQEBsAAEBCbAAAAAmxAQAAJL7Gxj5HAACAdcb9/XGOAAAA67hGBQAAJMbV1dUcAQAA1rHZAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgITYAAAAEmIDAABIiA0AACAhNgAAgMTYtjkBAAAsNPZ9TgAAAAu5RgUAACTEBgAAkBiPjw9zBAAAWGccj8c5AgAArDNubm7mCAAAsI7XqAAAgIQPxAEAgITYAAAAEmIDAABIiA0AACAxtm1OAAAAC3mNCgAASLhGBQAAJMQGAACQEBsAAEBCbAAAAAmvUQEAAAmvUQEAAAnXqAAAgITYAAAAEmIDAABIiA0AACDhNSoAACDhNSoAACDhGhUAAJAQGwAAQEJsAAAACbEBAAAkvEYFAAAkvEYFAAAkXKMCAAASYgMAAEiIDQAAICE2AACAhNeoAACAhNeoAACAhGtUAABAQmwAAAAJsQEAACR8IA4AACRsNgAAgMQ4Hh/mCAAAsM54fHycIwAAwDrjxYsXcwQAAFhnfDVHAACAdbxGBQAAJKw1AACAxNj3OQEAACxkswEAACTEBgAAkBAbAABAwmtUAABAwmYDAABIeI0KAABI2GwAAAAJsQEAACTEBgAAkPAaFQAAkLDZAAAAEl6jAgAAEjYbAABAQmwAAAAJsQEAACS8RgUAACRsNgAAgITXqAAAgIRrVAAAQMJmAwAASPhmAwAASLhGBQAAJGw2AACAhG82AACAhGtUAABAwmYDAABIbLe3t/vvvx/mz6e9fvnm4u9/+9f8BQAAfIt+++PnOT1tOxxu98PhebEBAADwXF6jAgAAEr7ZAAAAEl6jAgAAEjYbAABAwjcbAABAYnz58mWOAAAA64y7u49zBAAAWGd8993LOQIAAKwzbm6u5wgAALDKxcV/AbzBpq2PSspSAAAAAElFTkSuQmCC',  
            type:'Image'
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]},
          {id:'RecAzul' ,offsetX:50, offsetY:50, shape:{
            source:'data:image/gif;base64,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AwAACCUyAACAUCIDAAAIJTIAAIBQIgMAAAglMgAAgFAiAwAACCUyAACAUCIDAAAIJTIAAIBQIgMAAAhVVWTM5HsAAIDZWMkAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABCiQwAACCUyAAAAEKJDAAAIJTIAAAAQokMAAAglMgAAABC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',  
            type:'Image',
          activity:{
              activity: 'Task', task: { type: 'Service', loop: 'ParallelMultiInstance' }
          }
          },
          annotations:[{style: this.styleFC2, verticalAlignment:'Bottom'}]
      },
      {
        id:'factor causal' ,offsetX:50, offsetY:250, borderColor:"#ACACAC", shape:{
            source:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAVoAAAHKCAYAAAE1MLOjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAC3eSURBVHhe7Z0H2BTFGcfBEiyxd0URSKLRWGNU7CiKoNjlgRgNGqMx9hKTYO/RKCj6WBJj7KhRiYoookYhKMYW0RhUeqhK/Rof8MHm5pj7vO/mv3dbZndnZv+/5/k9A9/tzs7Mvvfe3NzdbjuyCk+W1mBlg61pdKmxVjbY7Eb/61//qmys2Q0u4ESDhUaCGlrSSFBDyzUO1MhyjQI1sFKjQA1EZs/bb7+NGuanEaCGVTNzUKOqmSmoQbXMFNSgIGYGakwQMwE1JKjtC6YOakgY02P06NGoAWFNFdSAKKYGOngUUwEdOKqpPPnQgeOYOOigcUwUdMBYjho1SpRWkUyD33zzzdKo6CaxEU6ywYk0ulhxr169dFZeaqz2BpdXrLPy1joLaM3J5Y0Vxuaoo45aWSi011uismIdlSdRZxFUsTAuSp3//Oc/ddSrViyNA6qvZHReeeUVVGG5UUF1lYwFqrDcqKC6yo0MqqzVI488UpRhUeoBRgJVhAwLqqONUXMyrAwYmJ49e6L9/QwNqsTPoKB9/QwFqqCaQUH7Qj/55BNRBkapoIZBQPvVsjYjRoxAOwaxFmifWgYC7RjEWqB9glgTtFMQq4G2D2pV0A5h9ANtG8haORnuFEI/0LZh9AVtHNZK0DZhhaANo1gJ2iaUkydPFqWCsmFEK0HbRPFbXnrpJbRBHEugx6K6irq6OvRgXEugxyK5xhpriDLRBqO/x7KY4iZNmuRNmzYNOmXKFPj3sIonDfq7MOwxCg0ndozCBx98UIo1K7CyscY3uLyh1jXW6AZb01jUUKGRoIaWNIdx48ahBpZrFKiB5RoFamClRoAahjQC1DA/Mwc1ys9MQQ2qZqagBtUyfeRnYVHMBNSQoKYOakRQUwU1IIypghoQ1tRABw9rKqADh1Z+tz1xlAPHMDneeustdMA4Jgo6YFwTAx0sromQSMVRP0WvhfbG9unTp/QNJ+0kcdqSqLO1Um0V19fXt35v7OWXX9baYO2NLVBep556X3/99cpK9VScTJ1KpboqTqRepdLevXvHrVipUxoLVGHJOKD6an5KXgtYqTQSRxxxBKqr3MigysqNAqqn3EigiiqNAqqnVfn7+dAoFQHDgupABufVV19FFfgZBrQ/MhSoAj/DgPb3MzBoZ6h8dgdB2beGgUA71jIIaD9fg+ZcuHMNq3L44YejfYLoT2NjI9ohqNVA29e01ujCnQJaDbR9TcePHy9KX5QdQugH2jaMKnK2HlcE2i6MELRhWBFou7AqoI3CWgnaJoptQBtEtRz0eGgrswLcKKLloMej2gp6MKol0GNxLIIeiKsA/T2ys2bN8tqVfyOt2rfbwliovE295YY5RuU36kS9hLSGMNFMaWA5wDo5/vjjKwe2JNEAGlghiQka1HJJRNBgIkkY+vXrhwaxmiQEaACrSQKCBi+IpAZo0MJIEH379kWDFUUCQAMVVVIGGqA4EgkaHB3mm5NOOgkNik5zDRoQ3eYSNBBJmDvQICRpPjjhhBNQ59MwF6COp6WbLF++HHU2VY877jhROonS2YxM5GcgmSEjxiSdAnUwa50AdSxzjz32WFFajdIpw7Qz/x5zzDGoMyZqFy0tLd6KFSusaPjIkSOtG2CbosI75JBDrBng0sB68j4dJtPa1oJm59+jjz66vLElTcWmthZBDRYaxRtvvIHu8lHSSFBDyzUJ1L6iIX5ClxpKIyuVv2w3AaVtQDPyb5if6y1YsECUWaK0yc9av9BLC9i4KmbCqFGjquVZP7Nh2bJlqDFBTZX6+nrUhprKb7VngtKYoL722muiTBOlDSFMNz3I2xjFNS3QscOaKqgBUUwUuW6gy1RAB45jkqDjRfL0008XZaIoB42rvFddEijHiqtY7SuU+glwaZ846gYdQ5eJgA6kU52g+nWqFXSAJNQBqlerZ599tii1oFSeoHFBdSZlvPnvoYceiipN2qiguhJ16dKlooyMUmFKRgHVk4aRQBWlZVhQHal4/vnnizIUSiUZGBS0b6oGXp7MKM/6GQS0XxYGAu2YpdVA22cpRn6Jw0T9QNtm6sUXX+ybIuAOhohA22Vum8EVt+OU3zgx3XLQ4ya5ioTudZqEJdBjxumXHkjOENFAEoADq5tTTjmlPIcRjXBgE4IDmwDlg8rB1QgHVjfvv/8+GlQhiQka1JIkBmhAS5Io9O/fHw1mpSQCaCArJRFAA1kpCQkaRD9JCNAA+kmC8N5776HBqyUJABq4WpJqNDU1oUELIqlGzItdkiqgAQsqQWj6xJgA0ECFlQDQQIWVlPPuu++iQYoqKQMNUFRJGWiAokoEJ598MhqcuJICaGDiSgqggdFhrkEDostcgwZEl/lk7NixaDB0m0vQQOg2l6CBSML8cOKJJ6IBSMpcgQYgKfNBY2Mj6nzS5gLU8aTNBajjiSpvaOQuY8aMUTqdok6DOpyWTv9aEHU4Td3DkBsKOQnqaNo6mQ5QR7PQKVAHs9IpUAcz0ZnbDb799ttK5wzQCVDHstaJFzHUMRO0F3n7PlO1GtQhI3zrrbdEaS1KhwzTSlBHTNOuF7GMPiUIrbxRpz28+uqrSicM1h5GjBhhRYNbWlpWxr1sdNrY1Fg72tqnTx/RUFsG1qa2rmqsHGDTKbY1g1tqRaLYWKmxvPnmm5V3uTOa8oaa3tg2bTX90qRtGis1lTbtPOyww8xs68svv9ymoSUbGhpEaRS9evVS2ik1EtRQ74033hClaSjtlBqZDlBDS5oGamNJczjqqKNQA8s1CdS+co0CNbBVOfCmoLSvXPkZnTEoDQRmzuuvvx70Ds1GgBqGNAHULsXM57Ty5uthzIz58+cHvp94jx49RJkdo0aNUhpVw8zo3bt32Bu1ZwpqkK/yRGSF0p4aZpMOWlbdODeKWYHaUsv0qfK2sKry87C0UdoRxKxexGBjainv5Jw2SjuCOHr0aFGmjtKQEKaGXMSOY6qgBoQxTdDxA5t2OoCNCGlaoGMH9rTTThNl8owcOVI5eEQT58gjj0THjWIqoAOHVp6gpFGOG9FU0gE6cFSTBh0zqsnRs2dPdMA4Jgk6XhwTBR0wsvJEJYVyvDh++OGHokwM5YAa1E6CX8pLBHQgHSYBOk5sk5rTwoNpUjfoGLE988wzRamPV155RTmIZrUh1yKSVCvoADrVCapfp1rTATqAbnWB6tZtfA4//HBUcRLqANWbhPFYtGgRqjQR5QmMi1JvEn722WeijE6aAyuNC6ozKWOBKkzSOKD6EnPOnDmijIxSYQpGBdWVmKeffroow+P3fdcUjAqqK2kjgSpKwyigetIw0pwWVZSWYUF1pGVw5PfxszQsqI60DAWqIE3DgPZPza+++kqUgVEqyMCgoH3TNhBoxywMAtovdYOu08KdMzAIaL/UveCCC0Tpz/Dhw5WdMrYWaJ+srAraIUurgbbPzFrpAO6UodVA22dm+/btRanSvXt3ZWND9ANtm6krVqwQpYKyoSEi0HaZO336dFEqKBsaZCVoG1NsA9rAJCtB2xhh5YsY3Mggy0GPG+Nll10mynbtXnzxReVBQy2BHjPK+vp68Zsy/KCBlkCPGWXxPubTpk3z/Jw4cSL8u3Dq1Knw78LJkyfDvwujPlZocNW2RrVaP6ZMmQL/Lvzyyy/h34WiH6K9RDNdu3blwBJ7uOeee0rplhBrKAUtA5dYQXnAMnCJ2XTp0gUFbElCzOLuu+9GgVouIcaBArVSQowBBaifhGRL586dUWDWkpBsGDJkCArIoBKSCSgYg0pI6qBADCsh6bD99tujAIwqIcly1113ocCLKyGJgoIuroQkBgo4XRKil06dOqFA0y0herjzzjtRgCUlIfFoampCgZW0hMQCBVXSEhKN7bbbDgVUWhISjsGDB6NASltCQoGCKAsJCQQKnqwkpDrbbrstCpysJQQzaNAgFDCmSAgEBYtJEtIGFCQmSki7dh07dkTBYaok79xxxx0oMEyX5BwUFDZIcgoKBpskeWKbbbZBQWCbJC/cfvvtKABslbiOvOOMaxJXWbp0KTrhrkhco7Gx0dt6663RyXZC2TfiEjfffLNyoh2UuEJLSws6wa5KHAGdXJclNrPVVluhk+q0ss/ERm677TblhObIqrdAJwYib1Sddxm4loFOYh5l4NrAlltuiU5eLpVjQUzm1ltvVU5c3pVjQkxk2bJlygmjrXKaYCjoZNFvZeCaxBZbbIFOEi1TjhExgeuuu045QRQrx4pkieNfN0xKThMyBp0UWlsGbhZsvvnm6GTQAIqxK8DATZNbbrkFngwaXDmGJA2am5uVE0CjKe8pQZJE/GymUFC9cpqQFMuXL/c23XTT0kATDbRv337lZpttxvltUtx0002loCUaER86DBw4kOOqmyVLlpQyrCd/pEg0UBjLlYWiOK5yjIlGWoNWyAGOT+FNWGvAlslpgg7K5rGVkngoY7rhhhtyfhsXMY8tFFDOb6NT7YOZa665RpQkCkHuSyuDmoSgMGZoWtBG+d1kEgFlMJFcIA9OY2NjzYAtk9OEMGyyySZoEKtJgoHGDiqu4cv5bUBuvPFGOIjVlEFOqiA+RCgUobzhhhtESaoR52NaGewEUBibMNOCSplta4AGLbAy6EkZDQ0NcQK2JAMXsfHGG6PBiiJpCxqjUG633XaiJOXIuZMWZfCTAlU+mAktPz4vo/DypQxQXPkGopgIdEwLKuU0QYIGJ7byyZBL6uvrkwjYkvkO3I022ggNik7zChoLLXbu3FmU+UNcUv76669XBkS38kmRKyJ8MBPaXF4fbPHixcpAJKV8cuSCNBJBme1z84lZFheK+/rrr0XpNHPmzFH6nbTyR6buI76zWSiy0HVQnxO1a9eu7n8/Icvrbskni5NkmAg8ea9hN5k8ebLS4bS9/PLLRekUsk+ZOnv2bGczLuxw2tbV1YnSCWRfjNC5oN1ggw1gRzPUFVDfMnGHHXYQpRtce+21SgezVj6JrMbAROANGjRIlHaT5npsWOWTyUpMTARlWj9NQJ0yRvmksgqTE0FJa+e366+/PuyQgdoG6oNR7rTTTqK0B/GJ11VXXaV0xFTlk8sKLEoExfmtNT9FX7RokdIB07XhAhWyjbZpzTQBNd4GTQe12XiNn9+ut956sOEWaSqorVa4yy67iNJMLH35aqN80hmFA4nAu+eee0RpFjbOY6toGqiNNmrcNAE10mZNAbXNWo2Y386cOdP77ne/CxvogFmD2mS1Yn67cOHC7IJXXM3FhK/FJaV8MmaCw4nAe/jhh8VXGcWvhdNHZNlC4bpZgdrijLNmzfLkfY1TR2mMo6YNaoNzph606667rtIIx00LdGwn3XPPPUWZDjZ9r0CjaYGO7ayPPfaYKJNlwYIFyoFzZNKgY+bB5FYSeF/aokmBjpUbRWwlcm3hddZZRzlYTk0CdJzcuPfee4tSL1deeaVyoByrG3SM3Pnkk0+KUg/z589XDkC1gerOs9rmt6hyGh9UZ+6N/RHv2muvDSumReOC6sy93bp1E2U0rrjiCqVCqhgVVBeVPv3006IMTktLizd37lylIuprWFAdtELxo0gRi4V/B0aphPoaFlQHBQae36611lqwAlrVoKB9qY8HHHCAKKszcOBAZUca2FqgfWgNn332WVG2pXTpy2+++abNxjSSfqBtaXDbThPKrtdauSENrx9oWxpCMb+V90dbFbQdOnSAG9JIVoK2oSE9+OCDPRG0xTdnl1xyCdyIxrIEeoxGdOjQocFXFAghhBBz+NnPfiZeygixitIcjBDz+fDDD1vfNBT/QIjpiNtuFgoGLrEKBi2xB3kNVgYtsQoUtEJCjAUFrJAQ8zjllFNQsJZLiHGgQC2XEHP44IMPUJBWSog5dOnSBQUpkpDsCXk1dEKy5+6770bBWU1CMgcFZjUJyRwUmNUkJDt++tOfoqAMIiGZgQIyiISkz/vvv4+CMaiEpE/nzp1RMIaRkNRBgRhGQtJjyJAhKAijSEhqoACMIiGpgQIwioQkT//+/VHwxZGQxEGBF0dCkmPMmDEo6HRISDJsv/32KOB0SEhioIDTISH6ueuuu1Cw6ZQQ7aBA0ykh2kGBpltC9NCvXz8UYElISHwaGxtRcCUlIfF5++23UXAlKSHx2G677VBgJSkhsUGBlaSEROfOO+9EQZWGhEQGBVQaEhIZFFBpSUg4TjjhBBRIaUpIaFAgpSkhwRk3bhwKoiwkJBgZrM36SUhgUABlJSHVGTx4MAqcLCWkJihwspSQmqDAyVpCMH379kUBY4KE+IICxhQJacu7776LAsUkCWnLtttuiwLFJAlRQIFimoSsYtCgQShATJSQdu2am5tRcJgqIe3atbS0oOAwWZJ3Tj75ZBQYJksIDAzTJXnlnXfeQQFhgySvdOzYEQWEDZIcgwLCFkneuOOOO1Ag2CTJISgQbJPkDBQEtknywkknnYQCwEZJjkABYKvEdcaOHYtOvM0S19lmm23QibdW2R/iOMqJd0DiKrfeeis64S5IXGTp0qXoZLskcY0lS5agE+2SxDWOP/54dKJdkrjE8uXL0Ul2UeIKGdwLLCuJK2y11VboBDun7CdxBOUEO2z7gsRm/vjHP6IT67IMWgdAJ9Z1ia1YeE0DXTLb2ooB9wLLRNlvYinKCc2RxDbGjBmDTmSe5BTBJmbOnOltvvnm6ETmRtl/Ygs5+ti2lsy2tnDbbbehE5g75TgQS1BOYI4lpsOpgSKnCKaTg+/NhlKOBzEc5cRRZltjGT16NDphlEFrLltuuSU6YblXjgsxFOWE0VaZbU3D4WsaaFGODzEM5URRRWZbU1i2bBk6QVSVQWsKxx13HDpBtEI5TiRr6urqlJNDq8psmzVvvfUWOjHURzleJEu22GIL5cRQf+V4kYxRTgytKacIWfGHP/wBnRBaQzluJCOUE0IDy2ybNjm4SHKiyuv1kjQ59thjlRNBgyvHj6SMciJoaDlFSAuuzeqRa7YpkvdrGuhSjGMBZtuUgCeBRpJBmyRNTU3eLbfcggaeRlSOJ0kKEbSFguqX2TYp5s+fXxpkog9v7ty5HNMkWLFihXfUUUd5opR/IhoQ47n//vvzDVmCeM3NzQxajSxZsmRloRBjyqDVzT/+8Q8xsN4xxxzDoNVIYTyLQfvaa69xXHWz2WabFYNWSvRRHNMOHTpwipAArUErsy6JSWEcS1ODkgxaXdx8883lA+vJrEtiUvmrj6uvvprjqpE2gysl8VHGlVMEDcjvfSrK7EsiUhi/yqlBUa7OaKBPnz7KwJZJooPG0+vevbsoSUyUgS3Jb99Ho6mpCWbZMjlFiMqbb76JBrRVmYVJSArjVjVoX3/9dVGSKGy66abKgAJJeNA4tiquZ8s3ZNGBg1quzMYkIIXxqjU1KMmgDctNN92EBlJRZmMSkKC/+rjuuutESYLS0NCgDGI15fakBmHHlVOEEIT9srfMyqQGhXEKOjUo2tLSIkoShKOPPloZwACS2qBx87VHjx6iJAFRBrCWMjsTHxobG0Nl2TI5RajFG2+8gQaupjI7Ex8K4xMpaPmNugBssskmysCFkPiDxqumHTt2FCWpgTJwQZVZmlRQGJeoU4OSnCL4ceONN6IBC6zM0qSCil99hFaeF+KDMmARJCponELJNVtA4d0tHKywMiu0pTAecacGJRm0lYhrGhQKXZJvQeMT2iOPPFKUpAJloKIqs3buaWho0JVlSzLblpDf39SmzNq5pzAOWoN29OjRoiSCjTfeWBkgDRI8LpHt1KmTKMmCBQuUwdHhsGHDRJlbZP+1O2/ePFHmmxtuuEEZGB3K7J1bAv7qI7S8B9kqlIHRaJ5B46HFXK/Zhv1SclhlFs8dhX7rXjWoNL9B27t3bzQgus0jaBy0mffVGWVAdJu3n+LU19cnnWVL5ivbikAaNWoUGgjtymyeGwr9TSVox44dK8r8IIJ2o402UgYiKZcvXy5K55HX4UrFLl26eHV1deIJkg+SfgNW6auvvipK5xkxYoTS9yRdvHixKPPBlVdeqQxAkm644YaidB7Zz9QU36jL0/IXHIQklbfadxZ515/UzUXQFt7dws4n7TXXXCNKZ5FXhEndXFwboVevXkrHU9RlUH8Tt3///qJ0HqXjaSmzvHNk9epVprtTBHmvqsyUWd45Mn718t577z1Ruoe4/+oGG2ygdDhtHb0PrNLPNBVrti7fX1fpcNq6dmfCrF+9ynRvipDVu9tKXVuzTXtt1s9BgwaJ0jmUjmaoS6D+ZaJTa7Z1dXWwk1npylWuTXn1KtOdoJW/mTdNF0D9yswBAwaI0hmUDmatzP7WYtqrV0knpggjR46Encta26+YYuirl/fBBx+I0m5MWJutos2g/mTujjvuKErrUTpmivJVwDpMffUq094pwrXXXos6ZIzyVcA6DH/18gYPHixKa1E6ZKA2gvphlFa+IZM/xTBe+WpgDaa/epVpX9D27NkTdcRUbQK13zjPOOMMu7LtsmXLYEcM1iZQ+41UxIE1gSt//WqN8lXBeCx79fI+/vhjUdrB+uuvr3TAAm0AtdtYd955Z1Fag9IB07Xk2ghKuy3Q/OmB/NWrdcpXB2Ox9NXLGzJkiCiNR2m4RZoMaq8VGv1mbNGiRbDRtmjqtRFsffUq09ygPeKII1CDbdNEUDut8ayzzhKlsSgNtlATQe20SiOnCK+88gpsrG3KVwtjcOTVyxs/frwozWK99dZTGmqxJoHaZ5277rqrKI1DaajFmgRqn62aM0W4+uqrUQOtVb5qZI5jr17eAw88IEpjUBrogCaA2mW1mb8hmzhxojd16lTYOAc0AdQuq50/f763cOFC8e9smD59unf44YcrDXPILEHtsd5zzjlHlNkhgrZQuGyWoPY4oZgiZDZNeOSRR2CjHDJLUHuc8PPPP/dmzZol/p0+6667rtIgB80C1A5n3GOPPYpBm1W2hY1yzCxA7XDKGTNmpB+0V111FWyMa8pXk7RR2uGad911VyaZFjbGUdMEHd9JUw3aBQsWwEY4bJqg47tqekHbo0cP1ADXTQN0XGc977zzRJkaSgNyYBqg4zptKlOEl19+GR48B6YBOq7TfvHFF6JMlpyszfqZJOh4zrvXXnuJMnGUA+fIJEHHy4vJTBEaGxu93/72t+iAeTJJ0PFy4UMPPeSJ+EpqfgsPmjOTAB0nVyYSsOJ7kIWCJgM6Tt7UH7SHHXYYOlAeTQJ0nFx54YUXilI7yoFyrE5Q/blU6xRh+PDh8CA5Vieo/lwqfr5VKPWwzjrrKAfIuTpB9efSffbZR5TaUA5AtYDqzbVapghXXHEFrJxqAdWba4cOHSrK2CgV06I6QPXm3ljZdt68ebBS2mocUH10ldGD9tBDD0UV0m+NA6qPFrzoootEGRmlQqoYBVQPLTPSFOGll16ClVHFKKB6aJlTpkwRZXBaWlq8tddeW6mIQqOA6qFl7rfffp6Iw0AZd8WKFZ6w8E8a3DCg/Slw+fLlpViszcCBA5UKaFXDgPanwGeeeUaUgVEqoFUNA9qfAldfffVg04NvvvkGVkBrGgS0H61u7aDt3r072pHWNghoP1rFSy+9VJQ1UXakgQwC2o/WsOoU4cUXX4Q70cBWA21PAzhz5kxRYtZaay1lBxrKaqDtaQAPPPBAUfqi7EBDWQ20PQ0onCL8/ve/hxvT0CLQdjSEzz33nChF9LYJXmVDGkkE2o6G8Dvf+U4x2zY3N4v/t2s3d+5cZSMaWQTajob326A95JBDKh+k8SwHPU4jePnll3utQVtA2YDGshz0OI1oa9BOmzbNi+KECRPg32s5efJk+Pdaiu9Yor/XUuwnboeKHqtl1LaKcY2yb5y2Rh2fqH2cNGkS/HsQxXVp0d9rWepjMXAJIYQQkmNeeOGF0rSWEEKIbsSnCB06dCglWiZbQgjRzcEHH1yeZJlsCSFEJ7/73e9QkhUSQgiJy9///neUYMslhBASFbEuK77yXfhnLQkhhETBZ13WT0IIIWGIeJd7QgghQQiwLusnIYSQWsyZMyfouqyfhBBCqnHQQQeh5BlWQgghiIjrsn4SQggp59FHH0XJMo6EEEJKiMvrrbnmmihZxpUQQohA07qsn4QQkm/E5ecLRdISQkg+GTZsGEqKSUkIIfli9uzZSa3L+kkIIflC3kI8bQkhJB+ktC7rJyGEuM3zzz+Pkl/aEkKIm4h12TXWWAMlvrQlhBA3yWhd1k9CCHGL3/zmNyjZZS0hhLiBIeuyfhJCiN3MmjXLlHXZahJCiJ00NjZ6++23H0pspkkIIfaxYsUK77LLLkNJzVQJIcQunnvuOZTMTJcQQuxArMuuvvrqKJHZICGEmM8BBxyAEpgtEkKI2Vi2LusnIYSYiaXrsn4SQohZzJgxw+Z1WT8JIcQMxPdl999/f5SoXJAQQrKlqanJu/DCC1GCckVCCMmWJ598EiUn1ySEkGyYOXOmt9pqq6HE5KKEEJI+Dq/L+kkIIelx6aWXokTkuoQQkjwtLS3eM888g5JQXiSEkGSZOnVqntZl/SSEkOSw5PqyaUgIIfrJ6bpsNQkhRB9/+9vfUKLJu4QQogdxHYP27dujREMJIUQHXJetKSGEROeSSy5BiYWqEkJIeLguG0pCCAnH//73P67LhpcQQoLTrVs3lEhobQkhpDZcl40tIYT4k/PrGOiUEEJUxLpsoaB6JIQQFa7LapcQQlbR0NDgnX/++ShR0PgSQgjXZVOQEJJnpk+fjhID1SshJM/su+++KDFQ/RJC8sjFF1+MEgJNTkJInnj66adRIqDJSwjJA1yXzVRCSB7gumzmEkJc5qKLLkJPfJq+hBAX4bqscRJCXGLatGnoiU6zlxDiCvvssw96ktPsJYS4ANdljZcQYjNPPfUUemJT8ySE2MbixYu9zz77DD2hqbkSQmxh6dKlxSct12WtkxBiCyLRXnjhheiJTM2XEGI6jY2N3uOPP46ewNQeCSGmsnz5cm/ChAnoiUvtkxBiIiLR7rXXXuhJSy1TnkdCiGnwvl/OSQgxiaFDh6InKrVfQogJTJ06FT1BqTu2L0gIyZK9994bPTmpI8rzy2RLSFZccMEFyhOTOikTLSFZwHXZ3MlkS0iaTJkyBT0Rqfsy2RKSFj/5yU/Qk5A6rjzvTLaEJA3XZfOtPP9MtoQkwezZs7377rtPeeLRXMpES0gScF2WVshkS4huuC5Ly+V6LSGa4XUMKFLGBZMtIXF58sknlScYpWUy0RISh8mTJ6MnFqWVMtkSEhVeX5YGUcYJky0hYeG6LA0j12sJCckTTzyhPJEoraWMGyZbQmrBdVkaUyZaQmrBdVkaR67XElKD8847T3niUBpWGUdMtoRUwnVZqlOu1xJSwaRJk5QnCqUaZKIlpLm52RPuueee6ElCaSxlXDHZEsJ1WZqkXK8luefxxx9XnhiU6lbGGZMtyR9cl6Vp+tVXX3kFmGxJvvjxj38MnxCUJqGMNyZakh/OPfdc5YlAadLKuGOyJe7DdVmapVyvJc4zceJEJfApTdsvv/yS67XEXfh9WWqC/H4tcRauy1KT5HotcY7HHntMCXRKs1bGJZMtsZvGxkaP67LUZLleS6ymqanJE4mW67LUZEV8Ll26lMmW2MeKFSs8kWjPOuusysAmxAjat2+/slAU4/JXv/qVKJloiV0sXLjQu/fee71hw4Z5w4cPLyofIsQYCnG5UsTmCy+84A0aNIjJltiFWPcqFKUZLSFGU5jRFme3n376KZcQiD3ssccexUQrlJ/sEmIkhfhsXULo1KmTKJloifn8+te/bk2yJcWVkwolIUZReOe1crXVVmsTq6eddpoomWyJuTz66KNtgraknOESYhR77rln62y23AcffFCUTLbEPOSs1Vc50yXECArxCJNsyQkTJnC9lphH+bqsn3LGS0imFOKwapIVdu7cWZRMtMQczjnnHCVQ/eR6LckStC7r54ABA0TJZEuyx29d1k+u15Is8VuX9fOhhx4SJZMtyY7S92XDKmfAhKRKIe5CJdmSvB4CyZTdd98dBmYQuV5L0iTIuqyfXbt2FSUTLUmfMOuyfsoZMSGJ8sUXXwRel/Xz9NNPFyWTLUmPRx55RAnEKMoZMSGJsscee0SezZb717/+VZRMtiR5oq7L+sn1WpIkUddl/RTXV+Z6LUkMcdlD4a677goDMI7ilzil+gv/JyQWjY2NK0UsyV94aVWs1zY0NDDZkuSQ1+1MxC+++EKUhGhhwoQJsddl/TzjjDNEyURL9KNrXdZPrtcSnehal/VTPh+YbIk+5GwzceWMmZBYlK4vm7STJk3iEgLRx2677QYDLQnlTIGQSBTiJ5UkK9xhhx1EyURL4pPkuqyfXK8lUUhyXdbPM888U5RMtiQ6Dz/8sBJYaShn0ISEYvfdd09tNluuvIsIky0JT1rrsn5yvZaEIa11WWT79u29KVOmcL2WhCfNdVk/5YyakKoU4iSzJFtSfmuGiZYE5+yzz1YCKSu5XkuqkcW6rJ/yrs9MtqQ2Wa3L+sn1WlKNrNZl/Xz88ce5hECqI+6TVCiMU86wCWlDIS6MSrJCMbueOnUqky3xJ4nrGOiS67WkHBPWZf3s1q2bKJloiYpJ67J+yhk3yTn//e9/jVmX9VN+a4bJlnyLvM6m8coZN8k5u+22m7Gz2XK5XkuKrFixwvv8889hkJiq+GRXtLvwb5IzWlpaVspP9q1wjTXWKK7Xinhlws05Jq/L+iln4CRnFM67FTPZcg888EBRMsnmGZtmB5VyvTZf2LAu66e8iwiTbR6xZV3WT67X5gtb1mX9fOKJJ7h8kDcKswMYDLYpZ+TEcQrn2eokK1xzzTW9GTNmMNnmgZaWFnHS2+2yyy5KINgq12vdxsZ1WT8POuggUTLRuoy4oZxItDavy/opZujLly8X/yYOIc6rreuyfp577rmiZLJ1kWXLlhXv3PmXv/xFOfEuKGboTLRu0dzcXDyvhX8659ChQ736+nouI7iGSLQfffQRPOmuKK5039jYKP5NLEckoV/84hfKOXbFDh06eF9++aUnXkyYbB1CJNqdd94ZnnSXvP/++72lS5eKfxNLEV/uv++++5Rz65ri+7VNTU1MtC7h8uyg0vHjx4uSWMp//vMf5Zy6qvh+rfjchMnWAR566CF4kl31Rz/6kSiJpcjzlxufeuopJlrbse06Brr85S9/KUpiGfK85cq11lrLmz17NpOtzeRtdlCunMkTS8jbO69yu3fvLkomWpsQd+MU9uvXTzmheXPUqFGiJIYjz1OuHTBgQPF5y7vpWoSr35cNK9dr7SDP77zKfeaZZ5hkbSGv67J+cr3WbPK4LuvnOuus482dO5fJ1gY4O1CVM3xiGHznpXrYYYeJkonWZMSvowoFBcqZPjEEvvPy96KLLhIlk62JcHZQXa7XmgXfeVX32Wef5RKCaeTp1zRxlDN+kjF851Xbdddd1/v666+ZbE0iD9cx0CXXa7OF77yC26NHD1Ey0ZoAZwfhle8ASMrwnVd4L774YlEy2WbJgw8+qJwYWlv5DoCkDN95RfP555/nEkJWcHYQT67XpgvfeUV3vfXW8+bNm8dkmwWcHcRXviMgCcN3XvE94ogjRMlEmyZ5ur5s0nK9Nln4zkufAwcOFCWTbRpwdqBXrtcmC9956XXYsGFcQkiKRYsWecJx48bBwafxPPXUU0VJNCPHlWpUrNeKK3yJfMCEmxA77bQTHHwaX67X6oXvvJKzZ8+eomSSTQKuy6Yi0QcaX6rJa6+9ljNa3fz5z3+Gg031Kt8xkJjwnVc6vvDCC0y2uvjss8/gINNklO8cSET4zis9N9xwQ2/hwoVMtjrg7CB95TsIEhK+80rfXr16iZKJNg5nnHGGMrA0NUl40DjShOV6bQw4O8hWrteGg++8svXFF19ksg3Lp59+CgeTpqt8R0FqwHde2bvRRht5ixcvZrINww9/+EM4mDQTSW3QuNGU7d27tyiZaIPA2YGREn/QeNGMvO666zirrcWf/vQnOHg0W+U7DFIB33mZ6fDhw5ls/eC6rNlyvRaijBPN3k022cSrq6tjsi0hLgwh/8nZgR2Sb0HjQw3x6KOPFiUTrUBcNX3ZsmXegAEDlIGixkrwuFDDFN+vbW5uLuaY3M5up0+fXrzUGddl7TLv67V852WXI0aMyG+SbWxs9ESifeedd+DgUOPNM2g8qKFuuummXkNDQzHZzp49e2Wukm4p0f7gBz+Ag0OtMI+gcaCG26dPH1EWE+2sWbPyM8MVibZv377KgFDrzBOo/9QSb7zxRm/OnDlerhLt3XffDQeDWmeeQP2nFjl06NBiol26dKn7yXb8+PFwEKi15gHUb2qZYr120qRJ+Ui0O+64IxwEarUug/pLLVXcb2zJkiVuJ1p+X9ZpXQX1lVrs9ddf726ifeCBB2CnqTO6COondcCRI0e6l2y5LpsbXQL1jzriFlts4d4Swg477AA7S53UBVC/qGMed9xxonQj0XJdNne6AOoXddBbbrnF/lnt/fffDztHnddmUH+ow44aNcreZPvvf/8bdormRhtB/aCOu9VWWxWv8mVNshU/rS35/e9/H3aK5kYbQf2gOfCYY47x6uvrW/OXFUmX67JUahOo/TRH3nrrrfbMarkuSyu0AdRumkNHjx5tfrL95JNPYONp7jUZ1F6aU7feemvz78jA68tSH00GtZfm2BNPPFGUZiban//850qDKS3TRFA7KfVuu+0282a1XJelATUJ1D5KWx0zZow5yZbfl6UhNAnUPkpb7dixo9fS0mJGsuW6LA2pCaB2Uap48sknizLbRMt1WRrRLEHtodTX22+/PbtZ7X333QcbRWlAswK1hdKqjh07Nv1ky3VZqsEsQO2gtKbbbrutKNNNtLyOAdVkmqDjUxrYvn37ijKdZHvaaacpDaA0hmmAjktpaO+4447klhAWLVrkCQcNGgQPTmkM0wAdl9JIvvbaa8V8WFJr4v3444/hQSnVYJKg41Ea2U6dOokymVkt12VpwiYBOg6lse3Xr58o9SZbrsvSFEwCdBxKtTh48GB9ywb33nsvPAilCagTVD+lWh03blz8ZMt1WZqBOkD1Uqrd7bffXpTBEm1dXZ3YWOF73/tem0opTck4oPooTcz+/fuLsnayRYn21FNPbVMZpSkaB1QfpYl655131l5CqEy0XJelBhgFVA+lqfjee+9VT7blifajjz5SKqA0I8OA9qc0Nbt06SLK1kRbX1+/sk3iLU+0XJelBhkGtD+lqXrKKaeIsphcRaJtbm7+dpZbSrRcl6UGGgS0H6WZOGTIkGJyhYn2nnvugTtRaoDVQNtTmqnvv/++19DQ4LVJtOImZKUNKDVUP9C2lGZq165dPTGBbZNo999/f++ggw5KzQMOOMDbd999vbSOe+CBBxaPiR5LSnG8LI4p+ooeS8I0x7UYqBWg7XSbVexkcR7TPGbaxxN269ataFrHFdevFVf3WrJkSTHhtps1a5Y3f/58b8GCBak4e/Zsb+LEid6MGTPg47r95ptviscUJXpct2Is58yZUzwmejwJS338+uuv4eNJKPooTDN2RMxMmjQptbGdO3dusY/z5s2Dj+tWHEc8H8Vx0eNJKI6V5vNDKPqYZqwKp06d6k2ePDm144oxFWO76vmxwPs/HIWNJuYTFpIAAAAASUVORK5CYII=',
            type:'Image',
        
        },
        annotations:[{style: this.styleFC, verticalAlignment:'Top',offset:{x: 0.5, y: -0.4}}]
    },
      
  ];
  Imag:string;
  public palettes: PaletteModel[] = [
  { id: 'Bpmn', expanded: true, symbols: this.bpmnShapes, iconCss: 'shapes', title: 'Bloques' },

      // { id: 'flow', expanded: true, symbols: this.flowshapes, iconCss: 'shapes', title: 'Flow Shapes' },
      { id: 'connectors', expanded: true, symbols: this.connectorSymbols, iconCss: 'shapes', title: 'Connectors' }
  ]

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
      return { fit: true };
  }

  public getSymbolDefaults(symbol: NodeModel): void {
      console.log(symbol.id);
      
      if (symbol.id === 'factor causal') {
        symbol.width = 30;
        symbol.height = 40;
    } else if (symbol.id === 'pentagono') {
        symbol.width = 100;
        symbol.height = 100;
    } else {
        symbol.width = 200;
        symbol.height = 100;
    }
    symbol.style!.strokeColor = '#757575';
  }

  public onUploadSuccess(args: { [key: string]: Object }): void {
      let file1: { [key: string]: Object } = args['file'] as { [key: string]: Object };
      let file: Blob = file1['rawFile'] as Blob;
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = this.loadDiagram.bind(this);
  }

  public loadDiagram(event: ProgressEvent): void {
      this.diagram.loadDiagram((event.target as FileReader).result!.toString());
  }

  public onClicked(args: ClickEventArgs) {
    console.log(args);
    
    if (args.item.text === 'New') {
        this.diagram.clear();
    } else if (args.item.text === 'Load') {
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click();
    } else if (args.item.id === 'palette-icon') {
        showPaletteIcon()
    } else {
        this.download(this.diagram.saveDiagram());
    }
    }


  public download(data: string): void {
      if (window.navigator.msSaveBlob) {
          let blob: Blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
          // window.navigator.msSaveOrOpenBlob(blob, 'Diagram.json');
      } else {
          let dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
          let a: HTMLAnchorElement = document.createElement('a');
          a.href = dataStr;
          a.download = 'Diagram.json';
          document.body.appendChild(a);
          a.click();
          a.remove();
      }
  }


  changeText(evento: any){
    try {
        console.log(evento);
        // console.log(evento.element.properties.id);
        // console.log(evento.newValue);
  
        if(evento.element.properties.id.includes('factor')){
        // console.log("ok");
  
        let x = this.listFC.find((x)=>x.nombre == evento.oldValue)
            console.log(x);
  
        if(x!=undefined){
          this.listFC.forEach(element => {
            if(element.id===x.id){
              element.nombre = evento.newValue;
            }
          });
        }else{
          this.listFC.push({id:this.listFC.length+1, nombre:evento.newValue});
        }
  
        console.log(this.listFC);
        
        this.datosFC.emit(this.listFC);
        }
    } catch (error) {
        console.log("error",error);
    }
  }

  loadFC(){
    console.log(this.dataFlowChart); 
    console.log(JSON.parse(this.dataFlowChart.flow_chart).nodes);
    let y = JSON.parse(this.dataFlowChart.flow_chart).nodes;

    y.forEach(element => {
        if (element.id.includes('factor')) {
            console.log(element.annotations[0].content);
            this.listFC.push({id:this.listFC.length+1, nombre:element.annotations[0].content});
        }
        console.log(element);
        console.log(element.id);
        // if (element.id) {
            
        // }
        // this.listFC.push({id:this.listFC.length+1, element});
        
    });

    // this.listFC.push({id:this.listFC.length+1, nombre:evento.newValue});


  }

  saveDiagram(){
    // console.log(this.diagram.saveDiagram());
    this.diagramSave.emit(this.diagram.saveDiagram())
  }

  exportImg(){


    // this.compressImage(img.src, 100, 100).then(compressed => {
    //     console.log(compressed)
    //   })
    this.captureService.getImage(this.screen.nativeElement, true).then(h=>{
        let printOptions: IExportOptions = {};
        printOptions.mode = 'Data';
        printOptions.region = 'PageSettings';
    
        var img = new Image();
        img.src =this.diagram.exportDiagram(printOptions).toString(); 

        this.compressImage(h, img.width, img.height).then(resize => {
            this.imgDF.emit(resize.toString());
            console.log(resize.toString())
          })
    })
    // console.log('export')
    // this.captureService.getImage(this.screen.nativeElement, true).then(h=>{
    //     let printOptions: IExportOptions = {};
    //     printOptions.mode = 'Data';
    //     printOptions.region = 'PageSettings';

    //     var img = new Image();
    //     img.src =this.diagram.exportDiagram(printOptions).toString(); 

    //     var img2 = new Image();

    //     var resizebase64 = require('resize-base64');  
    //     img2.src = resizebase64(h, 500, 500); 
 
    //     console.log(img.width)
    //     console.log(img2.width)
    //     console.log(img.src)
    //     console.log(img2.src)
    // })

    }
    // startTimer() {
    //     console.log('timer')
    //     this.timeoutID = window.setInterval(() => { this.exportImg() }, 5000);
    // }
    compressImage(src, newX, newY) {
        return new Promise((res, rej) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            const elem = document.createElement('canvas');
            elem.width = newX;
            elem.height = newY;
            const ctx = elem.getContext('2d');
            ctx.drawImage(img, 0, 0, newX, newY);
            const data = ctx.canvas.toDataURL();
            res(data);
          }
          img.onerror = error => rej(error);
        })
    }
    exportDF() {
       
            let printOptions: IExportOptions = {};
            printOptions.mode = 'Data';
            printOptions.region = 'PageSettings';
        
            // var img = new Image();
            // img.src =this.diagram.exportDiagram(printOptions).toString(); 
    

            this.imgDF.emit(this.diagram.exportDiagram(printOptions).toString());

    }
    svg(){
        // svg = this.diagram.exportDiagram(options);
        let printOptions: IExportOptions = {};
        // printOptions.format='SVG';
        printOptions.mode = 'Data';
        printOptions.region = 'PageSettings';
        // this.diagram.print(printOptions);
        var svg=this.diagram.exportDiagram(printOptions);
        // this.svg2=svg.toString()
        console.log(svg)
        // console.log(JSON.stringify(svg))

    }
}
//   goInactive() {
//     this.expired = true;
//     this.intervalID = setInterval(() => this.countInterval(), 50);
//   }


function paletteIconClick() {
  throw new Error('Function not implemented.');
}

function showPaletteIcon() {
  throw new Error('Function not implemented.');
}

declare global {
  interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}
