import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PermisosComponent } from './components/permisos/permisos.component';
import { PermisoService } from './services/permiso.service';

@NgModule({
    imports: [
        ComunModule,
        AdminRoutingModule
    ],
    declarations: [AdminComponent, PerfilComponent, UsuarioComponent, PermisosComponent]
})
export class AdminModule { }
