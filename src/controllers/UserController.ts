import { Context } from "hono";
import { loginValidation, userValidation } from "../validations/UserValidation";
import Log from "../utils/Logger";
import UserModel from "../models/UserModel";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/Jwt";
import { User } from "@prisma/client";

class UserController {
  async verifyUser(c: Context) {
    try {
      const data = await c.req.json();
      const { email, password } = await loginValidation.parse(data);
      // check user existing
      const userCheck = await UserModel.findByEmail(email);
      if (!userCheck) {
        return c.json({ message: "User not found", data: null }, 404);
      }
      // process login
      const user = await UserModel.verifyUser(email, password);
      let token = null;
      let refreshToken = null;
      if (!user) {
        return c.json(
          { message: "Invalid email or password", data: null },
          400
        );
      }
      token = await generateAccessToken(user);
      refreshToken = await generateRefreshToken(user);
      return c.json(
        {
          message: "User logged in successfully",
          data: { ...user, token, refreshToken },
        },
        200
      );
    } catch (error) {
      Log.error("Error ./controllers/UserController.getUser " + error);
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

  async refreshToken(c: Context) {
    const authHeader = c.req.header("Authorization");
    const tokenRefresh = authHeader?.split(" ")[1];
    // check if token is present
    if (!tokenRefresh) {
      return c.json({ message: "Unauthorized", data: null }, 401);
    }
    try {
      const payload = await verifyRefreshToken(tokenRefresh);
      const user = await UserModel.findById(String(payload.id));
      if (!user) {
        return c.json({ message: "Unauthorized", data: null }, 401);
      }
      const token = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      return c.json({
        message: "Token refreshed successfully",
        data: { ...user, token, refreshToken },
      });
    } catch {
      return c.json({ message: "Unauthorized", data: null }, 401);
    }
  }

  async getCurrentUser(c: Context) {
    const user = c.get("user") as User;

    return c.json({ message: "Get current user success", data: user });
  }

  async createUser(c: Context) {
    try {
      const data = await c.req.json();
      const { name, email, role } = await userValidation.parse(data);
      const userInserted = await UserModel.create({
        name,
        email,
        role,
        password: await Bun.password.hash("test1234", {
          algorithm: "bcrypt",
          cost: 10,
        }),
      } as User);
      return c.json(
        {
          message: "User created successfully",
          data: userInserted,
        },
        201
      );
    } catch (error) {
      Log.error("Error ./controllers/UserController.createUser " + error);
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

  async getAllUser(c: Context) {
    try {
      const users = await UserModel.findAll();
      return c.json({ message: "Get users success", data: users });
    } catch (error) {
      Log.error("Error ./controllers/UserController.getUsers " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param("id");
      const user = await UserModel.findById(id);
      return c.json({ message: "Get user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.getUser " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const user = await UserModel.update(id, data);
      return c.json({ message: "Update user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.updateUser " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param("id");
      const user = await UserModel.delete(id);
      return c.json({ message: "Delete user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.deleteUser " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }
}

export default new UserController();
