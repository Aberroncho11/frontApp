

// Interface para el DTO de Post de Articulo
export interface ArticuloPostDTO {
  nombre:        string;
  descripcion:   string;
  fabricante:    string;
  peso:          string;
  altura:        string;
  ancho:         string;
  precio:        string;
  foto?:         File;
}
