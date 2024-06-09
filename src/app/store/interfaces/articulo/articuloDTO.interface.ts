

// Interface para el DTO de Articulo
export interface ArticuloDTO {
  descripcion:     string;
  fabricante:      string;
  peso:            string;
  altura:          string;
  ancho:           string;
  precio:          string;
  foto?:           File;
  estadoArticulo:  string;
}
