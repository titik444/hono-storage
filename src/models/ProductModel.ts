import { Product, PrismaClient } from "@prisma/client";
import { IProductModel } from "./interfaces/IProductModel";
import prisma from "../utils/prismaClient";

class ProductModel implements IProductModel {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  create(product: Product): Promise<Product> {
    return this.prisma.product.create({ data: product });
  }

  update(id: string, product: Product): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
      },
    });
  }

  delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }
}

export default new ProductModel();
