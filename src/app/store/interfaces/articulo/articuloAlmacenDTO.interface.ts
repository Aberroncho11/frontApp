import { AlmacenDTO } from "../almacen/almacenDTO.interface";

// Interface para el DTO de ArticuloAlmacen
export interface ArticuloAlmacenDTO {
  idArticulo:     number;
  descripcion:    string;
  fabricante:     string;
  peso:           string;
  altura:         string;
  ancho:          string;
  precio:         string;
  foto?:           string;
  estadoArticulo: string;
  almacen:        AlmacenDTO[];
}


