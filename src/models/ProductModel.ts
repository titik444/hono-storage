import { Product, PrismaClient } from "@prisma/client";
import { IProductModel } from "./interfaces/IProductModel";
import prisma, { QueryMode } from "../utils/prismaClient";

class ProductModel implements IProductModel {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async create(product: Product): Promise<Product> {
    return await this.prisma.product.create({ data: product });
  }

  async update(id: string, product: Product): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: {
        sku: product.sku || undefined,
        name: product.name || undefined,
        ptName: product.ptName || undefined,
        description: product.description || undefined,
      },
    });
  }

  async delete(id: string): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: { status: "DELETED" },
    });
  }

  async restore(id: string): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: { status: "ACTIVE" },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { name },
    });
  }

  async findBySkuNotId(id: string, sku: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { sku, NOT: { id } },
    });
  }

  async findByNameNotId(id: string, name: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { name, NOT: { id } },
    });
  }

  async findAll(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<Product[]> {
    const filter = request.keyword
      ? {
          OR: [
            {
              name: {
                contains: request.keyword,
                mode: QueryMode.insensitive,
              },
            },
            {
              ptName: {
                contains: request.keyword,
                mode: QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    return await this.prisma.product.findMany({
      where: filter,
      orderBy: { name: "asc" },
      skip: (request.page - 1) * request.perPage,
      take: request.perPage,
    });
  }

  async count(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<number> {
    const filter = request.keyword
      ? {
          OR: [
            {
              name: {
                contains: request.keyword,
                mode: QueryMode.insensitive,
              },
            },
            {
              ptName: {
                contains: request.keyword,
                mode: QueryMode.insensitive,
              },
            },
          ],
        }
      : {};
    return await this.prisma.product.count({ where: filter });
  }
}

export default new ProductModel();
