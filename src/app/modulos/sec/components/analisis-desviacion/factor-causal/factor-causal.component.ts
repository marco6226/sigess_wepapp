import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FactorCausal } from './../../../entities/factor-causal';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-factor-causal',
  templateUrl: './factor-causal.component.html',
  styleUrls: ['./factor-causal.component.scss']
})
export class FactorCausalComponent implements OnInit {

  @Input() factorCausal: FactorCausal;

  pasoSelect=0;

  formDesempeño: FormGroup;
  
  items = [
    {label: 'Step 1'},
    {label: 'Step 2'},
    {label: 'Step 3'}
  ];

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formDesempeño = this.fb.group({
      'di1': [null, Boolean, Validators.required],
      'di2': [null, Boolean, Validators.required],
      'di3': [null, Boolean, Validators.required],
      'di4': [null, Boolean, Validators.required],
      'di5': [null, Boolean, Validators.required],
      'di6': [null, Boolean, Validators.required],
      'di7': [null, Boolean, Validators.required],
      'di8': [null, Boolean, Validators.required],
      'de9': [null, Boolean, Validators.required],
      'de10': [null, Boolean, Validators.required],
      'de11': [null, Boolean, Validators.required],
      'de12': [null, Boolean, Validators.required],
      'de13': [null, Boolean, Validators.required],
      'de14': [null, Boolean, Validators.required],
      'de15': [null, Boolean, Validators.required],
    });
  }

  next(){
    console.log(this.factorCausal);
    this.pasoSelect++;
  }

  back(){
    console.log(this.factorCausal);
    this.pasoSelect--;
  }

}
