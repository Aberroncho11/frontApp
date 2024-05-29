import { ArticleDTO } from "../article/articleDTO.interface";

export interface OrderCreacionDTO {
  idUser:            number;
  postalCode:        string;
  town:              string;
  phoneNumber:       string;
  personalContact:   string;
  address:           string;
  province:          string;
  articles:          ArticleDTO[]
}
