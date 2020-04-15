import { Usuario } from "./usuario";

export class ContextoOrganizacion{
  id: string;
  version: number;
  usuarioElabora: Usuario;
  usuarioModifica: Usuario;
  fechaElaboracion: Date;
  fechaModificacion: Date;
  data: DataCtxOrg = new DataCtxOrg();
}

class DataCtxOrg {
  fortalezas: string[];
  debilidades: string[];
  oportunidades: string[];
  amenazas: string[];
  requisitosLegales: string[];
  normasSector: string[];
  requisitosMercado: string[];
  politicasInternas: string[];
  partesInteresadasInterno: ParteInteresada[];
  partesInteresadasExterno: ParteInteresada[];
}

class ParteInteresada {
  nombre: string;
  necesidades: string;
}