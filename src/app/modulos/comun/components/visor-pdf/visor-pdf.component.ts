import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sigess-visor-pdf',
  templateUrl: './visor-pdf.component.html',
  styleUrls: ['./visor-pdf.component.scss']
})
export class VisorPdfComponent implements OnInit {

  @Input() src: string;
  @Input() zoom: number = 1.6;

  constructor() { }

  ngOnInit() {
  }

  zoomIn() {
    this.zoom += 0.2;
  }

  zoomOut() {
    this.zoom -= 0.2;
  }
  download() {
    window.location.href = this.src;
  }
}
