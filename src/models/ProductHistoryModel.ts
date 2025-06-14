import { ProductHistory, PrismaClient } from "@prisma/client";
import { IProductHistoryModel } from "./interfaces/IProductHistoryModel";
import prisma, { QueryMode } from "../utils/prismaClient";

class ProductHistoryModel implements IProductHistoryModel {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  create(productHistory: ProductHistory): Promise<ProductHistory> {
    return this.prisma.productHistory.create({ data: productHistory });
  }

  update(id: string, productHistory: ProductHistory): Promise<ProductHistory> {
    return this.prisma.productHistory.update({
      where: { id },
      data: {
        quantity: productHistory.quantity,
      },
    });
  }

  delete(id: string): Promise<ProductHistory> {
    return this.prisma.productHistory.delete({ where: { id } });
  }

  findById(id: string): Promise<ProductHistory | null> {
    return this.prisma.productHistory.findUnique({
      where: { id },
    });
  }

  async findAll(
    productId: string | null,
    request: { keyword: string; page: number; perPage: number }
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
  > {
    const filter = request.keyword
      ? {
          description: {
            contains: request.keyword,
            mode: QueryMode.insensitive,
          },
        }
      : {};

    const whereClause = {
      ...(productId ? { productId } : {}),
      ...filter,
    };

    const productHistory = await this.prisma.productHistory.findMany({
      include: { product: true, user: true },
      orderBy: { changedAt: "desc" },
      where: whereClause,
      skip: (request.page - 1) * request.perPage,
      take: request.perPage,
    });

    return productHistory.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      action: item.action,
      quantity: item.quantity,
      stockBefore: item.stockBefore,
      stockAfter: item.stockAfter,
      description: item.description,
      changedBy: item.user.name,
      changedAt: item.changedAt,
    }));
  }

  count(
    productId: string | null,
    request: { keyword: string; page: number; perPage: number }
  ): Promise<number> {
    const filter = request.keyword
      ? {
          description: {
            contains: request.keyword,
            mode: QueryMode.insensitive,
          },
        }
      : {};

    const whereClause = {
      ...(productId ? { productId } : {}),
      ...filter,
    };

    return this.prisma.productHistory.count({ where: whereClause });
  }
}

export default new ProductHistoryModel();
