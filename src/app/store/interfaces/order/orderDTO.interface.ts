import { ItemDTO } from "../item/itemDTO.interface";

export interface OrderDTO {
  idOrder:           number;
  idUser:            number;
  postalCode:        number;
  town:              string;
  phoneNumber:       number;
  personalContact:   number;
  address:           string;
  province:          string;
  status:            string;
  items:              ItemDTO[]
}
