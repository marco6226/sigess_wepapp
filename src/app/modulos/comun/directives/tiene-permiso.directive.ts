import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { SesionService } from 'app/modulos/core/services/sesion.service'

@Directive({
  selector: '[sTienePermiso]',
  providers: [SesionService],
})
export class TienePermisoDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sesionService: SesionService
  ) { }

  @Input() set sTienePermiso(codigo: string) {
    if(this.sesionService.getPermisosMap() == null){
      return;
    }
    let permiso = this.sesionService.getPermisosMap()[codigo];    
    if (permiso != null && permiso.valido == true) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

  }

}