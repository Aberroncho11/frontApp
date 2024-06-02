export interface ArticuloPostDTO {
  descripcion:   string;
  fabricante:    string;
  peso:          number;
  altura:        number;
  ancho:         number;
  precio:        number;
  foto?:         File;
}
