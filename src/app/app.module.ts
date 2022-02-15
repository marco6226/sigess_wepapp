import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { HttpInt } from 'app/httpInt';

import { AdminModule } from './modulos/admin/admin.module';
import { CoreModule } from './modulos/core/core.module';
import { AusModule } from './modulos/aus/aus.module';
import { DocumentosModule } from './modulos/ado/documentos.module';
import { EmpresaModule } from './modulos/empresa/empresa.module';
import { InspeccionesModule } from './modulos/inspecciones/inspecciones.module';
import { IprModule } from './modulos/ipr/ipr.module';
import { ObservacionesModule } from './modulos/observaciones/observaciones.module';
import { RaiModule } from './modulos/rai/rai.module';
import { SecModule } from './modulos/sec/sec.module';
import { SgModule } from './modulos/sg/sg.module';
import { IndModule } from './modulos/ind/ind.module';
import { CtrModule } from './modulos/ctr/ctr.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthInterceptor } from './modulos/core/services/http-auth-interceptor';
import { CopModule } from './modulos/cop/cop.module';
import { AyudaModule } from './modulos/ayuda/ayuda.module';
import { ScmModule } from './modulos/scm/scm.module';




const appRoutes: Routes = [
    { path: '**', component: PageNotFoundComponent }
];


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,


    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        AdminModule,
        AusModule,
        CoreModule,
        DocumentosModule,
        EmpresaModule,
        InspeccionesModule,
        IprModule,
        ObservacionesModule,
        RaiModule,
        SecModule,
        SgModule,
        ScmModule,
        IndModule,
        CtrModule,
        CopModule,
        AyudaModule
        //ng g c modulos/scm/components/formulario-scm
    ],
    providers: [
        HttpInt,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpAuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]

})
export class AppModule { }
