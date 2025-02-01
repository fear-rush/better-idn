import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, verifyPassword } from "./user.service";
import { createUserSchema, signInUserSchema } from "./user.schema";

export async function createUserHandler(
  req: FastifyRequest<{ Body: z.infer<typeof createUserSchema.body> }>,
  reply: FastifyReply
) {
  const { email, username, password } = req.body;

  await createUser({ email, username, password });

  reply.code(201).send({
    message: "User created successfully",
  });
}

export async function signInUserHandler(
  req: FastifyRequest<{ Body: z.infer<typeof signInUserSchema.body> }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  await verifyPassword(password, user.password);

  req.session.set("user", { id: user.id, username: user.username });

  reply.code(200).send({
    message: "Logged in successfully",
  });
}

export async function signOutUserHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  req.session.delete();

  reply.code(200).send({
    message: "Successfully sign out",
  });
}

export async function getCurrentUserHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  reply.code(200).send({
    message: "Succesfully get current user data",
    data: {
      user: req.session.get("user"),
    },
  });
}
