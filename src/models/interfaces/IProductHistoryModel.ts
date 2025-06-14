import { ProductHistory } from "@prisma/client";

export interface IProductHistoryModel {
  create(productHistory: ProductHistory): Promise<ProductHistory>;
  update(id: string, productHistory: ProductHistory): Promise<ProductHistory>;
  delete(id: string): Promise<ProductHistory>;
  findById(id: string): Promise<ProductHistory | null>;
  findAll(
    id: string | null,
    request: {
      keyword: string;
      page: number;
      perPage: number;
    }
  ): Promise<
    {
      id: string;
      productId: string;
      name: string;
      action: string;
      quantity: number;
      stockBefore: number;
      stockAfter: number;
      description: string | null;
      changedBy: string;
      changedAt: Date;
    }[]
  >;
  count(
    id: string | null,
    request: {
      keyword: string;
      page: number;
      perPage: number;
    }
  ): Promise<number>;
}
