import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualesComponent } from './components/manuales/manuales.component';
import { ComunModule } from '../comun/comun.module';

@NgModule({
  declarations: [ManualesComponent],
  imports: [
    CommonModule,
    ComunModule,
  ]
})
export class AyudaModule { }
