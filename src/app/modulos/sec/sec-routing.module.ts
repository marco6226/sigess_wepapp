import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TareaComponent } from './components/tarea/tarea.component';

import { SecComponent } from './sec.component';

const routes: Routes = [
    {
        path: 'seguimientoControl', component: SecComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class SecRoutingModule { }
