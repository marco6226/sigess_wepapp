
import { Documento } from "../../ado/entities/documento";
import { Area } from "../../empresa/entities/area";


export class Acta {
    id: string;
    nombre: string;
    descripcion: string;
    fechaElaboracion: Date;
    area: Area;
    documentosList: Documento[];
}