import { ArticuloPedidoDTO } from "../articulo/articuloPedidoDTO.interface";

// Interface para el DTO de Post de Pedido
export interface PedidoPostDTO {
  usuarioId:           number;
  codigoPostal:        string;
  ciudad:              string;
  telefono:            string;
  contacto:            string;
  direccion:           string;
  provincia:           string;
  articulos:           ArticuloPedidoDTO[]
}
