import { ArticleDTO } from "../article/articleDTO.interface";

export interface OrderCreacionDTO {
  idUser:            number;
  postalCode:        number;
  town:              string;
  phoneNumber:       number;
  personalContact:   number;
  address:           string;
  province:          string;
  status:            string;
  articles:          ArticleDTO[]
}
