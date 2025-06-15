import { Context } from "hono";
import {
  loginValidation,
  updateUserValidation,
  userValidation,
} from "../validations/UserValidation";
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
      Log.error("Error ./controllers/UserController.verifyUser " + error);
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
    try {
      const user = c.get("user") as User;

      return c.json({ message: "Get Current User success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.getCurrentUser " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async createUser(c: Context) {
    try {
      const data = await c.req.json();
      const { name, email, role } = await userValidation.parse(data);

      // check user existing
      const userCheck = await UserModel.findByEmail(email);
      if (userCheck) {
        return c.json({ message: "User already exists", data: null }, 400);
      }

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
      const request = {
        keyword: c.req.query("q")?.toString() || "",
        page: Number(c.req.query("page")) || 1,
        perPage: Number(c.req.query("perPage")) || 10,
      };

      const users = await UserModel.findAll(request);
      const totalItems = await UserModel.count(request);
      const totalPages = Math.ceil(totalItems / request.perPage);

      // Check if page is valid
      const page = request.page;

      if (
        page < 1 ||
        (totalPages === 0 && page > 1) ||
        (totalPages > 0 && page > totalPages)
      ) {
        return c.json({ message: "Page not found", data: null }, 404);
      }

      return c.json({
        message: "Get users success",
        data: users,
        pagination: {
          currentPage: request.page,
          perPage: request.perPage,
          totalPages: totalPages,
          totalItems: totalItems,
        },
      });
    } catch (error) {
      Log.error("Error ./controllers/UserController.getAllUser " + error);
      return c.json({ message: "Internal Server Error", data: null }, 500);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param("id");
      const user = await this.userMustExist(id);

      if (!user) {
        return c.json({ message: "User not found", data: null }, 404);
      }

      return c.json({ message: "Get user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.getUserById " + error);
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

  async updateUser(c: Context) {
    try {
      const id = c.req.param("id");
      const userExist = await this.userMustExist(id);

      if (!userExist) {
        return c.json({ message: "User not found", data: null }, 404);
      }

      const { email } = await c.req.json();

      const emailExist = await UserModel.findByEmailNotId(id, email);

      if (emailExist) {
        return c.json({ message: "Email already exists", data: null }, 400);
      }

      const data = await c.req.json();

      await updateUserValidation.parse(data);

      const user = await UserModel.update(id, data);
      return c.json({ message: "Update user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.updateUser " + error);
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

  async deleteUser(c: Context) {
    try {
      const id = c.req.param("id");
      const userExist = await this.userMustExist(id);

      if (!userExist) {
        return c.json({ message: "User not found", data: null }, 404);
      }

      const user = await UserModel.delete(id);
      return c.json({ message: "Delete user success", data: user });
    } catch (error) {
      Log.error("Error ./controllers/UserController.deleteUser " + error);
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

  private async userMustExist(id: string) {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default new UserController();
