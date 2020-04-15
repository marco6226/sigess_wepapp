import { Component, OnInit, Input, EventEmitter, ViewChild, Output, ViewContainerRef } from '@angular/core';
import { RadioButton } from 'primeng/primeng';

@Component({
  selector: 's-radioButton',
  templateUrl: './custom-radio-button.component.html'
})
export class CustomRadioButtonComponent {
  @Input() id: string;
  @ViewChild('radioButton', { static: false }) radioButton: RadioButton;
  @Input() name: string;
  @Input() value: string;
  @Input() label: string;
  @Input() pTooltip: string;
  @Input() tooltipPosition: string;
  @Input() disabled: boolean;
  @Output() onClick = new EventEmitter<any>();

  click() {
    this.onClick.emit(null);
  }

  check() {
    this.radioButton.checked = true;
  }
  uncheck() {
    this.radioButton.checked = false;
  }
}
