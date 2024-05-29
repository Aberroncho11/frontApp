
export interface ArticlePutDTO {
  description:   string;
  maker:         string;
  weight:        number;
  height:        number;
  width:         number;
  price:         number;
  status:        string;
  foto?:          File;
}
