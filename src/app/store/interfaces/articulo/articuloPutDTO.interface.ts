

// Interface para el DTO de Put de Articulo
export interface ArticuloPutDTO {
  nombre:          string;
  descripcion:     string;
  fabricante:      string;
  peso:            string;
  altura:          string;
  ancho:           string;
  precio:          string;
  idEstanteria?:   number;
  cantidad?:        number;
  estadoArticulo:  string;
  foto?:           File;
}
