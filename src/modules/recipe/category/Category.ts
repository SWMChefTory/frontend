import { CategoryApiResponse } from "./api";

export class Category {
  id: string;
  name: string;
  count: number;

  constructor(id: string, name: string, count: number) {
    this.id = id;
    this.name = name;
    this.count = count;
  }

  static create(apiResponse: CategoryApiResponse): Category {
    return new Category(
      apiResponse.category_id,
      apiResponse.name,
      apiResponse.count,
    );
  }
}
