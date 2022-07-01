import { Component, Input, OnInit } from '@angular/core';
import { listPlanAccion } from 'app/modulos/sec/entities/factor-causal';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-plan-accion-list',
  templateUrl: './plan-accion-list.component.html',
  styleUrls: ['./plan-accion-list.component.scss']
})
export class PlanAccionListComponent implements OnInit {

  @Input() planAccionList: listPlanAccion[] = []
  planAccionListSelected: listPlanAccion;
  causasListSelect
  display: boolean = false;
  constructor() { }
  cols: any[];
  files: TreeNode[]

  ngOnInit() {
//     this.cols = [
//       { field: 'name', header: 'Name' },
//       { field: 'size', header: 'Size' },
//       // { field: 'type', header: 'Type' }
//   ];

//   this.files=[{data:
//     [  
//         {  
//             data:{  
//                 name:"Lazy Folder 0",
//                 size:"75kb",
//                 type:"Folder"
//             },
//             leaf: false
//         },
//         {  
//             data:{  
//                 name:"Lazy Folder 1",
//                 size:"150kb",
//                 type:"Folder"
//             },
//             leaf: false
//         }
//     ]
// }]

  }
  
  selectProduct(event) {
    console.log(event);
    this.planAccionListSelected = event;
    this.display = true
  }

  confirmCheck(){
    this.display = false
  }

  test(){
    console.log(this.planAccionList);
    
  }
 

}


// export interface TreeNode {
//   name?: string;
//   size?: string;
//  }