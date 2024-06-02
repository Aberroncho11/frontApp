import { AlmacenDTO } from "../almacen/almacenDTO.interface";

export interface ArticuloAlmacenDTO {
  idArticulo:     number;
  descripcion:    string;
  fabricante:     string;
  peso:           number;
  altura:         number;
  ancho:          number;
  precio:         number;
  foto:           string;
  estadoArticulo: string;
  almacen:        AlmacenDTO[];
}


