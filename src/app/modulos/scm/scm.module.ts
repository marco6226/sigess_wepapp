import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioScmComponent } from './components/formulario-scm/formulario-scm.component';
import { ComunModule } from '../comun/comun.module';
import { ScmComponent } from './components/scm/scm.component';
import { EmpresaService } from '../empresa/services/empresa.service';
import { SedeService } from '../empresa/services/sede.service';
import { AreaService } from '../empresa/services/area.service';
import { TipoAreaService } from '../empresa/services/tipo-area.service';
import { CargoService } from '../empresa/services/cargo.service';
import { EmpleadoService } from '../empresa/services/empleado.service';
import { PerfilService } from '../admin/services/perfil.service';
import { UsuarioService } from '../admin/services/usuario.service';
import { CieSelectorComponent } from '../comun/components/cie-selector/cie-selector.component';
import { RecomendationsformComponent, RecomendationStatusPipe } from './components/recomendationsform/recomendationsform.component';
import { SeguimientosformComponent, SeguimientoStatusPipe } from './components/seguimientosform/seguimientosform.component';
import { SeguimientosgenericoformComponent, SeguimientogenericoStatusPipe } from './components/seguimientosgenericoform/seguimientosgenericoform.component';
import { CoreModule } from '../core/core.module';
import { LogmodalComponent } from './components/logmodal/logmodal.component';
import { DiagnosticoFormComponent } from './components/diagnostico-form/diagnostico-form.component';
import { DocumentosModule } from '../ado/documentos.module';
import { PclComponent } from './components/pcl/pcl.component';
import { ScmpermisosComponent } from './components/scmpermisos/scmpermisos.component';
import { AdminModule } from '../admin/admin.module';
import { PermisoService } from '../admin/services/permiso.service';
import { RecursoService } from '../admin/services/recurso.service';
import { ReintegroComponent } from './components/formulario-scm/reintegro/reintegro.component';
import { ReintegroListComponent } from './components/formulario-scm/reintegro-list/reintegro-list.component';


@NgModule({
    declarations: [FormularioScmComponent, ScmComponent, RecomendationsformComponent, SeguimientosformComponent, SeguimientosgenericoformComponent, LogmodalComponent, DiagnosticoFormComponent, RecomendationStatusPipe,SeguimientoStatusPipe,SeguimientogenericoStatusPipe, PclComponent, ScmpermisosComponent, ReintegroComponent, ReintegroListComponent],
    imports: [
        CommonModule,
        ComunModule,
        CoreModule,
        DocumentosModule,
        AdminModule
    ],
    providers: [
        UsuarioService,
        EmpresaService,
        SedeService,
        AreaService,
        TipoAreaService,
        PermisoService,
        RecursoService,
        CargoService,
        EmpleadoService,
        PerfilService
    ],

})
export class ScmModule { }
