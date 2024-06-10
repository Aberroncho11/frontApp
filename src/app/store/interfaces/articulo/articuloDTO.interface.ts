

// Interface para el DTO de Articulo
export interface ArticuloDTO {
  nombre:          string;
  descripcion:     string;
  fabricante:      string;
  peso:            string;
  altura:          string;
  ancho:           string;
  precio:          string;
  foto?:           string;
  estadoArticulo:  string;
}
