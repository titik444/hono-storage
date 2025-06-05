import { z, ZodType } from "zod";

export const productValidation: ZodType = z.object({
  sku: z.string().min(1, { message: "Product sku is required" }),
  name: z
    .string()
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Product name must be at most 255 characters long" }),
  ptName: z
    .string()
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Product name must be at most 255 characters long" }),
  description: z
    .string()
    .max(1000, {
      message: "Product description must be at most 1000 characters long",
    })
    .optional(),
  stock: z.number().min(1, { message: "Product stock is required" }),
});
