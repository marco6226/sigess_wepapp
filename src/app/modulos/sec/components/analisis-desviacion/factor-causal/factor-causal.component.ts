import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

  public formDesempeno: FormGroup;
  
  steps = [
    {label: 'Desempeño Individual'},
    {label: 'Desempeño del Equipo de Trabajo'},
    {label: 'Step 3'}
  ];

  jefeForm: FormGroup;

  questionIndividual:Desempeno[]=[
    {id:1,pregunta:'¿Estaba la persona excesivamente fatigada, impedida, molesta, aburrida, distraida o abrumada?',dq:"Dq1",areas:[{area:'Ingeniería Humana'},{area:'Dirección del Trabajo'}]},
    {id:2,pregunta:'¿Debería la persona haber tenido y usado un procedimiento escrito, pero no fue así?',dq:"Dq2",areas:[{area:'Dirección del Trabajo'},{area:'Procedimientos'},{area:'Ingeniería Humana',}]},
    {id:3,pregunta:'¿Se cometió un error mientras se usaba un procedimiento?',dq:"Dq3",areas:[{area:'Procedimientos'}]},
    {id:4,pregunta:'¿No estaban disponibles las alarmas o indicadores o se entendieron mal para reconocer o responder a una problema?',dq:"Dq4",areas:[{area:'Ingeniería Humana'}]},
    {id:5,pregunta:'¿Se identificaron o manejaron mal los indicadores, alarmas, controles, herramienta o equipo?',dq:"Dq5",areas:[{area:'Capacitación'}]},
    {id:6,pregunta:'¿Necesitaba la persona más habilidades o conocimientos para cumplir con un trabajo, responder a una situación o comprender la respuesta del sistema?',dq:"Dq6",areas:[{area:'Capacitación'},{area:'Dirección del Trabajo'}]},
    {id:7,pregunta:'¿Fue el trabajo realizado en un ambiente adverso (tal como caliente, húmedo, obscuro, reducido o peligroso)?',dq:"Dq7",areas:[{area:'Ingeniería Humana'}]},
    {id:8,pregunta:'¿Implicaba el trabajo movimientos repetitivos, posiciones incómodas, vibraciones o levantar cosas pesadas?',dq:"Dq8",areas:[{area:'Dirección del Trabajo'},{area:'Capacitación'},{area:'Ingeniería Humana',}]},    
  ]

  questionTrabajo:Desempeno[]=[
    {id:9,pregunta:'¿Tuvo algo que ver con este problema la comunicación verbal o el cambio de turno?',dq:"Dq9",areas:[{area:'Comunicaciones'}]},
    {id:10,pregunta:'¿Tuvo algo que ver con este problema la incapacidad de ponerse de acuerdo de quién/qué/cuándo/dónde se ejecutaria este trabajo?',dq:"Dq10",areas:[{area:'Capacitación'},{area:'Comunicaciones'},{area:'Dirección del Trabajo',}]},
    {id:11,pregunta:'¿Fue necesaria la comunicación a través de barreras organizacionales o con otras unidades?',dq:"Dq11",areas:[{area:'Comunicaciones'}]},
    {id:12,pregunta:'¿Se llevó a cabo la tarea con prisas o se usó un atajo?',dq:"Dq12",areas:[{area:'Sistema de Administración'},{area:'Dirección del Trabajo'}]},
    {id:13,pregunta:'¿Había sido advertida la Administración acerca de este problema o había ocurrido antes?',dq:"Dq13",areas:[{area:'Sistema de Administración'}]},
    {id:14,pregunta:'¿No se usaron o no existían o necesitaban mejorar las Normas, Controles Administrativos o Procedimientos?',dq:"Dq14",areas:[{area:'Sistema de Administración'},{area:'Dirección del Trabajo'},{area:'Procedimientos',}]},
    {id:15,pregunta:'¿Hubiera detectado este problema una revisión de control de calidad independiente?',dq:"Dq15",areas:[{area:'Control de Calidad'}]},
  ]

  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.formDesempeno = this.fb.group({
      Dq1: [false, Boolean, Validators.required],
      Dq2: [false, Boolean, Validators.required],
      Dq3: [false, Boolean, Validators.required],
      Dq4: [false, Boolean, Validators.required],
      Dq5: [false, Boolean, Validators.required],
      Dq6: [false, Boolean, Validators.required],
      Dq7: [false, Boolean, Validators.required],
      Dq8: [false, Boolean, Validators.required],
      Dq9: [false, Boolean, Validators.required],
      Dq10: [false, Boolean, Validators.required],
      Dq11: [false, Boolean, Validators.required],
      Dq12: [false, Boolean, Validators.required],
      Dq13: [false, Boolean, Validators.required],
      Dq14: [false, Boolean, Validators.required],
      Dq15: [false, Boolean, Validators.required],
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

  changeSelection(selectForm: string, selection:boolean){
    // console.log(selectForm, selection);
    
    // console.log(this.formDesempeno.value);
    // console.log(this.formDesempeno.value[selectForm]);
    this.formDesempeno.value[selectForm]=selection;

    // console.log(this.formDesempeno.value[selectForm]);
    console.log(this.formDesempeno.value);
    console.log(this.formDesempeno);
  }

  cx=false;
  selectedValue;
  ok(){
    console.log(this.cx);
    console.log(this.selectedValue);
    
    

  }

}


interface Desempeno{
  id: number;
  pregunta: string;
  dq?:string;
  areas: areaInvolucrada[];
}

interface areaInvolucrada{
  area: string
}

interface IUserFormGroup extends FormGroup{}