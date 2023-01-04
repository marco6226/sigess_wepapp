import { EmpresaService } from 'app/modulos/empresa/services/empresa.service';
import { Localidades, SST, _divisionList } from './../../entities/aliados';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EquipoSST, ResponsableSST } from '../../entities/aliados';

@Component({
  selector: 'app-equipo-sst',
  templateUrl: './equipo-sst.component.html',
  styleUrls: ['./equipo-sst.component.scss']
})
export class EquipoSstComponent implements OnInit {

  @Output() closeDialog = new EventEmitter();
  @Output() createMiembroSST = new EventEmitter<EquipoSST>();
  @Output() createResponsableSST = new EventEmitter<ResponsableSST>();
  @Input() isResponsable: boolean = false;
  @Input() flagConsult: boolean=false;
  @Input() miembroToUpdate: SST = null;

  responsableSST: ResponsableSST={
    nombre: '',
    correo: '',
    telefono: '',
    licenciaSST: ''
  }

  equipoSST: EquipoSST={
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    division: '',
    localidad: '',
    cargo: '',
    licenciaSST: ''
  }

  divisionList= _divisionList
  localidadesList: any[] = [];
  selectedLocalidad: any[] = [];

  formResponsable: FormGroup;
  formEquipo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService
  ) { 
    this.formResponsable = fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      licenciaSST: ['', Validators.required],
    })

    this.formEquipo = fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      division: ['', Validators.required],
      localidad: ['', Validators.required],
      cargo: ['', Validators.required],
      licenciaSST: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadLocalidades().then(result => {});
  }

  CloseDialog(){
    this.formResponsable.reset();
    this.formEquipo.reset();
    this.closeDialog.emit();
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((items: Localidades[]) => {
      items.forEach(item => {
        this.localidadesList.push({label: item.localidad, value: item.localidad});
      });
    });
  }

  agregar(){
    console.log(this.formResponsable.value)

    if (this.isResponsable) {
      this.responsableSST = {
        nombre: this.formResponsable.value.nombre,
        correo: this.formResponsable.value.correo,
        telefono:this.formResponsable.value.telefono,
        licenciaSST: this.formResponsable.value.licenciaSST
      }
  
      console.log(this.responsableSST);
      
      this.createResponsableSST.emit(this.responsableSST)  
    } else {

      this.equipoSST = {
        nombre: this.formEquipo.value.nombre,
        documento: this.formEquipo.value.documento,
        correo: this.formEquipo.value.correo,
        telefono: this.formEquipo.value.telefono,
        division:this.formEquipo.value.division,
        localidad: JSON.stringify(this.selectedLocalidad),
        cargo:this.formEquipo.value.cargo,
        licenciaSST: this.formEquipo.value.licenciaSST
      }
      
      this.createMiembroSST.emit(this.equipoSST)     
    }
    
    this.CloseDialog();
  }

  test(){
    console.log(this.isResponsable);
    
  }

}
