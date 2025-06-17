import { Hono } from "hono";
import ProductController from "../controllers/ProductController";
import { authenticate, authGuard } from "../middlewares/AccessValidation";

const productRoute = new Hono();

productRoute.use("/product/*", authenticate, authGuard(["ADMIN", "MANAGER"]));

productRoute.post("/product", (c) => ProductController.createProduct(c));
productRoute.get("/product", (c) => ProductController.getAllProduct(c));
productRoute.get("/product/:id", (c) => ProductController.getProductById(c));
productRoute.put("/product/:id", (c) => ProductController.updateProduct(c));
productRoute.delete("/product/:id", (c) => ProductController.deleteProduct(c));
productRoute.patch("/product/:id/restore", (c) =>
  ProductController.restoreProduct(c)
);
productRoute.post("/product/:id/stock-in", (c) =>
  ProductController.increaseStock(c)
);
productRoute.post("/product/:id/stock-out", (c) =>
  ProductController.decreaseStock(c)
);
productRoute.get("/product/:id/history", (c) =>
  ProductController.getProductHistory(c)
);

export default productRoute;
