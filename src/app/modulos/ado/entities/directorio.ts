import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Documento } from 'app/modulos/ado/entities/documento';

export class Directorio {
    id: string;
    nombre: string;
    caseId: number;
    esDocumento: boolean;
    usuario: Usuario;
    directorioList: Directorio[];
    directorioPadre: Directorio;
    documento: Documento;
    tamanio: number;
    fechaCreacion: Date;
    nivelAcceso: string;
    modulo: string
}
