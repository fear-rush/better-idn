import { z } from "zod";

const baseHttpErrorSchema = z.object({
  status: z.literal("error"),
  statusCode: z.number(),
  error: z.string().optional(),
  message: z.string(),
});

export const badRequestSchema = baseHttpErrorSchema
  .extend({
    statusCode: z.literal(400),
    error: z.string().default("Bad Request"),
    message: z.string(),
  })
  .describe("Response for bad request errors.");

export const unauthorizedSchema = baseHttpErrorSchema.extend({
  statusCode: z.literal(401),
  error: z.string().default("Unauthorized"),
  message: z.string(),
});

export const notFoundSchema = baseHttpErrorSchema
  .extend({
    statusCode: z.literal(404),
    error: z.literal("Not Found"),
    message: z.string(),
  })
  .describe(
    "Response for not found errors. This error is thrown by default by Fastify when a route is not found."
  );

export const conflictSchema = baseHttpErrorSchema
  .extend({
    statusCode: z.literal(409),
    error: z.literal("Conflict"),
    message: z.literal("User already exists"),
  })
  .describe("Response for conflict errors.");

export const internalServerErrorSchema = baseHttpErrorSchema
  .extend({
    statusCode: z.literal(500),
    error: z.string().default("Internal server error"),
  })
  .describe("Response for internal server errors.");

/* 
  statusCode = statusCode
  status = error
  error = error
  message = message
*/

/*
  -- duplicate --
  statusCode: 500,
  code: pg_code
  error: internal server error
  message: duplicate key value

  ----------------
  -- validation 1 --
  statusCode: 400,
  code: FST_ERR_VALIDATION,
  error: Bad Request,
  message: body/password

  -- validation 2 --
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Expected double-quoted property name in JSON at position 37"

  ----------------
  -- doesn't match the schema --
  statusCode: 500,
  code: FST_ERR_RESPONSE_SERIALIZATION
  error: internal server error
  message: Response doesn't match the schema

  ---------------
  -- not found --
  {
    "message": "Route PATCH:/api/v1/register not found",
    "error": "Not Found",
    "statusCode": 404
 } 

*/
