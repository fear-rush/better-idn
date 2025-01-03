import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, verifyPassword } from "./user.service";
import { createUserSchema, signInUserSchema } from "./user.schema";
import { PostgresError } from "postgres";

export async function createUserHandler(
  req: FastifyRequest<{ Body: z.infer<typeof createUserSchema.body> }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = req.body;

    await createUser({ email, password });

    return reply.code(201).send({
      status: "success",
      statusCode: 201,
      message: "User created successfully",
    });
  } catch (error) {
    // TODO: add logger
    const e = error as PostgresError;

    if (e.code === "23505") {
      return reply.code(409).send({
        status: "error",
        statusCode: 409,
        message: "User already exists",
        error: "Conflict",
      });
    }

    reply.code(500).send({
      status: "error",
      statusCode: 500,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occured",
    });
  }
}

export async function signInUserHandler(
  req: FastifyRequest<{ Body: z.infer<typeof signInUserSchema.body> }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user || !user?.password) {
      return reply.code(404).send({
        status: "error",
        statusCode: 404,
        message: "User not found",
        error: "Not Found",
      });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      reply.code(403).send({
        status: "error",
        statusCode: 403,
        message: "Invalid credentials",
        error: "Unauthorized",
      });
    }

    req.session.set("user", { id: user.id, username: user.username });

    reply.code(200).send({
      status: "success",
      statusCode: 200,
      message: "Logged in successfully",
    });
    // TODO: add logger
  } catch (error) {
    reply.code(500).send({
      status: "error",
      statusCode: 500,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occured",
    });
  }
}

export async function signOutUserHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    req.session.delete();

    reply.code(200).send({
      status: "success",
      statusCode: 200,
      message: "Successfully sign out",
    });
  } catch (error) {
    reply.code(500).send({
      status: "error",
      statusCode: 500,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occured",
    });
  }
}

export async function getCurrentUserHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return reply.code(200).send({
      status: "success",
      statusCode: 200,
      message: "Succesfully get current user data",
      data: {
        user: req.session.get("user"),
      },
    });
  } catch (error) {
    reply.code(500).send({
      status: "error",
      statusCode: 500,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occured",
    });
  }
}
