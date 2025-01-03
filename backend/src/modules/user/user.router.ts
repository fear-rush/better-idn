import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getCurrentUserHandler,
  signInUserHandler,
  signOutUserHandler,
} from "./user.controller";
import {
  createUserSchema,
  getCurrentUserSchema,
  signInUserSchema,
  signOutUserSchema,
} from "./user.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/signup",
    handler: createUserHandler,
    schema: createUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/sessions",
    handler: signInUserHandler,
    schema: signInUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/sessions",
    preHandler: [app.authenticate],
    handler: signOutUserHandler,
    schema: signOutUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/sessions",
    preHandler: [app.authenticate],
    handler: getCurrentUserHandler,
    schema: getCurrentUserSchema,
  });
}
