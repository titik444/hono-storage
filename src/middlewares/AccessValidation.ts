import { Context } from "hono";
import { verifyToken } from "../utils/Jwt";

export async function authenticate(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return c.json({ message: "Unauthorized", data: null }, 401);
  }

  try {
    const payload = (await verifyToken(token)) as { sub: { role: string } };
    c.set("user", payload.sub);
    c.set("role", payload.sub.role);

    await next();
  } catch {
    return c.json({ message: "Unauthorized", data: null }, 401);
  }
}

export function authGuard(allowedRoles: string[]) {
  return async (c: Context, next: () => Promise<void>) => {
    const role = c.get("role");

    if (!role || !allowedRoles.includes(role)) {
      return c.json(
        { message: "Forbidden: insufficient role", data: null },
        403
      );
    }
    await next();
  };
}
