export class Hht {
  id: string;
  anio: number;
  mes: string;
  valor: string;
  empresaSelect:string;

  // nombreMes:string;
}

export class AreaHht {
  area: string;
  ubicacion:UbicacionHht;
}

export class UbicacionHht {
  Girardot: ValorHht;
  Funza:ValorHht;
  Madrid:ValorHht;
}

export class ValorHht {
  Hht: Number;
  Nh:Number;
}

export class DataPlanta {
  id: number;
  NumPersonasPlanta: number;
  HhtPlanta: number;
}

export class DataArea {
  id: number;
  NumPersonasArea: number;
  HhtArea: number;
  Plantas: DataPlanta[];
}

export class DataHht {
  id: number;
  mes: string;
  NumPersonasMes: number;
  HhtMes: number;
  Areas: DataArea[];
}
