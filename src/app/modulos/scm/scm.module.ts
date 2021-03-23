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
import { CoreModule } from '../core/core.module';
import { LogmodalComponent } from './components/logmodal/logmodal.component';
import { DiagnosticoFormComponent } from './components/diagnostico-form/diagnostico-form.component';


@NgModule({
    declarations: [FormularioScmComponent, ScmComponent, RecomendationsformComponent, LogmodalComponent, DiagnosticoFormComponent, RecomendationStatusPipe],
    imports: [
        CommonModule,
        ComunModule,
        CoreModule,
    ],
    providers: [
        UsuarioService,
        EmpresaService,
        SedeService,
        AreaService,
        TipoAreaService,
        CargoService,
        EmpleadoService,
        PerfilService
    ],

})
export class ScmModule { }
