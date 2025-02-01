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

// TODO: signup, signin, signout, session can be decoupled into /auth route

export function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/signup",
    handler: createUserHandler,
    schema: createUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/signin",
    handler: signInUserHandler,
    schema: signInUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/user/signout",
    preHandler: [app.authenticate],
    handler: signOutUserHandler,
    schema: signOutUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user/session",
    preHandler: [app.authenticate],
    handler: getCurrentUserHandler,
    schema: getCurrentUserSchema,
  });
}
