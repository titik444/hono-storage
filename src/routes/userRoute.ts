import { Hono } from "hono";
import UserController from "../controllers/UserController";
import { authenticate, authGuard } from "../middlewares/AccessValidation";

const userRoute = new Hono();

userRoute.get("/auth/me", authenticate, (c) =>
  UserController.getCurrentUser(c)
);
userRoute.post("/auth/login", (c) => UserController.verifyUser(c));
userRoute.get("/auth/refresh", (c) => UserController.refreshToken(c));

userRoute.use("/user/*", authenticate, authGuard(["MANAGER"]));

userRoute.post("/user", (c) => UserController.createUser(c));
userRoute.get("/user", (c) => UserController.getAllUser(c));
userRoute.get("/user/:id", (c) => UserController.getUserById(c));
userRoute.put("/user/:id", (c) => UserController.updateUser(c));
userRoute.delete("/user/:id", (c) => UserController.deleteUser(c));

export default userRoute;
