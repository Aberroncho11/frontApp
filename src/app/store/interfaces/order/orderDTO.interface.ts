import { ItemDTO } from "../item/itemDTO.interface";

export interface OrderDTO {
  idOrder:           number;
  idUser:            number;
  postalCode:        string;
  town:              string;
  phoneNumber:       string;
  personalContact:   string;
  address:           string;
  province:          string;
  status:            string;
  items:             ItemDTO[]
}
