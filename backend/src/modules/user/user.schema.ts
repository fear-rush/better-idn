import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const createUserSchema = {
  tags: ["users"],
  body: z.object({
    email: z
      .string()
      .email({ message: "Invalid email" })
      .transform((email) => email.toLowerCase()),
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters long" })
      .regex(usernameRegex, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z.string().regex(passwordRegex, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  }),
  response: {
    201: z
      .object({
        message: z.string().default("User created successfully"),
      })
      .describe("Response for successful user creation"),
  },
};

export const signInUserSchema = {
  tags: ["users"],
  body: z.object({
    email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
    password: z.string().min(8, {
      message: "Password must contain at least 8 characters",
    }),
  }),
  response: {
    200: z
      .object({
        message: z.string().default("Logged in successfully"),
      })
      .describe("Response for succesful user sign in"),
  },
};

export const signOutUserSchema = {
  tags: ["users"],
  response: {
    200: z
      .object({
        message: z.string().default("Logged out successfully"),
      })
      .describe("Response for succesful user sign out"),
  },
};

export const getCurrentUserSchema = {
  tags: ["users"],
  response: {
    200: z
      .object({
        message: z.string().default("Succesfully get current user data"),
        data: z.object({
          user: z.object({
            id: z.string(),
            username: z.string(),
          }),
        }),
      })
      .describe("Response for succesful get current user session"),
  },
};
