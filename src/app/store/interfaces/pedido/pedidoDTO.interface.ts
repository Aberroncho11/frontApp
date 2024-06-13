import { ProductoDTO } from "../producto/productoDTO.interface";

// Interface para el DTO de Pedido
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
  producto:          ProductoDTO[]
}
