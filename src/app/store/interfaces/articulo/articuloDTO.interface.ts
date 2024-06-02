export interface ArticuloDTO {
  descripcion:     string;
  fabricante:      string;
  peso:            number;
  altura:          number;
  ancho:           number;
  precio:          number;
  foto?:           File;
  estadoArticulo:  string;
}
