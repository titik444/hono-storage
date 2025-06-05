import { Product } from "@prisma/client";

export interface IProductModel {
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
