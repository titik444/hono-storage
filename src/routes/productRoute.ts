import { Hono } from "hono";
import ProductController from "../controllers/ProductController";
import { authenticate, authGuard } from "../middlewares/AccessValidation";

const productRoute = new Hono();

productRoute.use("/product/*", authenticate, authGuard(["ADMIN", "MANAGER"]));

productRoute.post("/product", ProductController.createProduct);
productRoute.get("/product", ProductController.getAllProduct);
productRoute.get("/product/:id", ProductController.getProductById);
productRoute.put("/product/:id", ProductController.updateProduct);
productRoute.delete("/product/:id", ProductController.deleteProduct);

export default productRoute;
