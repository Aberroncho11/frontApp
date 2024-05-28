import { StockDTO } from "../stock/stockDTO.interface";

export interface ArticleDTO {
  idArticle:     number;
  description:   string;
  maker:         string;
  weight:        number;
  height:        number;
  width:         number;
  price:         number;
  foto:          string;
  status:        string;
  stocks:        StockDTO[]
}
