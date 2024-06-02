export interface PaginacionDTO<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
}
