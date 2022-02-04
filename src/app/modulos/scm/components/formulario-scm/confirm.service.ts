import { Injectable } from "@angular/core";
import { ConfirmationService } from "primeng/api";
@Injectable({
  providedIn: "root"
})
export class ConfirmService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm({
    message = "¿Está usted seguro que desea eliminar este tratamiento?",
    header = "Confirmación",
    icon = "pi pi-exclamation-triangle"
  } = {}): Promise<boolean> {
    return new Promise(resolve => {
      console.log(
        this.confirmationService.confirm({
          message,
          header,
          icon,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        })
      );
    });
  }

  confirmDiagnostico({
    message = "¿Está usted seguro que desea eliminar este diagnostico?",
    header = "Confirmación",
    icon = "pi pi-exclamation-triangle"
  } = {}): Promise<boolean> {
    return new Promise(resolve => {
      console.log(
        this.confirmationService.confirm({
          message,
          header,
          icon,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        })
      );
    });
  }

  confirmPCL({
    message = "¿Está usted seguro que desea eliminar este PCL?",
    header = "Confirmación",
    icon = "pi pi-exclamation-triangle"
  } = {}): Promise<boolean> {
    return new Promise(resolve => {
      console.log(
        this.confirmationService.confirm({
          message,
          header,
          icon,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        })
      );
    });
  }

  confirmRecomendacion({
    message = "¿Está usted seguro que desea eliminar esta recomendación?",
    header = "Confirmación",
    icon = "pi pi-exclamation-triangle"
  } = {}): Promise<boolean> {
    return new Promise(resolve => {
      console.log(
        this.confirmationService.confirm({
          message,
          header,
          icon,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        })
      );
    });
  }

  confirmSeguimiento({
    message = "¿Está usted seguro que desea eliminar este seguimiento?",
    header = "Confirmación",
    icon = "pi pi-exclamation-triangle"
  } = {}): Promise<boolean> {
    return new Promise(resolve => {
      console.log(
        this.confirmationService.confirm({
          message,
          header,
          icon,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        })
      );
    });
  }


}
