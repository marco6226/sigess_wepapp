import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-pcl',
    templateUrl: './pcl.component.html',
    styleUrls: ['./pcl.component.scss']
})
export class PclComponent implements OnInit {

    @Input() diagnosticos: any[];

    constructor() { }

    ngOnInit() {
    }

}
