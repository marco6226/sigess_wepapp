import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 's-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {

  @Output() onRemove = new EventEmitter<any>();
  _images: any[];
  @Input("readOnly") readOnly;
  currentImage: any;
  visibleDlg: boolean;
  showHeader: false;
  vpselect: any;
  indexSelect: number = 0;

  constructor() { }

  ngOnInit() {
    if (this.images != null && this.images.length > 0) {
      this.vpselect = this.images[this.indexSelect];
      this.vpselect.source
    }
  }

  onImageClick(event, image) {
    this.visibleDlg = true;
    this.currentImage = image;
  }

  cerrarDlg() {
    this.visibleDlg = false;
  }

  onRemoveClick(image) {
    this.images.splice(this.indexSelect, 1);
    if (this.indexSelect == 0) {
      this.vpselect = this.images[0];
    } else {
      this.vpselect = this.images[this.indexSelect - 1];
      this.indexSelect -= 1;
    }
    this.onRemove.emit({ file: image, index: this.indexSelect });
  }

  vistaPreviaSelect($event, vpselect, index) {
    this.vpselect = vpselect;
    this.indexSelect = index;
  }

  get images() {
    return this._images;
  }

  @Input("images") set images(val) {
    this._images = val;
    if (val == null || val.length == 0)
      this.vpselect = null;
    else
      this.vpselect = this.images[0];
  }
}
