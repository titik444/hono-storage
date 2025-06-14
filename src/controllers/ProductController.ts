import { Context } from "hono";
import {
  productUpdateValidation,
  productValidation,
} from "../validations/ProductValidation";
import Log from "../utils/Logger";
import ProductModel from "../models/ProductModel";
import { Product, ProductHistory, User } from "@prisma/client";
import ProductHistoryModel from "../models/ProductHistoryModel";

class ProductController {
  async createProduct(c: Context) {
    try {
      const user = c.get("user") as User;
      const body = await c.req.json();
      const { sku, name, ptName, description, stock } =
        await productValidation.parse(body);

      // Cek apakah produk sudah ada
      const productExist = await ProductModel.findBySku(sku);
      if (productExist) {
        return c.json({ message: "SKU already exists", data: null }, 400);
      }

      // Cek apakah nama produk sudah ada
      const nameExist = await ProductModel.findByName(name);
      if (nameExist) {
        return c.json(
          { message: "Product name already exists", data: null },
          400
        );
      }

      // Buat produk baru
      const product = await ProductModel.create({
        sku,
        name,
        ptName,
        description,
        stock,
        createdBy: user.id,
      } as Product);

      // Tambahkan entri riwayat produk
      await ProductHistoryModel.create({
        productId: product.id,
        action: "CREATED",
        quantity: stock,
        stockBefore: 0,
        stockAfter: stock,
        description: `Initial stock: ${stock}`,
        changedBy: user.id,
      } as ProductHistory);

      return c.json(
        { message: "Product created successfully", data: product },
        201
      );
    } catch (error) {
      Log.error("Error ./controllers/ProductController.createProduct " + error);

      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async getAllProduct(c: Context) {
    try {
      const request = {
        keyword: c.req.query("q")?.toString() || "",
        page: Number(c.req.query("page")) || 1,
        perPage: Number(c.req.query("perPage")) || 10,
      };

      const products = await ProductModel.findAll(request);
      const totalItems = await ProductModel.count(request);
      const totalPages = Math.ceil(totalItems / request.perPage);

      // if page is greater than total pages, return 404
      if (request.page > totalPages) {
        return c.json({ message: "Page not found", data: null }, 404);
      }

      return c.json({
        message: "Get products success",
        data: products,
        pagination: {
          currentPage: request.page,
          perPage: request.perPage,
          totalPages: totalPages,
          totalItems: totalItems,
        },
      });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.getAllProduct " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async getProductById(c: Context) {
    try {
      const id = c.req.param("id");
      const product = await this.productMustExist(id);

      if (!product) {
        return c.json({ message: "Product not found", data: null }, 404);
      }

      return c.json({ message: "Get product success", data: product });
    } catch (error) {
      Log.error(
        "Error ./controllers/ProductController.getProductById " + error
      );
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async updateProduct(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const { sku, name, ptName, description } =
        await productUpdateValidation.parse(data);

      await this.productMustExist(id);

      const productExist = await ProductModel.findBySkuNotId(id, sku);
      if (productExist) {
        return c.json({ message: "SKU already exists", data: null }, 400);
      }

      const nameExist = await ProductModel.findByNameNotId(id, name);
      if (nameExist) {
        return c.json(
          { message: "Product name already exists", data: null },
          400
        );
      }

      const product = await ProductModel.update(id, {
        sku,
        name,
        ptName,
        description,
      } as Product);
      return c.json({ message: "Update product success", data: product });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.updateProduct " + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async deleteProduct(c: Context) {
    try {
      const id = c.req.param("id");
      const productExist = await this.productMustExist(id);

      if (!productExist) {
        return c.json({ message: "Product not found", data: null }, 404);
      }

      const product = await ProductModel.delete(id);
      return c.json({ message: "Delete product success", data: product });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.deleteProduct " + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async increaseStock(c: Context) {
    try {
      const user = c.get("user") as User;
      const productId = c.req.param("id");
      const body = await c.req.json();
      const { quantity, description } = body;

      if (!productId || !quantity || quantity <= 0) {
        return c.json(
          { message: "Invalid productId or quantity", data: null },
          400
        );
      }

      const product = await this.productMustExist(productId);

      const stockBefore = product!.stock;
      const stockAfter = stockBefore + quantity;

      product!.stock = stockAfter;

      const updatedProduct = await ProductModel.update(product!.id, product!);

      await ProductHistoryModel.create({
        productId: product!.id,
        action: "STOCK_IN",
        quantity,
        stockBefore: stockBefore,
        stockAfter: stockAfter,
        description: description ?? `Stock increased by ${quantity}`,
        changedBy: user.id,
      } as ProductHistory);

      return c.json(
        { message: "Stock increased successfully", data: updatedProduct },
        200
      );
    } catch (error) {
      Log.error("Error ./controllers/ProductController.increaseStock " + error);

      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async decreaseStock(c: Context) {
    try {
      const user = c.get("user") as User;
      const productId = c.req.param("id");
      const body = await c.req.json();
      const { quantity, description } = body;

      if (!productId || !quantity || quantity <= 0) {
        return c.json(
          { message: "Invalid productId or quantity", data: null },
          400
        );
      }

      const product = await this.productMustExist(productId);

      if (product!.stock < quantity) {
        return c.json({ message: "Insufficient stock", data: null }, 400);
      }

      const stockBefore = product!.stock;
      const stockAfter = stockBefore - quantity;

      product!.stock = stockAfter;

      const updatedProduct = await ProductModel.update(product!.id, product!);

      await ProductHistoryModel.create({
        productId: product!.id,
        action: "STOCK_OUT",
        quantity,
        stockBefore: stockBefore,
        stockAfter: stockAfter,
        description: description ?? `Stock decreased by ${quantity}`,
        changedBy: user.id,
      } as ProductHistory);

      return c.json(
        { message: "Stock decreased successfully", data: updatedProduct },
        200
      );
    } catch (error) {
      Log.error("Error ./controllers/ProductController.decreaseStock " + error);

      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async getProductHistory(c: Context) {
    try {
      const productId = c.req.param("id");

      const product = await this.productMustExist(productId);

      if (!product) {
        return c.json({ message: "Product not found", data: null }, 404);
      }

      const request = {
        keyword: c.req.query("q")?.toString() || "",
        page: Number(c.req.query("page")) || 1,
        perPage: Number(c.req.query("perPage")) || 10,
      };

      const products = await ProductHistoryModel.findAll(productId, request);
      const totalItems = await ProductHistoryModel.count(productId, request);
      const totalPages = Math.ceil(totalItems / request.perPage);

      // if page is greater than total pages, return 404
      if (request.page > totalPages) {
        return c.json({ message: "Page not found", data: null }, 404);
      }

      return c.json({
        message: "Get products success",
        data: products,
        pagination: {
          currentPage: request.page,
          perPage: request.perPage,
          totalPages: totalPages,
          totalItems: totalItems,
        },
      });
    } catch (error) {
      Log.error(
        "Error ./controllers/ProductController.getProductHistory " + error
      );

      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal Server Error", data: null }, 500);
      }
    }
  }

  async productMustExist(productId: string) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}

export default new ProductController();
