import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { IndicadoresEmpComponent } from './components/indicadores-emp/indicadores-emp.component';
import { ElaboracionTableroComponent } from './components/elaboracion-tablero/elaboracion-tablero.component'
import { EditorHtmlComponent } from '../comun/components/editor-html/editor-html.component';
import { SafeBypassPipe } from '../comun/pipes/safe-bypass.pipe';
import { ConsultaTableroComponent } from './components/consulta-tablero/consulta-tablero.component';

@NgModule({
  imports: [
    CommonModule,
    ComunModule,
    FormsModule,
  ],
  declarations: [
    IndicadoresEmpComponent, 
    ElaboracionTableroComponent, 
    EditorHtmlComponent,
    SafeBypassPipe,
    ConsultaTableroComponent
  ]
})
export class IndModule { }
