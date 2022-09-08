import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EquipoSST } from '../../entities/aliados';

@Component({
  selector: 'app-equipo-sst',
  templateUrl: './equipo-sst.component.html',
  styleUrls: ['./equipo-sst.component.scss']
})
export class EquipoSstComponent implements OnInit {

  @Output() closeDialog = new EventEmitter();
  @Output() createMiembroSST = new EventEmitter<EquipoSST>();
  // @Input()

  equipoSST: EquipoSST={
    nombre: '',
    correo: '',
    telefono: '',
    licenciaSST: ''
  }

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { 
    this.form = fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      licenciaSST: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  CloseDialog(){
    this.form.reset();
    this.closeDialog.emit();
  }

  agregar(){
    console.log(this.form.value)

    // this.equipoSST.nombre = this.form.value.nombre;
    // this.equipoSST.correo = this.form.value.correo;
    // this.equipoSST.telefono = this.form.value.telefono;
    // this.equipoSST.licenciaSST = this.form.value.licenciaSST;

    this.equipoSST = {
      nombre: this.form.value.nombre,
      correo: this.form.value.correo,
      telefono:this.form.value.telefono,
      licenciaSST: this.form.value.licenciaSST
    }

    console.log(this.equipoSST);
    
    this.createMiembroSST.emit(this.equipoSST)
    this.CloseDialog();
  }

}
