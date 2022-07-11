import { NgxCaptureService } from 'ngx-capture';
import { FactorCausal } from './../../../entities/factor-causal';
import { Component, ViewEncapsulation, ViewChild, Inject, Output, EventEmitter, Input } from '@angular/core';
import {
    FileFormats, DiagramComponent, Diagram, PrintAndExport, IExportOptions,BasicShapeModel,NodeModel, UndoRedo, ConnectorModel, PointPortModel, Node, FlowShapeModel, MarginModel, PaletteModel,
    SymbolInfo, DiagramContextMenu, GridlinesModel, SnapSettingsModel, ShapeStyleModel, TextStyleModel, BpmnShape, HtmlModel, IDragEnterEventArgs, SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { AsyncSettingsModel } from '@syncfusion/ej2-inputs';
import { ClickEventArgs, ExpandMode, MenuEventArgs} from '@syncfusion/ej2-navigations';
import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';

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

  
  styleFC: TextStyleModel = { color: 'red',bold:true,  whiteSpace:'CollapseSpace', strokeWidth: 1, };


  constructor(
    private captureService: NgxCaptureService
  ) {​​​​​​​
      
  }

  ngOnInit() {
    
    setTimeout(() => {
        this.precarga=true;
        
        setTimeout(() => {
        this.diagram.loadDiagram(this.dataFlowChart.flow_chart)
        console.log(JSON.parse(this.dataFlowChart.flow_chart));
        
        this.loadFC();
        
        }, 600);

        
    }, 600); 
     
    this.exportImg();
  }
  ​​​​​​​
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


  public bpmnShapes: NodeModel[] = [
      
          {id:'muroAzul' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
          +  ' <path style="fill:#2E76B7;" stroke="#000000" stroke-width="0.1" d="M 0 0 L 21 0 V 9 H 0 V 0 H 0 M 0 3 H 21 M 0 6 H 21 M 7 0 V 3 M 14 0 V 3 M 7 6 V 9 M 14 6 V 9 M 4 6 V 3 M 11 3 V 6 M 18 3 V 6'+
          '"/>	</g></g>',
          type:'Native'
          },},
          {id:'muroRojo' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
          +  ' <path style="fill:#E52320;" stroke="#000000" stroke-width="0.1" d="M 0 0 L 21 0 V 9 H 0 V 0 H 0 M 0 3 H 21 M 0 6 H 21 M 7 0 V 3 M 14 0 V 3 M 7 6 V 9 M 14 6 V 9 M 4 6 V 3 M 11 3 V 6 M 18 3 V 6'+
          '"/>	</g></g>',
      type:'Native'
          },},
          {id:'muroVerde' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
              +  ' <path style="fill:#93C34F;" stroke="#000000" stroke-width="0.1" d="M 0 0 L 21 0 V 9 H 0 V 0 H 0 M 0 3 H 21 M 0 6 H 21 M 7 0 V 3 M 14 0 V 3 M 7 6 V 9 M 14 6 V 9 M 4 6 V 3 M 11 3 V 6 M 18 3 V 6'+
              '"/>	</g></g>',
          type:'Native'
          },},
          {id:'ovalo' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
              +  ' <path d="M10 0C19 0 20 3 20 4 20 5 19 8 10 8 1 8 0 5 0 4 0 3 1 0 10 0" stroke="#70AD47" stroke-width="0.3" fill="#94C24D"/>'+
              '</g></g>',
          type:'Native'
          },},
          {id:'pentagono' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
          +  ' <path d="M0 0H12V7L6 12 0 7V0" stroke="#41729D" stroke-width="0.3" fill="#5B9BD4"/>'+
          '</g></g>',
          type:'Native'
          },},
          {id:'RecAmarillo' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
              +  ' <path d="M0 0H21V9H0V0" stroke="#BCBCBB" stroke-width="0.3" fill="#F3E600"/>'+
              '</g></g>',
          type:'Native'
          },},
          {id:'RecAzul' ,offsetX:50, offsetY:50, shape:{
              content:'<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>'
          +  '<path d="M1 0H20C21 0 21 1 21 1V8C21 9 20 9 20 9H1C1 9 0 9 0 8V1C0 1 0 0 1 0" stroke="#41729D" stroke-width="0.3" fill="#5B9BD4"/>'
          +' <div style="background:#6BA5D7;height:100%;width:100%;"> <button>Play</button></div> '
          + '</g></g>',
          type:'Native',
          activity:{
              activity: 'Task', task: { type: 'Service', loop: 'ParallelMultiInstance' }
          }
          },
      },
      {
        id:'factor causal' ,offsetX:50, offsetY:250, borderColor:"#ACACAC", shape:{
            content:'<g xmlns="http://www.w3.org/2000/svg" > <g transform="translate(1 1)" ><g>'
        +  ' <path style="fill:#000000;" d="M4 0 3 2 5 2 4 0M3 2 2 4 4 4 3 2M4 4 5 2 6 4 4 4"/>	</g></g>',
        type:'Native',
        
        },
        annotations:[{style: this.styleFC, verticalAlignment:'Bottom'}]
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
    this.captureService.getImage(this.screen.nativeElement, true).then(h=>{
        this.imgDF.emit(h);
    })
}
};

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
