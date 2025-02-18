import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getCurrentUserHandler,
  signInUserHandler,
  signOutUserHandler,
} from "./auth.controller";
import {
  createUserSchema,
  getCurrentUserSchema,
  signInUserSchema,
  signOutUserSchema,
} from "./auth.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

// TODO: signup, signin, signout, session can be decoupled into /auth route
// TODO: implement CSRF token
export function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/signup",
    handler: createUserHandler,
    schema: createUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/signin",
    handler: signInUserHandler,
    schema: signInUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/auth/signout",
    preHandler: [app.authenticate],
    handler: signOutUserHandler,
    schema: signOutUserSchema,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/auth/session",
    preHandler: [app.authenticate],
    handler: getCurrentUserHandler,
    schema: getCurrentUserSchema,
  });
}
