import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 's-editorHtml',
  templateUrl: './editor-html.component.html',
  styleUrls: ['./editor-html.component.scss']
})
export class EditorHtmlComponent implements OnInit {

  visibleDlg:boolean;
  htmlString: string

  divEditor: HTMLDivElement;
  propagateChange = (_: any) => { };

  constructor() {

  }

  ngOnInit() {

  }
  contentChange() {
    if (this.divEditor == null) {
      this.divEditor = <HTMLDivElement>document.getElementById("editor");
    }
    this.htmlString = this.divEditor.innerHTML;
  }

  addImage(imgB64: string) {
    this.htmlString += imgB64;
  }
  /*
    contentChange() {
      if (this.divEditor == null) {
        this.divEditor = <HTMLDivElement>document.getElementById("editor");
      }
      this.htmlString = this.divEditor.innerHTML;
      this.propagateChange(this.divEditor.innerHTML);
    }
  
    writeValue(value: any) {
      if (this.divEditor == null) {
        this.divEditor = <HTMLDivElement>document.getElementById("editor");
      }
      this.divEditor.innerHTML = value;
      this.htmlString = value;
    }*/

  onCodeChange(code) {
    this.htmlString = code;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

}
