export interface ArticuloPutDTO {
  descripcion:     string;
  fabricante:      string;
  peso:            number;
  altura:          number;
  ancho:           number;
  precio:          number;
  estadoArticulo:  string;
  foto?:           File;
}
