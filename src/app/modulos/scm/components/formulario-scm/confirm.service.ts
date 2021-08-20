import { Injectable } from "@angular/core";
import { ConfirmationService } from "primeng/api";
@Injectable({
  providedIn: "root"
})
export class ConfirmService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm({
    message = "esta usted seguro que desea eliminar el tratamiento?",
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
