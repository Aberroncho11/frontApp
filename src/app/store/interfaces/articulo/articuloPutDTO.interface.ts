

// Interface para el DTO de Put de Articulo
export interface ArticuloPutDTO {
  nombre:          string;
  descripcion:     string;
  fabricante:      string;
  peso:            string;
  altura:          string;
  ancho:           string;
  precio:          string;
  estadoArticulo:  string;
  foto?:           File;
}
