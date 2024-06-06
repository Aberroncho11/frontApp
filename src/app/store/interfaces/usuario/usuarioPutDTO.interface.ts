

// Interface para el DTO del Put de Usuario
export interface UsuarioPutDTO {
  idUsuario:        number;
  perfil:           number;
  password:         string;
  email:            string;
  estadoUsuario:    string;
  nickname:         string;
}
