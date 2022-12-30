import { LocalidadesComponent } from './components/localidades/localidades.component';
import { AsignacionColiderComponent } from './components/asignacion-colider/asignacion-colider.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { CargueDocumentosComponent } from './components/cargue-documentos/cargue-documentos.component';
import { ActividadesContratadasComponent } from './components/actividades-contratadas/actividades-contratadas.component';
import { EquipoSstListComponent } from './components/equipo-sst-list/equipo-sst-list.component';
import { EquipoSstComponent } from './components/equipo-sst/equipo-sst.component';
import { NgModule } from '@angular/core';
import { ComunModule } from 'app/modulos/comun/comun.module';
import { AdminContratistasComponent } from 'app/modulos/ctr/components/admin-contratistas/admin-contratistas.component'
import { SeguimientoContratistasComponent } from 'app/modulos/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component'
import { EmpresaDashComponent } from 'app/modulos/comun/components/empresa-dash/empresa-dash.component';
import { AliadosListComponent } from './components/aliados-list/aliados-list.component';
import { AliadosComponent } from './components/aliados/aliados.component';
import { AliadosActualizarComponent } from './components/aliados-actualizar/aliados-actualizar.component';
import { InformacionGeneralComponent } from './components/informacion-general/informacion-general.component'
import { ControlRiesgoComponent } from './components/control-riesgo/control-riesgo.component';
import { SubcontratistasComponent } from './components/subcontratistas/subcontratistas.component';
import { FormSubcontratistaComponent } from './components/subcontratistas/form-subcontratista/form-subcontratista.component';
import {ListboxModule} from 'primeng/listbox';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {TreeModule} from 'primeng/tree';

@NgModule({
  imports: [
    ComunModule,
    TableModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    ConfirmDialogModule,
    InputTextareaModule,
    ListboxModule,
    TreeModule
  ],
  declarations: [
    AdminContratistasComponent, 
    SeguimientoContratistasComponent, 
    EmpresaDashComponent, 
    AliadosListComponent, 
    AliadosComponent, 
    AliadosActualizarComponent,
    EquipoSstComponent,
    EquipoSstListComponent,
    ActividadesContratadasComponent,
    CargueDocumentosComponent,
    CalificacionComponent,
    AsignacionColiderComponent,
    LocalidadesComponent,
    InformacionGeneralComponent,
    ControlRiesgoComponent,
    SubcontratistasComponent,
    FormSubcontratistaComponent
  ],
  providers: [ConfirmationService,
    MessageService]
})
export class CtrModule { }
