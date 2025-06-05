import { Hono } from "hono";
import UserController from "../controllers/UserController";
import { authenticate, authGuard } from "../middlewares/AccessValidation";

const userRoute = new Hono();

userRoute.post("/auth/login", UserController.verifyUser);
userRoute.get("/auth/refresh", UserController.refreshToken);

userRoute.get("/auth/me", authenticate, UserController.getCurrentUser);

userRoute.use("/user/*", authenticate, authGuard(["MANAGER"]));

userRoute.post("/user", UserController.createUser);
userRoute.get("/user", UserController.getAllUser);
userRoute.get("/user/:id", UserController.getUserById);
userRoute.put("/user/:id", UserController.updateUser);
userRoute.delete("/user/:id", UserController.deleteUser);

export default userRoute;
