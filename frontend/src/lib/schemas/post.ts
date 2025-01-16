import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(5000, "Description must be less than 5000 characters"),
  tags: z
    .string()
    .transform((str) => str.split(",").map((tag) => tag.trim()))
    .refine((tags) => tags.length <= 3, "Maximum 3 tags allowed")
    .refine((tags) => tags.every((tag) => tag.length > 0), "Tags cannot be empty")
    .refine(
      (tags) => tags.every((tag) => tag.length <= 20),
      "Each tag must be less than 20 characters"
    ),
}); 