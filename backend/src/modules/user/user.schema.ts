import { z } from "zod";
import {
  badRequestSchema,
  conflictSchema,
  internalServerErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "../../utils/http-error";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// TODO: uniqueName (username) is not solved yet. solve it using random-name-generator for now
export const createUserSchema = {
  tags: ["users"],
  body: z.object({
    email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
    password: z.string().regex(passwordRegex, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  }),
  response: {
    201: z
      .object({
        status: z.literal("success"),
        statusCode: z.literal(201),
        message: z.string().default("User created successfully"),
      })
      .describe("Response for successful user creation"),
    400: badRequestSchema,
    404: notFoundSchema,
    409: conflictSchema,
    500: internalServerErrorSchema,
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
        status: z.literal("success"),
        statusCode: z.literal(200),
        message: z.string().default("Logged in successfully"),
      })
      .describe("Response for succesful user sign in"),
    400: badRequestSchema,
    403: unauthorizedSchema,
    404: notFoundSchema,
    500: internalServerErrorSchema,
  },
};

export const signOutUserSchema = {
  tags: ["users"],
  // TODO: add error response schema
  response: {
    200: z
      .object({
        status: z.literal("success"),
        statusCode: z.literal(200),
        message: z.string().default("Logged out successfully"),
      })
      .describe("Response for succesful user sign out"),
    400: badRequestSchema,
    401: unauthorizedSchema,
    404: notFoundSchema,
    500: internalServerErrorSchema,
  },
};

export const getCurrentUserSchema = {
  tags: ["users"],
  response: {
    200: z
      .object({
        status: z.literal("success"),
        statusCode: z.literal(200),
        message: z.string().default("Succesfully get current user data"),
        data: z.object({
          user: z.object({
            id: z.string(),
            username: z.string(),
          }),
        }),
      })
      .describe("Response for succesful get current user session"),
    400: badRequestSchema,
    401: unauthorizedSchema,
    404: notFoundSchema,
    500: internalServerErrorSchema,
  },
};
