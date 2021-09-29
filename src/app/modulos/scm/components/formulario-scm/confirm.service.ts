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
}
