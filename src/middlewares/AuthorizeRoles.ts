import { Context } from "hono";

export function authorizeRoles(allowedRoles: string[]) {
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
