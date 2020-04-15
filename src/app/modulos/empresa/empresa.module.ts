import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa.component';
import { EmpresaAdminComponent } from './components/empresa-admin/empresa-admin.component';
import { AreaComponent } from './components/area/area.component';
import { CargoComponent } from './components/cargo/cargo.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';

import { PerfilService } from 'app/modulos/admin/services/perfil.service'
import { EmpresaService } from './services/empresa.service';

import { AreaService } from './services/area.service';
import { CargoService } from './services/cargo.service';
import { SedeService } from './services/sede.service';
import { TipoAreaService } from './services/tipo-area.service';
import { EmpleadoService } from './services/empleado.service';

import { GMapModule } from 'primeng/primeng';
import { EmpleadoFormComponent } from './components/empleado/empleado-form/empleado-form.component';
import { JornadaFormComponent } from './components/empleado/jornada-form/jornada-form.component';
import { HorasExtraFormComponent } from './components/empleado/horas-extra-form/horas-extra-form.component';
import { HhtComponent } from './components/hht/hht.component';
import { DocumentosEmpleadoFormComponent } from './components/empleado/documentos-empleado-form/documentos-empleado-form.component';
import { TipoAreaComponent } from './components/tipo-area/tipo-area.component';
import { CargueDatosComponent } from './components/cargue-datos/cargue-datos.component';
import { DragDropModule } from 'primeng/dragdrop';
import { UsuarioPreferenciasComponent } from './components/usuario-preferencias/usuario-preferencias.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { CompetenciaComponent } from './components/competencia/competencia.component';
import { EvaluacionDesempenoComponent } from './components/evaluacion-desempeno/evaluacion-desempeno.component';
import { EvaluacionDesempenoFormComponent } from './components/evaluacion-desempeno-form/evaluacion-desempeno-form.component';
import { ContextoOrganizacionComponent } from './components/contexto-organizacion/contexto-organizacion.component';


@NgModule({
  imports: [
    ComunModule,
    EmpresaRoutingModule,
    DragDropModule,
    GMapModule,
    ImageCropperModule
  ],
  exports: [ComunModule],
  declarations: [
    EmpresaComponent,
    EmpresaAdminComponent,
    AreaComponent,
    CargoComponent,
    EmpleadoComponent,
    EmpleadoFormComponent,
    JornadaFormComponent,
    HorasExtraFormComponent,
    HhtComponent,
    DocumentosEmpleadoFormComponent,
    TipoAreaComponent,
    CargueDatosComponent,
    UsuarioPreferenciasComponent,
    CompetenciaComponent,
    EvaluacionDesempenoComponent,
    EvaluacionDesempenoFormComponent,
    ContextoOrganizacionComponent,

  ],
  providers: [
    EmpresaService,
    SedeService,
    AreaService,
    TipoAreaService,
    CargoService,
    EmpleadoService,
    PerfilService
  ]
})
export class EmpresaModule { }
