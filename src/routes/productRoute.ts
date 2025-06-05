import { Hono } from "hono";
import ProductController from "../controllers/ProductController";
import AccessValidation from "../validations/AccessValidation";

const productRoute = new Hono();

productRoute.use("/product/*", AccessValidation.validateAccessToken);

productRoute.post("/product", ProductController.createProduct);
productRoute.get("/product", ProductController.getAllProduct);
productRoute.get("/product/:id", ProductController.getProductById);
productRoute.put("/product/:id", ProductController.updateProduct);
productRoute.delete("/product/:id", ProductController.deleteProduct);

export default productRoute;
