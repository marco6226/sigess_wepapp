import { Directive, Input, Output,EventEmitter,ViewContainerRef, TemplateRef } from '@angular/core';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { tienePermiso } from 'app/modulos/comun/services/tienePermiso.service'

@Directive({
  selector: '[sTienePermiso]',
  providers: [SesionService],
})
export class TienePermisoDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sesionService: SesionService,
    private tienePermiso:tienePermiso,
  ) { }


  @Input() set sTienePermiso(codigo: string) {
    if(this.sesionService.getPermisosMap() == null){
      return;
    }
    let permiso = this.sesionService.getPermisosMap()[codigo];    
    if (permiso != null && permiso.valido == true) {
      if(codigo=='RAI_GET_TAREAEVI'){this.tienePermiso.setPermisoFlag(false)}
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      if(codigo=='RAI_GET_TAREAEVI'){this.tienePermiso.setPermisoFlag(true)}
      this.viewContainer.clear();
    }
  }

}