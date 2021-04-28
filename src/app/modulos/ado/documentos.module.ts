import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { GestionDocumentalComponent } from './components/gestion-documental/gestion-documental.component';
import { DirectorioService } from 'app/modulos/ado/services/directorio.service'
import { DragDropModule } from 'primeng/dragdrop';

import { DocumentoFormComponent } from './components/documento-form/documento-form.component';
import { TreeModule } from 'primeng/primeng';
import { CoreModule } from '../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        ComunModule,
        CoreModule,
    ],
    exports: [GestionDocumentalComponent],
    declarations: [GestionDocumentalComponent, DocumentoFormComponent],
    providers: [DirectorioService]
})
export class DocumentosModule { }
