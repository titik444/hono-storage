import { Context } from "hono";
import { productValidation } from "../validations/ProductValidation";
import Log from "../utils/Logger";
import ProductModel from "../models/ProductModel";
import { Product, User } from "@prisma/client";

class ProductController {
  async createProduct(c: Context) {
    try {
      const user = c.get("user") as User;

      const body = await c.req.json();
      const { sku, name, ptName, description, stock } =
        await productValidation.parse(body);
      const product = await ProductModel.create({
        sku,
        name,
        ptName,
        description,
        stock,
        createdBy: user.id,
      } as Product);

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
      const products = await ProductModel.findAll();
      return c.json({ message: "Get products success", data: products });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.getProducts " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async getProductById(c: Context) {
    try {
      const id = c.req.param("id");
      const product = await ProductModel.findById(id);
      return c.json({ message: "Get product success", data: product });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.getProduct " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async updateProduct(c: Context) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const { sku, name, ptName, description } =
        await productValidation.parse(body);
      const product = await ProductModel.update(id, {
        sku,
        name,
        ptName,
        description,
      } as Product);
      return c.json({ message: "Update product success", data: product });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.updateProduct " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async deleteProduct(c: Context) {
    try {
      const id = c.req.param("id");
      const product = await ProductModel.delete(id);
      return c.json({ message: "Delete product success", data: product });
    } catch (error) {
      Log.error("Error ./controllers/ProductController.deleteProduct " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }
}

export default new ProductController();
