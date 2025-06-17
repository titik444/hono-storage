import { Product } from "@prisma/client";

export interface IProductModel {
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<Product>;
  restore(id: string): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findBySkuNotId(id: string, sku: string): Promise<Product | null>;
  findByNameNotId(id: string, name: string): Promise<Product | null>;
  findAll(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<Product[]>;
  count(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<number>;
}
