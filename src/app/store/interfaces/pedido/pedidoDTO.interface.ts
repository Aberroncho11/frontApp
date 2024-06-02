import { ProductoDTO } from "../producto/productoDTO.interface";

export interface PedidoDTO {
  idPedido:           number;
  usuarioId:          number;
  codigoPostal:       string;
  ciudad:             string;
  telefono:           string;
  contacto:           string;
  direccion:          string;
  provincia:          string;
  estadoPedido:       string;
  productos:          ProductoDTO[]
}
