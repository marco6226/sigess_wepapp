import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reintegro-list',
  templateUrl: './reintegro-list.component.html',
  styleUrls: ['./reintegro-list.component.scss']
})
export class ReintegroListComponent implements OnInit {

  @Input() idCase=null;

  constructor() { }

  ngOnInit() {
  }

}
